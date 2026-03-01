# Catan Desktop App

A full implementation of the Settlers of Catan (base game) built with React, TypeScript, Vite, and Electron.

## Features

- **Electron Integration**: Runs as a native desktop application with a robust main process.
- **Game Engine**: Pure TypeScript logic for board generation (19 hexes, tokens, desert, harbors), rules validation (setup phase, distance rule, costs), and resource distribution.
- **Advanced Mechanics**: Full implementation of the Robber (discard, move, steal), Trading (Bank, Harbors, Players), and Development Cards (Knight, Victory Point, Road Building, Year of Plenty, Monopoly).
- **Interactive UI**: Custom-built React board with clickable hexes, edges, and intersections for seamless gameplay.
- **Player Bots**: Basic AI logic for 3-4 player games (human + bots).
- **Persistence**: Save and load game states locally using Electron IPC and `electron-store`.
- **Unit Tested**: Critical game rules verified with comprehensive unit tests (Vitest).

## Project Structure

```
├── electron/          # Electron Main Process & Preload Scripts
├── src/
│   ├── api/           # IPC communication layer
│   ├── components/    # React components (Board, Dashboard, EventLog)
│   ├── game/          # Pure TypeScript Game Engine & Rules
│   │   ├── __tests__/ # Unit tests for game logic
│   │   ├── board.ts   # Board generation
│   │   ├── engine.ts  # Core game loop & actions
│   │   └── types.ts   # Shared TypeScript definitions
│   ├── hooks/         # Custom React hooks (useGame)
│   └── App.tsx        # Root application component
└── vite.config.ts     # Vite, Electron & Vitest configuration
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

Run the application in development mode:
```bash
pnpm dev
```
This launches the Vite dev server and the Electron application.

### Building

Build the application for production:
```bash
pnpm build
```

### Quality Assurance

- **Run Tests**: `pnpm test:run`
- **Linting**: `pnpm lint`
- **Type Checking**: `tsc -b`

## Known Limitations

- Bot AI is basic and focuses on random legal moves.
- Expansions are not currently supported, but the architecture is modular for future additions.
- Local multiplayer is single-instance (hot-seat style or human vs. bots).
