import { describe, it, expect } from "vitest";
import { initializeGame, distributeResources, placeSettlement } from "./engine";
import { ResourceType, Resource } from "./types";

describe("Game Engine", () => {
  it("should initialize a game with 19 hexes", () => {
    const state = initializeGame(3);
    expect(state.hexes.length).toBe(19);
    expect(state.players.length).toBe(3);
    expect(Object.keys(state.nodes).length).toBeGreaterThan(0);
    expect(Object.keys(state.edges).length).toBeGreaterThan(0);
  });

  it("should distribute resources when dice is rolled", () => {
    let state = initializeGame(3);
    
    // Pick a node and a hex it touches
    const hex = state.hexes.find(h => h.token !== null && h.resource !== ResourceType.None)!;
    const nodeId = Object.keys(state.nodes).find(id => id.includes(`${hex.q},${hex.r},${hex.s}`))!;
    
    // Place a settlement in setup phase
    state = placeSettlement(state, 0, nodeId, true);
    
    // Roll the dice for that hex
    state = distributeResources(state, hex.token!);
    
    expect(state.players[0].resources[hex.resource as Resource]).toBe(1);
  });

  it("should follow the distance rule for settlements", () => {
    const state = initializeGame(3);
    const nodeIds = Object.keys(state.nodes);
    const n1 = nodeIds[0];
    
    // Find an adjacent node
    const edge = Object.values(state.edges).find(e => e.id.includes(n1))!;
    const n2 = edge.id.replace(n1, "").replace("<->", "");
    
    const stateAfter1 = placeSettlement(state, 0, n1, true);
    expect(stateAfter1.nodes[n1]?.owner).toBe(0);
    
    const stateAfter2 = placeSettlement(stateAfter1, 1, n2, true);
    expect(stateAfter2.nodes[n2]?.owner).toBeNull(); // Should fail distance rule
  });

  it("should generate the correct distribution of hex types", () => {
    const state = initializeGame(3);
    const forestCount = state.hexes.filter(h => h.resource === ResourceType.Wood).length;
    const desertCount = state.hexes.filter(h => h.resource === ResourceType.None).length;
    
    expect(forestCount).toBe(4);
    expect(desertCount).toBe(1);
  });
});
