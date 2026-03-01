import { useEffect, useState } from 'react'
import './App.css'
import { Board } from './components/Board/Board'
import { Dashboard } from './components/Dashboard/Dashboard'
import { useGame } from './hooks/useGame'
import { persistence } from './api/ipc'

function App() {
  const { 
    gameState, 
    rollDice, 
    buildSettlement, 
    buildRoad, 
    endTurn,
    setGameState
  } = useGame();

  const [hasSavedGame, setHasSavedGame] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    window.ipcRenderer.on('main-process-message', (_event, value) => {
      console.log('Main process message:', value);
    });

    const checkSaved = async () => {
      const hasSaved = await persistence.hasSaved();
      setHasSavedGame(hasSaved);
    };
    void checkSaved();
  }, []);

  const handleSave = async () => {
    const result = await persistence.save(gameState);
    if (result.success) {
      setStatusMessage('Game saved successfully!');
      setHasSavedGame(true);
    } else {
      setStatusMessage(`Error saving game: ${result.error}`);
    }
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleLoad = async () => {
    const result = await persistence.load<any>();
    if (result.success && result.data) {
      setGameState(result.data);
      setStatusMessage('Game loaded successfully!');
    } else {
      setStatusMessage(`Error loading game: ${result.error}`);
    }
    setTimeout(() => setStatusMessage(''), 3000);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Catan Desktop</h1>
        <div className="persistence-controls">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleLoad} disabled={!hasSavedGame}>Load</button>
        </div>
      </header>
      
      {statusMessage && <div className="status-toast">{statusMessage}</div>}

      <main className="app-main">
        <Board 
          gameState={gameState} 
          onIntersectionClick={buildSettlement} 
          onEdgeClick={buildRoad} 
        />
      </main>

      <footer className="app-footer">
        <Dashboard 
          gameState={gameState} 
          onRollDice={rollDice} 
          onEndTurn={endTurn} 
        />
      </footer>
    </div>
  )
}

export default App
