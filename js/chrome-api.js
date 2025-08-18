// chrome-api.js - Chrome extension API communication
// Basic Chrome extension setup

window.POKPOK = {
    sendMessage: (message) => {
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            return chrome.runtime.sendMessage(message);
        }
        return Promise.reject(new Error('Chrome runtime not available'));
    },
    
    getPageContent: async () => {
        try {
            const response = await chrome.runtime.sendMessage({ type: 'GET_PAGE_CONTENT' });
            return response;
        } catch (error) {
            console.error('Failed to get page content:', error);
            return { success: false, error: error.message };
        }
    },
    
    analyzeSelection: async () => {
        try {
            const response = await chrome.runtime.sendMessage({ type: 'ANALYZE_SELECTION' });
            return response;
        } catch (error) {
            console.error('Failed to analyze selection:', error);
            return { success: false, error: error.message };
        }
    },

    // Secure storage functionality
    storage: {
        // Generate or retrieve encryption key
        async getEncryptionKey() {
            if (typeof crypto === 'undefined' || !crypto.subtle) {
                throw new Error('Web Crypto API not available');
            }

            try {
                // Try to get existing key from storage
                const stored = await chrome.storage.local.get(['encryptionKey']);
                
                if (stored.encryptionKey) {
                    // Import stored key
                    const keyData = new Uint8Array(stored.encryptionKey);
                    return await crypto.subtle.importKey(
                        'raw',
                        keyData,
                        { name: 'AES-GCM', length: 256 },
                        false,
                        ['encrypt', 'decrypt']
                    );
                } else {
                    // Generate new key
                    const key = await crypto.subtle.generateKey(
                        { name: 'AES-GCM', length: 256 },
                        true,
                        ['encrypt', 'decrypt']
                    );
                    
                    // Export and store key
                    const keyData = await crypto.subtle.exportKey('raw', key);
                    await chrome.storage.local.set({ 
                        encryptionKey: Array.from(new Uint8Array(keyData)) 
                    });
                    
                    return key;
                }
            } catch (error) {
                console.error('Failed to get encryption key:', error);
                throw error;
            }
        },

        // Encrypt data
        async encrypt(data) {
            if (!data) return null;

            try {
                const key = await this.getEncryptionKey();
                const iv = crypto.getRandomValues(new Uint8Array(12));
                const encoded = new TextEncoder().encode(JSON.stringify(data));
                
                const encrypted = await crypto.subtle.encrypt(
                    { name: 'AES-GCM', iv: iv },
                    key,
                    encoded
                );

                return {
                    data: Array.from(new Uint8Array(encrypted)),
                    iv: Array.from(iv)
                };
            } catch (error) {
                console.error('Encryption failed:', error);
                throw error;
            }
        },

        // Decrypt data
        async decrypt(encryptedData) {
            if (!encryptedData || !encryptedData.data || !encryptedData.iv) {
                return null;
            }

            try {
                const key = await this.getEncryptionKey();
                const iv = new Uint8Array(encryptedData.iv);
                const data = new Uint8Array(encryptedData.data);

                const decrypted = await crypto.subtle.decrypt(
                    { name: 'AES-GCM', iv: iv },
                    key,
                    data
                );

                const decoded = new TextDecoder().decode(decrypted);
                return JSON.parse(decoded);
            } catch (error) {
                console.error('Decryption failed:', error);
                throw error;
            }
        },

        // Save settings securely with version tracking
        async saveSettings(settings) {
            if (typeof chrome === 'undefined' || !chrome.storage) {
                throw new Error('Chrome storage API not available');
            }

            try {
                // Add version and timestamp to settings
                const currentVersion = '1.0';
                const settingsToStore = { 
                    ...settings,
                    version: currentVersion,
                    savedAt: Date.now(),
                    extensionVersion: this.getExtensionVersion()
                };
                
                if (settings.apiKey) {
                    settingsToStore.encryptedApiKey = await this.encrypt(settings.apiKey);
                    delete settingsToStore.apiKey; // Remove plaintext API key
                }

                // Store encrypted settings with metadata
                await chrome.storage.local.set({
                    pokpokSettings: settingsToStore,
                    pokpokSettingsVersion: currentVersion,
                    pokpokLastSaved: Date.now()
                });

                console.log('Settings saved successfully with version:', currentVersion);
            } catch (error) {
                console.error('Failed to save settings:', error);
                throw error;
            }
        },

        // Load settings securely with migration support
        async loadSettings() {
            if (typeof chrome === 'undefined' || !chrome.storage) {
                throw new Error('Chrome storage API not available');
            }

            try {
                const stored = await chrome.storage.local.get([
                    'pokpokSettings', 
                    'pokpokSettingsVersion', 
                    'pokpokLastSaved'
                ]);
                
                if (!stored.pokpokSettings) {
                    return null;
                }

                const settings = { ...stored.pokpokSettings };
                const currentExtensionVersion = this.getExtensionVersion();

                // Check if settings need migration
                if (settings.extensionVersion !== currentExtensionVersion) {
                    console.log(`Settings from extension v${settings.extensionVersion}, current v${currentExtensionVersion}`);
                    settings.migrated = true;
                    settings.previousExtensionVersion = settings.extensionVersion;
                    settings.extensionVersion = currentExtensionVersion;
                }

                // Decrypt API key if present
                if (settings.encryptedApiKey) {
                    settings.apiKey = await this.decrypt(settings.encryptedApiKey);
                    delete settings.encryptedApiKey; // Remove encrypted version from result
                }

                console.log('Settings loaded successfully:', {
                    version: settings.version,
                    extensionVersion: settings.extensionVersion,
                    migrated: settings.migrated || false,
                    savedAt: settings.savedAt ? new Date(settings.savedAt).toISOString() : 'unknown'
                });
                
                return settings;
            } catch (error) {
                console.error('Failed to load settings:', error);
                throw error;
            }
        },

        // Clear all stored settings
        async clearSettings() {
            if (typeof chrome === 'undefined' || !chrome.storage) {
                throw new Error('Chrome storage API not available');
            }

            try {
                await chrome.storage.local.remove([
                    'pokpokSettings', 
                    'pokpokSettingsVersion', 
                    'encryptionKey'
                ]);
                console.log('Settings cleared successfully');
            } catch (error) {
                console.error('Failed to clear settings:', error);
                throw error;
            }
        },

        // Get current extension version from manifest
        getExtensionVersion() {
            try {
                if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest) {
                    return chrome.runtime.getManifest().version;
                }
                // Fallback to hardcoded version if manifest not available
                return '1.82.0';
            } catch (error) {
                console.warn('Could not get extension version from manifest:', error);
                return '1.82.0';
            }
        }
    }
};

console.log('POKPOK.AI extension loaded successfully');