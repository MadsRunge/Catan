export type ResourceType = 'brick' | 'lumber' | 'wool' | 'grain' | 'ore' | 'desert';

export interface Resources {
  brick: number;
  lumber: number;
  wool: number;
  grain: number;
  ore: number;
}

export type PlayerColor = 'red' | 'blue' | 'white' | 'orange';

export interface Player {
  id: string;
  name: string;
  color: PlayerColor;
  resources: Resources;
  victoryPoints: number;
}

export interface HexData {
  id: string;
  type: ResourceType;
  number: number | null;
  q: number;
  r: number;
}

export interface SettlementData {
  id: string;
  playerId: string;
  type: 'settlement' | 'city';
}

export interface RoadData {
  id: string;
  playerId: string;
}

export interface GameState {
  players: Player[];
  currentPlayerId: string;
  board: {
    hexes: HexData[];
    settlements: Record<string, SettlementData>; // key is intersection id
    roads: Record<string, RoadData>; // key is edge id
  };
  eventLog: string[];
}

import { useState, useCallback } from 'react';

export const useGame = () => {
  // Initial Mock State
  const [gameState, setGameState] = useState<GameState>({
    players: [
      {
        id: '1',
        name: 'Player 1',
        color: 'red',
        resources: { brick: 2, lumber: 2, wool: 1, grain: 1, ore: 0 },
        victoryPoints: 2,
      },
      {
        id: '2',
        name: 'Player 2',
        color: 'blue',
        resources: { brick: 0, lumber: 0, wool: 0, grain: 0, ore: 0 },
        victoryPoints: 2,
      },
    ],
    currentPlayerId: '1',
    board: {
      hexes: [
        { id: 'h1', type: 'brick', number: 6, q: 0, r: 0 },
        { id: 'h2', type: 'lumber', number: 8, q: 1, r: -1 },
        { id: 'h3', type: 'wool', number: 9, q: 1, r: 0 },
        // ... more hexes
      ],
      settlements: {},
      roads: {},
    },
    eventLog: ['Game started'],
  });

  const rollDice = useCallback(() => {
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    const roll = die1 + die2;
    
    setGameState(prev => ({
      ...prev,
      eventLog: [`Player rolled a ${roll}`, ...prev.eventLog],
    }));
  }, []);

  const buildSettlement = useCallback((intersectionId: string) => {
    setGameState(prev => {
      if (prev.board.settlements[intersectionId]) return prev;

      return {
        ...prev,
        board: {
          ...prev.board,
          settlements: {
            ...prev.board.settlements,
            [intersectionId]: { id: intersectionId, playerId: prev.currentPlayerId, type: 'settlement' },
          },
        },
        eventLog: [`Player built a settlement at ${intersectionId}`, ...prev.eventLog],
      };
    });
  }, []);

  const buildRoad = useCallback((edgeId: string) => {
    setGameState(prev => {
      if (prev.board.roads[edgeId]) return prev;

      return {
        ...prev,
        board: {
          ...prev.board,
          roads: {
            ...prev.board.roads,
            [edgeId]: { id: edgeId, playerId: prev.currentPlayerId },
          },
        },
        eventLog: [`Player built a road at ${edgeId}`, ...prev.eventLog],
      };
    });
  }, []);

  const endTurn = useCallback(() => {
    setGameState(prev => {
      const currentPlayerIndex = prev.players.findIndex(p => p.id === prev.currentPlayerId);
      const nextPlayerIndex = (currentPlayerIndex + 1) % prev.players.length;
      return {
        ...prev,
        currentPlayerId: prev.players[nextPlayerIndex].id,
        eventLog: [`${prev.players[nextPlayerIndex].name}'s turn`, ...prev.eventLog],
      };
    });
  }, []);

  return {
    gameState,
    rollDice,
    buildSettlement,
    buildRoad,
    endTurn,
  };
};
