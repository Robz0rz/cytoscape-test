import { EdgeSingular, ElementDefinition, NodeSingular } from 'cytoscape';
import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { CytoscapeContext, useCytoscape } from './CytoscapeContext';
import NodeWrapper from './NodeWrapper';
import AnchorPoint, { AnchorPointPlacement } from './AnchorPoint';

export interface OverlayDefinition {
  name: string;
  active: boolean;
  placement?: AnchorPointPlacement;
  renderNode?: (
    nodeId: string,
    data: Record<string, unknown>,
    node: NodeSingular
  ) => React.ReactNode;
  renderEdge?: (
    edgeId: string,
    data: Record<string, unknown>,
    edge: EdgeSingular
  ) => React.ReactNode;
}

export interface OverlayOutput {
  name: string;
  element: React.ReactNode;
}

interface CytoscapeContainerProps {
  renderNodeLabel?: (
    node: NodeSingular,
    overlays: OverlayOutput[]
  ) => React.ReactNode;
  renderEdgeLabel?: (edge: EdgeSingular) => React.ReactNode;
  elements: ElementDefinition[];
  overlays: OverlayDefinition[];
}

// TODO: should be able to convert to function component
class CytoscapeContainer extends React.Component<
  PropsWithChildren<CytoscapeContainerProps>
