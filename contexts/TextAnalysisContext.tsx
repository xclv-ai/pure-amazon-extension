import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { TextAnalysisService, ToneAnalysisResult, TextSelection } from '../services/TextAnalysisService';
import { ContentSelectionService } from '../services/ContentSelectionService';

export type AnalysisMode = 'fullPage' | 'selectedElements';

interface TextAnalysisState {
  mode: AnalysisMode;
  isAnalyzing: boolean;
  currentSelection: TextSelection | null;
  currentClickSelection: TextSelection | null;
  fullPageContent: TextSelection | null;
  analysisResult: ToneAnalysisResult | null;
  error: string | null;
  lastAnalyzedContent: string | null;
  compriseAnalysisRequested: boolean;
}

type TextAnalysisAction = 
  | { type: 'SET_MODE'; payload: AnalysisMode }
  | { type: 'SET_ANALYZING'; payload: boolean }
  | { type: 'SET_SELECTION'; payload: TextSelection | null }
  | { type: 'SET_CLICK_SELECTION'; payload: TextSelection | null }
  | { type: 'SET_FULL_PAGE_CONTENT'; payload: TextSelection }
  | { type: 'SET_ANALYSIS_RESULT'; payload: ToneAnalysisResult }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LAST_ANALYZED_CONTENT'; payload: string }
  | { type: 'CLEAR_ANALYSIS' }
  | { type: 'REQUEST_COMPROMISE_ANALYSIS' }
  | { type: 'COMPLETE_COMPROMISE_ANALYSIS' };

interface TextAnalysisContextType {
  state: TextAnalysisState;
  setMode: (mode: AnalysisMode) => void;
  analyzeCurrentContent: () => Promise<void>;
  clearAnalysis: () => void;
  refreshFullPageContent: () => void;
  setClickSelection: (content: string, element?: Element, context?: string) => void;
  clearClickSelection: () => void;
  requestCompromiseAnalysis: () => void;
  completeCompromiseAnalysis: () => void;
}

const initialState: TextAnalysisState = {
  mode: 'selectedElements',
  isAnalyzing: false,
  currentSelection: null,
  currentClickSelection: null,
  fullPageContent: null,
  analysisResult: null,
  error: null,
  lastAnalyzedContent: null,
  compriseAnalysisRequested: false,
};

function textAnalysisReducer(state: TextAnalysisState, action: TextAnalysisAction): TextAnalysisState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'SET_ANALYZING':
      return { ...state, isAnalyzing: action.payload };
    case 'SET_SELECTION':
      return { ...state, currentSelection: action.payload };
    case 'SET_CLICK_SELECTION':
      return { ...state, currentClickSelection: action.payload };
    case 'SET_FULL_PAGE_CONTENT':
      return { ...state, fullPageContent: action.payload };
    case 'SET_ANALYSIS_RESULT':
      return { ...state, analysisResult: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isAnalyzing: false };
    case 'SET_LAST_ANALYZED_CONTENT':
      return { ...state, lastAnalyzedContent: action.payload };
    case 'CLEAR_ANALYSIS':
      return { ...state, analysisResult: null, error: null, lastAnalyzedContent: null };
    case 'REQUEST_COMPROMISE_ANALYSIS':
      return { ...state, compriseAnalysisRequested: true };
    case 'COMPLETE_COMPROMISE_ANALYSIS':
      return { ...state, compriseAnalysisRequested: false };
    default:
      return state;
  }
}

const TextAnalysisContext = createContext<TextAnalysisContextType | undefined>(undefined);

