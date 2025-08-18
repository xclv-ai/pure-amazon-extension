import React, { forwardRef } from 'react';
import { Move } from 'lucide-react';
import { AnimatedLogo } from "./AnimatedLogo";

interface PopupHeaderProps {
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseEnter?: () => void;
}

export const PopupHeader = forwardRef<
  { triggerAnimation: () => void },
  PopupHeaderProps
>(({ onMouseDown, onMouseEnter }, logoRef) => {
  return (
    <div 
      className="bg-brand-bg-header-teal border-b border-brand-border-light px-4 py-3 flex-shrink-0 cursor-grab active:cursor-grabbing rounded-t-lg relative z-10"
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
    >
      <div className="flex items-center justify-between">
        <div>
          <AnimatedLogo ref={logoRef} />
        </div>
        
        <div className="flex items-center">
          <Move className="w-4 h-4 text-brand-accent-yellow hover:text-white transition-colors cursor-pointer" />
        </div>
      </div>
    </div>
  );
});

PopupHeader.displayName = 'PopupHeader';