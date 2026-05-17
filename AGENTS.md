# AGENTS.md

## Commands

- `npm run dev` - Start Vite dev server at http://localhost:5173
- `npm run build` - Production build to `docs/`
- `npm run test` - Run Vitest tests (watch mode: `npm test -- --watch`)
- `npm run lint` - Run ESLint
- `npm run watch` - Preview production build

## Testing

- Uses Vitest with jsdom environment
- Test setup in `src/setupTests.js` includes ResizeObserver mock (required for Recharts)
- Run single test file: `npm test src/App.test.jsx`

## Project Structure

- Single-page React app (Vite + React 18)
- Main component: `src/App.jsx`
- Entry point: `src/main.jsx` + `index.html`
- Styling: Tailwind CSS 4 (via `@tailwindcss/vite`)
- Charts: Recharts (LineChart, PieChart)

## Notes

- Port 5173 auto-increments if occupied
- ESLint config in `eslint.config.js` (flat config format)