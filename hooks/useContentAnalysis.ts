import { useCallback, useEffect } from 'react';
import { useTextAnalysis } from '../contexts/TextAnalysisContext';

export interface ContentAnalysisHook {
  // State
  mode: 'fullPage' | 'selectedElements';
  isAnalyzing: boolean;
  hasSelection: boolean;
  hasClickSelection: boolean;
  hasAnalysisResult: boolean;
  analysisResult: any;
  error: string | null;
  
  // Actions
  switchToFullPage: () => void;
  switchToSelectedElements: () => void;
  analyzeContent: () => Promise<void>;
  clearAnalysis: () => void;
  refreshContent: () => void;
  setClickSelection: (content: string, element?: Element, context?: string) => void;
  clearClickSelection: () => void;
  requestCompromiseAnalysis: () => void;
  
  // Content info
  selectionInfo: {
    hasContent: boolean;
    wordCount: number;
    source: string;
    context?: string;
  };
  
  clickSelectionInfo: {
    hasContent: boolean;
    wordCount: number;
    source: string;
    context?: string;
  };
  
  fullPageInfo: {
    hasContent: boolean;
    wordCount: number;
    source: string;
  };
}

export function useContentAnalysis(): ContentAnalysisHook {
  const { 
    state, 
    setMode, 
    analyzeCurrentContent, 
    clearAnalysis, 
    refreshFullPageContent,
    setClickSelection,
    clearClickSelection,
    requestCompromiseAnalysis
  } = useTextAnalysis();

  // No auto-analysis - manual control only
  useEffect(() => {
    // Removed auto-analysis functionality
    // Analysis now only happens when user explicitly clicks "Analyze Selection" button
  }, [state.currentClickSelection, state.mode, state.isAnalyzing]);

  const switchToFullPage = useCallback(() => {
    setMode('fullPage');
  }, [setMode]);

  const switchToSelectedElements = useCallback(() => {
    setMode('selectedElements');
  }, [setMode]);

  const analyzeContent = useCallback(async () => {
    await analyzeCurrentContent();
  }, [analyzeCurrentContent]);

  const refreshContent = useCallback(() => {
    if (state.mode === 'fullPage') {
      refreshFullPageContent();
    }
    // For selected elements, content is automatically refreshed via selection listeners
  }, [state.mode, refreshFullPageContent]);

  // Selection info (text selection)
  const selectionInfo = {
    hasContent: Boolean(state.currentSelection?.content),
    wordCount: state.currentSelection?.content?.split(/\s+/).length || 0,
    source: state.currentSelection?.source || 'none',
    context: state.currentSelection?.context,
  };

  // Click selection info (interactive content blocks)
  const clickSelectionInfo = {
    hasContent: Boolean(state.currentClickSelection?.content),
    wordCount: state.currentClickSelection?.content?.split(/\s+/).length || 0,
    source: state.currentClickSelection?.source || 'none',
    context: state.currentClickSelection?.context,
  };

  // Full page info
  const fullPageInfo = {
    hasContent: Boolean(state.fullPageContent?.content),
    wordCount: state.fullPageContent?.content?.split(/\s+/).length || 0,
    source: state.fullPageContent?.source || 'none',
  };



  return {
    // State
    mode: state.mode,
    isAnalyzing: state.isAnalyzing,
    hasSelection: Boolean(state.currentSelection),
    hasClickSelection: Boolean(state.currentClickSelection?.content?.trim()),
    hasAnalysisResult: Boolean(state.analysisResult),
    analysisResult: state.analysisResult,
    error: state.error,
    
    // Actions
    switchToFullPage,
    switchToSelectedElements,
    analyzeContent,
    clearAnalysis,
    refreshContent,
    setClickSelection,
    clearClickSelection,
    requestCompromiseAnalysis,
    
    // Content info
    selectionInfo,
    clickSelectionInfo,
    fullPageInfo,
  };
}