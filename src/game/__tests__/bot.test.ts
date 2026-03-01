import { describe, it, expect } from 'vitest';
import { botChooseRobberHex, botTurn } from '../bot';
import { GameState, Player, Hex, HexType, ResourceType } from '../types';

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

const createMockHex = (id: number): Hex => ({
  id,
  type: HexType.Forest,
  resource: ResourceType.Wood,
  token: 8,
  hasRobber: false,
  q: 0,
  r: 0,
  s: 0,
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

describe('Bot', () => {
  describe('botChooseRobberHex', () => {
    it('should choose a hex that does not have the robber', () => {
      const hexes = [createMockHex(1), { ...createMockHex(2), id: 2 }];
      const state = createMockGameState({ hexes, robberHexId: 1 });
      const chosenHex = botChooseRobberHex(state);
      expect(chosenHex).toBe(2);
    });
  });

  describe('botTurn', () => {
    it('should play a knight card if available', () => {
      const player1 = { ...createMockPlayer(1), devCards: ['knight'] as any[] };
      const player2 = { ...createMockPlayer(2), resources: { wood: 1, brick: 0, sheep: 0, wheat: 0, ore: 0 } };
      const hexes = [createMockHex(1), { ...createMockHex(2), id: 2 }];
      const initialState = createMockGameState({
        players: [player1, player2],
        currentPlayerIndex: 0,
        hexes,
        robberHexId: 1,
      });

      const newState = botTurn(initialState);
      expect(newState.players[0].devCards).toHaveLength(0);
      expect(newState.players[0].knightsPlayed).toBe(1);
      expect(newState.players[0].playedDevCardThisTurn).toBe(true);
      expect(newState.robberHexId).toBe(2);
    });
  });
});
