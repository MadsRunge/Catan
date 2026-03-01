import React from 'react';
import './Dashboard.css';

export const TradeUI: React.FC = () => {
  return (
    <div className="trade-ui">
      <h4>Trade (4:1 Bank)</h4>
      <div className="trade-row">
        <span>Give 4 Lumber</span>
        <button className="btn btn-secondary">Trade</button>
      </div>
      <div className="trade-row">
        <span>Get 1 Brick</span>
      </div>
    </div>
  );
};
