import React, {
  CSSProperties,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import { NodeSingular, Position } from 'cytoscape';
import { getNodeLabelTransform } from '../app/alignment';
import { NodeOverlayPlacement } from './CytoscapeContainer';

interface NodeWrapperProps {
  node: NodeSingular;
}

// export default class NodeWrapper extends React.Component<
//   PropsWithChildren<NodeWrapperProps>,
//   { position: Position }
// > {
//   constructor(props: NodeWrapperProps) {
//     super(props);
//     this.state = {
//       position: { ...this.props.node.position() },
//     };
//   }
//
//   override shouldComponentUpdate(
//     prevProps: Readonly<PropsWithChildren<NodeWrapperProps>>
//   ): boolean {
//     const currentPosition = this.state.position;
//     const newPosition = { ...this.props.node.position() };
//
//     if (
//       newPosition.x !== currentPosition.x ||
//       newPosition.y !== currentPosition.y
//     ) {
//       this.setState({ position: newPosition });
//       return true;
//     }
//
//     // Could / should be improved?
//     return (
//       React.Children.count(prevProps.children) !==
//       React.Children.count(this.props.children)
//     );
//   }
//
//   override render() {
//     const { node, children } = this.props;
//     const styles: CSSProperties = {
//       position: 'absolute',
//       transform: getNodeLabelTransform(node, 'center', 'center'),
//     };
//
//     return <div style={styles}>{children}</div>;
//   }
// }

export const useForceUpdate = () => {
  const [, setValue] = useState(0);
  return () => setValue((value) => value + 1);
};

const NodeWrapper: React.FC<PropsWithChildren<NodeWrapperProps>> = ({
  node,
  children,
}) => {
  const forceUpdate = useForceUpdate();
  const styles: CSSProperties = {
    position: 'absolute',
    transform: getNodeLabelTransform(node, 'center', 'center'),
  };

  useEffect(() => {
    node.on('position', forceUpdate);
    return () => {
      node.off('position');
    };
  }, [forceUpdate, node]);

  console.log('Render', node.id());

  return (
    <div style={styles}>
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
};

export default NodeWrapper;
