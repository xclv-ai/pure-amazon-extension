import React, { ReactNode, cloneElement } from 'react';

interface PopupLayoutProps {
  header: ReactNode;
  switch: ReactNode;
  content: ReactNode;
  statusBar: ReactNode;
  dragHandlers?: {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseEnter: () => void;
  };
}

export function PopupLayout({ header, switch: switchComponent, content, statusBar, dragHandlers }: PopupLayoutProps) {
  // Pass drag handlers to the header component
  const enhancedHeader = React.isValidElement(header) && dragHandlers
    ? cloneElement(header, {
        ...header.props,
        onMouseDown: dragHandlers.onMouseDown,
        onMouseEnter: dragHandlers.onMouseEnter,
      } as any)
    : header;

  return (
    <>
      {/* Header Section */}
      <header className="relative z-10 flex-shrink-0">
        {enhancedHeader}
      </header>

      {/* Switch Section - Full width, no gaps */}
      <div className="relative z-10 flex-shrink-0">
        {switchComponent}
      </div>

      {/* Main Content Area with Hidden Scrollbar */}
      <main className="flex-1 relative z-10 overflow-y-auto scrollbar-hide">
        <div className="p-4">
          {content}
        </div>
      </main>

      {/* Status Bar */}
      <footer className="bg-brand-bg-card border-t border-brand-border-light px-4 py-2 flex-shrink-0 text-xs text-brand-text-secondary flex justify-between items-center rounded-b-lg relative z-10">
        {statusBar}
      </footer>

      {/* Resize Handle */}
      <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-20">
        <div className="absolute bottom-1 right-1 w-0 h-0 border-l-2 border-b-2 border-brand-border-light"></div>
        <div className="absolute bottom-2 right-2 w-0 h-0 border-l-2 border-b-2 border-brand-border-light"></div>
      </div>
    </>
  );
}