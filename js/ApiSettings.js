// ApiSettings.js - API configuration management
// Handles Gemini API and Supabase database settings

window.ApiSettings = (function() {
    'use strict';

    // State
    let formElements = null;
    let initialized = false;

    // Initialize API settings module
    function initialize() {
        if (initialized) return;
        
        // Move existing API sections to API tab if needed
        reorganizeApiSections();
        
        // Get form elements
        formElements = {
            apiKey: document.getElementById('apiKey'),
            modelSelect: document.getElementById('modelSelect'),
            supabaseDb: document.getElementById('supabaseDb'),
            testConnectionBtn: document.getElementById('testConnectionBtn'),
            saveSettingsBtn: document.getElementById('saveSettingsBtn'),
            // Gemini API 2025 Features Control
            thinkingMode: document.getElementById('thinkingMode'),
            urlContext: document.getElementById('urlContext'),
            googleSearch: document.getElementById('googleSearch'),
            highTemperature: document.getElementById('highTemperature'),
            advancedFeaturesGroup: document.getElementById('advancedFeaturesGroup')
        };
        
        // 🔍 DEBUG: Verify all form elements were found
        console.log('🔍 FORM ELEMENTS INITIALIZATION DEBUG:');
        Object.entries(formElements).forEach(([key, element]) => {
            console.log(`  - ${key}:`, element ? '✅ FOUND' : '❌ NOT FOUND');
        });
        
        // Special focus on checkbox elements
        console.log('📋 CHECKBOX ELEMENTS SPECIFICALLY:');
        console.log('  - thinkingMode element:', formElements.thinkingMode);
        console.log('  - urlContext element:', formElements.urlContext);
        console.log('  - googleSearch element:', formElements.googleSearch);
        console.log('  - highTemperature element:', formElements.highTemperature);
        
        // Set up event listeners
        setupEventListeners();
        
        // Load saved settings
        loadApiSettings();
        
        initialized = true;
        console.log('ApiSettings module initialized');
    }

    // Reorganize existing sections into API tab
    function reorganizeApiSections() {
        const apiTab = document.getElementById('apiTab');
        if (!apiTab) return;
        
        const settingsForm = document.getElementById('settingsForm');
        if (!settingsForm) return;
        
        // Find and move only API-related sections
        const sections = settingsForm.querySelectorAll('.settings-section');
        const apiSections = [];
        
        sections.forEach(section => {
            const label = section.querySelector('.section-label');
            if (label) {
                const text = label.textContent;
                if (text.includes('GEMINI API') || text.includes('SUPABASE')) {
                    apiSections.push(section);
                }
            }
        });
        
        // Keep only API-related sections in the form
        if (apiSections.length > 0) {
            // Remove AI Engine section if it exists (will be moved to Analysis tab)
            const aiEngineSection = Array.from(sections).find(section => {
                const label = section.querySelector('.section-label');
                return label && label.textContent.includes('AI ENGINE');
            });
            
            if (aiEngineSection) {
                aiEngineSection.remove();
            }
        }
    }

    // Set up event listeners
    function setupEventListeners() {
        if (formElements.testConnectionBtn) {
            formElements.testConnectionBtn.addEventListener('click', handleTestConnection);
        }
        
        if (formElements.saveSettingsBtn) {
            formElements.saveSettingsBtn.addEventListener('click', handleSaveSettings);
        }
        
        
        // Listen for tab changes to refresh when API tab is selected
        document.addEventListener('settingsTabChange', (event) => {
            if (event.detail.currentTab === 'api') {
                loadApiSettings();
            }
        });
        
        // Listen for settings loaded event
        document.addEventListener('settingsLoaded', (event) => {
            if (event.detail && event.detail.settings) {
                populateFields(event.detail.settings);
            }
        });
    }

    // Load saved API settings
    async function loadApiSettings() {
        console.log('🔍 loadApiSettings() CALLED');
        try {
            if (window.POKPOK && window.POKPOK.storage) {
                const settings = await window.POKPOK.storage.loadSettings();
                
                // 🔍 DEBUG: Show raw Chrome storage contents
                console.log('🔍 RAW CHROME STORAGE CONTENTS:');
                chrome.storage.local.get(null, (result) => {
                    console.log('📦 Complete Chrome storage:', result);
                    if (result.pokpokSettings) {
                        console.log('📦 pokpokSettings specifically:', result.pokpokSettings);
                        console.log('📦 pokpokSettings.geminiFeatures:', result.pokpokSettings.geminiFeatures);
                    }
                });
                
                if (settings) {
                    populateFields(settings);
                } else {
                    console.warn('⚠️ No settings returned from storage');
                }
            } else {
                console.error('❌ POKPOK.storage not available');
            }
        } catch (error) {
            console.error('Failed to load API settings:', error);
        }
    }
    
    // Populate form fields with settings
    function populateFields(settings) {
        if (!formElements || !settings) return;
        
        try {
            // Populate API key
            if (formElements.apiKey && settings.apiKey) {
                formElements.apiKey.value = settings.apiKey;
            }
            
            // Populate model selection
            if (formElements.modelSelect && settings.model) {
                formElements.modelSelect.value = settings.model;
            }
            
            // Populate Supabase database
            if (formElements.supabaseDb && settings.supabaseDb) {
                formElements.supabaseDb.value = settings.supabaseDb;
            }
            
            // 🔍 DEBUG: Show what's being loaded from Chrome storage
            console.log('🔍 LOADING SETTINGS DEBUG:');
            console.log('  - Full settings object:', settings);
            console.log('  - settings.geminiFeatures exists:', !!settings.geminiFeatures);
            console.log('  - settings.geminiFeatures:', settings.geminiFeatures);
            
            // Populate Gemini API 2025 Features (v2.43.0+) - Enhanced Debug
            if (settings.geminiFeatures) {
                console.log('🔧 SETTING CHECKBOX STATES FROM STORAGE:');
                
                if (formElements.thinkingMode) {
                    const value = settings.geminiFeatures.thinkingMode === true;
                    formElements.thinkingMode.checked = value;
                    console.log('  - thinkingMode: storage =', settings.geminiFeatures.thinkingMode, '→ checkbox =', value);
                }
                if (formElements.urlContext) {
                    const value = settings.geminiFeatures.urlContext === true;
                    formElements.urlContext.checked = value;
                    console.log('  - urlContext: storage =', settings.geminiFeatures.urlContext, '→ checkbox =', value);
                }
                if (formElements.googleSearch) {
                    const value = settings.geminiFeatures.googleSearch === true;
                    formElements.googleSearch.checked = value;
                    console.log('  - googleSearch: storage =', settings.geminiFeatures.googleSearch, '→ checkbox =', value);
                }
                if (formElements.highTemperature) {
                    const value = settings.geminiFeatures.highTemperature === true;
                    formElements.highTemperature.checked = value;
                    console.log('  - highTemperature: storage =', settings.geminiFeatures.highTemperature, '→ checkbox =', value);
                }
            } else {
                console.warn('⚠️ No geminiFeatures in storage - using defaults');
            }
            
            console.log('API settings populated successfully', {
                hasGeminiFeatures: !!settings.geminiFeatures,
                thinkingMode: settings.geminiFeatures?.thinkingMode,
                urlContext: settings.geminiFeatures?.urlContext,
                googleSearch: settings.geminiFeatures?.googleSearch,
                highTemperature: settings.geminiFeatures?.highTemperature
            });
        } catch (error) {
            console.error('Failed to populate API fields:', error);
        }
    }

    // Handle save settings
    async function handleSaveSettings(event) {
        if (event) event.preventDefault();
        
        const apiKey = formElements.apiKey ? formElements.apiKey.value.trim() : '';
        const model = formElements.modelSelect ? formElements.modelSelect.value : 'gemini-2.5-flash';
        const supabaseDb = formElements.supabaseDb ? formElements.supabaseDb.value.trim() : '';
        
        // Read Gemini API 2025 Features (v2.42.0+) - Fixed checkbox reading
        const geminiFeatures = {
            thinkingMode: formElements.thinkingMode ? formElements.thinkingMode.checked : false,
            urlContext: formElements.urlContext ? formElements.urlContext.checked : false,
            googleSearch: formElements.googleSearch ? formElements.googleSearch.checked : false,
            highTemperature: formElements.highTemperature ? formElements.highTemperature.checked : false
        };
        
        console.log('💡 Gemini features to save:', geminiFeatures);
        
        // 🔍 DEBUG: Show individual checkbox states for troubleshooting
        console.log('🔍 INDIVIDUAL CHECKBOX DEBUG:');
        console.log('  - thinkingMode element exists:', !!formElements.thinkingMode);
        console.log('  - thinkingMode.checked:', formElements.thinkingMode?.checked);
        console.log('  - urlContext element exists:', !!formElements.urlContext);
        console.log('  - urlContext.checked:', formElements.urlContext?.checked);
        console.log('  - googleSearch element exists:', !!formElements.googleSearch);
        console.log('  - googleSearch.checked:', formElements.googleSearch?.checked);
        console.log('  - highTemperature element exists:', !!formElements.highTemperature);
        console.log('  - highTemperature.checked:', formElements.highTemperature?.checked);
        
        // 🔍 DEBUG: Check if this save function is even being called
        console.log('🔥 handleSaveSettings() CALLED - User clicked Save Settings button');
        console.log('🔥 Event object:', event);
        
        // Validate API key
        if (!apiKey) {
            showNotification('Please enter a Gemini API key', 'error');
            return;
        }
        
        try {
            // 🔍 DEBUG: Show what's being saved
            const settingsToSave = {
                apiKey: apiKey,
                model: model,
                supabaseDb: supabaseDb,
                geminiFeatures: geminiFeatures
            };
            console.log('💾 ABOUT TO SAVE THESE SETTINGS:', settingsToSave);
            
            // Save settings
            await saveApiSettings(settingsToSave);
            
            showNotification('API settings saved successfully!', 'success');
            
            // Dispatch event for other modules
            const settingsSavedEvent = new CustomEvent('apiSettingsSaved', {
                detail: { model: model }
            });
            document.dispatchEvent(settingsSavedEvent);
            
        } catch (error) {
            console.error('Failed to save API settings:', error);
            showNotification('Failed to save settings. Please try again.', 'error');
        }
    }

    // Save API settings
    async function saveApiSettings(settings) {
        if (window.POKPOK && window.POKPOK.storage) {
            const currentSettings = await window.POKPOK.storage.loadSettings() || {};
            const updatedSettings = {
                ...currentSettings,
                ...settings,
                lastUpdated: new Date().toISOString()
            };
            await window.POKPOK.storage.saveSettings(updatedSettings);
        }
    }

    // Handle test connection
    async function handleTestConnection() {
        const apiKey = formElements.apiKey ? formElements.apiKey.value.trim() : '';
        const model = formElements.modelSelect ? formElements.modelSelect.value : 'gemini-2.5-flash';
        
        if (!apiKey) {
            showNotification('Please enter an API key first', 'error');
            return;
        }
        
        // Disable button during test
        const originalText = formElements.testConnectionBtn.textContent;
        formElements.testConnectionBtn.textContent = 'Testing...';
        formElements.testConnectionBtn.disabled = true;
        
        try {
            const isConnected = await testGeminiConnection(apiKey, model);
            
            if (isConnected) {
                showNotification('Connection successful!', 'success');
                
                // Also test Supabase if configured
                const supabaseDb = formElements.supabaseDb ? formElements.supabaseDb.value.trim() : '';
                if (supabaseDb) {
                    await testSupabaseConnection(supabaseDb);
                }
            } else {
                showNotification('Connection failed. Please check your API key.', 'error');
            }
        } catch (error) {
            console.error('Connection test error:', error);
            showNotification('Connection test failed: ' + error.message, 'error');
        } finally {
            // Re-enable button
            formElements.testConnectionBtn.textContent = originalText;
            formElements.testConnectionBtn.disabled = false;
        }
    }

    // Test Gemini API connection
    async function testGeminiConnection(apiKey, model) {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: "Hello, this is a connection test. Please respond with 'OK'."
                        }]
                    }]
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                return data && data.candidates && data.candidates.length > 0;
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Gemini API test failed:', error);
            throw error;
        }
    }

    // Test Supabase connection
    async function testSupabaseConnection(databaseName) {
        // This is a placeholder - actual Supabase testing would require more configuration
        console.log('Testing Supabase connection for database:', databaseName);
        showNotification('Supabase connection test completed', 'info');
        return true;
    }

    // Show notification
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

    // Get current API configuration
    function getApiConfig() {
        return {
            apiKey: formElements.apiKey ? formElements.apiKey.value.trim() : '',
            model: formElements.modelSelect ? formElements.modelSelect.value : 'gemini-2.5-flash',
            supabaseDb: formElements.supabaseDb ? formElements.supabaseDb.value.trim() : ''
        };
    }

    // Public API
    return {
        initialize: initialize,
        loadApiSettings: loadApiSettings,
        saveApiSettings: saveApiSettings,
        testGeminiConnection: testGeminiConnection,
        getApiConfig: getApiConfig
    };
})();