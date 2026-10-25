import { useMemo, useRef, useState, useEffect } from 'react'
import { LevaPanel, useControls, useCreateStore, button } from 'leva'
import { BUILDINGS } from '../lib/islandGen'
import { rebuildIsland } from '../lib/world'
import { EXHIBITS } from '../data/exhibits'

// Sliders for one building: x/z, the type's size settings, then any colors / roof style.
function schemaFor(b, R, onRemove) {
  const def = BUILDINGS[b.type]
  const full = { ...def.defaults, ...b }
  const range = (v) => ({ min: Math.min(-R, v), max: Math.max(R, v), step: 1 })
  const s = {
    x: { value: full.x ?? 0, ...range(full.x ?? 0) },
    z: { value: full.z ?? 0, ...range(full.z ?? 0) },
  }
  for (const [k, [min, max]] of Object.entries(def.params))
    s[k] = { value: full[k], min: Math.min(min, full[k]), max: Math.max(max, full[k]), step: 1 }
  for (const [k, v] of Object.entries(full)) {
    if (k === 'roofStyle') s[k] = { value: v, options: ['hip', 'gable', 'flat'] }
    else if (typeof v === 'string' && v.startsWith('#')) s[k] = v
  }
  s.remove = button(onRemove)
  return s
}

function BuildingFolder({ store, index, building, R, onChange, onRemove }) {
  const schema = useMemo(() => schemaFor(building, R, () => onRemove(index)), []) // eslint-disable-line react-hooks/exhaustive-deps
  const values = useControls(`${index + 1} · ${building.type}`, schema, { store })
  const key = JSON.stringify(values)
  useEffect(() => onChange(index, values), [key]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

// Only keep x/z and settings that differ from the defaults, so the copied code stays short.
function trim(type, values) {
  const defaults = BUILDINGS[type].defaults
  const out = { type }
  for (const [k, v] of Object.entries(values)) if (k === 'x' || k === 'z' || v !== defaults[k]) out[k] = v
  return out
}

const toCode = (buildings) =>
  'buildings: [\n' +
  buildings
    .map((b) => '  { ' + Object.entries(b).map(([k, v]) => `${k}: ${typeof v === 'string' ? `'${v}'` : v}`).join(', ') + ' },')
    .join('\n') +
  '\n],'

function Folders({ draft, island, onChange, onRemove }) {
  const store = useCreateStore()
  return (
    <>
      {draft.map((b, i) => (
        <BuildingFolder key={i} store={store} index={i} building={b} R={island.R} onChange={onChange} onRemove={onRemove} />
      ))}
      <LevaPanel store={store} fill flat titleBar={false} />
    </>
  )
}

export function BuildingEditor({ world, islandId, onRebuilt }) {
  const island = world.byId[islandId]
  const original = useMemo(() => EXHIBITS.find((e) => e.id === islandId)?.buildings || [], [islandId])
  const draft = useRef(original.map((b) => ({ ...b })))
  const [gen, setGen] = useState(0) // bump to rebuild the slider list after add / remove / reset
  const [copied, setCopied] = useState(false)
  const [newType, setNewType] = useState('house')
  const frame = useRef(0)

  const rebuild = () => {
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      rebuildIsland(world, islandId, draft.current)
      onRebuilt()
    })
  }
  const onChange = (i, values) => {
    if (!draft.current[i]) return
    draft.current[i] = trim(draft.current[i].type, values)
    rebuild()
  }
  const remount = () => { rebuild(); setGen((g) => g + 1) }
  const onRemove = (i) => { draft.current.splice(i, 1); remount() }
  const add = () => { draft.current.push({ type: newType, x: 0, z: 0 }); remount() }
  const reset = () => { draft.current = original.map((b) => ({ ...b })); remount() }
  const copy = async () => {
    const code = toCode(draft.current)
    console.log(code)
    try { await navigator.clipboard.writeText(code) } catch { /* clipboard blocked: code is in the console */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <aside className="editor panel">
      <div className="area">Building editor</div>
      <h2>{island.name}</h2>
      <p className="hint">
        Drag to rebuild live. x / z are voxels from the island center (radius {island.R}). Nothing is saved: copy the
        result into <code>exhibits.js</code>.
      </p>
      {draft.current.length === 0 && <p className="hint">No buildings here yet. Add one below.</p>}
      <div className="leva-wrap">
        <Folders key={gen} draft={draft.current} island={island} onChange={onChange} onRemove={onRemove} />
      </div>
      <div className="editor-row">
        <select value={newType} onChange={(e) => setNewType(e.target.value)}>
          {Object.keys(BUILDINGS).map((t) => <option key={t}>{t}</option>)}
        </select>
        <button onClick={add}>+ Add</button>
        <button onClick={reset}>Reset</button>
      </div>
      <button className="primary" onClick={copy}>{copied ? '✓ Copied!' : '📋 Copy buildings code'}</button>
    </aside>
  )
}
