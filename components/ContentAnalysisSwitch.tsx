import React, { useState, useRef, useEffect } from 'react';
import { useContentAnalysis } from '../hooks/useContentAnalysis';

type AnalysisMode = 'FULL_PAGE' | 'SELECTION';

interface ContentAnalysisSwitchProps {
  onModeChange?: (mode: AnalysisMode) => void;
  onAnalyzeStart?: (mode: AnalysisMode) => void;
}

export function ContentAnalysisSwitch({ onModeChange, onAnalyzeStart }: ContentAnalysisSwitchProps) {
  const [activeMode, setActiveMode] = useState<AnalysisMode>('SELECTION');
  const [indicatorPosition, setIndicatorPosition] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const fullPageRef = useRef<HTMLButtonElement>(null);
  const selectionRef = useRef<HTMLButtonElement>(null);
  
  // Get content analysis state
  const { 
    mode,
    hasClickSelection, 
    hasSelection, 
    isAnalyzing, 
    analyzeContent,
    clickSelectionInfo,
    requestCompromiseAnalysis,
    switchToFullPage,
    switchToSelectedElements
  } = useContentAnalysis();

  // Initialize component
  useEffect(() => {
    setHasInitialized(true);
  }, []);

  // Sync local state with context mode
  useEffect(() => {
    if (mode === 'fullPage' && activeMode !== 'FULL_PAGE') {
      setActiveMode('FULL_PAGE');
    } else if (mode === 'selectedElements' && activeMode !== 'SELECTION') {
      setActiveMode('SELECTION');
    }
  }, [mode, activeMode]);

  // Calculate center positions of the labels
  useEffect(() => {
    if (fullPageRef.current && selectionRef.current && trackRef.current) {
      const fullPageRect = fullPageRef.current.getBoundingClientRect();
      const selectionRect = selectionRef.current.getBoundingClientRect();
      const trackRect = trackRef.current.getBoundingClientRect();
      
      const fullPageCenter = fullPageRect.left + fullPageRect.width / 2 - trackRect.left;
      const selectionCenter = selectionRect.left + selectionRect.width / 2 - trackRect.left;
      
      const targetPosition = activeMode === 'FULL_PAGE' ? fullPageCenter : selectionCenter;
      setIndicatorPosition(targetPosition);
    }
  }, [activeMode]);

  const handleLabelClick = (mode: AnalysisMode) => {
    setActiveMode(mode);
    
    // Update the context mode
    if (mode === 'FULL_PAGE') {
      switchToFullPage();
    } else {
      switchToSelectedElements();
    }
    
    onModeChange?.(mode);
  };

  const handleAnalyzeClick = async () => {
    if (activeMode === 'SELECTION' && hasClickSelection) {
      // Trigger compromise.js analysis for selected content
      requestCompromiseAnalysis();
    } else if (activeMode === 'FULL_PAGE') {
      // For full page mode - simulate for demo
      onAnalyzeStart?.(activeMode);
    }
  };

  const getButtonText = () => {
    if (activeMode === 'FULL_PAGE') {
      return 'FULL PAGE (DEMO)';
    }
    return 'ANALYZE SELECTION';
  };

  const getButtonClasses = () => {
    const baseClasses = "w-full py-3 px-4 text-sm font-jetbrains-normal transition-colors duration-200";
    
    // Ensure component is initialized before checking state
    if (!hasInitialized) {
      return `${baseClasses} bg-brand-bg-muted text-brand-text-tertiary cursor-not-allowed`;
    }
    
    // Button is active (yellow) when:
    // - Full page mode is selected, OR
    // - Selection mode is selected AND content is actually selected (has both flags true)
    const hasValidSelection = hasClickSelection && clickSelectionInfo?.hasContent;
    const isButtonActive = activeMode === 'FULL_PAGE' || (activeMode === 'SELECTION' && hasValidSelection);
    
    if (isButtonActive && !isAnalyzing) {
      return `${baseClasses} bg-brand-accent-yellow text-brand-text-primary hover:bg-brand-accent-rose cursor-pointer`;
    } else {
      // Inactive state - light badge color from variables
      return `${baseClasses} bg-brand-bg-muted text-brand-text-tertiary cursor-not-allowed`;
    }
  };

  const getStatusText = () => {
    if (!hasInitialized) {
      return 'Initializing...';
    }
    
    if (activeMode === 'SELECTION') {
      if (hasClickSelection && clickSelectionInfo?.hasContent) {
        return `Content selected (${clickSelectionInfo.wordCount} words)`;
      } else {
        return 'Selection mode active - click content to select';
      }
    } else {
      return 'Full page mode (demo)';
    }
  };

  const getStatusClasses = () => {
    if (activeMode === 'SELECTION' && hasClickSelection && clickSelectionInfo?.hasContent) {
      return 'text-brand-text-secondary';
    } else if (activeMode === 'SELECTION') {
      return 'text-brand-text-tertiary';
    } else {
      return 'text-brand-text-tertiary';
    }
  };

  const isButtonClickable = () => {
    if (!hasInitialized || isAnalyzing) return false;
    if (activeMode === 'FULL_PAGE') return true;
    if (activeMode === 'SELECTION' && hasClickSelection && clickSelectionInfo?.hasContent) return true;
    return false;
  };

  return (
    <div className="w-full bg-brand-bg-card px-4 py-4">
      {/* Mode labels above track */}
      <div className="flex items-center justify-between mb-3">
        <button
          ref={fullPageRef}
          onClick={() => handleLabelClick('FULL_PAGE')}
          className={`text-sm font-jetbrains-normal transition-colors ${
            activeMode === 'FULL_PAGE' ? 'text-brand-text-primary' : 'text-brand-text-tertiary'
          }`}
        >
          FULL PAGE
        </button>
        
        <button
          ref={selectionRef}
          onClick={() => handleLabelClick('SELECTION')}
          className={`text-sm font-jetbrains-normal transition-colors ${
            activeMode === 'SELECTION' ? 'text-brand-text-primary' : 'text-brand-text-tertiary'
          }`}
        >
          SELECTION
        </button>
      </div>

      {/* Custom horizontal track with vertical indicator */}
      <div ref={trackRef} className="relative mb-4 h-3">
        <div className="absolute top-2 left-0 right-0 h-px bg-brand-border-primary" />
        
        <div 
          className="absolute top-0 w-px h-2 bg-brand-border-primary transition-all duration-200 ease-out"
          style={{
            left: `${indicatorPosition}px`,
            transform: 'translateX(-50%)'
          }}
        />
      </div>

      {/* Status info */}
      <div className="mb-3 text-xs">
        <span className={`${getStatusClasses()} flex items-center gap-2`}>
          {activeMode === 'SELECTION' && hasClickSelection && clickSelectionInfo?.hasContent ? (
            <span className="w-2 h-2 bg-brand-accent-yellow rounded-full animate-pulse"></span>
          ) : activeMode === 'SELECTION' ? (
            <span className="w-2 h-2 bg-brand-accent-yellow rounded-full"></span>
          ) : null}
          {getStatusText()}
        </span>
      </div>

      {/* Analyze button */}
      <button
        onClick={handleAnalyzeClick}
        disabled={!isButtonClickable()}
        className={getButtonClasses()}
      >
        {isAnalyzing ? (
          <>
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-brand-text-tertiary mr-2"></div>
            Analyzing...
          </>
        ) : (
          getButtonText()
        )}
      </button>
    </div>
  );
}