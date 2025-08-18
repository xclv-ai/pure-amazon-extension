// AnimatedLogo.js - Simple logo animation for POKPOK.AI
// Direct DOM manipulation approach

(function() {
    // Symbol array for cycling animation - Your beautiful design variations
    const symbols = [
        '[—*—]', '[—○—]', '[—●—]', '[—◐—]', '[—◑—]', '[—◒—]', '[—◓—]', 
        '[—▲—]', '[—▼—]', '[—◆—]', '[—◇—]', '[—●—]', '[—○—]', '[—*—]',
        '[—⬢—]', '[—⬡—]', '[—◈—]', '[—◊—]', '[—※—]', '[—°—]', '[—•—]',
        '[—⟐—]', '[—⟑—]', '[—⚬—]', '[—⊙—]', '[—⊚—]', '[—⊛—]', '[—*—]'
    ];

    let currentIndex = 0;
    let animationInterval = null;
    let isAnimating = false;

    // Animation speeds for different stages
    const ANIMATION_SPEEDS = {
        slow: 800,
        medium: 400,
        fast: 150,
        rapid: 50
    };

    function init() {
        console.log('AnimatedLogo initialized');
        
        // Start gentle breathing animation
        startBreathingAnimation();
        
        // Add click handler for manual trigger
        const logoContainer = document.getElementById('animated-logo-container');
        if (logoContainer) {
            logoContainer.addEventListener('click', triggerAnimation);
        }
    }

    function startBreathingAnimation() {
        // Add breathing effect to logo container
        const logoContainer = document.getElementById('animated-logo-container');
        if (logoContainer) {
            logoContainer.style.animation = 'none'; // Reset
            setTimeout(() => {
                logoContainer.style.animation = 'slider-breath 3s ease-in-out infinite';
            }, 100);
        }
    }

    function triggerAnimation() {
        if (isAnimating) return;
        
        console.log('Logo animation triggered');
        isAnimating = true;
        
        // Stop breathing animation during symbol cycling
        const logoContainer = document.getElementById('animated-logo-container');
        if (logoContainer) {
            logoContainer.style.animation = 'none';
        }
        
        // Multi-stage animation sequence
        animateStage1() // Fast cycling
            .then(() => animateStage2()) // Medium cycling
            .then(() => animateStage3()) // Slow cycling
            .then(() => {
                // Reset to original symbol
                updateSymbol('[—*—]');
                isAnimating = false;
                
                // Resume breathing animation
                setTimeout(() => {
                    startBreathingAnimation();
                }, 500);
                
                console.log('Logo animation completed');
            });
    }

    function animateStage1() {
        return new Promise((resolve) => {
            let cycles = 0;
            const maxCycles = 8;
            
            animationInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % symbols.length;
                updateSymbol(symbols[currentIndex]);
                
                cycles++;
                if (cycles >= maxCycles) {
                    clearInterval(animationInterval);
                    resolve();
                }
            }, ANIMATION_SPEEDS.rapid);
        });
    }

    function animateStage2() {
        return new Promise((resolve) => {
            let cycles = 0;
            const maxCycles = 6;
            
            animationInterval = setInterval(() => {
                currentIndex = (currentIndex + 2) % symbols.length;
                updateSymbol(symbols[currentIndex]);
                
                cycles++;
                if (cycles >= maxCycles) {
                    clearInterval(animationInterval);
                    resolve();
                }
            }, ANIMATION_SPEEDS.fast);
        });
    }

    function animateStage3() {
        return new Promise((resolve) => {
            let cycles = 0;
            const maxCycles = 4;
            
            animationInterval = setInterval(() => {
                currentIndex = (currentIndex + 3) % symbols.length;
                updateSymbol(symbols[currentIndex]);
                
                cycles++;
                if (cycles >= maxCycles) {
                    clearInterval(animationInterval);
                    resolve();
                }
            }, ANIMATION_SPEEDS.medium);
        });
    }

    function updateSymbol(symbol) {
        const logoSymbol = document.getElementById('logo-symbol');
        if (logoSymbol) {
            logoSymbol.textContent = symbol;
            
            // Add subtle scale effect
            logoSymbol.style.transform = 'scale(1.1)';
            setTimeout(() => {
                logoSymbol.style.transform = 'scale(1)';
            }, 100);
        }
    }

    // Export trigger function for external use
    window.POKPOK = window.POKPOK || {};
    window.POKPOK.triggerLogoAnimation = triggerAnimation;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();