import { GameState, Player } from './types';

export function calculatePlayerScore(player: Player, state: GameState): number {
  let score = 0;

  // Settlements and Cities
  score += player.settlements;
  score += player.cities * 2;

  // Victory Point Cards
  score += player.devCards.filter(card => card === 'victory_point').length;

  // Longest Road
  if (isLongestRoad(player, state)) {
    score += 2;
  }

  // Largest Army
  if (isLargestArmy(player, state)) {
    score += 2;
  }

  return score;
}

function isLongestRoad(player: Player, state: GameState): boolean {
  if (player.longestRoad < 5) return false;

  // Find the maximum longest road among all players
  const maxLongestRoad = Math.max(...state.players.map(p => p.longestRoad));

  // If player has the maximum and it's unique, or they were already holding it...
  // For simplicity, we assume player.longestRoad is updated elsewhere.
  // In a real Catan game, the longest road title only changes if someone exceeds the current holder.
  // We'll just return if they have the maximum value among all players and it's >= 5.
  return player.longestRoad === maxLongestRoad && player.longestRoad >= 5;
}

function isLargestArmy(player: Player, state: GameState): boolean {
  if (player.knightsPlayed < 3) return false;

  const maxKnights = Math.max(...state.players.map(p => p.knightsPlayed));

  return player.knightsPlayed === maxKnights && player.knightsPlayed >= 3;
}

export function checkWinner(state: GameState): GameState {
  for (const player of state.players) {
    const score = calculatePlayerScore(player, state);
    if (score >= 10) {
      return { ...state, winnerId: player.id };
    }
  }
  return state;
}
