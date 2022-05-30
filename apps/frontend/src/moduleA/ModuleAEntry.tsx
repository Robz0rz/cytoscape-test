import React, { ChangeEvent, useEffect, useState } from 'react';
import { useCytoscape } from '../NetworkView/CytoscapeContext';
import { generateSimpleTree } from '../app/dummy';
import {
  Box,
  Drawer,
  FormControlLabel,
  List,
  ListItem,
  Switch,
  TextField,
} from '@mui/material';
import NodeWrapper from '../NetworkView/NodeWrapper';
import CytoscapeContainer, {
  OverlayDefinition,
} from '../NetworkView/CytoscapeContainer';
import EdgeWrapper from '../NetworkView/EdgeWrapper';
import { ElementDefinition } from 'cytoscape';
import Layer from '../app/Layer';
import FactoryIcon from '../assets/factory.png';
import DatePoller from '../app/DatePoller';

const MODULE_OVERLAYS: OverlayDefinition[] = [
  {
    name: 'Icon',
    active: false,
    renderNode: (id, data, node) => (
      <img
        style={{
          width: node.width(),
          height: node.height(),
        }}
        src={FactoryIcon}
        alt="Factory Icon"
      />
    ),
  },
  {
    name: 'NodeId',
    active: false,
    placement: 'top',
    renderNode: (id, data, node) => <Layer>{id}</Layer>,
  },
  {
    name: 'Date',
    active: false,
    placement: 'bottom',
    renderNode: () => <DatePoller />,
  },
];

const ModuleAEntry: React.FC = () => {
  const context = useCytoscape();
  const [nodeCount, setNodeCount] = useState(10);
  const [overlays, setOverlays] = useState(MODULE_OVERLAYS);
  const [elements, setElements] = useState<ElementDefinition[]>(() =>
    generateSimpleTree(nodeCount)
  );

  useEffect(() => {
    setElements(generateSimpleTree(nodeCount));
  }, [nodeCount]);

  if (!context) {
    throw new Error('No cytoscape context provided');
  }

  const handleNodeCountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setNodeCount(isNaN(value) || value < 2 ? 2 : value);
  };

  const toggleOverlay = (overlay: OverlayDefinition) => {
    setOverlays((prev) => {
      const copy = [...prev];
      copy.splice(prev.indexOf(overlay), 1, {
        ...overlay,
        active: !overlay.active,
      });
      return copy;
    });
  };

  return (
    <>
      <Drawer
        anchor="left"
        variant="permanent"
        sx={{
          width: 250,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box',
          },
        }}
      >
        <List>
          <ListItem>
            <TextField
              label="Number of nodes"
              type="number"
              value={nodeCount}
              onChange={handleNodeCountChange}
              inputProps={{ min: 2 }}
            />
          </ListItem>
          {overlays.map((overlay) => {
            return (
              <ListItem key={overlay.name}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={overlay.active}
                      onChange={() => toggleOverlay(overlay)}
                    />
                  }
                  label={overlay.name}
                  labelPlacement="start"
                />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <Box height="100vh">
        <CytoscapeContainer
          elements={elements}
          overlays={overlays}
          renderNodeLabel={(node, overlays) => {
            console.log(overlays);
            return (
              <NodeWrapper node={node} key={node.data('id')}>
                {overlays.map((x) => x.element)}
              </NodeWrapper>
            );
          }}
          renderEdgeLabel={(edge) => (
            <EdgeWrapper
              edge={edge}
              key={edge.data('id')}
              position="midpoint"
            />
          )}
        />
      </Box>
    </>
  );
};

export default ModuleAEntry;
