import { EdgeSingular, NodeSingular } from 'cytoscape';
import React, { PropsWithChildren, ReactElement } from 'react';
import { CytoscapeContext } from './CytoscapeContext';
import { edgeOnScreen, nodeOnScreen } from './alignment';

interface ClassContainerProps {
  renderNodeLabel?: (node: NodeSingular) => ReactElement | null;
  renderEdgeLabel?: (edge: EdgeSingular) => ReactElement | null;
  onMount?: () => void;
}

class CytoscapeContainer extends React.Component<
  PropsWithChildren<ClassContainerProps>
> {
  static override contextType = CytoscapeContext;
  override context: React.ContextType<typeof CytoscapeContext> | undefined;

  override componentDidMount = () => {
    this.context?.cy.on('zoom pan position resize', () => {
      this.forceUpdate();
    });
  };

  renderNodeLabels = () => {
    const { renderNodeLabel } = this.props;
    if (!renderNodeLabel) return null;
    return this.context?.cy.nodes().filter(nodeOnScreen).map(renderNodeLabel);
  };

  renderEdgeLabels = () => {
    const { renderEdgeLabel } = this.props;
    if (!renderEdgeLabel) return null;
    return this.context?.cy.edges().filter(edgeOnScreen).map(renderEdgeLabel);
  };

  renderLabels = () => {
    const { renderNodeLabel, renderEdgeLabel } = this.props;
    const { cy } = this.context || {};
    if (!cy || (!renderNodeLabel && !renderEdgeLabel)) return null;
    const pan = cy.pan();
    const zoom = cy.zoom();

    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 500,
          transformOrigin: 'top left',
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          zIndex: 10,
        }}
      >
        {this.renderNodeLabels()}
        {this.renderEdgeLabels()}
      </div>
    );
  };

  mount = (container: HTMLDivElement | null) => {
    if (container) {
      this.context?.cy.mount(container);
      this.props.onMount?.();
    }
  };

  override render = () => {
    const { children } = this.props;

    return (
      <div
        style={{ height: '100%', width: '100%', backgroundColor: '#f5f5f5' }}
      >
        <div
          style={{ height: '100%', width: '100%', overflow: 'hidden' }}
          ref={this.mount}
        >
          {this.renderLabels()}
        </div>
        {children}
      </div>
    );
  };
}

export default CytoscapeContainer;
