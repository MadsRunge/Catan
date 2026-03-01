import { Hex, HexType, ResourceType, Harbor, HarborType, Node, Edge } from "./types";

const HEX_TYPES = [
  ...Array(4).fill(HexType.Forest),
  ...Array(4).fill(HexType.Pasture),
  ...Array(4).fill(HexType.Fields),
  ...Array(3).fill(HexType.Hills),
  ...Array(3).fill(HexType.Mountains),
  HexType.Desert,
];

const TOKENS = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];

const HARBOR_TYPES = [
  HarborType.Generic, HarborType.Generic, HarborType.Generic, HarborType.Generic,
  HarborType.Wood, HarborType.Sheep, HarborType.Wheat, HarborType.Brick, HarborType.Ore,
];

export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getResourceType(hexType: HexType): ResourceType {
  switch (hexType) {
    case HexType.Forest: return ResourceType.Wood;
    case HexType.Pasture: return ResourceType.Sheep;
    case HexType.Fields: return ResourceType.Wheat;
    case HexType.Hills: return ResourceType.Brick;
    case HexType.Mountains: return ResourceType.Ore;
    case HexType.Desert: return ResourceType.None;
    default: return ResourceType.None;
  }
}

export function generateHexes(): Hex[] {
  const shuffledTypes = shuffle(HEX_TYPES);
  const shuffledTokens = shuffle(TOKENS);
  const hexes: Hex[] = [];
  let tokenIndex = 0;
  let id = 0;

  for (let q = -2; q <= 2; q++) {
    for (let r = Math.max(-2, -q - 2); r <= Math.min(2, -q + 2); r++) {
      const s = -q - r;
      const type = shuffledTypes.pop()!;
      let token: number | null = null;
      if (type !== HexType.Desert) {
        token = shuffledTokens[tokenIndex++];
      }
      const resource = getResourceType(type);
      hexes.push({ 
        id: id++, 
        type, 
        resource, 
        token, 
        q, 
        r, 
        s, 
        hasRobber: type === HexType.Desert 
      });
    }
  }
  return hexes;
}

export function generateNodesAndEdges(hexes: Hex[]): { nodes: Record<string, Node>, edges: Record<string, Edge> } {
  const nodes: Record<string, Node> = {};
  const edges: Record<string, Edge> = {};

  const hexMap = new Map<string, Hex>();
  hexes.forEach(h => hexMap.set(`${h.q},${h.r},${h.s}`, h));

  hexes.forEach(hex => {
    const { q, r, s } = hex;
    
    const vertexDefinitions = [
      [[q, r, s], [q, r - 1, s + 1], [q + 1, r - 1, s]],
      [[q, r, s], [q + 1, r - 1, s], [q + 1, r, s - 1]],
      [[q, r, s], [q + 1, r, s - 1], [q, r + 1, s - 1]],
      [[q, r, s], [q, r + 1, s - 1], [q - 1, r + 1, s]],
      [[q, r, s], [q - 1, r + 1, s], [q - 1, r, s + 1]],
      [[q, r, s], [q - 1, r, s + 1], [q, r - 1, s + 1]],
    ];

    const nodeIds: string[] = [];

    vertexDefinitions.forEach((vDef) => {
      const nodeId = vDef
        .map(coord => coord.join(","))
        .sort()
        .join("|");
      
      if (!nodes[nodeId]) {
        nodes[nodeId] = { id: nodeId, owner: null, building: null };
      }
      nodeIds.push(nodeId);
    });

    for (let i = 0; i < 6; i++) {
      const n1 = nodeIds[i];
      const n2 = nodeIds[(i + 1) % 6];
      const edgeId = [n1, n2].sort().join("<->");
      if (!edges[edgeId]) {
        edges[edgeId] = { id: edgeId, owner: null };
      }
    }
  });

  return { nodes, edges };
}

export function generateHarbors(nodes: Record<string, Node>): Harbor[] {
  const shuffledHarborTypes = shuffle(HARBOR_TYPES);
  const harbors: Harbor[] = [];
  const nodeIds = Object.keys(nodes);
  
  // Assign harbors to pairs of nodes on the boundary (simplified for this task)
  for (let i = 0; i < 9; i++) {
    const harborType = shuffledHarborTypes.pop()!;
    const n1 = nodeIds[i * 2];
    const n2 = nodeIds[i * 2 + 1];
    harbors.push({ type: harborType, nodeIds: [n1, n2] });
  }

  return harbors;
}

export function generateBoard(): { 
  hexes: Hex[], 
  nodes: Record<string, Node>, 
  edges: Record<string, Edge>, 
  harbors: Harbor[] 
} {
  const hexes = generateHexes();
  const { nodes, edges } = generateNodesAndEdges(hexes);
  const harbors = generateHarbors(nodes);
  
  return { hexes, nodes, edges, harbors };
}
