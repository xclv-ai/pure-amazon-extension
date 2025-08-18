import React, { useState, useRef, useEffect } from 'react';
import { RealContentAnalyzer } from './RealContentAnalyzer';
import { CompromiseDemo } from './CompromiseDemo';

export function AnalysisWorkspacePopup() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 450, y: 50 });
  const [size, setSize] = useState({ width: 900, height: 700 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Initialize position to avoid main popup overlap
  useEffect(() => {
    const updateInitialPosition = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // Position to the right of main popup if there's space
      let x = 450;
      let y = 50;
      
      // If screen is wide enough, position side by side
      if (screenWidth > 1200) {
        x = 470; // Just to the right of main popup
      } else {
        // On smaller screens, position below
        x = 50;
        y = 120;
      }
      
      setPosition({ x, y });
    };

    updateInitialPosition();
    window.addEventListener('resize', updateInitialPosition);
    return () => window.removeEventListener('resize', updateInitialPosition);
  }, []);

  // Handle mouse down on header to start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!popupRef.current) return;
    
    const rect = popupRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
    e.preventDefault();
  };

  // Handle resize from corner
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.stopPropagation();
    e.preventDefault();
  };

  // Handle mouse move during dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMinimized) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Keep popup within screen bounds
        const maxX = window.innerWidth - (isMinimized ? 360 : size.width);
        const maxY = window.innerHeight - (isMinimized ? 100 : size.height);
        
        setPosition({
          x: Math.max(0, Math.min(maxX, newX)),
          y: Math.max(0, Math.min(maxY, newY)),
        });
      } else if (isResizing && !isMinimized) {
        const newWidth = Math.max(600, e.clientX - position.x + 10);
        const newHeight = Math.max(400, e.clientY - position.y + 10);
        
        // Don't exceed screen bounds
        const maxWidth = window.innerWidth - position.x - 20;
        const maxHeight = window.innerHeight - position.y - 20;
        
        setSize({
          width: Math.min(newWidth, maxWidth),
          height: Math.min(newHeight, maxHeight),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, position, size, isMinimized]);

  // Toggle minimize/maximize
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div
      ref={popupRef}
      className={`fixed z-40 bg-brand-bg-card border border-brand-border-light rounded-lg shadow-xl transition-all duration-300 ${
        isDragging ? 'cursor-grabbing' : ''
      } ${isResizing ? 'cursor-se-resize' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: isMinimized ? '360px' : `${size.width}px`,
        height: isMinimized ? 'auto' : `${size.height}px`,
        maxHeight: '90vh',
        maxWidth: '95vw',
        minWidth: '360px',
        minHeight: isMinimized ? 'auto' : '400px',
      }}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 bg-brand-bg-header-teal text-white rounded-t-lg select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <div className="text-lg">🔬</div>
          <div>
            <h3 className="font-jetbrains-medium text-sm">
              Analysis Workspace
            </h3>
            <p className="text-xs opacity-80">
              {isMinimized ? 'Minimized - Click to expand' : 'Real Content & Compromise.js Analysis'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Status indicator */}
          <div className="flex items-center gap-2 text-xs opacity-70">
            <div className="w-2 h-2 bg-brand-accent-yellow rounded-full animate-pulse"></div>
            Active
          </div>
          
          <button
            onClick={toggleMinimize}
            className="w-7 h-7 flex items-center justify-center rounded bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors font-jetbrains-medium text-sm"
            title={isMinimized ? 'Expand workspace' : 'Minimize workspace'}
          >
            {isMinimized ? '□' : '—'}
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="h-full overflow-hidden flex flex-col relative">
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="p-6 space-y-12">
              {/* Real Content Analyzer */}
              <div>
                <RealContentAnalyzer />
              </div>
              
              {/* Separator */}
              <div className="border-t border-brand-border-light"></div>
              
              {/* Compromise Demo */}
              <div>
                <CompromiseDemo />
              </div>
            </div>
          </div>
          
          {/* Resize handle */}
          <div
            className="absolute bottom-2 right-2 w-4 h-4 cursor-se-resize opacity-30 hover:opacity-70 transition-opacity group"
            onMouseDown={handleResizeMouseDown}
            title="Resize window"
          >
            <div className="absolute bottom-0 right-0">
              <div className="w-3 h-0.5 bg-brand-text-tertiary group-hover:bg-brand-text-secondary transition-colors"></div>
              <div className="w-0.5 h-3 bg-brand-text-tertiary group-hover:bg-brand-text-secondary transition-colors mt-0.5"></div>
            </div>
          </div>
          
          {/* Status bar */}
          <div className="px-4 py-2 bg-brand-bg-muted border-t border-brand-border-light text-xs text-brand-text-tertiary flex justify-between items-center">
            <span>Drag header to move • Drag corner to resize</span>
            <span>{size.width} × {size.height}</span>
          </div>
        </div>
      )}

      {/* Minimized state */}
      {isMinimized && (
        <div 
          className="p-4 text-center cursor-pointer hover:bg-brand-bg-muted transition-colors rounded-b-lg"
          onClick={toggleMinimize}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-brand-accent-yellow rounded-full animate-pulse"></div>
            <p className="text-sm font-jetbrains-medium text-brand-text-primary">
              Analysis Workspace
            </p>
          </div>
          <p className="text-xs text-brand-text-tertiary">
            🌐 Real Content Analysis & 🤖 Compromise.js Tools
          </p>
        </div>
      )}
    </div>
  );
}