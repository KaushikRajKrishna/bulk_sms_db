# SMS Gateway — Frontend

React + Vite dashboard for managing devices and sending bulk SMS.

## Prerequisites

- Node.js v18+
- Backend server running on `http://localhost:5000`

## Setup

```bash
npm install
```

## Running

### Development

```bash
npm run dev
```

Starts the Vite dev server at `http://localhost:5173`. API requests are proxied to the backend at `http://localhost:5000`.

### Production Build

```bash
npm run build
```

Outputs static files to the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

Serves the `dist/` folder locally to test the production build.

## Full Stack — Start Order

1. Start the backend API server (Terminal 1):
   ```bash
   cd ../backend && npm run server
   ```

2. Start the SMS worker (Terminal 2):
   ```bash
   cd ../backend && npm run worker
   ```

3. Start the frontend (Terminal 3):
   ```bash
   npm run dev
   ```

Then open `http://localhost:5173` in your browser.
