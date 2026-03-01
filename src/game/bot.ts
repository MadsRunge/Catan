import { GameState, Resource } from './types';
import { moveRobber, stealResource } from './mechanics';
import { bankTrade } from './trade';

export function botTurn(state: GameState): GameState {
  let updatedState = { ...state };

  // 1. Move Robber if 7 was rolled
  // For simplicity, we assume this is handled in a separate step of the turn, 
  // but let's provide a function the bot can call.
  
  // 2. Play Dev Cards
  updatedState = botPlayDevCards(updatedState);

  // 3. Trade with bank if necessary
  updatedState = botBankTrade(updatedState);

  return updatedState;
}

export function botChooseRobberHex(state: GameState): number {
  // Simple bot logic: move robber to a hex that isn't their own and has a high number token
  // For now, just pick a random hex that doesn't currently have the robber.
  const otherHexes = state.hexes.filter(h => h.id !== state.robberHexId);
  const randomHex = otherHexes[Math.floor(Math.random() * otherHexes.length)];
  return randomHex.id;
}

export function botChooseStealTarget(state: GameState, _targetHexId: number): number | null {
  // Simple bot logic: steal from anyone on the target hex who isn't the current bot.
  // This would require knowledge of which players are on which hexes.
  // Since we don't have that mapping yet, let's just pick another player at random who has resources.
  const currentPlayer = state.players[state.currentPlayerIndex];
  const otherPlayers = state.players.filter(p => p.id !== currentPlayer.id);
  const playersWithResources = otherPlayers.filter(p => Object.values(p.resources).some(c => c > 0));

  if (playersWithResources.length === 0) return null;
  return playersWithResources[Math.floor(Math.random() * playersWithResources.length)].id;
}

function botPlayDevCards(state: GameState): GameState {
  const currentPlayer = state.players[state.currentPlayerIndex];
  if (currentPlayer.playedDevCardThisTurn) return state;

  const knightCardIndex = currentPlayer.devCards.findIndex(c => c === 'knight');
  if (knightCardIndex !== -1) {
    // Bot plays a knight card
    let updatedState = { ...state };
    const targetHex = botChooseRobberHex(state);
    updatedState = moveRobber(updatedState, targetHex);
    const targetPlayer = botChooseStealTarget(updatedState, targetHex);
    if (targetPlayer !== null) {
      updatedState = stealResource(updatedState, targetPlayer);
    }

    const updatedPlayers = updatedState.players.map((p, i) => {
      if (i === state.currentPlayerIndex) {
        const newDevCards = [...p.devCards];
        newDevCards.splice(knightCardIndex, 1);
        return {
          ...p,
          devCards: newDevCards,
          knightsPlayed: p.knightsPlayed + 1,
          playedDevCardThisTurn: true
        };
      }
      return p;
    });

    return { ...updatedState, players: updatedPlayers };
  }

  return state;
}

function botBankTrade(state: GameState): GameState {
  const currentPlayer = state.players[state.currentPlayerIndex];
  const resourceTypes: Resource[] = ['wood', 'brick', 'sheep', 'wheat', 'ore'];

  for (const offer of resourceTypes) {
    if (currentPlayer.resources[offer] >= 4) {
      // Find a resource we need (one we have 0 of)
      const request = resourceTypes.find(r => currentPlayer.resources[r] === 0);
      if (request) {
        return bankTrade(state, offer, request);
      }
    }
  }

  return state;
}
