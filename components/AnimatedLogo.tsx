import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

const SYMBOLS = [
  '*', '•', '◆', '▲', '●', '■', '▼', '◄', '►', '♦', '♠', '♣', '♥',
  '★', '☆', '✦', '✧', '⬢', '⬡', '◉', '◎', '○', '◇', '◈', '⟐', '⟡',
  '▪', '▫', '▬', '▭', '▮', '▯', '▰', '▱', '▲', '△', '▴', '▵', '▶', '▷',
  '▸', '▹', '►', '▻', '▼', '▽', '▾', '▿', '◀', '◁', '◂', '◃', '◄', '◅',
  '◆', '◇', '◈', '◉', '◊', '○', '◌', '◍', '◎', '●', '◐', '◑', '◒', '◓'
];

const ANIMATION_STAGES = {
  IDLE: 'idle',
  CYCLING: 'cycling', 
  SETTLING: 'settling'
};

interface AnimatedLogoProps {}

interface AnimatedLogoRef {
  triggerAnimation: () => void;
}

export const AnimatedLogo = forwardRef<AnimatedLogoRef, AnimatedLogoProps>((props, ref) => {
  const [currentSymbol, setCurrentSymbol] = useState('*');
  const [animationStage, setAnimationStage] = useState(ANIMATION_STAGES.IDLE);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;

    // Main animation trigger - every 30 seconds
    const mainInterval = setInterval(() => {
      if (animationStage === ANIMATION_STAGES.IDLE) {
        setAnimationStage(ANIMATION_STAGES.CYCLING);
        setCycleCount(0);
      }
    }, 30000);

    // Handle cycling phase
    if (animationStage === ANIMATION_STAGES.CYCLING) {
      intervalId = setInterval(() => {
        const randomSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        setCurrentSymbol(randomSymbol);
        setCycleCount(prev => prev + 1);

        if (cycleCount >= 15 + Math.random() * 5) {
          setAnimationStage(ANIMATION_STAGES.SETTLING);
        }
      }, 80);
    }

    // Handle settling phase
    if (animationStage === ANIMATION_STAGES.SETTLING) {
      const settleSymbols = ['◆', '●', '▲', '♦', '*'];
      let settleIndex = 0;

      intervalId = setInterval(() => {
        setCurrentSymbol(settleSymbols[settleIndex]);
        settleIndex++;

        if (settleIndex >= settleSymbols.length) {
          setAnimationStage(ANIMATION_STAGES.IDLE);
          setCurrentSymbol('*');
          setCycleCount(0);
        }
      }, 200);
    }

    return () => {
      clearInterval(mainInterval);
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [animationStage, cycleCount]);

  const startAnimation = () => {
    if (animationStage === ANIMATION_STAGES.IDLE) {
      setAnimationStage(ANIMATION_STAGES.CYCLING);
      setCycleCount(0);
    }
  };

  useImperativeHandle(ref, () => ({
    triggerAnimation: startAnimation
  }), [animationStage]);

  // Initial demo animation
  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      startAnimation();
    }, 3000);

    return () => clearTimeout(initialTimeout);
  }, []);

  const getSymbolClasses = () => {
    switch (animationStage) {
      case ANIMATION_STAGES.CYCLING:
        return 'text-brand-accent-yellow scale-110 transition-all duration-75';
      case ANIMATION_STAGES.SETTLING:
        return 'text-brand-accent-rose scale-105 transition-all duration-200';
      default:
        return 'text-brand-accent-rose transition-all duration-300';
    }
  };

  return (
    <div className="text-xl text-brand-accent-rose logo-text">
      <span>[—</span>
      <span className={getSymbolClasses()}>
        {currentSymbol}
      </span>
      <span>—]</span>
      <span className="text-[14px]"> POKPOK.AI</span>
    </div>
  );
});

AnimatedLogo.displayName = 'AnimatedLogo';