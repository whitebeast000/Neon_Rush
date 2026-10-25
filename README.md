# Neon Rush

A neon endless runner built with React, Vite and Phaser 3. Jump, slide, collect coins, beat your best. Progress is saved in LocalStorage (no backend).

## Run locally
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # test the build
```

## Controls
Space / Up / click / tap = jump. Down = slide (Slide button on touch). Esc = pause.

## Deploy to GitHub + Vercel
```bash
git init && git add . && git commit -m "Neon Rush"
git branch -M main
git remote add origin https://github.com/<you>/neon-rush.git
git push -u origin main
```
Then at vercel.com: **Add New → Project → import the repo**. Vite is auto-detected (build `npm run build`, output `dist`). Click **Deploy**.

## Structure
`src/game` (Phaser scene, player, config), `src/components` (React screens), `src/utils` (storage, generated audio). React and Phaser talk through a small event bus.
