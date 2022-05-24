import React, { PropsWithChildren, useContext, useState } from 'react';
import cytoscape, { Core, CytoscapeOptions } from 'cytoscape';

export enum CytoscapeOverlay {
  A,
  B,
  C,
  D,
  E,
  F,
  G,
}

export interface CytoscapeContextValue {
  cy: Core;
  activeOverlays: CytoscapeOverlay[];
  setActiveOverlays: React.Dispatch<React.SetStateAction<CytoscapeOverlay[]>>;
}

export const CytoscapeContext =
  React.createContext<CytoscapeContextValue | null>(null);

export const useCytoscape = () => {
  return useContext(CytoscapeContext);
};

interface CytoscapeProviderProps {
  options?: CytoscapeOptions;
}

export const CytoscapeProvider: React.FC<
  PropsWithChildren<CytoscapeProviderProps>
> = ({ options, children }) => {
  // explicitly enable style by default because we mount later on and this causes issues otherwise
  const [cy] = useState(() => cytoscape({ styleEnabled: true, ...options }));
  const [activeOverlays, setActiveOverlays] = useState<CytoscapeOverlay[]>([]);

  return (
    <CytoscapeContext.Provider
      value={{ cy, activeOverlays, setActiveOverlays }}
    >
      {children}
    </CytoscapeContext.Provider>
  );
};
