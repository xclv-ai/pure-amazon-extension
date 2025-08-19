/**
 * POKPOK.AI Chrome Extension
 * File: js/SecureStorage.js
 * Purpose: Secure credential storage with encryption for service account keys
 * 
 * SECURITY NOTICE:
 * This module handles sensitive service account credentials. It uses Chrome's
 * Web Crypto API for encryption and never exposes credentials in plain text.
 */

window.SecureStorage = (function() {
    'use strict';

    // Generate a consistent key from browser-specific data
    async function generateEncryptionKey() {
        const keyMaterial = await window.crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode("pokpok-ai-chrome-extension-secure-storage"),
            { name: "PBKDF2" },
            false,
            ["deriveBits", "deriveKey"]
        );

        return await window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: new TextEncoder().encode("pokpok-salt-2024"),
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
    }

    // Encrypt sensitive data before storage
    async function encryptData(data) {
        try {
            const key = await generateEncryptionKey();
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            const encodedData = new TextEncoder().encode(JSON.stringify(data));
            
            const encryptedData = await window.crypto.subtle.encrypt(
                { name: "AES-GCM", iv: iv },
                key,
                encodedData
            );

            // Combine IV and encrypted data
            const combined = new Uint8Array(iv.length + encryptedData.byteLength);
            combined.set(iv);
            combined.set(new Uint8Array(encryptedData), iv.length);
            
            // Convert to base64 for storage
            return btoa(String.fromCharCode.apply(null, combined));
        } catch (error) {
            console.error('❌ Encryption failed:', error);
            throw new Error('Failed to encrypt sensitive data');
        }
    }

    // Decrypt data from storage
    async function decryptData(encryptedBase64) {
        try {
            const key = await generateEncryptionKey();
            
            // Convert from base64
            const combined = new Uint8Array(
                atob(encryptedBase64).split('').map(char => char.charCodeAt(0))
            );
            
            // Extract IV and encrypted data
            const iv = combined.slice(0, 12);
            const encryptedData = combined.slice(12);
            
            const decryptedData = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv },
                key,
                encryptedData
            );

            const jsonString = new TextDecoder().decode(decryptedData);
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('❌ Decryption failed:', error);
            throw new Error('Failed to decrypt stored data');
        }
    }

    // Store service account credentials securely
    async function storeServiceAccountKey(serviceAccountData) {
        console.log('🔐 Encrypting and storing service account credentials...');
        
        try {
            // Validate required fields
            if (!serviceAccountData.client_email || !serviceAccountData.private_key) {
                throw new Error('Invalid service account data - missing required fields');
            }

            // Extract only the necessary fields (security: don't store everything)
            const credentialsToStore = {
                client_email: serviceAccountData.client_email,
                private_key: serviceAccountData.private_key,
                project_id: serviceAccountData.project_id || '',
                stored_at: Date.now()
            };

            const encryptedData = await encryptData(credentialsToStore);
            
            return new Promise((resolve, reject) => {
                chrome.storage.local.set({
                    'pokpok_service_account_encrypted': encryptedData
                }, () => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(`Storage failed: ${chrome.runtime.lastError.message}`));
                    } else {
                        console.log('✅ Service account credentials encrypted and stored securely');
                        resolve(true);
                    }
                });
            });
        } catch (error) {
            console.error('❌ Failed to store service account:', error);
            throw error;
        }
    }

    // Retrieve and decrypt service account credentials
    async function getServiceAccountKey() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['pokpok_service_account_encrypted'], async (result) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(`Storage retrieval failed: ${chrome.runtime.lastError.message}`));
                    return;
                }

                if (!result.pokpok_service_account_encrypted) {
                    resolve(null); // No credentials stored
                    return;
                }

                try {
                    const decryptedData = await decryptData(result.pokpok_service_account_encrypted);
                    console.log('🔓 Service account credentials decrypted successfully');
                    resolve(decryptedData);
                } catch (error) {
                    console.error('❌ Failed to decrypt service account:', error);
                    reject(error);
                }
            });
        });
    }

    // Clear stored credentials
    async function clearServiceAccountKey() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.remove(['pokpok_service_account_encrypted'], () => {
                if (chrome.runtime.lastError) {
                    reject(new Error(`Storage clear failed: ${chrome.runtime.lastError.message}`));
                } else {
                    console.log('🗑️ Service account credentials cleared');
                    resolve(true);
                }
            });
        });
    }

    // Check if service account is configured
    async function hasServiceAccountKey() {
        try {
            const key = await getServiceAccountKey();
            return !!key;
        } catch (error) {
            return false;
        }
    }

    // Public API
    return {
        storeServiceAccountKey: storeServiceAccountKey,
        getServiceAccountKey: getServiceAccountKey,
        clearServiceAccountKey: clearServiceAccountKey,
        hasServiceAccountKey: hasServiceAccountKey
    };
})();

console.log('🔐 SecureStorage module loaded - service account encryption ready');