import React, { useRef, useState } from 'react';
import { PopupHeader } from './PopupHeader';
import { ContentAnalysisSwitch } from './ContentAnalysisSwitch';
import { ToneAnalysisDisplay } from './ToneAnalysisDisplay';
import { StatusBar } from './StatusBar';
import { RealContentAnalyzer } from './RealContentAnalyzer';
import { CompromiseDemo } from './CompromiseDemo';

export function SidebarApp() {
  const logoRef = useRef<{ triggerAnimation: () => void }>(null);
  const [activeView, setActiveView] = useState<'main' | 'analysis'>('main');

  return (
    <div className="w-full h-full bg-brand-bg-popup overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header - Fixed at top */}
        <div className="flex-none bg-brand-bg-card border-b border-brand-border-light">
          <div className="p-4">
            <PopupHeader ref={logoRef} />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex-none bg-brand-bg-muted border-b border-brand-border-light">
          <div className="p-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView('main')}
                className={`px-4 py-2 text-sm font-jetbrains-medium rounded-lg transition-colors ${
                  activeView === 'main'
                    ? 'bg-brand-accent-yellow text-brand-text-primary'
                    : 'bg-brand-bg-card text-brand-text-secondary hover:bg-brand-bg-card hover:text-brand-text-primary border border-brand-border-light'
                }`}
              >
                🎯 Tone Analysis
              </button>
              <button
                onClick={() => setActiveView('analysis')}
                className={`px-4 py-2 text-sm font-jetbrains-medium rounded-lg transition-colors ${
                  activeView === 'analysis'
                    ? 'bg-brand-accent-yellow text-brand-text-primary'
                    : 'bg-brand-bg-card text-brand-text-secondary hover:bg-brand-bg-card hover:text-brand-text-primary border border-brand-border-light'
                }`}
              >
                🔬 Deep Analysis
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {activeView === 'main' ? (
            <div className="flex flex-col h-full">
              {/* Content Analysis Switch */}
              <div className="flex-none bg-brand-bg-card border-b border-brand-border-light">
                <div className="p-4">
                  <ContentAnalysisSwitch />
                </div>
              </div>

              {/* Tone Analysis Display - Scrollable content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                  <ToneAnalysisDisplay />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Deep Analysis Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-8">
                  {/* Real Content Analyzer */}
                  <div className="bg-brand-bg-card rounded-lg border border-brand-border-light p-4">
                    <div className="mb-4">
                      <h3 className="font-jetbrains-medium text-brand-text-primary mb-2">
                        📄 Real Content Analysis
                      </h3>
                      <p className="text-sm text-brand-text-secondary">
                        Analyze webpage content or selected text elements
                      </p>
                    </div>
                    <RealContentAnalyzer />
                  </div>
                  
                  {/* Separator */}
                  <div className="border-t border-brand-border-light my-6"></div>
                  
                  {/* Compromise Demo */}
                  <div className="bg-brand-bg-card rounded-lg border border-brand-border-light p-4">
                    <div className="mb-4">
                      <h3 className="font-jetbrains-medium text-brand-text-primary mb-2">
                        🔬 Advanced Text Analysis
                      </h3>
                      <p className="text-sm text-brand-text-secondary">
                        Comprehensive linguistic analysis with 8 detailed tabs
                      </p>
                    </div>
                    <CompromiseDemo />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status Bar - Fixed at bottom */}
        <div className="flex-none bg-brand-bg-card border-t border-brand-border-light">
          <div className="p-3">
            <StatusBar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarApp;