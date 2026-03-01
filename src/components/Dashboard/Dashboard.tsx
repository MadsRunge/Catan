import React from 'react';
import { Resources } from './Resources';
import { Actions } from './Actions';
import { TradeUI } from './TradeUI';
import { EventLog } from './EventLog';
import type { GameState } from '../../hooks/useGame';
import './Dashboard.css';

interface DashboardProps {
  gameState: GameState;
  onRollDice: () => void;
  onEndTurn: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  gameState, 
  onRollDice, 
  onEndTurn 
}) => {
  const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayerId);
  
  if (!currentPlayer) return null;

  const canBuildSettlement = currentPlayer.resources.brick >= 1 && 
                            currentPlayer.resources.lumber >= 1 && 
                            currentPlayer.resources.wool >= 1 && 
                            currentPlayer.resources.grain >= 1;

  const canBuildRoad = currentPlayer.resources.brick >= 1 && 
                      currentPlayer.resources.lumber >= 1;

  return (
    <div className="dashboard">
      <div className="dashboard-top">
        <div>
          <h3>Current Player: <span style={{ color: currentPlayer.color }}>{currentPlayer.name}</span></h3>
          <Resources resources={currentPlayer.resources} />
        </div>
        <Actions 
          onRollDice={onRollDice} 
          onEndTurn={onEndTurn}
          canBuildSettlement={canBuildSettlement}
          canBuildRoad={canBuildRoad}
        />
      </div>
      
      <div className="dashboard-bottom">
        <TradeUI />
        <EventLog events={gameState.eventLog} />
        <div style={{ padding: '0.5rem', background: 'white', border: '1px solid #ced4da', borderRadius: '4px' }}>
          <h4>Victory Points</h4>
          {gameState.players.map(p => (
            <div key={p.id}>
              {p.name}: {p.victoryPoints} VP
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
