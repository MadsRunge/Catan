export enum ResourceType {
  Wood = "Wood",
  Sheep = "Sheep",
  Wheat = "Wheat",
  Brick = "Brick",
  Ore = "Ore",
  None = "None", // For Desert
}

export type Resource = 'wood' | 'brick' | 'sheep' | 'wheat' | 'ore';

export enum HexType {
  Forest = "Forest",
  Pasture = "Pasture",
  Fields = "Fields",
  Hills = "Hills",
  Mountains = "Mountains",
  Desert = "Desert",
}

export type DevCard = 'knight' | 'victory_point' | 'road_building' | 'year_of_plenty' | 'monopoly';

export enum BuildingType {
  Settlement = "Settlement",
  City = "City",
}

export interface Player {
  id: number;
  resources: Record<Resource, number>;
  devCards: DevCard[];
  settlements: number;
  cities: number;
  roads: number;
  knightsPlayed: number;
  longestRoad: number;
  victoryPoints: number;
  playedDevCardThisTurn: boolean;
}

export interface Hex {
  id: number;
  type: HexType;
  resource: ResourceType;
  token: number | null; // Null for desert
  hasRobber: boolean;
  q: number; // Cubic coordinates
  r: number;
  s: number;
}

export interface Node {
  id: string; // e.g., "q,r,s-index"
  owner: number | null; // Player index
  building: BuildingType | null;
}

export interface Edge {
  id: string;
  owner: number | null; // Player index
}

export enum HarborType {
  Generic = "Generic", // 3:1
  Wood = "Wood",
  Sheep = "Sheep",
  Wheat = "Wheat",
  Brick = "Brick",
  Ore = "Ore",
}

export interface Harbor {
  type: HarborType;
  nodeIds: string[]; // Usually 2 nodes
}

export interface GameState {
  hexes: Hex[];
  nodes: Record<string, Node>; // Changed from Map for serialization
  edges: Record<string, Edge>; // Changed from Map for serialization
  harbors: Harbor[];
  players: Player[];
  currentPlayerIndex: number;
  robberHexId: number;
  diceResult: number | null;
  winnerId: number | null;
  devCardDeck: DevCard[];
}
