// ContentAnalysisSwitch.js - Simple analysis toggle handling
// Direct DOM manipulation approach

(function() {
    let isAnalysisEnabled = false;

    function init() {
        console.log('ContentAnalysisSwitch initialized');
        
        // Setup toggle switch
        setupToggleSwitch();
    }

    function setupToggleSwitch() {
        const toggle = document.getElementById('analysis-toggle');
        
        if (toggle) {
            toggle.addEventListener('change', (e) => {
                isAnalysisEnabled = e.target.checked;
                handleToggleChange(isAnalysisEnabled);
            });
            
            // Initialize state
            handleToggleChange(isAnalysisEnabled);
        }
    }

    function handleToggleChange(enabled) {
        console.log(`Content analysis ${enabled ? 'enabled' : 'disabled'}`);
        
        // Update visual state if needed
        const switchContainer = document.getElementById('content-analysis-switch');
        if (switchContainer) {
            switchContainer.style.opacity = enabled ? '1' : '0.8';
        }
        
        // Communicate state to Chrome extension
        if (window.POKPOK && window.POKPOK.sendMessage) {
            window.POKPOK.sendMessage({
                type: 'ANALYSIS_STATE_CHANGED',
                enabled: enabled,
                timestamp: Date.now()
            }).catch(error => {
                console.log('Failed to send analysis state to extension:', error);
            });
        }
    }

    // Export for external use
    window.POKPOK = window.POKPOK || {};
    window.POKPOK.setAnalysisEnabled = (enabled) => {
        const toggle = document.getElementById('analysis-toggle');
        if (toggle) {
            toggle.checked = enabled;
            handleToggleChange(enabled);
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();