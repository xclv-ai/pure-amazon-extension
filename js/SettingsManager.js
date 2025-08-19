/**
 * POKPOK.AI Chrome Extension v2.39.0
 * File: js/SettingsManager.js
 * Purpose: Settings coordination, Chrome storage management, and startup initialization
 * 
 * CRITICAL COMPONENT: This module handles global settings state management and is responsible
 * for preserving user preferences across extension sessions. Any changes to this file
 * can affect settings persistence throughout the entire extension.
 * 
 * Key Features:
 * - Settings loading and saving coordination across all modules
 * - Chrome storage API management and error handling
 * - Module dependency management and availability checking
 * - Settings validation and default value handling
 * - Startup initialization sequence coordination
 * - Settings persistence across browser sessions
 * 
 * Dependencies:
 * - Settings.js: Core settings management module
 * - Chrome storage API: Local storage for persistence
 * - All settings modules: ApiSettings, AnalysisSettings, WhiteLabelSettings
 * 
 * Exposes:
 * - window.SettingsManager.loadSettingsOnStartup()
 * - window.SettingsManager.waitForModule()
 * - window.SettingsManager.ensureSettingsLoaded()
 * - window.SettingsManager.getGlobalSettings()
 * - window.SettingsManager.updateGlobalSettings()
 * - window.SettingsManager.validateSettings()
 * 
 * Integration Points:
 * - Original analysis.js: loadSettingsOnStartup(), waitForModule()
 * - GeminiAnalysisService.js: Settings access for API configuration
 * - AnalysisSettings.js: Engine selection persistence
 * - ApiSettings.js: API key and model configuration
 * - event-handlers.js: Settings loading on startup
 * 
 * Settings Flow:
 * 1. Wait for Settings module to be available
 * 2. Load saved settings from Chrome storage
 * 3. Validate and apply default values
 * 4. Store settings globally for module access
 * 5. Coordinate settings updates across modules
 * 
 * Global Variables Managed:
 * - window.pokpokSettings: Global settings object
 * - Module availability flags and health checks
 * 
 * Preserved Functionality:
 * - Exact startup sequence from original analysis.js
 * - Module dependency waiting with timeout
 * - Settings loading with enhanced reliability
 * - Global settings storage for cross-module access
 * - Error handling and fallback mechanisms
 * 
 * Enhanced Features:
 * - Better error handling for module loading failures
 * - Settings validation and sanitization
 * - Module health checking and recovery
 * - Enhanced logging for debugging
 * 
 * Last Updated: August 2024
 */

