import { GameState, Player, ResourceType, Hex, Node, Edge, BuildingType } from "./types";
import { generateBoard } from "./board";

export function initializeGame(numPlayers: number): GameState {
  const { hexes, nodes, edges, harbors } = generateBoard();
  const players: Player[] = [];
  
  for (let i = 0; i < numPlayers; i++) {
    players.push({
      id: i,
      resources: {
        [ResourceType.Wood]: 0,
        [ResourceType.Sheep]: 0,
        [ResourceType.Wheat]: 0,
        [ResourceType.Brick]: 0,
        [ResourceType.Ore]: 0,
        [ResourceType.None]: 0,
      },
      settlements: 0,
      cities: 0,
      roads: 0,
      victoryPoints: 0,
    });
  }

  const desertHex = hexes.find(h => h.resource === ResourceType.None);

  return {
    hexes,
    nodes,
    edges,
    harbors,
    players,
    currentPlayerIndex: 0,
    robberHexId: desertHex ? desertHex.id : 0,
    diceResult: null,
    winner: null,
  };
}

export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
}

export function distributeResources(state: GameState, diceRoll: number): GameState {
  if (diceRoll === 7) return state; // Robber logic not implemented for now

  const newState = { ...state, players: [...state.players.map(p => ({ ...p, resources: { ...p.resources } }))] };

  newState.hexes.forEach(hex => {
    if (hex.token === diceRoll && hex.id !== state.robberHexId) {
      // Find nodes touching this hex
      const touchingNodes = Array.from(newState.nodes.values()).filter(node => 
        node.id.includes(`${hex.q},${hex.r},${hex.s}`)
      );

      touchingNodes.forEach(node => {
        if (node.owner !== null) {
          const player = newState.players[node.owner];
          const amount = node.building === BuildingType.City ? 2 : 1;
          player.resources[hex.resource] += amount;
        }
      });
    }
  });

  return newState;
}

export function canPlaceSettlement(state: GameState, playerId: number, nodeId: string, isSetupPhase: boolean = false): boolean {
  const node = state.nodes.get(nodeId);
  if (!node || node.owner !== null) return false;

  const adjacentNodeIds = Array.from(state.edges.keys())
    .filter(edgeId => edgeId.includes(nodeId))
    .map(edgeId => edgeId.replace(nodeId, "").replace("<->", ""));

  for (const adjId of adjacentNodeIds) {
    if (state.nodes.get(adjId)?.owner !== null) return false;
  }

  if (!isSetupPhase) {
    const hasConnectingRoad = Array.from(state.edges.values()).some(edge => 
      edge.owner === playerId && edge.id.includes(nodeId)
    );
    if (!hasConnectingRoad) return false;
    
    const p = state.players[playerId];
    if (p.resources[ResourceType.Wood] < 1 || p.resources[ResourceType.Brick] < 1 || 
        p.resources[ResourceType.Wheat] < 1 || p.resources[ResourceType.Sheep] < 1) return false;
  }

  return true;
}

export function placeSettlement(state: GameState, playerId: number, nodeId: string, isSetupPhase: boolean = false): GameState {
  if (!canPlaceSettlement(state, playerId, nodeId, isSetupPhase)) return state;

  const newState = { 
    ...state, 
    nodes: new Map(state.nodes),
    players: state.players.map(p => p.id === playerId ? { ...p, resources: { ...p.resources } } : p)
  };

  const node = newState.nodes.get(nodeId)!;
  newState.nodes.set(nodeId, { ...node, owner: playerId, building: BuildingType.Settlement });

  const player = newState.players[playerId];
  player.settlements++;
  player.victoryPoints++;

  if (!isSetupPhase) {
    player.resources[ResourceType.Wood]--;
    player.resources[ResourceType.Brick]--;
    player.resources[ResourceType.Wheat]--;
    player.resources[ResourceType.Sheep]--;
  }

  return newState;
}

export function placeRoad(state: GameState, playerId: number, edgeId: string, isSetupPhase: boolean = false): GameState {
  const edge = state.edges.get(edgeId);
  if (!edge || edge.owner !== null) return state;

  const newState = { 
    ...state, 
    edges: new Map(state.edges),
    players: state.players.map(p => p.id === playerId ? { ...p, resources: { ...p.resources } } : p)
  };

  newState.edges.set(edgeId, { ...edge, owner: playerId });
  const player = newState.players[playerId];
  player.roads++;

  if (!isSetupPhase) {
    player.resources[ResourceType.Wood]--;
    player.resources[ResourceType.Brick]--;
  }

  return newState;
}

export function placeCity(state: GameState, playerId: number, nodeId: string): GameState {
  const node = state.nodes.get(nodeId);
  if (!node || node.owner !== playerId || node.building !== BuildingType.Settlement) return state;

  const p = state.players[playerId];
  if (p.resources[ResourceType.Ore] < 3 || p.resources[ResourceType.Wheat] < 2) return state;

  const newState = { 
    ...state, 
    nodes: new Map(state.nodes),
    players: state.players.map(p => p.id === playerId ? { ...p, resources: { ...p.resources } } : p)
  };

  const updatedNode = newState.nodes.get(nodeId)!;
  newState.nodes.set(nodeId, { ...updatedNode, building: BuildingType.City });

  const player = newState.players[playerId];
  player.settlements--;
  player.cities++;
  player.victoryPoints++;
  player.resources[ResourceType.Ore] -= 3;
  player.resources[ResourceType.Wheat] -= 2;

  return newState;
}
