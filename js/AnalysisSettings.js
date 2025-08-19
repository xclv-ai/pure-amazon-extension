// AnalysisSettings.js - Analysis engine configuration
// Handles AI engine selection (Local vs Cloud) and analysis preferences

window.AnalysisSettings = (function() {
    'use strict';

    // State
    let currentEngine = 'local'; // Default to local AI
    let initialized = false;
    let engineButtons = null;

    // Engine configurations
    const engines = {
        local: {
            name: 'Local AI',
            title: 'Local AI (compromise.js)',
            description: `✓ Fast offline analysis
✓ No API costs
✓ Complete privacy
• Nielsen's 4-dimensional framework`,
            features: [
                'Instant processing',
                'Works offline',
                'No data leaves device',
                'Rule-based NLP'
            ]
        },
        cloud: {
            name: 'Cloud AI',
            title: 'Cloud AI (Gemini API)',
            description: `✓ Advanced AI analysis
✓ Context understanding
✓ Deeper insights
• Requires API key & internet`,
            features: [
                'Advanced language models',
                'Contextual analysis',
                'Brand archetype detection',
                'Semantic understanding'
            ]
        }
    };

    // Initialize analysis settings
    function initialize() {
        if (initialized) return;
        
        // Create analysis settings UI
        createAnalysisUI();
        
        // Load saved preferences
        loadAnalysisPreferences();
        
        // Set up event listeners
        setupEventListeners();
        
        initialized = true;
        console.log('AnalysisSettings module initialized');
    }

    // Create analysis settings UI
    function createAnalysisUI() {
        const container = document.querySelector('.analysis-settings-content');
        if (!container) return;
        
        // Move AI Engine section here if it exists
        const existingSection = findAndMoveAiEngineSection();
        
        if (!existingSection) {
            // Create new AI Engine section
            container.innerHTML = `
                <div class="settings-section">
                    <div class="section-label">
                        <span class="bracket">[ ]</span> AI ENGINE SELECTION
                    </div>
                    <div class="form-group">
                        <label class="form-label">Analysis Engine</label>
                        <div class="ai-toggle-container">
                            <div class="ai-toggle-wrapper">
                                <button type="button" class="ai-toggle-btn active" id="analysisLocalBtn" data-engine="local">
                                    Local AI
                                </button>
                                <button type="button" class="ai-toggle-btn" id="analysisCloudBtn" data-engine="cloud">
                                    Cloud AI
                                </button>
                            </div>
                        </div>
                        <div class="ai-engine-description" id="analysisEngineDesc">
                            <div class="engine-title">Local AI (compromise.js)</div>
                            <div class="engine-details">
                                ✓ Fast offline analysis<br>
                                ✓ No API costs<br>
                                ✓ Complete privacy<br>
                                • Nielsen's 4-dimensional framework
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="settings-section">
                    <div class="section-label">
                        <span class="bracket">[ ]</span> ANALYSIS PREFERENCES
                    </div>
                    <div class="form-group">
                        <label class="form-label">
                            <input type="checkbox" id="autoAnalyze" style="margin-right: 8px;">
                            Auto-analyze on page load
                        </label>
                        <div class="form-hint">Automatically analyze page content when extension opens</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">
                            <input type="checkbox" id="deepAnalysis" style="margin-right: 8px;">
                            Enable deep analysis
                        </label>
                        <div class="form-hint">Perform comprehensive brand archetype analysis (slower)</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">
                            <input type="checkbox" id="saveHistory" style="margin-right: 8px;">
                            Save analysis history
                        </label>
                        <div class="form-hint">Keep history of analyzed pages for comparison</div>
                    </div>
                </div>
                
                <div class="settings-actions" style="margin-top: 24px;">
                    <button type="button" class="btn btn-primary" id="saveAnalysisBtn" style="width: 100%;">
                        Save Analysis Settings
                    </button>
                </div>
                
                <div class="security-notice" style="margin-top: 20px;">
                    <div class="notice-icon">💡</div>
                    <div class="notice-text">
                        <strong>Tip:</strong> Local AI provides instant analysis without internet. 
                        Cloud AI offers deeper insights but requires an API key configured in the API Settings tab.
                    </div>
                </div>
            `;
        }
        
        // Get engine buttons
        engineButtons = {
            local: document.getElementById('analysisLocalBtn') || document.getElementById('localAiBtn'),
            cloud: document.getElementById('analysisCloudBtn') || document.getElementById('cloudAiBtn')
        };
    }

    // Find and move existing AI Engine section
    function findAndMoveAiEngineSection() {
        const settingsForm = document.getElementById('settingsForm');
        if (!settingsForm) return null;
        
        const sections = settingsForm.querySelectorAll('.settings-section');
        let aiEngineSection = null;
        
        sections.forEach(section => {
            const label = section.querySelector('.section-label');
            if (label && label.textContent.includes('AI ENGINE')) {
                aiEngineSection = section;
            }
        });
        
        if (aiEngineSection) {
            const container = document.querySelector('.analysis-settings-content');
            if (container) {
                container.appendChild(aiEngineSection);
                
                // Add additional sections
                const additionalHTML = `
                    <div class="settings-section">
                        <div class="section-label">
                            <span class="bracket">[ ]</span> ANALYSIS PREFERENCES
                        </div>
                        <div class="form-group">
                            <label class="form-label">
                                <input type="checkbox" id="autoAnalyze" style="margin-right: 8px;">
                                Auto-analyze on page load
                            </label>
                            <div class="form-hint">Automatically analyze page content when extension opens</div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">
                                <input type="checkbox" id="deepAnalysis" style="margin-right: 8px;">
                                Enable deep analysis
                            </label>
                            <div class="form-hint">Perform comprehensive brand archetype analysis (slower)</div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">
                                <input type="checkbox" id="saveHistory" style="margin-right: 8px;">
                                Save analysis history
                            </label>
                            <div class="form-hint">Keep history of analyzed pages for comparison</div>
                        </div>
                    </div>
                    
                    <div class="settings-actions" style="margin-top: 24px;">
                        <button type="button" class="btn btn-primary" id="saveAnalysisBtn" style="width: 100%;">
                            Save Analysis Settings
                        </button>
                    </div>
                `;
                
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = additionalHTML;
                while (tempDiv.firstChild) {
                    container.appendChild(tempDiv.firstChild);
                }
                
                return aiEngineSection;
            }
        }
        
        return null;
    }

    // Set up event listeners
    function setupEventListeners() {
        // Engine toggle buttons
        const localBtn = document.getElementById('analysisLocalBtn') || document.getElementById('localAiBtn');
        const cloudBtn = document.getElementById('analysisCloudBtn') || document.getElementById('cloudAiBtn');
        
        if (localBtn) {
            localBtn.addEventListener('click', () => handleEngineChange('local'));
        }
        
        if (cloudBtn) {
            cloudBtn.addEventListener('click', () => handleEngineChange('cloud'));
        }
        
        // Save button
        const saveBtn = document.getElementById('saveAnalysisBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', handleSaveSettings);
        }
        
        // Listen for tab changes
        document.addEventListener('settingsTabChange', (event) => {
            if (event.detail.currentTab === 'analysis') {
                loadAnalysisPreferences();
            }
        });
        
        // Listen for settings loaded event
        document.addEventListener('settingsLoaded', (event) => {
            if (event.detail && event.detail.settings) {
                populateFromSettings(event.detail.settings);
            }
        });
    }

    // Handle engine change
    function handleEngineChange(engine) {
        if (engine === currentEngine) return;
        
        currentEngine = engine;
        updateEngineUI();
        
        // Update global variable for compatibility
        window.currentAiEngine = engine;
        
        // Dispatch event
        const engineChangeEvent = new CustomEvent('analysisEngineChange', {
            detail: { engine: engine }
        });
        document.dispatchEvent(engineChangeEvent);
    }

    // Update engine UI
    function updateEngineUI() {
        // Update toggle buttons
        const localBtn = document.getElementById('analysisLocalBtn') || document.getElementById('localAiBtn');
        const cloudBtn = document.getElementById('analysisCloudBtn') || document.getElementById('cloudAiBtn');
        
        if (localBtn && cloudBtn) {
            if (currentEngine === 'local') {
                localBtn.classList.add('active');
                cloudBtn.classList.remove('active');
            } else {
                localBtn.classList.remove('active');
                cloudBtn.classList.add('active');
            }
        }
        
        // Update description
        const descElement = document.getElementById('analysisEngineDesc') || document.getElementById('aiEngineDescription');
        if (descElement) {
            const engine = engines[currentEngine];
            descElement.innerHTML = `
                <div class="engine-title">${engine.title}</div>
                <div class="engine-details">${engine.description}</div>
            `;
        }
    }

    // Load saved preferences
    async function loadAnalysisPreferences() {
        try {
            if (window.POKPOK && window.POKPOK.storage) {
                const settings = await window.POKPOK.storage.loadSettings();
                if (settings) {
                    populateFromSettings(settings);
                }
            }
        } catch (error) {
            console.warn('Failed to load analysis preferences:', error);
        }
    }
    
    // Populate form from settings
    function populateFromSettings(settings) {
        if (!settings) return;
        
        try {
            // Load engine preference
            if (settings.aiEngine) {
                currentEngine = settings.aiEngine;
                updateEngineUI();
            }
            
            // Load checkboxes
            const autoAnalyze = document.getElementById('autoAnalyze');
            if (autoAnalyze && settings.autoAnalyze !== undefined) {
                autoAnalyze.checked = settings.autoAnalyze;
            }
            
            const deepAnalysis = document.getElementById('deepAnalysis');
            if (deepAnalysis && settings.deepAnalysis !== undefined) {
                deepAnalysis.checked = settings.deepAnalysis;
            }
            
            const saveHistory = document.getElementById('saveHistory');
            if (saveHistory && settings.saveHistory !== undefined) {
                saveHistory.checked = settings.saveHistory;
            }
            
            console.log('Analysis settings populated successfully');
        } catch (error) {
            console.error('Failed to populate analysis settings:', error);
        }
    }

    // Handle save settings
    async function handleSaveSettings() {
        try {
            const settings = {
                aiEngine: currentEngine,
                autoAnalyze: document.getElementById('autoAnalyze')?.checked || false,
                deepAnalysis: document.getElementById('deepAnalysis')?.checked || false,
                saveHistory: document.getElementById('saveHistory')?.checked || false
            };
            
            // Save settings
            if (window.POKPOK && window.POKPOK.storage) {
                const currentSettings = await window.POKPOK.storage.loadSettings() || {};
                const updatedSettings = {
                    ...currentSettings,
                    ...settings
                };
                await window.POKPOK.storage.saveSettings(updatedSettings);
            }
            
            showNotification('Analysis settings saved successfully!', 'success');
            
        } catch (error) {
            console.error('Failed to save analysis settings:', error);
            showNotification('Failed to save settings', 'error');
        }
    }

    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 16px;
            border-radius: 4px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            z-index: 10000;
            background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
            color: ${type === 'success' ? '#155724' : '#721c24'};
            border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Get current engine
    function getCurrentEngine() {
        return currentEngine;
    }

    // Get analysis preferences
    function getPreferences() {
        return {
            engine: currentEngine,
            autoAnalyze: document.getElementById('autoAnalyze')?.checked || false,
            deepAnalysis: document.getElementById('deepAnalysis')?.checked || false,
            saveHistory: document.getElementById('saveHistory')?.checked || false
        };
    }

    // Public API
    return {
        initialize: initialize,
        getCurrentEngine: getCurrentEngine,
        getPreferences: getPreferences,
        handleEngineChange: handleEngineChange
    };
})();