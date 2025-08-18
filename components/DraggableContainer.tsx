import React, { useState, useRef, useEffect, ReactNode, cloneElement } from 'react';

interface Position {
  x: number;
  y: number;
}

interface DraggableContainerProps {
  children: ReactNode;
  logoRef?: React.RefObject<{ triggerAnimation: () => void }>;
}

export function DraggableContainer({ children, logoRef }: DraggableContainerProps) {
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleHeaderHover = () => {
    if (logoRef?.current && !isDragging) {
      logoRef.current.triggerAnimation();
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, dragOffset]);

  // Pass drag handlers to children via React context or props
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return cloneElement(child, {
        ...child.props,
        dragHandlers: {
          onMouseDown: handleMouseDown,
          onMouseEnter: handleHeaderHover,
        }
      } as any);
    }
    return child;
  });

  return (
    <div
      ref={containerRef}
      className="fixed bg-brand-bg-popup rounded-lg shadow-2xl border border-brand-border-light z-50 transition-shadow duration-200 flex flex-col overflow-hidden"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '400px',
        height: '700px',
        boxShadow: isDragging 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)' 
          : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Background Pattern Overlay */}
      <img 
        src="https://lh3.googleusercontent.com/d/1w1x8iiYHzOqlx7yan9VVJgKbNXZRMpuY"
        alt="Halftone texture overlay"
        className="absolute bottom-0 left-0 w-full h-full object-contain object-bottom opacity-100 pointer-events-none"
        style={{ 
          zIndex: 1,
          mixBlendMode: 'overlay',
          marginBottom: '-50px'
        }}
      />

      {enhancedChildren}
    </div>
  );
}