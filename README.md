# Catan Desktop with Persistence

A desktop version of Catan (prototype) built with React, TypeScript, Vite, and Electron.

## Features

- **Electron Integration**: Runs as a native desktop application.
- **Game Persistence**: Save and Load your game state locally using Electron IPC and `electron-store`.
- **Automatic Resume**: Check for existing saved games on startup.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/)

### Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

Run the application in development mode:
```bash
pnpm dev
```
This will start the Vite dev server and launch the Electron application.

### Building

Build the application for production:
```bash
pnpm build
```

## Persistence Implementation

The persistence layer is implemented using Electron's IPC (Inter-Process Communication).

- **Main Process (`electron/main.ts`)**: Handles the actual file I/O using `electron-store`.
- **Preload Script (`electron/preload.ts`)**: Exposes a secure bridge to the renderer process.
- **Renderer Process (`src/api/ipc.ts`)**: Provides a typed API for the React components to interact with the persistence layer.

### IPC Methods

- `saveGame(gameState)`: Saves the current game state.
- `loadGame()`: Retrieves the saved game state.
- `hasSavedGame()`: Checks if a saved game exists.
- `clearGame()`: Deletes the saved game state.

## Quality Assurance

### Linting

Run ESLint:
```bash
pnpm lint
```

### Type Checking

Run TypeScript compiler:
```bash
pnpm tsc
```
