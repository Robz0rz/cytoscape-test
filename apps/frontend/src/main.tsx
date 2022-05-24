import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import cytoscape from 'cytoscape';

import App from './app/App';
import { CssBaseline } from '@mui/material';
import { CytoscapeProvider } from './app/CytoscapeContext';
import customLayout from './app/CustomLayout';

cytoscape.use(customLayout);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <CssBaseline />
    <CytoscapeProvider
      options={{
        wheelSensitivity: 0.5,
        style: [
          {
            selector: 'node',
            style: {
              width: 75,
              height: 75,
            },
          },
          {
            selector: 'edge',
            style: {
              'target-arrow-shape': 'triangle',
              'curve-style': 'straight',
            },
          },
        ],
      }}
    >
      <App />
    </CytoscapeProvider>
  </StrictMode>
);
