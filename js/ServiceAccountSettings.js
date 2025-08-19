/**
 * POKPOK.AI Chrome Extension
 * File: js/ServiceAccountSettings.js
 * Purpose: Secure service account settings management for Google Drive integration
 * 
 * SECURITY NOTICE:
 * This module handles the UI for service account credential input and validation.
 * All credentials are immediately encrypted before storage.
 */

window.ServiceAccountSettings = (function() {
    'use strict';

    // Update service account status display
    function updateStatus(message, isSuccess = true) {
        const statusElement = document.getElementById('serviceAccountStatus');
        const statusText = statusElement.querySelector('.status-text');
        const statusIndicator = statusElement.querySelector('.status-indicator');
        
        if (statusElement && statusText && statusIndicator) {
            statusText.textContent = message;
            statusIndicator.style.backgroundColor = isSuccess ? '#28a745' : '#dc3545';
            statusElement.style.display = 'block';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 5000);
        }
    }

    // Validate service account JSON
    function validateServiceAccountJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            
            // Required fields for Google service account
            const requiredFields = ['type', 'project_id', 'private_key', 'client_email'];
            const missingFields = requiredFields.filter(field => !data[field]);
            
            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }
            
            if (data.type !== 'service_account') {
                throw new Error('Invalid service account type');
            }
            
            if (!data.private_key.includes('BEGIN PRIVATE KEY')) {
                throw new Error('Invalid private key format');
            }
            
            if (!data.client_email.includes('@') || !data.client_email.includes('.iam.gserviceaccount.com')) {
                throw new Error('Invalid service account email format');
            }
            
            return data;
        } catch (error) {
            throw new Error(`Invalid JSON: ${error.message}`);
        }
    }

    // Save service account credentials
    async function saveServiceAccount() {
        const textarea = document.getElementById('serviceAccountKey');
        const jsonInput = textarea.value.trim();
        
        if (!jsonInput) {
            updateStatus('Please paste your service account JSON', false);
            return;
        }

        try {
            updateStatus('Validating service account...', true);
            
            // Validate JSON format
            const serviceAccountData = validateServiceAccountJSON(jsonInput);
            
            updateStatus('Encrypting and storing credentials...', true);
            
            // Store encrypted credentials
            await window.SecureStorage.storeServiceAccountKey(serviceAccountData);
            
            // Clear textarea for security
            textarea.value = '';
            textarea.placeholder = 'Service account credentials stored securely ✅\n\nTo update, paste new JSON and save again.';
            
            updateStatus(`✅ Service account stored: ${serviceAccountData.client_email}`, true);
            
            console.log('🔐 Service account credentials saved securely');
            
            // Enable test button
            const testButton = document.getElementById('testDriveConnectionBtn');
            if (testButton) {
                testButton.disabled = false;
            }
            
        } catch (error) {
            console.error('❌ Failed to save service account:', error);
            updateStatus(`❌ ${error.message}`, false);
        }
    }

    // Test Google Drive connection
    async function testDriveConnection() {
        try {
            updateStatus('Testing Google Drive connection...', true);
            
            // Get stored credentials
            const serviceAccountData = await window.SecureStorage.getServiceAccountKey();
            if (!serviceAccountData) {
                updateStatus('❌ No service account configured', false);
                return;
            }
            
            // Generate access token
            const tokenData = await window.JWTGenerator.getCachedAccessToken(serviceAccountData);
            
            // Test Shared Drive access
            const response = await fetch('https://www.googleapis.com/drive/v3/about?fields=user&supportsAllDrives=true', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${tokenData.access_token}`
                }
            });
            
            if (response.ok) {
                const userData = await response.json();
                updateStatus(`✅ Connected as: ${serviceAccountData.client_email}`, true);
                console.log('✅ Google Drive API test successful');
            } else {
                const error = await response.text();
                console.error('❌ Drive API test failed:', response.status, error);
                updateStatus(`❌ Connection failed: ${response.status}`, false);
            }
            
        } catch (error) {
            console.error('❌ Drive connection test failed:', error);
            updateStatus(`❌ Test failed: ${error.message}`, false);
        }
    }

    // Clear stored service account
    async function clearServiceAccount() {
        if (!confirm('⚠️ Are you sure you want to clear the stored service account credentials?')) {
            return;
        }
        
        try {
            await window.SecureStorage.clearServiceAccountKey();
            
            // Reset UI
            const textarea = document.getElementById('serviceAccountKey');
            if (textarea) {
                textarea.value = '';
                textarea.placeholder = 'Paste your service account JSON here:\n{\n  "type": "service_account",\n  "project_id": "your-project",\n  ...';
            }
            
            // Disable test button
            const testButton = document.getElementById('testDriveConnectionBtn');
            if (testButton) {
                testButton.disabled = true;
            }
            
            // Clear token cache
            window.JWTGenerator.clearTokenCache();
            
            updateStatus('🗑️ Service account credentials cleared', true);
            
        } catch (error) {
            console.error('❌ Failed to clear service account:', error);
            updateStatus(`❌ Clear failed: ${error.message}`, false);
        }
    }

    // Load existing credentials on startup
    async function loadExistingCredentials() {
        try {
            const hasCredentials = await window.SecureStorage.hasServiceAccountKey();
            if (hasCredentials) {
                const textarea = document.getElementById('serviceAccountKey');
                const testButton = document.getElementById('testDriveConnectionBtn');
                
                if (textarea) {
                    textarea.placeholder = 'Service account credentials stored securely ✅\n\nTo update, paste new JSON and save again.';
                }
                
                if (testButton) {
                    testButton.disabled = false;
                }
                
                updateStatus('📁 Service account credentials loaded from secure storage', true);
            }
        } catch (error) {
            console.error('❌ Failed to load existing credentials:', error);
        }
    }

    // Initialize event handlers
    function initializeEventHandlers() {
        // Test connection button
        const testButton = document.getElementById('testDriveConnectionBtn');
        if (testButton) {
            testButton.addEventListener('click', testDriveConnection);
            testButton.disabled = true; // Disabled until credentials are saved
        }
        
        // Clear credentials button
        const clearButton = document.getElementById('clearServiceAccountBtn');
        if (clearButton) {
            clearButton.addEventListener('click', clearServiceAccount);
        }
        
        // Auto-save on textarea blur (when user finishes pasting)
        const textarea = document.getElementById('serviceAccountKey');
        if (textarea) {
            textarea.addEventListener('blur', () => {
                if (textarea.value.trim()) {
                    saveServiceAccount();
                }
            });
        }
    }

    // Public API
    return {
        saveServiceAccount: saveServiceAccount,
        testDriveConnection: testDriveConnection,
        clearServiceAccount: clearServiceAccount,
        loadExistingCredentials: loadExistingCredentials,
        initializeEventHandlers: initializeEventHandlers
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (window.ServiceAccountSettings) {
        window.ServiceAccountSettings.initializeEventHandlers();
        window.ServiceAccountSettings.loadExistingCredentials();
    }
});

console.log('⚙️ ServiceAccountSettings module loaded - secure credential management ready');