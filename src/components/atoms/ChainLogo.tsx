'use client';

import * as React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { SolanaLogo } from './SolanaLogo';

type ChainLogoProps = {
  className?: string;
  width?: number;
  height?: number;
};

export function ChainLogo({ className, width = 14, height = 14 }: ChainLogoProps) {
  const activeChain = useSelector((state: RootState) => state.ui.activeChain);

  const wrapperStyle = React.useMemo<React.CSSProperties>(
    () => ({
      width,
      height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }),
    [width, height]
  );

  const isBnb = activeChain === 'bnb';

  const logo = isBnb ? (
    <img
      src="https://axiom.trade/images/bnb-fill.svg"
      alt="BNB Chain"
      width={width}
      height={height}
      loading="lazy"
      style={{ width, height, objectFit: 'contain' }}
    />
  ) : (
    <SolanaLogo width={width} height={height} />
  );

  return (
    <div className={className} style={wrapperStyle} aria-label="Active chain logo">
      {logo}
    </div>
  );
}
