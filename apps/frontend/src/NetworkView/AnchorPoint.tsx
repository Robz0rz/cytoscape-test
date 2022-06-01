import React, { CSSProperties, PropsWithChildren } from 'react';

const STYLE_MAP: Record<AnchorPointPlacement, CSSProperties> = {
  top: {
    left: 0,
    top: 0,
    transform: 'translateY(-100%)',
  },
  bottom: {
    left: 0,
    bottom: 0,
    transform: 'translateY(100%)',
  },
  left: {
    left: 0,
    top: 0,
    transform: 'translateX(-100%)',
  },
  right: {
    right: 0,
    top: 0,
    transform: 'translateX(100%)',
  },
};

export type AnchorPointPlacement = 'top' | 'bottom' | 'left' | 'right';

interface AnchorPointProps {
  direction: React.CSSProperties['flexDirection'];
  placement: AnchorPointPlacement;
}

const AnchorPoint: React.FC<PropsWithChildren<AnchorPointProps>> = ({
  direction,
  placement,
  children,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        position: 'absolute',
        flexDirection: direction,
        ...STYLE_MAP[placement],
      }}
    >
      {children}
    </div>
  );
};

export default AnchorPoint;