> {
  static override contextType = CytoscapeContext;
  override context: React.ContextType<typeof CytoscapeContext> | undefined;

  labelContainer = React.createRef<HTMLDivElement>();

  get safeContext() {
    if (!this.context) {
      throw new Error('Cytoscape context is required');
    }

    return this.context;
  }

  get cytoscape() {
    return this.safeContext.cy;
  }

  get activeOverlays() {
    return this.props.overlays.filter((overlay) => overlay.active);
  }

  get labelContainerTransform() {
    const pan = this.cytoscape.pan();
    const zoom = this.cytoscape.zoom();
    return `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;
  }

  get activeOverlaysPerPlacement() {
    return this.activeOverlays.reduce<
      Record<AnchorPointPlacement | 'center', OverlayDefinition[]>
    >(
      (acc, next) => {
        acc[next.placement ?? 'center'].push(next);
        return acc;
      },
      { center: [], top: [], left: [], bottom: [], right: [] }
    );
  }

  override componentDidMount = () => {
    this.cytoscape.on('pan zoom', () => {
      if (this.labelContainer.current) {
        this.labelContainer.current.style.transform =
          this.labelContainerTransform;
      }
    });

    this.cytoscape.on('add remove', () => {
      this.forceUpdate();
    });
  };

  override componentDidUpdate(
    prevProps: Readonly<React.PropsWithChildren<CytoscapeContainerProps>>
  ) {
    if (this.props.elements !== prevProps.elements) {
      this.addElements();
    }
  }

  renderNodeLabels = () => {
    const { renderNodeLabel } = this.props;
    if (!renderNodeLabel) return null;

    return this.cytoscape
      .nodes()
      .toArray()
      .map((node) => {
        return (
          <NodeWrapper node={node} key={node.id()}>
            <div
              style={{
                width: node.width(),
                height: node.height(),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {this.activeOverlaysPerPlacement['center'].map((overlay) => (
                <React.Fragment key={overlay.name}>
                  {overlay.renderNode?.(node.id(), node.data(), node)}
                </React.Fragment>
              ))}
            </div>
            <AnchorPoint direction="row" placement="top">
              {this.activeOverlaysPerPlacement['top'].map((overlay) => (
                <React.Fragment key={overlay.name}>
                  {overlay.renderNode?.(node.id(), node.data(), node)}
                </React.Fragment>
              ))}
            </AnchorPoint>
            <AnchorPoint direction="row" placement="bottom">
              {this.activeOverlaysPerPlacement['bottom'].map((overlay) => (
                <React.Fragment key={overlay.name}>
                  {overlay.renderNode?.(node.id(), node.data(), node)}
                </React.Fragment>
              ))}
            </AnchorPoint>
            <AnchorPoint direction="column" placement="left">
              {this.activeOverlaysPerPlacement['left'].map((overlay) => (
                <React.Fragment key={overlay.name}>
                  {overlay.renderNode?.(node.id(), node.data(), node)}
                </React.Fragment>
              ))}
            </AnchorPoint>
            <AnchorPoint direction="column" placement="right">
              {this.activeOverlaysPerPlacement['right'].map((overlay) => (
                <React.Fragment key={overlay.name}>
                  {overlay.renderNode?.(node.id(), node.data(), node)}
                </React.Fragment>
              ))}
            </AnchorPoint>
          </NodeWrapper>
        );

        // const overlays = this.activeOverlays.map<OverlayOutput>((overlay) => {
        //   return {
        //     name: overlay.name,
        //     element: (
        //       <React.Fragment key={overlay.name}>
        //         {overlay.renderNode?.(node.id(), node.data(), node)}
        //       </React.Fragment>
        //     ),
        //   };
        // });

        // return renderNodeLabel(node, overlays);
      });
  };

  renderEdgeLabels = () => {
    const { renderEdgeLabel } = this.props;
    if (!renderEdgeLabel) return null;
    return this.cytoscape.edges().map(renderEdgeLabel);
  };

  renderLabels = () => {
    const { renderNodeLabel, renderEdgeLabel } = this.props;
    if (!renderNodeLabel && !renderEdgeLabel) return null;

    return (
      <div
        ref={this.labelContainer}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 500,
          transformOrigin: 'top left',
          transform: this.labelContainerTransform,
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
      this.cytoscape.mount(container);
      this.layout();
    }
  };

  layout = () => {
    this.cytoscape.layout({ name: 'breadthfirst', fit: true }).run();
  };

  addElements = () => {
    this.cytoscape.elements().remove();
    this.cytoscape.add(this.props.elements);
    this.layout();
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

// FIXME
export const FunctionContainer: React.FC<
  PropsWithChildren<CytoscapeContainerProps>
> = ({ elements, overlays, children, renderNodeLabel, renderEdgeLabel }) => {
  const { cy } = useCytoscape();
  const labelContainer = useRef<HTMLDivElement>(null);

  const layout = () => {
    cy.layout({ name: 'breadthfirst', fit: true }).run();
  };

  const calculateTransform = () => {
    const pan = cy.pan();
    const zoom = cy.zoom();
    return `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;
  };

  useEffect(() => {
    cy.on('pan zoom', () => {
      if (labelContainer.current) {
        labelContainer.current.style.transform = calculateTransform();
      }
    });

    return () => {
      cy.off('pan zoom');
    };
  }, []);

  useEffect(() => {
    cy.elements().remove();
    cy.add(elements);
    layout();
  }, [elements]);

  const mount = (container: HTMLDivElement | null) => {
    if (container) {
      cy.mount(container);
      layout();
    }
  };

  const renderNodeLabels = () => {
    if (!renderNodeLabel) return null;

    const mappedOverlays = overlays
      .filter((overlay) => overlay.active)
      .reduce<Record<AnchorPointPlacement | 'center', OverlayDefinition[]>>(
        (acc, next) => {
          acc[next.placement ?? 'center'].push(next);
          return acc;
        },
        { center: [], top: [], left: [], bottom: [], right: [] }
      );

    return cy
      .nodes()
      .toArray()
      .map((node) => {
        return (
          <NodeWrapper node={node} key={node.id()}>
            <div
              style={{
                width: node.width(),
                height: node.height(),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {mappedOverlays['center'].map((overlay) => (
                <React.Fragment key={overlay.name}>
                  {overlay.renderNode?.(node.id(), node.data(), node)}
                </React.Fragment>
              ))}
            </div>
            <AnchorPoint direction="row" placement="top">
              {mappedOverlays['top'].map((overlay) => (
                <React.Fragment key={overlay.name}>
                  {overlay.renderNode?.(node.id(), node.data(), node)}
                </React.Fragment>
              ))}
            </AnchorPoint>
            <AnchorPoint direction="row" placement="bottom">
              {mappedOverlays['bottom'].map((overlay) => (
                <React.Fragment key={overlay.name}>
                  {overlay.renderNode?.(node.id(), node.data(), node)}
                </React.Fragment>
              ))}
            </AnchorPoint>
            <AnchorPoint direction="column" placement="left">
              {mappedOverlays['left'].map((overlay) => (
                <React.Fragment key={overlay.name}>
                  {overlay.renderNode?.(node.id(), node.data(), node)}
                </React.Fragment>
              ))}
            </AnchorPoint>
            <AnchorPoint direction="column" placement="right">
              {mappedOverlays['right'].map((overlay) => (
                <React.Fragment key={overlay.name}>
                  {overlay.renderNode?.(node.id(), node.data(), node)}
                </React.Fragment>
              ))}
            </AnchorPoint>
          </NodeWrapper>
        );
      });
  };

  const renderEdgeLabels = () => {
    if (!renderEdgeLabel) return null;
    return cy.edges().map(renderEdgeLabel);
  };

  const renderLabels = () => {
    return (
      <div
        ref={labelContainer}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 500,
          transformOrigin: 'top left',
          transform: calculateTransform(),
          zIndex: 10,
        }}
      >
        {renderNodeLabels()}
        {renderEdgeLabels()}
      </div>
    );
  };

  return (
    <div style={{ height: '100%', width: '100%', backgroundColor: '#f5f5f5' }}>
      <div
        style={{ height: '100%', width: '100%', overflow: 'hidden' }}
        ref={mount}
      >
        {renderLabels()}
      </div>
      {children}
    </div>
  );
};
