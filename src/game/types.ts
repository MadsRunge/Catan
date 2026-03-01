export enum ResourceType {
  Wood = "Wood",
  Sheep = "Sheep",
  Wheat = "Wheat",
  Brick = "Brick",
  Ore = "Ore",
  None = "None", // For Desert
}

export enum HexType {
  Forest = "Forest",
  Pasture = "Pasture",
  Fields = "Fields",
  Hills = "Hills",
  Mountains = "Mountains",
  Desert = "Desert",
}

export interface Hex {
  id: number;
  type: HexType;
  resource: ResourceType;
  token: number | null; // Null for desert
  q: number; // Cubic coordinates
  r: number;
  s: number;
}

export enum BuildingType {
  Settlement = "Settlement",
  City = "City",
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

export interface Player {
  id: number;
  resources: Record<ResourceType, number>;
  settlements: number;
  cities: number;
  roads: number;
  victoryPoints: number;
}

export interface GameState {
  hexes: Hex[];
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;
  harbors: Harbor[];
  players: Player[];
  currentPlayerIndex: number;
  robberHexId: number;
  diceResult: number | null;
  winner: number | null;
}
