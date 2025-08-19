// SettingsTabs.js - Tab navigation controller for settings
// Manages tab switching and maintains active tab state

window.SettingsTabs = (function() {
    'use strict';

    // State
    let activeTab = 'api'; // Default active tab
    let tabButtons = null;
    let tabPanels = null;
    let initialized = false;

    // Initialize tab system
    function initialize() {
        if (initialized) return;
        
        // Create tab structure if not exists
        createTabStructure();
        
        // Get tab elements
        tabButtons = document.querySelectorAll('.tab-btn');
        tabPanels = document.querySelectorAll('.tab-panel');
        
        // Set up event listeners
        tabButtons.forEach(button => {
            button.addEventListener('click', handleTabClick);
        });
        
        // Load saved tab preference
        loadTabPreference();
        
        // Set initial active tab
        switchToTab(activeTab);
        
        initialized = true;
        console.log('SettingsTabs module initialized');
    }

    // Create tab structure in DOM
    function createTabStructure() {
        const settingsContent = document.querySelector('.settings-content');
        if (!settingsContent) return;
        
        // Check if tabs already exist
        if (document.querySelector('.settings-tabs')) return;
        
        // Create tab navigation
        const tabNav = document.createElement('div');
        tabNav.className = 'settings-tabs';
        tabNav.innerHTML = `
            <button class="tab-btn active" data-tab="api">API</button>
            <button class="tab-btn" data-tab="whitelabel">Branding</button>
            <button class="tab-btn" data-tab="analysis">Analysis</button>
        `;
        
        // Insert tab navigation at the beginning of settings content
        settingsContent.insertBefore(tabNav, settingsContent.firstChild);
        
        // Wrap existing form in API tab panel
        const existingForm = document.getElementById('settingsForm');
        if (existingForm) {
            const apiPanel = document.createElement('div');
            apiPanel.className = 'tab-panel active';
            apiPanel.id = 'apiTab';
            apiPanel.setAttribute('data-tab', 'api');
            
            // Move form into API panel
            existingForm.parentNode.insertBefore(apiPanel, existingForm);
            apiPanel.appendChild(existingForm);
        }
        
        // Create White Label tab panel
        const whiteLabelPanel = document.createElement('div');
        whiteLabelPanel.className = 'tab-panel';
        whiteLabelPanel.id = 'whitelabelTab';
        whiteLabelPanel.setAttribute('data-tab', 'whitelabel');
        whiteLabelPanel.innerHTML = '<div class="white-label-content"></div>';
        settingsContent.appendChild(whiteLabelPanel);
        
        // Create Analysis tab panel
        const analysisPanel = document.createElement('div');
        analysisPanel.className = 'tab-panel';
        analysisPanel.id = 'analysisTab';
        analysisPanel.setAttribute('data-tab', 'analysis');
        analysisPanel.innerHTML = '<div class="analysis-settings-content"></div>';
        settingsContent.appendChild(analysisPanel);
    }

    // Handle tab click
    function handleTabClick(event) {
        const button = event.currentTarget;
        const tabName = button.getAttribute('data-tab');
        
        if (tabName && tabName !== activeTab) {
            switchToTab(tabName);
            saveTabPreference(tabName);
            
            // Dispatch custom event for other modules
            const tabChangeEvent = new CustomEvent('settingsTabChange', {
                detail: { 
                    previousTab: activeTab,
                    currentTab: tabName 
                }
            });
            document.dispatchEvent(tabChangeEvent);
        }
    }

    // Switch to specified tab
    function switchToTab(tabName) {
        if (!tabButtons || !tabPanels) return;
        
        // Update buttons
        tabButtons.forEach(button => {
            if (button.getAttribute('data-tab') === tabName) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Update panels
        tabPanels.forEach(panel => {
            if (panel.getAttribute('data-tab') === tabName) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
        
        activeTab = tabName;
        
        // Initialize tab-specific modules if needed
        initializeTabModule(tabName);
    }

    // Initialize tab-specific module
    function initializeTabModule(tabName) {
        switch(tabName) {
            case 'api':
                if (window.ApiSettings && typeof window.ApiSettings.initialize === 'function') {
                    window.ApiSettings.initialize();
                }
                break;
            case 'whitelabel':
                if (window.WhiteLabelSettings && typeof window.WhiteLabelSettings.initialize === 'function') {
                    window.WhiteLabelSettings.initialize();
                }
                break;
            case 'analysis':
                if (window.AnalysisSettings && typeof window.AnalysisSettings.initialize === 'function') {
                    window.AnalysisSettings.initialize();
                }
                break;
        }
    }

    // Load saved tab preference
    async function loadTabPreference() {
        try {
            if (window.POKPOK && window.POKPOK.storage) {
                const settings = await window.POKPOK.storage.loadSettings();
                if (settings && settings.lastSettingsTab) {
                    activeTab = settings.lastSettingsTab;
                }
            }
        } catch (error) {
            console.warn('Failed to load tab preference:', error);
        }
    }

    // Save tab preference
    async function saveTabPreference(tabName) {
        try {
            if (window.POKPOK && window.POKPOK.storage) {
                const settings = await window.POKPOK.storage.loadSettings() || {};
                settings.lastSettingsTab = tabName;
                await window.POKPOK.storage.saveSettings(settings);
            }
        } catch (error) {
            console.warn('Failed to save tab preference:', error);
        }
    }

    // Get current active tab
    function getActiveTab() {
        return activeTab;
    }

    // Programmatically switch tabs
    function setActiveTab(tabName) {
        if (['api', 'whitelabel', 'analysis'].includes(tabName)) {
            switchToTab(tabName);
            saveTabPreference(tabName);
        }
    }

    // Public API
    return {
        initialize: initialize,
        getActiveTab: getActiveTab,
        setActiveTab: setActiveTab,
        switchToTab: switchToTab
    };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.SettingsTabs.initialize);
} else {
    // Delay initialization to ensure settings overlay is ready
    setTimeout(window.SettingsTabs.initialize, 100);
}