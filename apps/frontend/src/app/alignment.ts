import { NodeSingular, EdgeSingular, Position } from 'cytoscape';

export type VerticalAlignment = 'top' | 'center' | 'bottom';

export type HorizontalAlignment = 'left' | 'center' | 'right';

export type EdgeAlignment = 'sourceEndpoint' | 'targetEndpoint' | 'midpoint';

const alignments = {
  top: -0.5,
  left: -0.5,
  center: 0,
  right: 0.5,
  bottom: 0.5,
};

export function calculateAngle(a: Position, b: Position) {
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}

export function calculateDistance(a: Position, b: Position) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function isSamePosition(a: Position, b: Position) {
  return a.x === b.x && a.y === b.y;
}

export function nodeOnScreen(node: NodeSingular) {
  const pos = node.position();
  const extent = node.cy().extent();
  const halfWidth = node.width() / 2;
  const halfHeight = node.height() / 2;
  return (
    pos.x + halfWidth >= extent.x1 &&
    pos.x - halfWidth <= extent.x2 &&
    pos.y + halfHeight >= extent.y1 &&
    pos.y - halfHeight <= extent.y2
  );
}

export function edgeOnScreen(edge: EdgeSingular) {
  const pos = edge.midpoint();
  const extent = edge.cy().extent();
  return (
    pos.x >= extent.x1 &&
    pos.x <= extent.x2 &&
    pos.y >= extent.y1 &&
    pos.y <= extent.y2
  );
}

export function getNodeLabelTransform(
  node: NodeSingular,
  hAlign: HorizontalAlignment,
  vAlign: VerticalAlignment
) {
  const position = node.position();
  const padding = getPadding(node);

  const translate = {
    x: position.x + alignments[hAlign] * (node.width() + padding),
    y: position.y + alignments[vAlign] * (node.height() + padding),
  };
  const box = {
    x: 100 * (alignments[hAlign] - 0.5),
    y: 100 * (alignments[hAlign] - 0.5),
  };
  return `translate(${box.x}%, ${box.y}%) translate(${translate.x}px, ${translate.y}px)`;
}

export function getEdgeLabelTransform(
  edge: EdgeSingular,
  position: 'sourceEndpoint' | 'targetEndpoint' | 'midpoint'
) {
  const pos = edge[position]();
  let a = { ...edge.source().position() };
  let b = { ...edge.target().position() };
  if (a.x > b.x) [a, b] = [b, a];
  const angle = calculateAngle(a, b);

  return `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px) rotate(${angle}deg)`;
}

export function positionToString(position: Position) {
  return `${position.x}-${position.y}`;
}

export function getPadding(node: NodeSingular) {
  return parseInt(node.style()['padding'].slice(0, -2), 10) * 2;
}
