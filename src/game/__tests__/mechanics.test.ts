import { describe, it, expect } from 'vitest';
import { handleSevenRolled, moveRobber, stealResource } from '../mechanics';
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

describe('Mechanics', () => {
  describe('handleSevenRolled', () => {
    it('should force players with more than 7 resources to discard half', () => {
      const player1 = createMockPlayer(1, { wood: 10 }); // 10 resources, should discard 5
      const player2 = createMockPlayer(2, { wood: 4 });  // 4 resources, should not discard

      const initialState = createMockGameState({
        players: [player1, player2],
      });

      const newState = handleSevenRolled(initialState);
      
      const totalResourcesP1 = Object.values(newState.players[0].resources).reduce((a, b) => a + b, 0);
      const totalResourcesP2 = Object.values(newState.players[1].resources).reduce((a, b) => a + b, 0);

      expect(totalResourcesP1).toBe(5);
      expect(totalResourcesP2).toBe(4);
    });
  });

  describe('moveRobber', () => {
    it('should update the robber location', () => {
      const hexes = [createMockHex(1), { ...createMockHex(2), id: 2 }];
      const initialState = createMockGameState({
        hexes,
        robberHexId: 1,
      });

      const newState = moveRobber(initialState, 2);
      expect(newState.robberHexId).toBe(2);
      expect(newState.hexes.find(h => h.id === 2)?.hasRobber).toBe(true);
      expect(newState.hexes.find(h => h.id === 1)?.hasRobber).toBe(false);
    });
  });

  describe('stealResource', () => {
    it('should steal a resource from one player to another', () => {
      const player1 = createMockPlayer(1, { wood: 0 });
      const player2 = createMockPlayer(2, { wood: 1 });

      const initialState = createMockGameState({
        players: [player1, player2],
        robberHexId: 1,
      });

      const newState = stealResource(initialState, 2);
      expect(newState.players[0].resources.wood).toBe(1);
      expect(newState.players[1].resources.wood).toBe(0);
    });
  });
});
