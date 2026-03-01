export type Resource = 'wood' | 'brick' | 'sheep' | 'wheat' | 'ore';

export type DevCard = 'knight' | 'victory_point' | 'road_building' | 'year_of_plenty' | 'monopoly';

export interface Player {
  id: number;
  resources: Record<Resource, number>;
  devCards: DevCard[];
  settlements: number; // count
  cities: number; // count
  roads: number; // count
  knightsPlayed: number;
  longestRoad: number;
  victoryPoints: number;
  playedDevCardThisTurn: boolean;
}

export interface Hex {
  id: number;
  resource: Resource | 'desert';
  numberToken: number; // 2-12
  hasRobber: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  hexes: Hex[];
  robberHexId: number;
  devCardDeck: DevCard[];
  winnerId: number | null;
}
