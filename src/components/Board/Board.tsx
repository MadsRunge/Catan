import React from 'react';
import { Hex } from './Hex';
import { Intersection } from './Intersection';
import { Edge } from './Edge';
import type { GameState } from '../../hooks/useGame';
import './Board.css';

interface BoardProps {
  gameState: GameState;
  onIntersectionClick: (id: string) => void;
  onEdgeClick: (id: string) => void;
}

export const Board: React.FC<BoardProps> = ({ gameState, onIntersectionClick, onEdgeClick }) => {
  const { hexes, settlements, roads } = gameState.board;
  const players = gameState.players;

  // Mock intersections for the 3 hexes defined in useGame
  const mockIntersections = [
    { id: 'i1', x: 0, y: -50 },
    { id: 'i2', x: 43, y: -25 },
    { id: 'i3', x: 43, y: 25 },
    { id: 'i4', x: 0, y: 50 },
    { id: 'i5', x: -43, y: 25 },
    { id: 'i6', x: -43, y: -25 },
  ];

  // Mock edges
  const mockEdges = [
    { id: 'e1', x: 21, y: -37, rotation: 60 },
    { id: 'e2', x: 43, y: 0, rotation: 0 },
    { id: 'e3', x: 21, y: 37, rotation: -60 },
    { id: 'e4', x: -21, y: 37, rotation: 60 },
    { id: 'e5', x: -43, y: 0, rotation: 0 },
    { id: 'e6', x: -21, y: -37, rotation: -60 },
  ];

  return (
    <div className="board-container">
      <div className="board-inner">
        {hexes.map(hex => (
          <Hex key={hex.id} {...hex} />
        ))}
        
        {mockIntersections.map(inter => {
          const settlement = settlements[inter.id];
          const player = settlement ? players.find(p => p.id === settlement.playerId) : null;
          return (
            <Intersection 
              key={inter.id} 
              {...inter} 
              color={player?.color} 
              onClick={onIntersectionClick} 
            />
          );
        })}

        {mockEdges.map(edge => {
          const road = roads[edge.id];
          const player = road ? players.find(p => p.id === road.playerId) : null;
          return (
            <Edge 
              key={edge.id} 
              {...edge} 
              color={player?.color} 
              onClick={onEdgeClick} 
            />
          );
        })}
      </div>
    </div>
  );
};
