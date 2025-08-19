/**
 * POKPOK.AI Chrome Extension
 * File: js/GoogleDriveService.js
 * Purpose: Google Drive API integration for automatic JSON backup
 * 
 * Features:
 * - Automatic JSON upload to specified Google Drive folder
 * - Uses existing API key from settings
 * - Simple, no-conditions-always-save approach
 * - Folder ID: 1HvMD_wcGjFwnDarI8UBEOKobZ5wgB5hv
 */

window.GoogleDriveService = (function() {
    'use strict';

    // Configuration - Shared Drive for service account uploads
    const DRIVE_FOLDER_ID = '0AJAs3YBrbFCAUk9PVA';
    const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
    const UPLOAD_API_BASE = 'https://www.googleapis.com/upload/drive/v3';
    
    // State
    let initialized = false;

    // Initialize service with service account authentication
    async function initialize() {
        if (initialized) return true;
        
        try {
            // Check if service account credentials are available
            if (!window.SecureStorage) {
                console.warn('⚠️ SecureStorage not available yet, will retry when needed');
                return false;
            }

            const hasServiceAccount = await window.SecureStorage.hasServiceAccountKey();
            if (hasServiceAccount) {
                initialized = true;
                console.log('✅ GoogleDriveService initialized with service account authentication');
                return true;
            } else {
                console.warn('⚠️ No service account configured for Google Drive');
                return false;
            }
        } catch (error) {
            console.error('❌ Failed to initialize GoogleDriveService:', error);
            return false;
        }
    }

    /**
     * Save JSON data to Google Drive using service account authentication
     * @param {Object} jsonData - The JSON data to save
     * @param {string} filename - The filename for the saved file
     * @returns {Promise<Object>} - Google Drive file metadata or null if failed
     */
    async function saveToGoogleDrive(jsonData, filename) {
        try {
            // Ensure service is initialized
            if (!initialized) {
                const success = await initialize();
                if (!success) {
                    console.warn('⚠️ Google Drive service not initialized - skipping Drive save');
                    return null;
                }
            }

            console.log(`📤 Uploading ${filename} to Google Drive with service account...`);

            // Get service account credentials and access token
            const serviceAccountData = await window.SecureStorage.getServiceAccountKey();
            if (!serviceAccountData) {
                console.warn('⚠️ No service account credentials available');
                return null;
            }

            const tokenData = await window.JWTGenerator.getCachedAccessToken(serviceAccountData);
            if (!tokenData || !tokenData.access_token) {
                console.error('❌ Failed to obtain access token');
                return null;
            }

            // Prepare the file content
            const jsonString = typeof jsonData === 'string' 
                ? jsonData 
                : JSON.stringify(jsonData, null, 2);

            // Create file metadata for Shared Drive upload
            const metadata = {
                name: filename,
                parents: [DRIVE_FOLDER_ID],
                mimeType: 'application/json',
                // Explicitly specify this is for a Shared Drive
                driveId: DRIVE_FOLDER_ID
            };

            // Use FormData for multipart upload (as recommended in your instructions)
            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', new Blob([jsonString], { type: 'application/json' }));

            // Make the upload request with Bearer token authentication (Shared Drive support)
            const response = await fetch(`${UPLOAD_API_BASE}/files?uploadType=multipart&supportsAllDrives=true&supportsTeamDrives=true`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenData.access_token}`
                },
                body: form
            });

            if (response.ok) {
                const fileData = await response.json();
                console.log('✅ Successfully uploaded to Google Drive:', fileData.name);
                console.log('📁 File ID:', fileData.id);
                console.log('🔗 View in Drive: https://drive.google.com/file/d/' + fileData.id);
                console.log('📧 Service Account:', serviceAccountData.client_email);
                return fileData;
            } else {
                const errorText = await response.text();
                console.error('❌ Google Drive upload failed:', response.status, errorText);
                
                // Clear token cache on auth errors
                if (response.status === 401 || response.status === 403) {
                    console.log('🔄 Clearing token cache due to auth error');
                    window.JWTGenerator.clearTokenCache();
                }
                
                return null;
            }

        } catch (error) {
            console.error('❌ Error saving to Google Drive:', error);
            return null;
        }
    }

    /**
     * Save both locally and to Google Drive
     * @param {Object} jsonData - The JSON data to save
     * @param {string} filename - The filename for the saved file
     */
    async function saveEverywhere(jsonData, filename) {
        console.log('💾 Saving JSON everywhere (Downloads + Google Drive)...');
        
        // Save to Google Drive (non-blocking - don't wait for it)
        saveToGoogleDrive(jsonData, filename).then(result => {
            if (result) {
                console.log('☁️ Google Drive backup completed');
            } else {
                console.log('⚠️ Google Drive backup skipped or failed (local save still successful)');
            }
        });

        // Return immediately after triggering Drive save
        // This ensures the extension continues working even if Drive fails
        return true;
    }

    // Public API
    return {
        initialize: initialize,
        saveToGoogleDrive: saveToGoogleDrive,
        saveEverywhere: saveEverywhere,
        get initialized() {
            return initialized;
        }
    };
})();

// Note: Initialization now happens manually after storage service is ready
// This prevents timing issues where storage service isn't available yet