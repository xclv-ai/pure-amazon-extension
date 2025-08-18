// Navigation.js - Simple tab navigation handling
// Direct DOM manipulation approach

(function() {
    let activeTab = 'main';

    function init() {
        console.log('Navigation initialized');
        
        // Setup tab buttons
        setupTabButtons();
        
        // Initialize view
        showView(activeTab);
    }

    function setupTabButtons() {
        const mainTabBtn = document.getElementById('tab-main');
        const analysisTabBtn = document.getElementById('tab-analysis');

        if (mainTabBtn) {
            mainTabBtn.addEventListener('click', () => {
                switchTab('main');
            });
        }

        if (analysisTabBtn) {
            analysisTabBtn.addEventListener('click', () => {
                switchTab('analysis');
            });
        }
    }

    function switchTab(tabName) {
        if (activeTab === tabName) return;
        
        console.log(`Switching to ${tabName} tab`);
        activeTab = tabName;
        
        // Update button states
        updateTabButtonStates();
        
        // Show/hide content views
        showView(tabName);
        
        // Trigger logo animation when switching to main
        if (tabName === 'main' && window.POKPOK && window.POKPOK.triggerLogoAnimation) {
            setTimeout(() => {
                window.POKPOK.triggerLogoAnimation();
            }, 300);
        }
    }

    function updateTabButtonStates() {
        const mainTabBtn = document.getElementById('tab-main');
        const analysisTabBtn = document.getElementById('tab-analysis');

        if (mainTabBtn) {
            updateButtonState(mainTabBtn, activeTab === 'main');
        }

        if (analysisTabBtn) {
            updateButtonState(analysisTabBtn, activeTab === 'analysis');
        }
    }

    function updateButtonState(button, isActive) {
        const baseClasses = 'tab-button px-4 py-2 text-sm font-jetbrains-medium rounded-lg transition-colors';
        const activeClasses = 'bg-brand-accent-yellow text-brand-text-primary';
        const inactiveClasses = 'bg-brand-bg-card text-brand-text-secondary hover:bg-brand-bg-card hover:text-brand-text-primary border border-brand-border-light';
        
        button.className = `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
    }

    function showView(viewName) {
        const mainView = document.getElementById('main-view');
        const analysisView = document.getElementById('analysis-view');

        if (mainView) {
            mainView.classList.toggle('active', viewName === 'main');
        }

        if (analysisView) {
            analysisView.classList.toggle('active', viewName === 'analysis');
        }
    }

    // Export for external use
    window.POKPOK = window.POKPOK || {};
    window.POKPOK.switchTab = switchTab;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();