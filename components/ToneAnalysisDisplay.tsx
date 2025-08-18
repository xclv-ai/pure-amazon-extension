import React, { useState } from 'react';
import { BrandAnalysisCards } from './BrandAnalysisCards';

export function ToneAnalysisDisplay() {
  const [analysisMode, setAnalysisMode] = useState<'FULL_PAGE' | 'SELECTION'>('FULL_PAGE');

  const handleModeChange = (mode: 'FULL_PAGE' | 'SELECTION') => {
    setAnalysisMode(mode);
    // Here you could trigger different analysis logic based on the mode
    console.log('Analysis mode changed to:', mode);
  };

  return (
    <div className="w-full max-w-[400px]">
      {/* Brand Analysis Cards */}
      <BrandAnalysisCards />
    </div>
  );
}