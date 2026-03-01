import React from 'react';
import './Board.css';
import type { ResourceType } from '../../hooks/useGame';

interface HexProps {
  type: ResourceType;
  number: number | null;
  q: number;
  r: number;
}

const HEX_SIZE = 50;

export const Hex: React.FC<HexProps> = ({ type, number, q, r }) => {
  // Axial to Pixel conversion
  const x = HEX_SIZE * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r);
  const y = HEX_SIZE * (3/2 * r);

  const style: React.CSSProperties = {
    transform: `translate(${x}px, ${y}px)`,
  };

  return (
    <div className={`hex hex-${type}`} style={style}>
      <div className="hex-inner">
        {number && <div className="hex-number">{number}</div>}
      </div>
    </div>
  );
};
