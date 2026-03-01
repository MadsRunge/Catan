import React from 'react';
import './Dashboard.css';

interface ActionsProps {
  onRollDice: () => void;
  onEndTurn: () => void;
  canBuildSettlement: boolean;
  canBuildRoad: boolean;
}

export const Actions: React.FC<ActionsProps> = ({ 
  onRollDice, 
  onEndTurn, 
  canBuildSettlement, 
  canBuildRoad 
}) => {
  return (
    <div className="action-buttons">
      <button className="btn btn-primary" onClick={onRollDice}>Roll Dice</button>
      <button className="btn btn-secondary" onClick={onEndTurn}>End Turn</button>
      <button className="btn btn-success" disabled={!canBuildSettlement}>Build Settlement</button>
      <button className="btn btn-success" disabled={!canBuildRoad}>Build Road</button>
    </div>
  );
};
