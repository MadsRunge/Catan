import { GameState, Player, ResourceType, Resource, BuildingType } from "./types";
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
      },
      devCards: [],
      settlements: 0,
      cities: 0,
      roads: 0,
      knightsPlayed: 0,
      longestRoad: 0,
      victoryPoints: 0,
      playedDevCardThisTurn: false,
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
    winnerId: null,
    devCardDeck: [],
  };
}

export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
}

export function distributeResources(state: GameState, diceRoll: number): GameState {
  if (diceRoll === 7) return state; // Robber logic not implemented for now

  const newState = { ...state, players: state.players.map(p => ({ ...p, resources: { ...p.resources } })) };

  newState.hexes.forEach(hex => {
    if (hex.token === diceRoll && hex.id !== state.robberHexId) {
      // Find nodes touching this hex
      const touchingNodes = Object.values(newState.nodes).filter(node => 
        node.id.includes(`${hex.q},${hex.r},${hex.s}`)
      );

      touchingNodes.forEach(node => {
        if (node.owner !== null) {
          const player = newState.players[node.owner];
          const amount = node.building === BuildingType.City ? 2 : 1;
          if (hex.resource !== ResourceType.None) {
            player.resources[hex.resource as Resource] += amount;
          }
        }
      });
    }
  });

  return newState;
}

export function canPlaceSettlement(state: GameState, playerId: number, nodeId: string, isSetupPhase: boolean = false): boolean {
  const node = state.nodes[nodeId];
  if (!node || node.owner !== null) return false;

  const adjacentNodeIds = Object.keys(state.edges)
    .filter(edgeId => edgeId.includes(nodeId))
    .map(edgeId => edgeId.replace(nodeId, "").replace("<->", ""));

  for (const adjId of adjacentNodeIds) {
    if (state.nodes[adjId]?.owner !== null) return false;
  }

  if (!isSetupPhase) {
    const hasConnectingRoad = Object.values(state.edges).some(edge => 
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

  const newState: GameState = { 
    ...state, 
    nodes: { ...state.nodes },
    players: state.players.map(p => p.id === playerId ? { ...p, resources: { ...p.resources } } : p)
  };

  const node = newState.nodes[nodeId];
  newState.nodes[nodeId] = { ...node, owner: playerId, building: BuildingType.Settlement };

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
  const edge = state.edges[edgeId];
  if (!edge || edge.owner !== null) return state;

  const newState: GameState = { 
    ...state, 
    edges: { ...state.edges },
    players: state.players.map(p => p.id === playerId ? { ...p, resources: { ...p.resources } } : p)
  };

  newState.edges[edgeId] = { ...edge, owner: playerId };
  const player = newState.players[playerId];
  player.roads++;

  if (!isSetupPhase) {
    player.resources[ResourceType.Wood]--;
    player.resources[ResourceType.Brick]--;
  }

  return newState;
}

export function placeCity(state: GameState, playerId: number, nodeId: string): GameState {
  const node = state.nodes[nodeId];
  if (!node || node.owner !== playerId || node.building !== BuildingType.Settlement) return state;

  const p = state.players[playerId];
  if (p.resources[ResourceType.Ore] < 3 || p.resources[ResourceType.Wheat] < 2) return state;

  const newState: GameState = { 
    ...state, 
    nodes: { ...state.nodes },
    players: state.players.map(p => p.id === playerId ? { ...p, resources: { ...p.resources } } : p)
  };

  const updatedNode = newState.nodes[nodeId];
  newState.nodes[nodeId] = { ...updatedNode, building: BuildingType.City };

  const player = newState.players[playerId];
  player.settlements--;
  player.cities++;
  player.victoryPoints++;
  player.resources[ResourceType.Ore] -= 3;
  player.resources[ResourceType.Wheat] -= 2;

  return newState;
}
