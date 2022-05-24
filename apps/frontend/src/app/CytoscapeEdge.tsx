import React, { CSSProperties } from 'react';
import { EdgeAlignment, getEdgeLabelTransform } from './alignment';
import { EdgeSingular } from 'cytoscape';
import Layer from './Layer';
import { CytoscapeOverlay } from './CytoscapeContext';

interface CytoscapeEdgeProps {
  edge: EdgeSingular;
  position?: EdgeAlignment;
}

const CytoscapeEdge: React.FC<CytoscapeEdgeProps> = ({
  edge,
  position = 'midpoint',
}) => {
  const styles: CSSProperties = {
    position: 'absolute',
    transform: getEdgeLabelTransform(edge, position),
  };

  return <Layer type={CytoscapeOverlay.G} style={styles} />;
};

export default CytoscapeEdge;
