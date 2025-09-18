'use client';

import { useMemo } from 'react';

// Function that triggers the minification bug
// BUG: Occurs with 3+ calls to the closure, but NOT with 2 calls
const decideZoomByAccuracy = (range: number): number => {
  const isUnder = (accuracy: number): boolean => {
    return range <= accuracy;  // BUG: 'range' is not transformed during minification
  };
  
  if (isUnder(0)) {
    return 15;
  }
  if (isUnder(50)) {
    return 15;
  }
  if (isUnder(100)) {  // Adding this 3rd call triggers the bug!
    return 15;
  }
  return 11;
};

export default function Home() {
  const zoom = useMemo(() => decideZoomByAccuracy(75), []);

  return (
    <div>
      <h1>Next.js 15.4.1 Minification Bug</h1>
      <p>Expected zoom level: 15</p>
      <p>Actual zoom level: {zoom}</p>
      <p>The bug occurs when closure is called 3+ times.</p>
      <p>If you see "ReferenceError: range is not defined" during build, the bug is reproduced.</p>
    </div>
  );
}