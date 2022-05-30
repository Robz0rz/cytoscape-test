import React, { CSSProperties, PropsWithChildren } from 'react';
import { EdgeAlignment, getEdgeLabelTransform } from '../app/alignment';
import { EdgeSingular } from 'cytoscape';

interface EdgeWrapperProps {
  edge: EdgeSingular;
  position?: EdgeAlignment;
}

const EdgeWrapper: React.FC<PropsWithChildren<EdgeWrapperProps>> = ({
  edge,
  position = 'midpoint',
  children,
}) => {
  const styles: CSSProperties = {
    position: 'absolute',
    transform: getEdgeLabelTransform(edge, position),
  };

  return <div style={styles}>{children}</div>;
};

export default EdgeWrapper;
