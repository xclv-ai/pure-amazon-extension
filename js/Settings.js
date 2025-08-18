// Settings.js - Settings management module
// Handles form management, validation, and settings persistence

window.Settings = (function() {
    'use strict';

    // Settings form elements
    let formElements = null;
    let loadingIndicator = null;

    // Initialize settings module
    function initialize() {
        // Get form elements
        formElements = {
            form: document.getElementById('settingsForm'),
            apiKey: document.getElementById('apiKey'),
            modelSelect: document.getElementById('modelSelect'),
            supabaseDb: document.getElementById('supabaseDb'),
            testConnectionBtn: document.getElementById('testConnectionBtn'),
            saveSettingsBtn: document.getElementById('saveSettingsBtn')
        };

        // Get loading indicator
        loadingIndicator = document.getElementById('settingsLoading');

        // Set up event listeners
        if (formElements.form) {
            formElements.form.addEventListener('submit', handleFormSubmit);
        }

        if (formElements.testConnectionBtn) {
            formElements.testConnectionBtn.addEventListener('click', handleTestConnection);
        }

        console.log('Settings module initialized');
    }

    // Handle form submission
    async function handleFormSubmit(event) {
        event.preventDefault();
        
        const apiKey = formElements.apiKey.value.trim();
        const model = formElements.modelSelect.value;
        const supabaseDb = formElements.supabaseDb.value.trim();

        // Validate inputs
        if (!apiKey) {
            showNotification('Please enter a Gemini API key', 'error');
            return;
        }

        if (!model) {
            showNotification('Please select a model', 'error');
            return;
        }

        try {
            // Save settings securely
            await saveSettings({
                apiKey: apiKey,
                model: model,
                supabaseDb: supabaseDb
            });

            showNotification('Settings saved successfully!', 'success');
        } catch (error) {
            console.error('Failed to save settings:', error);
            showNotification('Failed to save settings. Please try again.', 'error');
        }
    }

    // Handle test connection
    async function handleTestConnection() {
        const apiKey = formElements.apiKey.value.trim();
        const model = formElements.modelSelect.value;

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
            } else {
                showNotification('Connection failed. Please check your API key and try again.', 'error');
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
        const apiUrl = getGeminiApiUrl(model);
        
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
                            text: "Hello, this is a connection test. Please respond with 'OK' if you receive this message."
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

    // Get Gemini API URL for model
    function getGeminiApiUrl(model) {
        const baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
        return `${baseUrl}/${model}:generateContent`;
    }

    // Save settings securely
    async function saveSettings(settings) {
        if (typeof window.POKPOK === 'undefined' || !window.POKPOK.storage) {
            throw new Error('Chrome storage API not available');
        }

        await window.POKPOK.storage.saveSettings(settings);
    }

    // Load settings from storage with enhanced reliability
    async function loadSettings() {
        return await ensureSettingsLoaded();
    }

    // Enhanced settings loading with retry mechanism
    async function ensureSettingsLoaded(maxRetries = 3) {
        // Show loading indicator
        showLoadingIndicator();
        
        try {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    console.log(`Settings load attempt ${attempt}/${maxRetries}`);
                    
                    // Check if POKPOK API is available
                    if (typeof window.POKPOK === 'undefined' || !window.POKPOK.storage) {
                        if (attempt < maxRetries) {
                            console.warn(`Chrome storage API not available on attempt ${attempt}, retrying...`);
                            await delay(500 * attempt); // Progressive delay
                            continue;
                        } else {
                            throw new Error('Chrome storage API not available after all retries');
                        }
                    }

                    // Load settings from storage
                    const settings = await window.POKPOK.storage.loadSettings();
                    
                    if (settings) {
                        // Validate and migrate settings if needed
                        const validatedSettings = await validateAndMigrateSettings(settings);
                        
                        // Populate form fields
                        const success = autoPopulateFields(validatedSettings);
                        
                        if (success) {
                            console.log('Settings loaded and populated successfully:', {
                                hasApiKey: !!validatedSettings.apiKey,
                                model: validatedSettings.model,
                                supabaseDb: validatedSettings.supabaseDb
                            });
                            
                            showSettingsLoadedIndicator();
                            return validatedSettings;
                        } else if (attempt < maxRetries) {
                            console.warn(`Field population failed on attempt ${attempt}, retrying...`);
                            await delay(300 * attempt);
                            continue;
                        }
                    } else if (attempt === 1) {
                        console.log('No saved settings found');
                        return null;
                    }

                } catch (error) {
                    console.error(`Settings load attempt ${attempt} failed:`, error);
                    
                    if (attempt === maxRetries) {
                        showNotification('Failed to load saved settings. Please re-enter your configuration.', 'error');
                        throw error;
                    }
                    
                    await delay(500 * attempt);
                }
            }
            
            return null;
            
        } finally {
            // Always hide loading indicator
            hideLoadingIndicator();
        }
    }

    // Validate and migrate settings for version compatibility
    async function validateAndMigrateSettings(settings) {
        const currentVersion = '1.0';
        const settingsVersion = settings.version || '1.0';
        
        if (settingsVersion !== currentVersion) {
            console.log(`Migrating settings from v${settingsVersion} to v${currentVersion}`);
            // Future: Add migration logic here for different versions
        }
        
        // Ensure all expected fields exist with defaults
        const validatedSettings = {
            version: currentVersion,
            apiKey: settings.apiKey || '',
            model: settings.model || 'gemini-2.5-flash',
            supabaseDb: settings.supabaseDb || '',
            ...settings
        };
        
        return validatedSettings;
    }

    // Auto-populate form fields with guaranteed success
    function autoPopulateFields(settings, retryIfEmpty = true) {
        try {
            // Wait for form elements to be ready
            if (!formElements || !formElements.apiKey) {
                if (retryIfEmpty) {
                    console.warn('Form elements not ready, will retry...');
                    return false;
                }
                throw new Error('Form elements not available');
            }
            
            let fieldsPopulated = 0;
            
            // Populate API key
            if (formElements.apiKey && settings.apiKey) {
                formElements.apiKey.value = settings.apiKey;
                fieldsPopulated++;
            }
            
            // Populate model selection
            if (formElements.modelSelect && settings.model) {
                // Verify the model option exists in the select
                const option = formElements.modelSelect.querySelector(`option[value="${settings.model}"]`);
                if (option) {
                    formElements.modelSelect.value = settings.model;
                    fieldsPopulated++;
                } else {
                    console.warn(`Model ${settings.model} not found in options, using default`);
                    formElements.modelSelect.value = 'gemini-2.5-flash';
                }
            }
            
            // Populate Supabase database name
            if (formElements.supabaseDb && settings.supabaseDb) {
                formElements.supabaseDb.value = settings.supabaseDb;
                fieldsPopulated++;
            }
            
            console.log(`Successfully populated ${fieldsPopulated} form fields`);
            return true;
            
        } catch (error) {
            console.error('Failed to populate form fields:', error);
            return false;
        }
    }

    // Show visual indicator when settings are loaded
    function showSettingsLoadedIndicator() {
        showNotification('Settings loaded successfully', 'success');
    }

    // Show loading indicator
    function showLoadingIndicator() {
        if (loadingIndicator) {
            loadingIndicator.classList.remove('hidden');
        }
        if (formElements && formElements.form) {
            formElements.form.classList.add('loading');
        }
    }

    // Hide loading indicator
    function hideLoadingIndicator() {
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
        if (formElements && formElements.form) {
            formElements.form.classList.remove('loading');
            formElements.form.classList.add('loaded');
        }
    }

    // Utility function for delays
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Show notification to user
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

    // Public API
    return {
        initialize: initialize,
        loadSettings: loadSettings,
        ensureSettingsLoaded: ensureSettingsLoaded,
        saveSettings: saveSettings,
        testGeminiConnection: testGeminiConnection,
        autoPopulateFields: autoPopulateFields,
        validateAndMigrateSettings: validateAndMigrateSettings,
        debugSettingsPersistence: debugSettingsPersistence
    };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.Settings.initialize);
} else {
    window.Settings.initialize();
}