window.SettingsManager = (function() {
    'use strict';

    // Configuration
    const MODULE_WAIT_TIMEOUT = 10000; // 10 seconds
    const SETTINGS_LOAD_RETRY = 3;
    const RETRY_DELAY = 1000; // 1 second

    // State management
    let settingsLoaded = false;
    let globalSettings = null;
    let moduleHealthMap = new Map();

    // Initialize settings manager
    function initialize() {
        console.log('SettingsManager module initialized');
    }

    // Load settings on startup with enhanced reliability (preserved exactly from original)
    async function loadSettingsOnStartup() {
        try {
            console.log('Loading settings on startup...');
            
            // Wait for Settings module to be available
            await waitForModule('Settings', 5000);
            
            if (typeof window.Settings !== 'undefined' && window.Settings.ensureSettingsLoaded) {
                const settings = await window.Settings.ensureSettingsLoaded();
                if (settings) {
                    console.log('Settings loaded on startup:', {
                        version: settings.version,
                        model: settings.model,
                        hasApiKey: !!settings.apiKey,
                        supabaseDb: settings.supabaseDb
                    });
                    
                    // Store settings globally for use in other modules
                    window.pokpokSettings = settings;
                    globalSettings = settings;
                    settingsLoaded = true;
                    
                    // Validate and apply defaults
                    const validatedSettings = validateSettings(settings);
                    if (validatedSettings !== settings) {
                        await updateGlobalSettings(validatedSettings);
                    }
                    
                    // Notify modules that settings are loaded
                    notifyModulesSettingsLoaded(settings);
                    
                } else {
                    console.log('No saved settings found on startup');
                    
                    // Create default settings
                    const defaultSettings = getDefaultSettings();
                    await updateGlobalSettings(defaultSettings);
                }
            } else {
                console.warn('Settings module not available, falling back to direct storage access');
                
                // Fallback to direct storage access
                if (typeof window.POKPOK !== 'undefined' && window.POKPOK.storage) {
                    const settings = await window.POKPOK.storage.loadSettings();
                    if (settings) {
                        window.pokpokSettings = settings;
                        globalSettings = settings;
                        settingsLoaded = true;
                        console.log('Settings loaded via fallback method');
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load settings on startup:', error);
            
            // Create emergency default settings to prevent extension breakage
            try {
                const emergencySettings = getDefaultSettings();
                window.pokpokSettings = emergencySettings;
                globalSettings = emergencySettings;
                settingsLoaded = true;
                console.log('Emergency default settings applied');
            } catch (emergencyError) {
                console.error('Failed to apply emergency settings:', emergencyError);
                // Don't throw - extension should still work without saved settings
            }
        }
    }

    // Wait for a module to be available (preserved exactly from original)
    async function waitForModule(moduleName, timeout = MODULE_WAIT_TIMEOUT) {
        const start = Date.now();
        
        console.log(`⏳ Waiting for module: ${moduleName} (timeout: ${timeout}ms)`);
        
        while (Date.now() - start < timeout) {
            if (typeof window[moduleName] !== 'undefined') {
                console.log(`✅ Module available: ${moduleName}`);
                
                // Update health map
                moduleHealthMap.set(moduleName, {
                    available: true,
                    lastCheck: Date.now(),
                    loadTime: Date.now() - start
                });
                
                return window[moduleName];
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.error(`❌ Module timeout: ${moduleName} not available after ${timeout}ms`);
        
        // Update health map
        moduleHealthMap.set(moduleName, {
            available: false,
            lastCheck: Date.now(),
            error: 'Timeout'
        });
        
        throw new Error(`Module ${moduleName} not available after ${timeout}ms`);
    }

    // Ensure settings are loaded with retry logic
    async function ensureSettingsLoaded(retryCount = 0) {
        if (settingsLoaded && globalSettings) {
            return globalSettings;
        }
        
        try {
            await loadSettingsOnStartup();
            return globalSettings;
        } catch (error) {
            if (retryCount < SETTINGS_LOAD_RETRY) {
                console.log(`🔄 Retrying settings load (attempt ${retryCount + 1}/${SETTINGS_LOAD_RETRY})...`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                return ensureSettingsLoaded(retryCount + 1);
            } else {
                console.error('❌ Failed to load settings after all retries:', error);
                throw error;
            }
        }
    }

    // Get current global settings
    function getGlobalSettings() {
        if (!settingsLoaded) {
            console.warn('⚠️ Settings not loaded, returning defaults');
            return getDefaultSettings();
        }
        return globalSettings;
    }

    // Update global settings with coordination
    async function updateGlobalSettings(newSettings) {
        try {
            // Validate settings first
            const validatedSettings = validateSettings(newSettings);
            
            // Update global state
            globalSettings = validatedSettings;
            window.pokpokSettings = validatedSettings;
            settingsLoaded = true;
            
            // Save to storage through Settings module
            if (typeof window.Settings !== 'undefined' && window.Settings.saveSettings) {
                await window.Settings.saveSettings(validatedSettings);
            } else if (window.POKPOK && window.POKPOK.storage) {
                await window.POKPOK.storage.saveSettings(validatedSettings);
            }
            
            // Notify modules of settings update
            notifyModulesSettingsUpdated(validatedSettings);
            
            console.log('✅ Global settings updated successfully');
            return validatedSettings;
        } catch (error) {
            console.error('❌ Failed to update global settings:', error);
            throw error;
        }
    }

    // Validate settings and apply defaults
    function validateSettings(settings) {
        console.log('🔧 SettingsManager.validateSettings called with:', settings);
        console.log('🔧 Input settings keys:', Object.keys(settings || {}));
        console.log('🔧 Input whiteLabelBrand:', settings?.whiteLabelBrand);
        
        if (!settings || typeof settings !== 'object') {
            console.log('🔧 No valid settings, returning defaults');
            return getDefaultSettings();
        }
        
        const defaults = getDefaultSettings();
        const validated = { ...defaults };
        console.log('🔧 Defaults keys:', Object.keys(defaults));
        
        // Validate and apply user settings from defaults
        Object.keys(defaults).forEach(key => {
            if (settings.hasOwnProperty(key)) {
                // Type validation
                if (typeof settings[key] === typeof defaults[key]) {
                    validated[key] = settings[key];
                } else {
                    console.warn(`⚠️ Invalid type for setting ${key}, using default`);
                }
            }
        });
        
        // ✅ CRITICAL FIX: Also preserve additional fields not in defaults
        // This ensures saved fields like whiteLabelBrand don't get filtered out
        Object.keys(settings).forEach(key => {
            if (!defaults.hasOwnProperty(key)) {
                console.log(`🔧 Preserving additional setting: ${key}=${settings[key]}`);
                validated[key] = settings[key];
            }
        });
        
        // Special validation for specific settings
        if (settings.model && typeof settings.model === 'string') {
            const validModels = ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];
            if (validModels.includes(settings.model)) {
                validated.model = settings.model;
            }
        }
        
        if (settings.aiEngine && typeof settings.aiEngine === 'string') {
            const validEngines = ['local', 'cloud'];
            if (validEngines.includes(settings.aiEngine)) {
                validated.aiEngine = settings.aiEngine;
            }
        }
        
        console.log('🔧 Final validated settings keys:', Object.keys(validated));
        console.log('🔧 Final whiteLabelBrand:', validated.whiteLabelBrand);
        console.log('🔧 Settings validation completed');
        
        return validated;
    }

    // Get default settings structure
    // 🚨 CRITICAL: This function defines the core settings schema. 
    // Any field removed from here will be filtered out during validation!
    function getDefaultSettings() {
        return {
            version: '2.28.0',                    // Settings schema version
            aiEngine: 'local',                    // Analysis engine: 'local' or 'cloud'
            model: 'gemini-2.5-flash',            // AI model selection
            apiKey: '',                           // Encrypted Gemini API key
            supabaseDb: '',                       // Database connection string
            autoAnalyze: false,                   // Auto-analyze content on load
            deepAnalysis: false,                  // Enable deep analysis features
            saveHistory: false,                   // Save analysis history
            whiteLabelName: 'POKPOK.AI',         // Brand display name
            whiteLabelColors: {                   // Brand color scheme
                primary: '#f6f951',               // Yellow accent
                secondary: '#04252b',             // Dark teal
                accent: '#f1c7d6'                 // Rose accent
            },
            whiteLabelBrand: 'pokpok'             // ✅ CRITICAL: Brand selection ('pokpok' | 'dr')
                                                  // ADDED v2.39.0 - Missing this field caused brand persistence bug
        };
    }

    // Notify modules that settings are loaded
    function notifyModulesSettingsLoaded(settings) {
        const event = new CustomEvent('settingsLoaded', {
            detail: { settings: settings }
        });
        document.dispatchEvent(event);
        
        console.log('📢 Settings loaded event dispatched to modules');
    }

    // Notify modules that settings are updated
    function notifyModulesSettingsUpdated(settings) {
        const event = new CustomEvent('settingsUpdated', {
            detail: { settings: settings }
        });
        document.dispatchEvent(event);
        
        console.log('📢 Settings updated event dispatched to modules');
    }

    // Check module health
    function checkModuleHealth(moduleName) {
        const health = moduleHealthMap.get(moduleName);
        if (!health) {
            return {
                available: false,
                status: 'unknown',
                message: 'Module not checked'
            };
        }
        
        const age = Date.now() - health.lastCheck;
        const isStale = age > 60000; // 1 minute
        
        return {
            available: health.available,
            status: health.available ? (isStale ? 'stale' : 'healthy') : 'error',
            lastCheck: health.lastCheck,
            age: age,
            loadTime: health.loadTime,
            error: health.error,
            message: health.available 
                ? `Module loaded in ${health.loadTime}ms` 
                : `Module failed: ${health.error || 'Unknown error'}`
        };
    }

    // Get system health report
    function getSystemHealth() {
        const modules = [
            'Settings', 'BasicAnalysis', 'GeminiAnalysisService',
            'AnalysisSettings', 'ApiSettings', 'UIController',
            'DataProcessor', 'ContentHandler'
        ];
        
        const health = {
            settingsLoaded: settingsLoaded,
            globalSettingsAvailable: !!globalSettings,
            modules: {}
        };
        
        modules.forEach(moduleName => {
            health.modules[moduleName] = checkModuleHealth(moduleName);
        });
        
        return health;
    }

    // Emergency recovery - reset to defaults
    async function emergencyReset() {
        console.log('🚨 Emergency settings reset initiated');
        
        try {
            const defaultSettings = getDefaultSettings();
            await updateGlobalSettings(defaultSettings);
            console.log('✅ Emergency reset completed successfully');
            return true;
        } catch (error) {
            console.error('❌ Emergency reset failed:', error);
            return false;
        }
    }

    // Public API - exactly matching original functionality with enhancements
    return {
        initialize: initialize,
        loadSettingsOnStartup: loadSettingsOnStartup,
        waitForModule: waitForModule,
        ensureSettingsLoaded: ensureSettingsLoaded,
        getGlobalSettings: getGlobalSettings,
        updateGlobalSettings: updateGlobalSettings,
        validateSettings: validateSettings,
        checkModuleHealth: checkModuleHealth,
        getSystemHealth: getSystemHealth,
        emergencyReset: emergencyReset
    };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.SettingsManager.initialize);
} else {
    window.SettingsManager.initialize();
}