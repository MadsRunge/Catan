import { describe, it, expect } from 'vitest';
import { calculatePlayerScore, checkWinner } from '../scoring';
import { GameState, Player } from '../types';

const createMockPlayer = (id: number, resources: any = {}): Player => ({
  id,
  resources: { wood: 0, brick: 0, sheep: 0, wheat: 0, ore: 0, ...resources },
  devCards: [],
  settlements: 0,
  cities: 0,
  roads: 0,
  knightsPlayed: 0,
  longestRoad: 0,
  victoryPoints: 0,
  playedDevCardThisTurn: false,
});

const createMockGameState = (overrides: Partial<GameState> = {}): GameState => ({
  players: [],
  currentPlayerIndex: 0,
  hexes: [],
  nodes: {},
  edges: {},
  harbors: [],
  robberHexId: 0,
  diceResult: null,
  winnerId: null,
  devCardDeck: [],
  ...overrides,
});

describe('Scoring', () => {
  describe('calculatePlayerScore', () => {
    it('should calculate points for settlements and cities', () => {
      const player = { ...createMockPlayer(1), settlements: 2, cities: 1 };
      const state = createMockGameState({ players: [player] });
      expect(calculatePlayerScore(player, state)).toBe(4); // 2*1 + 1*2
    });

    it('should calculate points for victory point cards', () => {
      const player = { ...createMockPlayer(1), devCards: ['knight', 'victory_point'] as any[] };
      const state = createMockGameState({ players: [player] });
      expect(calculatePlayerScore(player, state)).toBe(1);
    });

    it('should calculate points for Largest Army', () => {
      const player1 = { ...createMockPlayer(1), knightsPlayed: 3 };
      const player2 = { ...createMockPlayer(2), knightsPlayed: 2 };
      const state = createMockGameState({ players: [player1, player2] });
      expect(calculatePlayerScore(player1, state)).toBe(2);
      expect(calculatePlayerScore(player2, state)).toBe(0);
    });

    it('should calculate points for Longest Road', () => {
      const player1 = { ...createMockPlayer(1), longestRoad: 5 };
      const player2 = { ...createMockPlayer(2), longestRoad: 4 };
      const state = createMockGameState({ players: [player1, player2] });
      expect(calculatePlayerScore(player1, state)).toBe(2);
      expect(calculatePlayerScore(player2, state)).toBe(0);
    });
  });

  describe('checkWinner', () => {
    it('should set winnerId if a player has 10 or more points', () => {
      const player1 = { ...createMockPlayer(1), settlements: 10 };
      const state = createMockGameState({ players: [player1] });
      const newState = checkWinner(state);
      expect(newState.winnerId).toBe(1);
    });
  });
});
