import React from 'react';
import './Dashboard.css';

interface EventLogProps {
  events: string[];
}

export const EventLog: React.FC<EventLogProps> = ({ events }) => {
  return (
    <div className="event-log">
      {events.map((event, i) => (
        <div key={i}>{`> ${event}`}</div>
      ))}
    </div>
  );
};
