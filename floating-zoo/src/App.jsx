import { useCallback, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene, OVERVIEW } from './components/Scene'
import { buildWorld, feedStore } from './lib/world'
import { SPECIES } from './lib/animals'
import { BuildingEditor } from './components/BuildingEditor'

const world = buildWorld()
const TOUR = world.islands.filter((i) => i.animals.length).map((i) => i.id)

export default function App() {
  const [selectedId, setSelectedId] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [focus, setFocus] = useState({ id: null, n: 0 })
  const [night, setNight] = useState(false)
  const [labels, setLabels] = useState(true)
  const [tour, setTour] = useState(false)
  const [listOpen, setListOpen] = useState(window.innerWidth > 720)
  const [treats, setTreats] = useState(0)
  const [editing, setEditing] = useState(false)
  const [rev, setRev] = useState(0) // bumps when the editor rebuilds an island

  const select = useCallback((id) => {
    setSelectedId(id)
    setFocus((f) => ({ id, n: f.n + 1 }))
  }, [])

  useEffect(() => {
    document.body.style.cursor = hoveredId ? 'pointer' : ''
  }, [hoveredId])

  useEffect(() => {
    document.body.classList.toggle('night', night)
  }, [night])

  useEffect(() => {
    if (!tour) return
    let i = Math.max(0, TOUR.indexOf(selectedId))
    if (TOUR[i] !== selectedId) select(TOUR[i])
    const timer = setInterval(() => {
      i = (i + 1) % TOUR.length
      select(TOUR[i])
    }, 7000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour])

  const island = selectedId && world.byId[selectedId]

  const feed = () => {
    feedStore[selectedId] = (feedStore[selectedId] || 0) + 1
    setTreats((n) => n + 1)
  }

  return (
    <>
      <Canvas
        shadows
        flat
        dpr={[1, 2]}
        camera={{ position: OVERVIEW.pos.toArray(), fov: 40, near: 0.5, far: 2500 }}
        onPointerMissed={(e) => e.type === 'click' && setHoveredId(null)}
      >
        <Scene
          world={world}
          night={night}
          labels={labels}
          selectedId={selectedId}
          hoveredId={hoveredId}
          focus={focus}
          onSelect={select}
          onHover={setHoveredId}
          rev={rev}
        />
      </Canvas>

      <header className="title panel">
        <h1>Lincoln Park Zoo</h1>
        <p>floating edition · Chicago, IL</p>
      </header>

      <nav className={'directory panel' + (listOpen ? ' open' : '')}>
        <button className="directory-toggle" onClick={() => setListOpen((o) => !o)}>
          {listOpen ? '▾' : '▸'} Exhibits ({world.islands.length})
        </button>
        {listOpen && (
          <ul>
            {world.islands.map((i) => (
              <li key={i.id}>
                <button className={i.id === selectedId ? 'active' : ''} onClick={() => select(i.id)}>
                  <span className="emojis">{[...new Set(i.animals.map(([k]) => SPECIES[k].emoji))].slice(0, 3).join('') || '📍'}</span>
                  {i.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>

      {editing && island && (
        <BuildingEditor key={island.id} world={world} islandId={island.id} onRebuilt={() => setRev((r) => r + 1)} />
      )}
      {editing && !island && (
        <aside className="editor panel">
          <div className="area">Building editor</div>
          <p className="hint">Click an island to edit its buildings.</p>
        </aside>
      )}

      {!editing && island && (
        <aside className="card panel" key={island.id}>
          <button className="close" onClick={() => select(null)} aria-label="Back to overview">✕</button>
          <div className="area">{island.area}</div>
          <h2>{island.name}</h2>
          <p>{island.blurb}</p>
          {island.animals.length > 0 && (
            <>
              <ul className="chips">
                {island.animals.map(([k, n]) => (
                  <li key={k}>
                    {SPECIES[k].emoji} {SPECIES[k].name} <b>×{n}</b>
                  </li>
                ))}
              </ul>
              <button className="primary" onClick={feed}>🍎 Toss some treats</button>
            </>
          )}
          <p className="hint">Tip: click an animal to say hi.</p>
        </aside>
      )}

      <div className="toolbar panel">
        <button onClick={() => { setTour(false); select(null) }}>🗺️ Overview</button>
        <button className={tour ? 'on' : ''} onClick={() => setTour((t) => !t)}>🎥 {tour ? 'Stop tour' : 'Tour'}</button>
        <button className={labels ? 'on' : ''} onClick={() => setLabels((l) => !l)}>🏷️ Labels</button>
        <button className={editing ? 'on' : ''} onClick={() => { setTour(false); setEditing((e) => !e) }}>🛠️ Edit</button>
        <button onClick={() => setNight((n) => !n)}>{night ? '☀️ Day' : '🌙 Night'}</button>
        {treats > 0 && <span className="stat">🍎 {treats} {treats === 1 ? 'treat' : 'treats'} tossed</span>}
      </div>

      <div className="help">drag to orbit · right-drag to pan · scroll to zoom · click an island</div>
    </>
  )
}
