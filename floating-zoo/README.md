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


//todo : reformat this page. Instead of stages, restructure to changes per-island

<!-- 11/4/2026 - last changes: lowered turtle height deeper into water when swimming.
-Reduced scale of mallards from 0.11 to 0.7 since they were too big.
-Reduced scale of fish from 0.11 to 0.7
 -Added more action items to readMe -->
 
 <!--ABOVE HAS BEEN PUSHED^^ -->


### Phase 1 — 
- AJ [ ] **1.1** Create Grant statue & arch for east entrance of South Pond
- AJ [ ] **1.2** Change island map topography: merge islands in the north & south
- AJ [x] **1.3** Add emojis to other islands with no animals: Cafe Baur, Conservatory, Lionel Train Adventure, Main hall with food & b-rooms
- AJ [ ] **1.4** Add tortoise to SPECIES inventory. Add to south loop island
- AJ [x] **1.5** Add ducks to SPECIES inventory. Add to water fowl lagoon
- AJ [ ] **1.6** Add butterflies, fish - copy from snakes since they already wiggle, & insects? to SPECIES inventory. Add to south Pond
- AJ [x] **1.7** Find full list of all animals at the zoo
- AJ [x] **1.8** Make *some* of the exhibit topography static for rocks, trees, etc. (notably: lions, Macaques, Apes, )
- AJ [ ] **1.8** Add rocks, logs, lillies, and something else to South Pond
- AJ [ ] **1.9** Change snakes to slither instead of wiggling
- AJ [x] **1.91** Add fish - copy from snakes since they already wiggle to SPECIES inventory. Add to south Pond

### Phase 2 — 
- AJ [ ] **2.1** Re-size and format the lion island to match real life
- AJ [x] **2.2** Add new Seal to SPECIES inventory. Add to Kovler Seal Pool
- AJ [ ] **2.3** Add lizards and other reptiles to SPECIES inventory. Add to Reptile house
- AJ [x] **2.4** Add Grizzly bear to SPECIES inventory. Add to artic tundra
- AJ [ ] **2.5** Add pop-out menu for the aniaml houses (reptile, primeape, birdhouse)
- AJ [ ] **2.6** Add feet to ducks which paddle when underwater
- AJ [ ] **2.7** Make beavers waddle when in water maybe?
- AJ [ ] **2.8** Make Benten-jima Island more oblong.
- AJ [ ] **2.9** Remove turtles & beaver hopping when on land.

### Phase 3 — 
- AJ [x] **3.1** Fix Conservatory shape. Add 2nd dome and make more similar to real-life
- AJ [ ] **3.2** Find names (if exist) of the more notable animals and add them into the app
- AJ [ ] **3.3** Add 'grasses' to the South pond
- AJ [ ] **3.4** Add walk path around South Pond

### Phase 4 — 
- AJ [ ] **4.1** Adjust Macague island. Add Rocks or elevation. less of a flat top and conic bottom.
- AJ [ ] **4.2** Add stumps or rocks to South Pond.
- AJ [ ] **4.3** Have turtles slow down & sun bathe, on rocks. Slow Beavers down.

### Phase 5 — 
- AJ [ ] **5.1** Add API's to this project. Show and change weather to current conditions in Chicago

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
