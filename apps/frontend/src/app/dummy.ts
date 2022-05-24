import { EdgeDefinition, NodeDefinition } from 'cytoscape';

export const generateSimpleTree = (size: number) => {
  const nodes: NodeDefinition[] = [];

  for (let i = 0; i < size; i++) {
    nodes.push({ group: 'nodes', data: { id: `node-${i}` } });
  }

  const edges: EdgeDefinition[] = [];
  const sequence: number[] = [];
  // Generate prufer sequence
  for (let i = 0; i < size - 2; i++) {
    sequence.push(Math.floor(Math.random() * nodes.length));
  }

  prufer(sequence).forEach(([left, right], i) => {
    edges.push({
      group: 'edges',
      data: {
        id: `edge-${i}`,
        source: nodes[left].data.id as string,
        target: nodes[right].data.id as string,
      },
    });
  });

  return [...nodes, ...edges];
};

// prufer algorithm https://en.wikipedia.org/wiki/Pr%C3%BCfer_sequence
const prufer = (sequence: number[]) => {
  const tree: [number, number][] = [];

  const graph = new Array(sequence.length + 2).fill(0).map((_, i) => i);
  const degree = new Array(graph.length).fill(1);
  sequence.forEach((index) => degree[index]++);

  for (let i = 0; i < sequence.length; i++) {
    for (let j = 0; j < graph.length; j++) {
      if (degree[graph[j]] === 1) {
        tree.push([sequence[i], graph[j]]);
        degree[sequence[i]]--;
        degree[graph[j]]--;
        break;
      }
    }
  }

  const last = graph.filter((index) => degree[index] === 1);
  tree.push(last as [number, number]);

  return tree;
};