export function TextAnalysisProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(textAnalysisReducer, initialState);
  
  const textAnalysisService = TextAnalysisService.getInstance();
  const contentSelectionService = ContentSelectionService.getInstance();

  // Set up selection listeners
  useEffect(() => {
    const unsubscribeTextSelection = contentSelectionService.onSelectionChange((selection) => {
      dispatch({ type: 'SET_SELECTION', payload: selection });
    });

    const unsubscribeClickSelection = contentSelectionService.onClickSelectionChange((selection) => {
      dispatch({ type: 'SET_CLICK_SELECTION', payload: selection });
    });

    return () => {
      unsubscribeTextSelection();
      unsubscribeClickSelection();
    };
  }, [contentSelectionService]);

  // Load full page content on mount
  useEffect(() => {
    const fullPageContent = contentSelectionService.getFullPageContent();
    dispatch({ type: 'SET_FULL_PAGE_CONTENT', payload: fullPageContent });
  }, [contentSelectionService]);

  const setMode = useCallback((mode: AnalysisMode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
    
    // Clear selections when switching modes
    if (mode === 'fullPage') {
      contentSelectionService.clearClickSelection();
    }
  }, [contentSelectionService]);

  const analyzeContent = useCallback(async (content: string) => {
    if (!content || content.trim().length === 0) {
      dispatch({ type: 'SET_ERROR', payload: 'No content to analyze' });
      return;
    }

    dispatch({ type: 'SET_ANALYZING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = textAnalysisService.analyzeText(content);
      
      dispatch({ type: 'SET_ANALYSIS_RESULT', payload: result });
      dispatch({ type: 'SET_LAST_ANALYZED_CONTENT', payload: content });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_ANALYZING', payload: false });
    }
  }, [textAnalysisService]);

  const analyzeCurrentContent = useCallback(async () => {
    let contentToAnalyze: string | null = null;

    if (state.mode === 'fullPage' && state.fullPageContent) {
      contentToAnalyze = state.fullPageContent.content;
    } else if (state.mode === 'selectedElements') {
      // Prioritize click selection over text selection
      if (state.currentClickSelection) {
        contentToAnalyze = state.currentClickSelection.content;
      } else if (state.currentSelection) {
        contentToAnalyze = state.currentSelection.content;
      }
    }

    if (contentToAnalyze) {
      await analyzeContent(contentToAnalyze);
    } else {
      const modeText = state.mode === 'fullPage' ? 'full page' : 'selected text';
      dispatch({ type: 'SET_ERROR', payload: `No ${modeText} content available for analysis` });
    }
  }, [state.mode, state.fullPageContent, state.currentSelection, state.currentClickSelection, analyzeContent]);

  const clearAnalysis = useCallback(() => {
    dispatch({ type: 'CLEAR_ANALYSIS' });
  }, []);

  const refreshFullPageContent = useCallback(() => {
    const fullPageContent = contentSelectionService.getFullPageContent();
    dispatch({ type: 'SET_FULL_PAGE_CONTENT', payload: fullPageContent });
  }, [contentSelectionService]);

  const setClickSelection = useCallback((content: string, element?: Element, context?: string) => {
    contentSelectionService.setClickSelection(content, element, context);
  }, [contentSelectionService]);

  const clearClickSelection = useCallback(() => {
    contentSelectionService.clearClickSelection();
  }, [contentSelectionService]);

  const requestCompromiseAnalysis = useCallback(() => {
    dispatch({ type: 'REQUEST_COMPROMISE_ANALYSIS' });
  }, []);

  const completeCompromiseAnalysis = useCallback(() => {
    dispatch({ type: 'COMPLETE_COMPROMISE_ANALYSIS' });
  }, []);



  const contextValue: TextAnalysisContextType = {
    state,
    setMode,
    analyzeCurrentContent,
    clearAnalysis,
    refreshFullPageContent,
    setClickSelection,
    clearClickSelection,
    requestCompromiseAnalysis,
    completeCompromiseAnalysis,
  };

  return (
    <TextAnalysisContext.Provider value={contextValue}>
      {children}
    </TextAnalysisContext.Provider>
  );
}

export function useTextAnalysis() {
  const context = useContext(TextAnalysisContext);
  if (context === undefined) {
    throw new Error('useTextAnalysis must be used within a TextAnalysisProvider');
  }
  return context;
}