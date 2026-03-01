import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { persistence } from './api/ipc'

interface GameState {
  resources: {
    brick: number
    lumber: number
    wool: number
    grain: number
    ore: number
  }
  turn: number
}

const initialGameState: GameState = {
  resources: {
    brick: 0,
    lumber: 0,
    wool: 0,
    grain: 0,
    ore: 0,
  },
  turn: 1,
}

function App() {
  const [gameState, setGameState] = useState<GameState>(initialGameState)
  const [hasSavedGame, setHasSavedGame] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    const init = async () => {
      const hasSaved = await persistence.hasSaved()
      setHasSavedGame(hasSaved)
    }
    void init()
  }, [])

  const handleSave = async () => {
    const result = await persistence.save(gameState)
    if (result.success) {
      setStatusMessage('Game saved successfully!')
      setHasSavedGame(true)
    } else {
      setStatusMessage(`Error saving game: ${result.error}`)
    }
  }

  const handleLoad = async () => {
    const result = await persistence.load<GameState>()
    if (result.success && result.data) {
      setGameState(result.data)
      setStatusMessage('Game loaded successfully!')
    } else {
      setStatusMessage(`Error loading game: ${result.error}`)
    }
  }

  const handleNewGame = async () => {
    if (confirm('Start a new game? Current progress will be lost.')) {
      setGameState(initialGameState)
      await persistence.clear()
      setHasSavedGame(false)
      setStatusMessage('Started a new game.')
    }
  }

  const incrementResource = (resource: keyof GameState['resources']) => {
    setGameState(prev => ({
      ...prev,
      resources: {
        ...prev.resources,
        [resource]: prev.resources[resource] + 1,
      },
    }))
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Catan Desktop</h1>
      
      <div className="game-board">
        <h3>Resources - Turn {gameState.turn}</h3>
        <div className="resource-grid">
          {Object.entries(gameState.resources).map(([resource, count]) => (
            <div key={resource} className="resource-item">
              <span className="resource-label">{resource}: </span>
              <span className="resource-count">{count}</span>
              <button onClick={() => incrementResource(resource as keyof GameState['resources'])}>+</button>
            </div>
          ))}
        </div>
        <button onClick={() => setGameState(prev => ({ ...prev, turn: prev.turn + 1 }))}>Next Turn</button>
      </div>

      <div className="persistence-controls">
        <button onClick={handleSave}>Save Game</button>
        <button onClick={handleLoad} disabled={!hasSavedGame}>Load Game</button>
        <button onClick={handleNewGame}>New Game</button>
      </div>

      {statusMessage && <p className="status-message">{statusMessage}</p>}

      <div className="card">
        <p>
          Game persistence is handled via Electron IPC and stored locally.
        </p>
      </div>
    </>
  )
}

export default App
