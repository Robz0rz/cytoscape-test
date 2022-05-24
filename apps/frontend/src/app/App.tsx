import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { CytoscapeOverlay, useCytoscape } from './CytoscapeContext';
import { generateSimpleTree } from './dummy';
import {
  Box,
  Drawer,
  FormControlLabel,
  List,
  ListItem,
  Switch,
  TextField,
} from '@mui/material';
import CytoscapeNode from './CytoscapeNode';
import CytoscapeContainer from './CytoscapeContainer';
import CytoscapeEdge from './CytoscapeEdge';

const App: React.FC = () => {
  const context = useCytoscape();
  const [nodeCount, setNodeCount] = useState(10);

  const runLayout = useCallback(() => {
    context?.cy.layout({ name: 'custom', fit: true }).run();
  }, [context?.cy]);

  useEffect(() => {
    if (context) {
      context.cy.elements().remove();
      context.cy.add(generateSimpleTree(nodeCount));
      runLayout();
    }
  }, [nodeCount]);

  if (!context) {
    throw new Error('No cytoscape context provided');
  }

  const { activeOverlays, setActiveOverlays } = context;
  const handleNodeCountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setNodeCount(isNaN(value) || value < 2 ? 2 : value);
  };

  const toggleOverlay = (overlay: CytoscapeOverlay) => {
    setActiveOverlays((prev) => {
      if (activeOverlays.includes(overlay)) {
        return prev.filter((x) => x !== overlay);
      }

      return [...prev, overlay];
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
          {Object.entries(CytoscapeOverlay).map(([key, value]) => {
            // Enums are bi-directional apparently
            if (typeof value === 'string') {
              return null;
            }

            return (
              <ListItem key={key}>
                <FormControlLabel
                  control={
                    <Switch
                      value={activeOverlays.includes(value)}
                      onChange={() => toggleOverlay(value)}
                    />
                  }
                  label={`Overlay ${key}`}
                  labelPlacement="start"
                />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <Box height="100vh">
        <CytoscapeContainer
          onMount={runLayout}
          renderNodeLabel={(node) => (
            <CytoscapeNode node={node} key={node.data('id')} />
          )}
          renderEdgeLabel={(edge) => (
            <CytoscapeEdge
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

export default App;
