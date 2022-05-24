import React, { CSSProperties } from 'react';
import { NodeSingular } from 'cytoscape';
import { getNodeLabelTransform } from './alignment';
import { CytoscapeOverlay } from './CytoscapeContext';
import Layer from './Layer';

interface CytoscapeNodeProps {
  node: NodeSingular;
}

const CytoscapeNode: React.FC<CytoscapeNodeProps> = ({ node }) => {
  const styles: CSSProperties = {
    position: 'absolute',
    transform: getNodeLabelTransform(node, 'center', 'center'),
  };

  return (
    <div style={styles}>
      <div
        style={{
          position: 'relative',
          height: 75,
          width: 75,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            transform: 'translateY(-100%)',
            display: 'flex',
            gap: 1,
          }}
        >
          <Layer type={CytoscapeOverlay.A} color="red" />
          <Layer type={CytoscapeOverlay.B} color="green" />
          <Layer type={CytoscapeOverlay.C} color="blue" />
        </div>
        {node.data('id')}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            transform: 'translateY(100%)',
            display: 'flex',
            gap: 1,
          }}
        >
          <Layer type={CytoscapeOverlay.D} color="cyan" />
          <Layer type={CytoscapeOverlay.E} color="magenta" />
          <Layer type={CytoscapeOverlay.F} color="yellow" />
        </div>
      </div>
    </div>
  );
};

export default CytoscapeNode;
