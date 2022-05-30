import React, { PropsWithChildren } from 'react';

interface LayerProps {
  style?: React.CSSProperties;
  color?: React.CSSProperties['borderColor'];
}

const Layer: React.FC<PropsWithChildren<LayerProps>> = ({
  color = 'black',
  style,
  children,
}) => {
  return (
    <div style={{ ...style, border: `1px solid ${color}` }}>{children}</div>
  );
};

export default Layer;
