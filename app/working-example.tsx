'use client';

import { useMemo } from 'react';

// This WORKS - only 2 calls to the closure
const decideZoomByAccuracy = (range: number): number => {
  const isUnder = (accuracy: number): boolean => {
    return range <= accuracy;
  };
  
  if (isUnder(0)) {
    return 15;
  }
  if (isUnder(50)) {
    return 15;
  }
  // Only 2 calls - this builds successfully!
  return 11;
};

export default function WorkingExample() {
  const zoom = useMemo(() => decideZoomByAccuracy(75), []);

  return (
    <div>
      <h1>Working Example (2 closure calls)</h1>
      <p>This builds successfully with only 2 calls to the closure.</p>
      <p>Zoom level: {zoom}</p>
    </div>
  );
}