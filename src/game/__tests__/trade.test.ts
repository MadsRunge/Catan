import { describe, it, expect } from 'vitest';
import { bankTrade, harborTrade, playerTrade } from '../trade';
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

describe('Trade', () => {
  describe('bankTrade', () => {
    it('should exchange 4:1 with the bank', () => {
      const player1 = createMockPlayer(1, { wood: 4, brick: 0 });
      const initialState = createMockGameState({
        players: [player1],
      });

      const newState = bankTrade(initialState, 'wood', 'brick');
      expect(newState.players[0].resources.wood).toBe(0);
      expect(newState.players[0].resources.brick).toBe(1);
    });

    it('should not trade if insufficient resources', () => {
      const player1 = createMockPlayer(1, { wood: 3, brick: 0 });
      const initialState = createMockGameState({
        players: [player1],
      });

      const newState = bankTrade(initialState, 'wood', 'brick');
      expect(newState.players[0].resources.wood).toBe(3);
      expect(newState.players[0].resources.brick).toBe(0);
    });
  });

  describe('harborTrade', () => {
    it('should exchange 3:1 with a generic harbor', () => {
      const player1 = createMockPlayer(1, { wood: 3, brick: 0 });
      const initialState = createMockGameState({
        players: [player1],
      });

      const newState = harborTrade(initialState, 'wood', 'brick', 3);
      expect(newState.players[0].resources.wood).toBe(0);
      expect(newState.players[0].resources.brick).toBe(1);
    });

    it('should exchange 2:1 with a specific harbor', () => {
      const player1 = createMockPlayer(1, { wood: 2, brick: 0 });
      const initialState = createMockGameState({
        players: [player1],
      });

      const newState = harborTrade(initialState, 'wood', 'brick', 2);
      expect(newState.players[0].resources.wood).toBe(0);
      expect(newState.players[0].resources.brick).toBe(1);
    });
  });

  describe('playerTrade', () => {
    it('should exchange resources between players', () => {
      const player1 = createMockPlayer(1, { wood: 2, brick: 0 });
      const player2 = createMockPlayer(2, { wood: 0, brick: 1 });

      const initialState = createMockGameState({
        players: [player1, player2],
      });

      const newState = playerTrade(initialState, 1, 2, { wood: 1 }, { brick: 1 });
      expect(newState.players[0].resources.wood).toBe(1);
      expect(newState.players[0].resources.brick).toBe(1);
      expect(newState.players[1].resources.wood).toBe(1);
      expect(newState.players[1].resources.brick).toBe(0);
    });
  });
});
