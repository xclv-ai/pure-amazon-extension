// AnimatedLogo.js - Logo animation (extracted from analysis.js)
// Preserves exact visual behavior from working implementation

(function() {
    // Symbol array for cycling animation
    const symbols = [
        '*', '•', '◆', '▲', '●', '■', '▼', '◄', '►', '♦', '♠', '♣', '♥',
        '★', '☆', '✦', '✧', '⬢', '⬡', '◉', '◎', '○', '◇', '◈', '⟐', '⟡'
    ];

    let animationStage = 'idle';
    let cycleCount = 0;

    function init() {
        console.log('AnimatedLogo initialized');
    }

    function triggerLogoAnimation() {
        if (animationStage === 'idle') {
            animationStage = 'cycling';
            cycleCount = 0;
            cycleSymbols();
        }
    }

    function cycleSymbols() {
        if (animationStage !== 'cycling') return;
        
        const logoSymbol = document.getElementById('logoSymbol');
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        
        logoSymbol.textContent = randomSymbol;
        logoSymbol.className = 'logo-symbol cycling';
        
        cycleCount++;
        
        if (cycleCount >= 20) {
            animationStage = 'settling';
            settleAnimation();
        } else {
            setTimeout(cycleSymbols, 80);
        }
    }

    function settleAnimation() {
        const settleSymbols = ['◆', '●', '▲', '♦', '*'];
        let settleIndex = 0;
        const logoSymbol = document.getElementById('logoSymbol');
        
        function settle() {
            logoSymbol.textContent = settleSymbols[settleIndex];
            logoSymbol.className = 'logo-symbol settling';
            settleIndex++;
            
            if (settleIndex >= settleSymbols.length) {
                logoSymbol.textContent = '*';
                logoSymbol.className = 'logo-symbol';
                animationStage = 'idle';
                cycleCount = 0;
            } else {
                setTimeout(settle, 200);
            }
        }
        
        settle();
    }

    // Export for external use
    window.POKPOK = window.POKPOK || {};
    window.POKPOK.triggerLogoAnimation = triggerLogoAnimation;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();