import React from 'react';
import { ToneOfVoiceSliders } from './ToneOfVoiceSliders';

export function StatusBar() {
  return (
    <>
      <span>Status: Analysis complete</span>
      <div className="flex items-center gap-2">
        <ToneOfVoiceSliders />
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-brand-success blink-slow"></div>
          <span className="text-xs">Online</span>
        </div>
      </div>
    </>
  );
}