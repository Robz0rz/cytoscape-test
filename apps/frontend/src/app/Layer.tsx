import React from 'react';
import { CytoscapeOverlay, useCytoscape } from './CytoscapeContext';

interface LayerProps {
  type: CytoscapeOverlay;
  style?: React.CSSProperties;
  color?: React.CSSProperties['borderColor'];
}

const Layer: React.FC<LayerProps> = ({ type, color = 'black', style }) => {
  const context = useCytoscape();

  if (!context) {
    throw new Error('No cytoscape context provided');
  }

  if (!context.activeOverlays.includes(type)) {
    return null;
  }

  return (
    <div style={{ ...style, border: `1px solid ${color}` }}>
      {CytoscapeOverlay[type]}
    </div>
  );
};

export default Layer;
