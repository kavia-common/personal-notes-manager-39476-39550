# Personal Notes Manager - React Frontend

A modern, responsive notes app implementing the Ocean Professional theme with blue (#2563EB) and amber (#F59E0B) accents. Features create, edit, organize (tags), search, favorite, soft-delete, and trash restore.

## Run

- npm start (dev at http://localhost:3000)
- npm test
- npm run build

## Features

- Left sidebar: navigation (All, Favorites, Trash), tags list and add
- Top bar: debounced search, New Note
- Main: notes list + editor side by side
- Favorites, tags, deleted (Trash) with restore/purge
- Keyboard: Ctrl/Cmd+N (new), Ctrl/Cmd+S (save)
- Autosave edits; state persists via localStorage

## Theming

Main styles in `src/styles/theme.css` following the Ocean Professional guide.

## NotesService (persistence abstraction)

Located at `src/services/NotesService.js`. Current implementation stores to localStorage. It exposes:

- list({ includeDeleted }): Note[]
- get(id): Note|null
- create(note): Note
- update(id, patch): Note|null
- delete(id): boolean (soft delete)
- purge(id): boolean (hard delete)
- restore(id): Note|null
- listTags(): string[]
- addTag(tag): string[]
- removeTag(tag): string[]

To wire an API later:
- Set `REACT_APP_API_BASE` or `REACT_APP_BACKEND_URL` in `.env`.
- Replace methods to call your backend while keeping the same signatures. The rest of the app will continue to work.

## Routing

Uses react-router-dom for basic routes:
- / (All)
- /favorites
- /trash
- /tag/:tag

## Environment Variables (optional)

- REACT_APP_API_BASE
- REACT_APP_BACKEND_URL
(These are not required for localStorage mode.)
