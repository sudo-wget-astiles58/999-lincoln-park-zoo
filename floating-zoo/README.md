# Floating Lincoln Park Zoo

A voxel "floating islands" version of Chicago's Lincoln Park Zoo, built with React, three.js and react-three-fiber.

```
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Where things live

- `src/data/exhibits.js` — every island: position, size, terrain, pools, buildings, trees, which animals live there, and its blurb. Edit this first.
- `src/lib/animals.js` — voxel animal models and how each species moves (land, water, both, air).
- `src/lib/islandGen.js` — terrain, paths, buildings and trees for each island.
- `src/components/` — the 3D scene (islands, bridges, visitors, clouds, camera) and animals.
- `src/App.jsx` + `src/styles.css` — the UI overlay.

## Live building editor

Click **🛠️ Edit** in the bottom bar, then click an island. Every building on it gets sliders (position, size, colors), and the island rebuilds as you drag. You can also add or remove buildings. Nothing is saved: press **Copy buildings code** and paste the result over that island's `buildings: [...]` line in `src/data/exhibits.js`.

Each building type's settings, defaults and slider ranges live in `BUILDINGS` in `src/lib/islandGen.js` (`defaults` and `params`). Add a key to both to get a new slider.



### Phase 1 — 
- AJ [ ] **1.1** Create 
- AJ [ ] **1.2** Change island map topography: merge islands in the north & south
- AJ [x] **1.3** Add emojis to other islands with no animals: Cafe Baur, Conservatory, Lionel Train Adventure, Main hall with food & b-rooms
- AJ [ ] **1.4** Add tortoise to SPECIES inventory. Add to south loop island
- AJ [ ] **1.5** Add ducks to SPECIES inventory. Add to water fowl lagoon
- AJ [ ] **1.6** Add butterflies, fish, & insects? to SPECIES inventory. Add to south Pond
- AJ [x] **1.7** Find full list of all animals at the zoo

### Phase 2 — 
- AJ [ ] **2.1** Re-size and format the lion island to match real life
- AJ [ ] **2.2** Add new Seal to SPECIES inventory. Add to Kovler Seal Pool
- AJ [ ] **2.3** Add lizards and other reptiles to SPECIES inventory. Add to Reptile house
- AJ [ ] **2.4** Add Grizzly bear to SPECIES inventory. Add to artic tundra

### Phase 3 — 
- AJ [ ] **3.1** Fix Conservatory shape. Add 2nd dome and make more similar to real-life
- AJ [ ] **3.2** Find names (if exist) of the more notable animals and add them into the app
- AJ [ ] **3.3** Add 'grasses' to the South pond
- AJ [ ] **3.4** Add walk path around South Pond

### Phase 4 — 
- AJ [ ] **4.1** When a task is clicked, toggle it as "completed" (add/remove the CSS class)
- AJ [ ] **4.2** Add stumps or rocks to South Pond.
- AJ [ ] **4.3** Have turtles slow down & sun bathe, on rocks. Slow Beavers down.

### Phase 5 — 
- AJ [ ] **5.1** Add a "Delete" button inside each task `<li>` when it's created
- AJ [ ] **5.2** When the delete button is clicked, remove that `<li>` from the list
- AJ [ ] **5.2** Add API's to this project. Show and change weather to current conditions in Chicago

### Phase 6 — Stretch Goals (optional, tackle in any order)
- AJ [ ] **6.1** 

---

## Git Flow —  Working Together

1. Pull the latest `main` before starting any chunk: `git pull origin main`
2. Pick a requirement above, do the work, then commit with a clear message:
   - `git add <file(s)>`
   - `git commit -m "feat: add HTML structure for task list (1.1–1.4)"`
3. Push your branch and open a PR for the other person to review
4. Check off the box in this README when a requirement is done
5. Switch off — one person does a phase, the other reviews/merges, then picks the next chunk

## Commit Message Style
- `feat:` for new functionality
- `style:` for CSS-only changes
- `fix:` for bug fixes
- `chore:` for housekeeping (updating README, etc.)
