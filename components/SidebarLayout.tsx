import React from 'react';

interface SidebarLayoutProps {
  header: React.ReactNode;
  switch: React.ReactNode;
  content: React.ReactNode;
  statusBar: React.ReactNode;
}

export function SidebarLayout({ header, switch: switchComponent, content, statusBar }: SidebarLayoutProps) {
  return (
    <div className="flex flex-col h-full bg-brand-bg-popup">
      {/* Header Section */}
      <div className="flex-none bg-brand-bg-card border-b border-brand-border-light">
        <div className="p-3">
          {header}
        </div>
      </div>

      {/* Switch Section */}
      <div className="flex-none bg-brand-bg-muted border-b border-brand-border-light">
        <div className="p-3">
          {switchComponent}
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          {content}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex-none bg-brand-bg-card border-t border-brand-border-light">
        <div className="p-3">
          {statusBar}
        </div>
      </div>
    </div>
  );
}