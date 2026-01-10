'use client';

import * as React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

type ChainTextProps = {
  className?: string;
};

const ChainTextComponent = ({ className }: ChainTextProps) => {
  const activeChain = useSelector((state: RootState) => state.ui.activeChain);

  const chainLabel = activeChain === 'bnb' ? 'BNB' : 'SOL';

  return (
    <span className={className} aria-label="Active chain">
      {chainLabel}
    </span>
  );
};

export const ChainText = React.memo(ChainTextComponent);
