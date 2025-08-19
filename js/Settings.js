/**
 * POKPOK.AI Chrome Extension v2.39.0
 * File: js/Settings.js
 * Purpose: Settings orchestrator and state management system
 * 
 * v2.39.0 NOTES: This module's migration function was working correctly.
 * The brand persistence bug was actually in SettingsManager.js validation logic.
 * 
 * Key Features:
 * - Central settings coordination between multiple tab modules
 * - Chrome storage integration with encrypted API key storage
 * - Settings validation and error handling
 * - Unified settings state management
 * 
 * Dependencies:
 * - js/SettingsTabs.js: Tab navigation system
 * - js/ApiSettings.js: Gemini API configuration
 * - js/AnalysisSettings.js: Analysis engine settings
 * - js/WhiteLabelSettings.js: Brand customization
 * - Chrome storage API: Persistent settings storage
 * 
 * Exposes:
 * - window.Settings.init() - Initialize settings system
 * - window.Settings.save() - Save all settings to storage
 * - window.Settings.load() - Load settings from storage
 * 
 * Settings Structure:
 * - apiKey: Encrypted Gemini API key
 * - selectedModel: AI model selection (gemini-2.5-pro, flash, etc.)
 * - analysisEngine: Local vs Cloud AI preference
 * - whiteLabel: Brand customization options
 * 
 * Integration Points:
 * - GeminiAnalysisService.js: API configuration
 * - analysis.js: Settings-dependent functionality
 * - UI components: Settings-driven behavior
 * 
 * Last Updated: August 2024
 */

