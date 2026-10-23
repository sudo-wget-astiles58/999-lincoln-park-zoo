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
