import React, { useState, useCallback } from 'react';
import { useContentAnalysis } from '../hooks/useContentAnalysis';

interface ContentBlock {
  id: string;
  title: string;
  content: string;
  category: 'brand' | 'archetype' | 'visual';
}

const contentBlocks: ContentBlock[] = [
  {
    id: 'brand-analysis',
    title: 'Brand Analysis',
    content: 'Comprehensive analysis of brand voice characteristics using standardized metrics.',
    category: 'brand'
  },
  {
    id: 'archetype-mapping',
    title: 'Archetype Mapping',
    content: 'Jung\'s 12 archetypes framework for understanding brand personality.',
    category: 'archetype'
  },
  {
    id: 'visual-identity',
    title: 'Visual Identity',
    content: 'Design system analysis including color palettes and distinctive assets.',
    category: 'visual'
  }
];

export function AnalyzableWebpageContent() {
  const { 
    mode, 
    isAnalyzing,
    hasClickSelection,
    analyzeContent, 
    setClickSelection, 
    clearClickSelection 
  } = useContentAnalysis();
  
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const handleBlockClick = useCallback((block: ContentBlock) => {
    // Only allow selection in "selectedElements" mode
    if (mode !== 'selectedElements') return;

    const fullContent = `${block.title}\n\n${block.content}`;
    
    if (selectedBlockId === block.id) {
      // Deselect if already selected
      setSelectedBlockId(null);
      clearClickSelection();
    } else {
      // Select new block
      setSelectedBlockId(block.id);
      setClickSelection(fullContent, undefined, `Interactive content block: ${block.title}`);
    }
  }, [mode, selectedBlockId, setClickSelection, clearClickSelection]);

  // Analysis is now handled by the popup switch component
  // No need for separate analyze function here

  const getBlockClasses = useCallback((block: ContentBlock) => {
    const baseClasses = "bg-brand-bg-muted p-6 rounded-lg transition-all duration-200";
    
    if (mode !== 'selectedElements') {
      return baseClasses;
    }

    const interactiveClasses = "cursor-pointer hover:bg-brand-bg-card hover:shadow-md";
    const selectedClasses = selectedBlockId === block.id 
      ? "ring-2 ring-brand-accent-yellow bg-brand-bg-card shadow-lg" 
      : "";

    return `${baseClasses} ${interactiveClasses} ${selectedClasses}`;
  }, [mode, selectedBlockId]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        {contentBlocks.map((block) => (
          <div
            key={block.id}
            className={getBlockClasses(block)}
            onClick={() => handleBlockClick(block)}
            role={mode === 'selectedElements' ? 'button' : undefined}
            tabIndex={mode === 'selectedElements' ? 0 : undefined}
            onKeyDown={(e) => {
              if (mode === 'selectedElements' && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                handleBlockClick(block);
              }
            }}
          >
            <h3 className="font-jetbrains-medium text-brand-text-primary mb-2">
              {block.title}
            </h3>
            <p className="text-brand-text-secondary text-sm">
              {block.content}
            </p>
            
            {/* Selection indicator */}
            {mode === 'selectedElements' && selectedBlockId === block.id && (
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-brand-accent-yellow rounded-full animate-pulse"></div>
                <span className="text-xs text-brand-text-secondary">Selected for analysis</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Analysis is now controlled by the popup switch - no floating button needed */}
    </>
  );
}