window.Settings = (function() {
    'use strict';

    // State
    let initialized = false;
    let loadingIndicator = null;

    // Initialize settings module as orchestrator
    function initialize() {
        if (initialized) return;
        
        // Get loading indicator
        loadingIndicator = document.getElementById('settingsLoading');
        
        // Initialize tab system first
        if (window.SettingsTabs && typeof window.SettingsTabs.initialize === 'function') {
            window.SettingsTabs.initialize();
        }
        
        // Initialize individual tab modules
        setTimeout(() => {
            if (window.ApiSettings && typeof window.ApiSettings.initialize === 'function') {
                window.ApiSettings.initialize();
            }
            
            if (window.WhiteLabelSettings && typeof window.WhiteLabelSettings.initialize === 'function') {
                window.WhiteLabelSettings.initialize();
            }
            
            if (window.AnalysisSettings && typeof window.AnalysisSettings.initialize === 'function') {
                window.AnalysisSettings.initialize();
            }
        }, 100);
        
        // Set up global event listeners
        setupGlobalEventListeners();
        
        // Load initial settings
        loadSettings();
        
        initialized = true;
        console.log('Settings orchestrator initialized');
    }
    
    // Set up global event listeners
    function setupGlobalEventListeners() {
        // Listen for brand changes
        document.addEventListener('brandChange', (event) => {
            console.log('Brand changed to:', event.detail.brand);
        });
        
        // Listen for engine changes
        document.addEventListener('analysisEngineChange', (event) => {
            console.log('Analysis engine changed to:', event.detail.engine);
        });
        
        // Listen for API settings changes
        document.addEventListener('apiSettingsSaved', (event) => {
            console.log('API settings saved');
        });
    }


    // Centralized settings save (delegates to specific modules)
    async function saveSettings(settings) {
        if (typeof window.POKPOK === 'undefined' || !window.POKPOK.storage) {
            throw new Error('Chrome storage API not available');
        }

        await window.POKPOK.storage.saveSettings(settings);
        
        // Notify all modules about settings change
        const settingsChangeEvent = new CustomEvent('settingsChanged', {
            detail: { settings: settings }
        });
        document.dispatchEvent(settingsChangeEvent);
    }

    // Centralized settings load (coordinates all modules)
    async function loadSettings() {
        return await ensureSettingsLoaded();
    }

    // Enhanced settings loading with retry mechanism
    async function ensureSettingsLoaded(maxRetries = 3) {
        showLoadingIndicator();
        
        try {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    console.log(`Settings load attempt ${attempt}/${maxRetries}`);
                    
                    if (typeof window.POKPOK === 'undefined' || !window.POKPOK.storage) {
                        if (attempt < maxRetries) {
                            await delay(500 * attempt);
                            continue;
                        } else {
                            throw new Error('Chrome storage API not available');
                        }
                    }

                    const settings = await window.POKPOK.storage.loadSettings();
                    
                    if (settings) {
                        const validatedSettings = await validateAndMigrateSettings(settings);
                        console.log('Settings loaded successfully');
                        
                        // Notify all modules
                        const settingsLoadedEvent = new CustomEvent('settingsLoaded', {
                            detail: { settings: validatedSettings }
                        });
                        document.dispatchEvent(settingsLoadedEvent);
                        
                        return validatedSettings;
                    }
                    return null;

                } catch (error) {
                    console.error(`Settings load attempt ${attempt} failed:`, error);
                    if (attempt === maxRetries) {
                        throw error;
                    }
                    await delay(500 * attempt);
                }
            }
            return null;
        } finally {
            hideLoadingIndicator();
        }
    }

    // Validate and migrate settings
    async function validateAndMigrateSettings(settings) {
        const currentVersion = '2.13.0';
        const settingsVersion = settings.version || '1.0';
        
        console.log('🔧 validateAndMigrateSettings called with:', settings);
        console.log('🔧 Input settings keys:', Object.keys(settings));
        console.log('🔧 Input whiteLabelBrand value:', settings.whiteLabelBrand);
        
        if (settingsVersion !== currentVersion) {
            console.log(`Migrating settings from v${settingsVersion} to v${currentVersion}`);
        }
        
        // Build migrated settings with explicit whiteLabelBrand preservation
        const migratedSettings = {
            version: currentVersion,
            apiKey: settings.apiKey || '',
            model: settings.model || 'gemini-2.5-flash', 
            supabaseDb: settings.supabaseDb || '',
            aiEngine: settings.aiEngine || 'local',
            whiteLabelBrand: settings.whiteLabelBrand || 'pokpok', // Preserve brand selection
            lastSettingsTab: settings.lastSettingsTab || 'api',
            autoAnalyze: settings.autoAnalyze || false,
            deepAnalysis: settings.deepAnalysis || false,
            saveHistory: settings.saveHistory || false,
            // Gemini API 2025 Features Control (v2.42.0+)
            geminiFeatures: settings.geminiFeatures || {
                thinkingMode: true,
                urlContext: true,
                googleSearch: true,
                highTemperature: true
            },
            // Preserve any other existing settings
            ...settings,
            // Ensure critical fields aren't overwritten by spread
            version: currentVersion,
            whiteLabelBrand: settings.whiteLabelBrand || 'pokpok',
            geminiFeatures: settings.geminiFeatures || {
                thinkingMode: true,
                urlContext: true,
                googleSearch: true,
                highTemperature: true
            }
        };
        
        console.log('🔧 Migrated settings keys:', Object.keys(migratedSettings));
        console.log('🔧 Migrated whiteLabelBrand value:', migratedSettings.whiteLabelBrand);
        console.log('🔧 Migration completed successfully');
        
        return migratedSettings;
    }

    // Show loading indicator
    function showLoadingIndicator() {
        if (loadingIndicator) {
            loadingIndicator.classList.remove('hidden');
        }
        const settingsForm = document.getElementById('settingsForm');
        if (settingsForm) {
            settingsForm.classList.add('loading');
        }
    }

    // Hide loading indicator
    function hideLoadingIndicator() {
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
        const settingsForm = document.getElementById('settingsForm');
        if (settingsForm) {
            settingsForm.classList.remove('loading');
            settingsForm.classList.add('loaded');
        }
    }

    // Utility function for delays
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Show notification to user (for other modules to use)
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `settings-notification settings-notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 16px;
            border-radius: 4px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            font-weight: 500;
            z-index: 10000;
            max-width: 300px;
            word-wrap: break-word;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
        `;

        // Set colors based on type
        if (type === 'success') {
            notification.style.background = '#d4edda';
            notification.style.color = '#155724';
            notification.style.border = '1px solid #c3e6cb';
        } else if (type === 'error') {
            notification.style.background = '#f8d7da';
            notification.style.color = '#721c24';
            notification.style.border = '1px solid #f5c6cb';
        } else {
            notification.style.background = '#d1ecf1';
            notification.style.color = '#0c5460';
            notification.style.border = '1px solid #bee5eb';
        }

        // Add to document
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Debug function for testing settings persistence
    async function debugSettingsPersistence() {
        console.group('🔧 Settings Persistence Debug Test');
        
        try {
            // Test 1: Save test settings
            console.log('1️⃣ Saving test settings...');
            const testSettings = {
                apiKey: 'test-api-key-12345',
                model: 'gemini-2.5-flash',
                supabaseDb: 'test-database'
            };
            
            await saveSettings(testSettings);
            console.log('✅ Test settings saved');
            
            // Test 2: Load settings immediately
            console.log('2️⃣ Loading settings immediately...');
            const loadedSettings = await window.POKPOK.storage.loadSettings();
            console.log('📄 Loaded settings:', loadedSettings);
            
            // Test 3: Verify field population
            console.log('3️⃣ Testing field population...');
            if (loadedSettings) {
                const populateSuccess = autoPopulateFields(loadedSettings);
                console.log(populateSuccess ? '✅ Fields populated successfully' : '❌ Field population failed');
            }
            
            // Test 4: Test retry mechanism
            console.log('4️⃣ Testing enhanced loading with retry...');
            const enhancedSettings = await ensureSettingsLoaded();
            console.log('📄 Enhanced loaded settings:', enhancedSettings);
            
            console.log('🎉 Settings persistence test completed successfully!');
            
        } catch (error) {
            console.error('❌ Settings persistence test failed:', error);
        } finally {
            console.groupEnd();
        }
    }

    // Public API - simplified to orchestration functions
    return {
        initialize: initialize,
        loadSettings: loadSettings,
        ensureSettingsLoaded: ensureSettingsLoaded,
        saveSettings: saveSettings,
        validateAndMigrateSettings: validateAndMigrateSettings,
        showNotification: showNotification
    };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.Settings.initialize);
} else {
    window.Settings.initialize();
}