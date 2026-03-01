import React from 'react';
import './Board.css';

interface IntersectionProps {
  id: string;
  x: number;
  y: number;
  color?: string;
  onClick: (id: string) => void;
}

export const Intersection: React.FC<IntersectionProps> = ({ id, x, y, color, onClick }) => {
  const style: React.CSSProperties = {
    left: `${x}px`,
    top: `${y}px`,
    color: color,
  };

  return (
    <div 
      className={`intersection ${color ? 'owned' : ''}`} 
      style={style} 
      onClick={() => onClick(id)}
    />
  );
};
