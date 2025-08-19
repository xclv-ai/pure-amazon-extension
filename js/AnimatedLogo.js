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
        // Check which brand is currently active
        const logoText = document.querySelector('.logo-text');
        const isDRBrand = logoText && logoText.classList.contains('dr-brand');
        
        if (isDRBrand) {
            triggerDRLogoAnimation();
        } else {
            // PokPok logo animation
            if (animationStage === 'idle') {
                animationStage = 'cycling';
                cycleCount = 0;
                cycleSymbols();
            }
        }
    }

    function cycleSymbols() {
        if (animationStage !== 'cycling') return;
        
        const logoSymbol = document.getElementById('logoSymbol');
        if (!logoSymbol) return; // Safety check for DR brand
        
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
        
        if (!logoSymbol) return; // Safety check for DR brand
        
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

    // DR Logo Animation - Color cycling
    function triggerDRLogoAnimation() {
        const drLogo = document.querySelector('.dr-logo');
        if (!drLogo) return;
        
        // Brand colors for DR logo animation
        const brandColors = [
            '#f6f951', // Yellow
            '#ffffff', // White  
            '#f1c7d6'  // Pink/Rose
        ];
        
        let colorIndex = 0;
        let cycleCount = 0;
        const maxCycles = 12; // 4 cycles through 3 colors
        
        function cycleDRColors() {
            drLogo.style.filter = `brightness(1) hue-rotate(${colorIndex * 120}deg) saturate(1.5)`;
            
            // Add a subtle pulse effect
            drLogo.style.transform = 'scale(1.1)';
            setTimeout(() => {
                if (drLogo.style.transform) {
                    drLogo.style.transform = 'scale(1)';
                }
            }, 150);
            
            colorIndex = (colorIndex + 1) % brandColors.length;
            cycleCount++;
            
            if (cycleCount < maxCycles) {
                setTimeout(cycleDRColors, 300);
            } else {
                // Reset to original state
                setTimeout(() => {
                    drLogo.style.filter = '';
                    drLogo.style.transform = '';
                }, 300);
            }
        }
        
        cycleDRColors();
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