import React from 'react';
import type { Resources as ResourcesType } from '../../hooks/useGame';
import './Dashboard.css';

interface ResourcesProps {
  resources: ResourcesType;
}

export const Resources: React.FC<ResourcesProps> = ({ resources }) => {
  return (
    <div className="resource-list">
      {Object.entries(resources).map(([type, amount]) => (
        <div key={type} className="resource-item">
          <span className="resource-label">{type}</span>
          <span className="resource-value">{amount}</span>
        </div>
      ))}
    </div>
  );
};
