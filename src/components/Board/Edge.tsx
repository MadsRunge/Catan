import React from 'react';
import './Board.css';

interface EdgeProps {
  id: string;
  x: number;
  y: number;
  rotation: number;
  color?: string;
  onClick: (id: string) => void;
}

export const Edge: React.FC<EdgeProps> = ({ id, x, y, rotation, color, onClick }) => {
  const style: React.CSSProperties = {
    left: `${x}px`,
    top: `${y}px`,
    transform: `rotate(${rotation}deg)`,
    color: color,
  };

  return (
    <div 
      className={`edge ${color ? 'owned' : ''}`} 
      style={style} 
      onClick={() => onClick(id)}
    />
  );
};
