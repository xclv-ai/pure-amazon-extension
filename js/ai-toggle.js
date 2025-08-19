// AI Engine Toggle Functionality
function initializeAiToggle() {
    const localBtn = document.getElementById('localAiBtn');
    const cloudBtn = document.getElementById('cloudAiBtn');
    const description = document.getElementById('aiEngineDescription');
    
    function updateToggleState(activeEngine) {
        // Update button states
        localBtn.classList.toggle('active', activeEngine === 'local');
        cloudBtn.classList.toggle('active', activeEngine === 'cloud');
        
        // Update description
        if (activeEngine === 'local') {
            description.innerHTML = `
                <div class="engine-title">
                    Local AI (compromise.js)
                </div>
                <div class="engine-details">
                    ✓ Fast offline analysis<br>
                    ✓ No API costs<br>
                    ✓ Complete privacy<br>
                    • Nielsen's 4-dimensional framework
                </div>
            `;
        } else {
            description.innerHTML = `
                <div class="engine-title">
                    Cloud AI (Gemini API)
                </div>
                <div class="engine-details">
                    ✓ Advanced AI analysis<br>
                    ✓ Enhanced accuracy<br>
                    ✓ Multilingual support<br>
                    • Requires API key configuration
                </div>
            `;
        }
        
        // Store selection for Settings.js to access
        window.currentAiEngine = activeEngine;
    }
    
    // Make updateToggleState globally accessible for Settings.js
    window.updateToggleState = updateToggleState;
    
    // Event listeners
    localBtn.addEventListener('click', () => {
        updateToggleState('local');
    });
    
    cloudBtn.addEventListener('click', () => {
        updateToggleState('cloud');
    });
    
    // Initialize with local as default
    updateToggleState('local');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAiToggle);
} else {
    initializeAiToggle();
}