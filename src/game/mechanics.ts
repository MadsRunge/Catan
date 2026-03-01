import { GameState, Player, Resource } from './types';

export function handleSevenRolled(state: GameState): GameState {
  const updatedPlayers = state.players.map(player => {
    const totalResources = Object.values(player.resources).reduce((sum, count) => sum + count, 0);
    if (totalResources > 7) {
      const discardAmount = Math.floor(totalResources / 2);
      return discardResources(player, discardAmount);
    }
    return player;
  });

  return { ...state, players: updatedPlayers };
}

function discardResources(player: Player, amount: number): Player {
  const resources = { ...player.resources };
  let discarded = 0;
  const resourceTypes: Resource[] = ['wood', 'brick', 'sheep', 'wheat', 'ore'];

  while (discarded < amount) {
    const availableResources = resourceTypes.filter(type => resources[type] > 0);
    if (availableResources.length === 0) break;
    const randomResource = availableResources[Math.floor(Math.random() * availableResources.length)];
    resources[randomResource]--;
    discarded++;
  }

  return { ...player, resources };
}

export function moveRobber(state: GameState, hexId: number): GameState {
  const updatedHexes = state.hexes.map(hex => ({
    ...hex,
    hasRobber: hex.id === hexId
  }));

  return {
    ...state,
    hexes: updatedHexes,
    robberHexId: hexId
  };
}

export function stealResource(state: GameState, fromPlayerId: number): GameState {
  const currentPlayer = state.players[state.currentPlayerIndex];
  const targetPlayer = state.players.find(p => p.id === fromPlayerId);

  if (!targetPlayer) return state;

  const targetResources = Object.entries(targetPlayer.resources)
    .filter(([_, count]) => count > 0) as [Resource, number][];

  if (targetResources.length === 0) return state;

  const [stolenResource] = targetResources[Math.floor(Math.random() * targetResources.length)];

  const updatedPlayers = state.players.map(player => {
    if (player.id === currentPlayer.id) {
      return {
        ...player,
        resources: {
          ...player.resources,
          [stolenResource]: player.resources[stolenResource] + 1
        }
      };
    }
    if (player.id === fromPlayerId) {
      return {
        ...player,
        resources: {
          ...player.resources,
          [stolenResource]: player.resources[stolenResource] - 1
        }
      };
    }
    return player;
  });

  return { ...state, players: updatedPlayers };
}

export function handleRoadBuilding(state: GameState, playerId: number): GameState {
  const updatedPlayers = state.players.map(player => {
    if (player.id === playerId) {
      return {
        ...player,
        roads: player.roads + 2,
        playedDevCardThisTurn: true
      };
    }
    return player;
  });

  return { ...state, players: updatedPlayers };
}

export function handleYearOfPlenty(state: GameState, playerId: number, r1: Resource, r2: Resource): GameState {
  const updatedPlayers = state.players.map(player => {
    if (player.id === playerId) {
      return {
        ...player,
        resources: {
          ...player.resources,
          [r1]: player.resources[r1] + 1,
          [r2]: player.resources[r2] + 1
        },
        playedDevCardThisTurn: true
      };
    }
    return player;
  });

  return { ...state, players: updatedPlayers };
}

export function handleMonopoly(state: GameState, playerId: number, resource: Resource): GameState {
  let totalStolen = 0;
  const updatedPlayers = state.players.map(player => {
    if (player.id !== playerId) {
      const amount = player.resources[resource];
      totalStolen += amount;
      return {
        ...player,
        resources: {
          ...player.resources,
          [resource]: 0
        }
      };
    }
    return player;
  });

  const finalPlayers = updatedPlayers.map(player => {
    if (player.id === playerId) {
      return {
        ...player,
        resources: {
          ...player.resources,
          [resource]: player.resources[resource] + totalStolen
        },
        playedDevCardThisTurn: true
      };
    }
    return player;
  });

  return { ...state, players: finalPlayers };
}
