import { describe, it, expect } from "vitest";
import { initializeGame, distributeResources, placeSettlement, canPlaceSettlement } from "./engine";
import { ResourceType, BuildingType } from "./types";

describe("Game Engine", () => {
  it("should initialize a game with 19 hexes", () => {
    const state = initializeGame(3);
    expect(state.hexes.length).toBe(19);
    expect(state.players.length).toBe(3);
    expect(state.nodes.size).toBeGreaterThan(0);
    expect(state.edges.size).toBeGreaterThan(0);
  });

  it("should distribute resources when dice is rolled", () => {
    let state = initializeGame(3);
    
    // Pick a node and a hex it touches
    const hex = state.hexes.find(h => h.token !== null && h.resource !== ResourceType.None)!;
    const nodeId = Array.from(state.nodes.keys()).find(id => id.includes(`${hex.q},${hex.r},${hex.s}`))!;
    
    // Place a settlement in setup phase
    state = placeSettlement(state, 0, nodeId, true);
    
    // Roll the dice for that hex
    state = distributeResources(state, hex.token!);
    
    expect(state.players[0].resources[hex.resource]).toBe(1);
  });

  it("should follow the distance rule for settlements", () => {
    const state = initializeGame(3);
    const nodeIds = Array.from(state.nodes.keys());
    const n1 = nodeIds[0];
    
    // Find an adjacent node
    const edge = Array.from(state.edges.values()).find(e => e.id.includes(n1))!;
    const n2 = edge.id.replace(n1, "").replace("<->", "");
    
    const stateAfter1 = placeSettlement(state, 0, n1, true);
    expect(stateAfter1.nodes.get(n1)?.owner).toBe(0);
    
    const stateAfter2 = placeSettlement(stateAfter1, 1, n2, true);
    expect(stateAfter2.nodes.get(n2)?.owner).toBeNull(); // Should fail distance rule
  });

  it("should generate the correct distribution of hex types", () => {
    const state = initializeGame(3);
    const forestCount = state.hexes.filter(h => h.resource === ResourceType.Wood).length;
    const desertCount = state.hexes.filter(h => h.resource === ResourceType.None).length;
    
    expect(forestCount).toBe(4);
    expect(desertCount).toBe(1);
  });
});
