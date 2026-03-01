import { useEffect } from 'react'
import './App.css'
import { Board } from './components/Board/Board'
import { Dashboard } from './components/Dashboard/Dashboard'
import { useGame } from './hooks/useGame'

function App() {
  const { 
    gameState, 
    rollDice, 
    buildSettlement, 
    buildRoad, 
    endTurn 
  } = useGame();

  useEffect(() => {
    window.ipcRenderer.on('main-process-message', (_event, value) => {
      console.log('Main process message:', value);
    });
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Catan Interactive Board</h1>
      </header>
      
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
