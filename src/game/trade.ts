import { GameState, Resource, Player } from './types';

export function bankTrade(state: GameState, offer: Resource, request: Resource): GameState {
  const currentPlayer = state.players[state.currentPlayerIndex];
  if (currentPlayer.resources[offer] < 4) return state;

  const updatedPlayers = state.players.map((player, index) => {
    if (index === state.currentPlayerIndex) {
      return {
        ...player,
        resources: {
          ...player.resources,
          [offer]: player.resources[offer] - 4,
          [request]: player.resources[request] + 1
        }
      };
    }
    return player;
  });

  return { ...state, players: updatedPlayers };
}

export function harborTrade(state: GameState, offer: Resource, request: Resource, ratio: 2 | 3): GameState {
  const currentPlayer = state.players[state.currentPlayerIndex];
  if (currentPlayer.resources[offer] < ratio) return state;

  const updatedPlayers = state.players.map((player, index) => {
    if (index === state.currentPlayerIndex) {
      return {
        ...player,
        resources: {
          ...player.resources,
          [offer]: player.resources[offer] - ratio,
          [request]: player.resources[request] + 1
        }
      };
    }
    return player;
  });

  return { ...state, players: updatedPlayers };
}

export function playerTrade(
  state: GameState,
  fromPlayerId: number,
  toPlayerId: number,
  offer: Partial<Record<Resource, number>>,
  request: Partial<Record<Resource, number>>
): GameState {
  const fromPlayer = state.players.find(p => p.id === fromPlayerId);
  const toPlayer = state.players.find(p => p.id === toPlayerId);

  if (!fromPlayer || !toPlayer) return state;

  // Check if fromPlayer has the offered resources
  for (const [resource, count] of Object.entries(offer)) {
    if (fromPlayer.resources[resource as Resource] < (count || 0)) return state;
  }

  // Check if toPlayer has the requested resources
  for (const [resource, count] of Object.entries(request)) {
    if (toPlayer.resources[resource as Resource] < (count || 0)) return state;
  }

  const updatedPlayers = state.players.map(player => {
    if (player.id === fromPlayerId) {
      const newResources = { ...player.resources };
      for (const [resource, count] of Object.entries(offer)) {
        newResources[resource as Resource] -= (count || 0);
      }
      for (const [resource, count] of Object.entries(request)) {
        newResources[resource as Resource] += (count || 0);
      }
      return { ...player, resources: newResources };
    }
    if (player.id === toPlayerId) {
      const newResources = { ...player.resources };
      for (const [resource, count] of Object.entries(offer)) {
        newResources[resource as Resource] += (count || 0);
      }
      for (const [resource, count] of Object.entries(request)) {
        newResources[resource as Resource] -= (count || 0);
      }
      return { ...player, resources: newResources };
    }
    return player;
  });

  return { ...state, players: updatedPlayers };
}
