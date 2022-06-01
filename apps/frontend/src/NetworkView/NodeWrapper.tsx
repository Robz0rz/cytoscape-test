import React, {
  CSSProperties,
  PropsWithChildren,
  useEffect,
  useRef,
} from 'react';
import { NodeSingular } from 'cytoscape';
import { getNodeLabelTransform } from '../app/alignment';

interface NodeWrapperProps {
  node: NodeSingular;
}

const NodeWrapper: React.FC<PropsWithChildren<NodeWrapperProps>> = ({
  node,
  children,
}) => {
  const container = useRef<HTMLDivElement>(null);
  const styles: CSSProperties = {
    position: 'absolute',
    transform: getNodeLabelTransform(node, 'center', 'center'),
  };

  useEffect(() => {
    node.on('position', () => {
      if (container.current) {
        container.current.style.transform = getNodeLabelTransform(
          node,
          'center',
          'center'
        );
      }
    });
    return () => {
      node.off('position');
    };
  }, [node]);

  console.log('Render', node.id());

  return (
    <div style={styles} ref={container}>
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
};

export default NodeWrapper;
