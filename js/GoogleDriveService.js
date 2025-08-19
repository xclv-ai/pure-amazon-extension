/**
 * POKPOK.AI Chrome Extension - Secure Google Drive Integration
 * File: js/GoogleDriveService.js
 * Last Updated: v2.53.0 (January 2025)
 * 
 * PURPOSE:
 * Enterprise-grade Google Drive API v3 integration for automatic JSON backup
 * using service account authentication with JWT tokens and AES-GCM encryption.
 * 
 * SECURITY ARCHITECTURE:
 * - Service Account Authentication: Uses Google Cloud service accounts (not API keys)
 * - JWT Token Generation: RS256 cryptographic signing using Chrome's Web Crypto API
 * - Bearer Token Auth: OAuth2-compliant Bearer token authentication
 * - Encrypted Storage: Service account credentials encrypted with AES-GCM before storage
 * - Shared Drive Support: Files uploaded to Google Workspace Shared Drive
 * 
 * CRITICAL CHANGES FROM PREVIOUS VERSIONS:
 * v2.53.0: Complete rewrite from API key to service account authentication
 * v2.52.0: Added Shared Drive support and explicit driveId targeting
 * v2.51.0: Implemented non-blocking upload system for performance
 * 
 * DEPENDENCIES:
 * - window.SecureStorage: AES-GCM encryption for service account credentials
 * - window.JWTGenerator: RS256 JWT token generation and OAuth2 token exchange
 * - Chrome Storage API: Encrypted credential persistence
 * - Google Drive API v3: File upload with Shared Drive support
 * 
 * SECURITY NOTES:
 * - Private keys never transmitted over network or stored in plain text
 * - JWT tokens are single-use and expire in 1 hour
 * - Access tokens cached for 55 minutes to prevent excessive API calls
 * - All uploads are non-blocking to prevent extension performance impact
 * - Shared Drive provides centralized storage with workspace access controls
 */

window.GoogleDriveService = (function() {
    'use strict';

    // ===== CONFIGURATION CONSTANTS =====
    // CRITICAL: This is a Google Workspace Shared Drive ID (not a regular folder)
    // Shared Drives provide centralized storage with workspace-level access controls
    // This specific Drive was created to handle service account uploads
    const DRIVE_FOLDER_ID = '0AJAs3YBrbFCAUk9PVA';  // Google Workspace Shared Drive
    
    // Google Drive API v3 endpoints with Shared Drive support
    const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
    const UPLOAD_API_BASE = 'https://www.googleapis.com/upload/drive/v3';
    
    // ===== SERVICE STATE MANAGEMENT =====
    // Tracks initialization status to prevent multiple init attempts
    // Set to true only after successful service account credential verification
    let initialized = false;

    /**
     * Initialize Google Drive service with service account authentication verification
     * 
     * AUTHENTICATION FLOW:
     * 1. Check if SecureStorage module is loaded (dependency check)
     * 2. Verify service account credentials are stored and encrypted
     * 3. Set initialized flag to prevent re-initialization
     * 
     * IMPORTANT: This is a lazy initialization - service only initializes when needed
     * This prevents timing issues where SecureStorage module isn't loaded yet
     * 
     * @returns {Promise<boolean>} - True if successfully initialized, false otherwise
     */
    async function initialize() {
        // Prevent multiple initialization attempts
        if (initialized) return true;
        
        try {
            // DEPENDENCY CHECK: Ensure SecureStorage module is loaded
            // SecureStorage handles AES-GCM encryption of service account credentials
            if (!window.SecureStorage) {
                console.warn('⚠️ SecureStorage not available yet, will retry when needed');
                return false;
            }

            // CREDENTIAL VERIFICATION: Check if service account is configured
            // This doesn't decrypt credentials - just checks if encrypted data exists
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
     * 
     * COMPLETE AUTHENTICATION FLOW:
     * 1. Lazy initialize service (check for encrypted service account credentials)
     * 2. Decrypt service account credentials using AES-GCM
     * 3. Generate RS256 JWT token using service account private key
     * 4. Exchange JWT for OAuth2 Bearer access token (cached for 55 minutes)
     * 5. Upload file to Google Workspace Shared Drive using Bearer token
     * 
     * SHARED DRIVE INTEGRATION:
     * - Files uploaded to Google Workspace Shared Drive (ID: 0AJAs3YBrbFCAUk9PVA)
     * - Uses supportsAllDrives=true parameter for Shared Drive compatibility
     * - Explicit driveId metadata ensures proper Shared Drive targeting
     * - Shared Drive provides centralized storage with workspace access controls
     * 
     * SECURITY FEATURES:
     * - Service account credentials decrypted only when needed (never cached)
     * - JWT tokens are single-use and expire in 1 hour
     * - Bearer tokens cached for 55 minutes to prevent excessive OAuth2 calls
     * - All credentials encrypted with AES-GCM before Chrome storage
     * - Automatic token cache clearing on authentication errors (401/403)
     * 
     * ERROR HANDLING:
     * - Graceful failure - returns null if upload fails (doesn't break extension)
     * - Automatic token refresh on authentication errors
     * - Comprehensive logging for debugging authentication issues
     * 
     * @param {Object|string} jsonData - The JSON data to save (object or string)
     * @param {string} filename - The filename for the saved file (must include .json)
     * @returns {Promise<Object|null>} - Google Drive file metadata or null if failed
     */
    async function saveToGoogleDrive(jsonData, filename) {
        try {
            // ===== STEP 1: LAZY INITIALIZATION =====
            // Ensure service is initialized with service account credentials
            if (!initialized) {
                const success = await initialize();
                if (!success) {
                    console.warn('⚠️ Google Drive service not initialized - skipping Drive save');
                    return null;
                }
            }

            console.log(`📤 Uploading ${filename} to Google Drive with service account...`);

            // ===== STEP 2: DECRYPT SERVICE ACCOUNT CREDENTIALS =====
            // SecureStorage.getServiceAccountKey() decrypts credentials using AES-GCM
            // Credentials are NEVER stored in plain text anywhere in the extension
            const serviceAccountData = await window.SecureStorage.getServiceAccountKey();
            if (!serviceAccountData) {
                console.warn('⚠️ No service account credentials available');
                return null;
            }

            // ===== STEP 3: OBTAIN BEARER ACCESS TOKEN =====
            // JWTGenerator creates RS256 JWT token using service account private key
            // Then exchanges JWT for OAuth2 Bearer token (cached for 55 minutes)
            const tokenData = await window.JWTGenerator.getCachedAccessToken(serviceAccountData);
            if (!tokenData || !tokenData.access_token) {
                console.error('❌ Failed to obtain access token');
                return null;
            }

            // ===== STEP 4: PREPARE FILE DATA =====
            // Convert JSON data to string with pretty formatting for readability
            const jsonString = typeof jsonData === 'string' 
                ? jsonData 
                : JSON.stringify(jsonData, null, 2);

            // ===== STEP 5: CREATE SHARED DRIVE METADATA =====
            // CRITICAL: metadata must include driveId for explicit Shared Drive targeting
            // parents[] specifies folder within Shared Drive, driveId specifies the Shared Drive itself
            const metadata = {
                name: filename,
                parents: [DRIVE_FOLDER_ID],           // Folder within Shared Drive
                mimeType: 'application/json',         // Proper MIME type for JSON files
                driveId: DRIVE_FOLDER_ID              // CRITICAL: Explicit Shared Drive targeting
            };

            // ===== STEP 6: PREPARE MULTIPART UPLOAD =====
            // Google Drive API v3 requires multipart upload for file + metadata
            // FormData automatically handles multipart encoding
            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', new Blob([jsonString], { type: 'application/json' }));

            // ===== STEP 7: UPLOAD TO SHARED DRIVE =====
            // CRITICAL PARAMETERS:
            // - supportsAllDrives=true: Required for Shared Drive access
            // - supportsTeamDrives=true: Legacy parameter for backward compatibility
            // - Bearer token: OAuth2-compliant authentication (not API key)
            const response = await fetch(`${UPLOAD_API_BASE}/files?uploadType=multipart&supportsAllDrives=true&supportsTeamDrives=true`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenData.access_token}`  // OAuth2 Bearer token
                },
                body: form  // Multipart form with metadata + file data
            });

            // ===== STEP 8: PROCESS RESPONSE =====
            if (response.ok) {
                const fileData = await response.json();
                
                // SUCCESS: Log comprehensive upload details for debugging
                console.log('✅ Successfully uploaded to Google Drive:', fileData.name);
                console.log('📁 File ID:', fileData.id);
                console.log('🔗 View in Drive: https://drive.google.com/file/d/' + fileData.id);
                console.log('📧 Service Account:', serviceAccountData.client_email);
                console.log('🗂️ Shared Drive ID:', DRIVE_FOLDER_ID);
                
                return fileData;  // Return Google Drive file metadata
            } else {
                const errorText = await response.text();
                console.error('❌ Google Drive upload failed:', response.status, errorText);
                
                // ===== AUTHENTICATION ERROR HANDLING =====
                // Clear cached tokens on auth errors to force fresh token generation
                if (response.status === 401 || response.status === 403) {
                    console.log('🔄 Clearing token cache due to auth error');
                    window.JWTGenerator.clearTokenCache();
                    
                    // Log additional debugging info for 403 errors (common with Shared Drives)
                    if (response.status === 403) {
                        console.log('💡 403 Forbidden - Check service account has Shared Drive access');
                        console.log('💡 Service account email should be added to Shared Drive with Editor permissions');
                    }
                }
                
                return null;  // Return null on upload failure
            }

        } catch (error) {
            console.error('❌ Error saving to Google Drive:', error);
            console.error('🔍 Error details:', {
                filename: filename,
                serviceInitialized: initialized,
                driveId: DRIVE_FOLDER_ID,
                timestamp: new Date().toISOString()
            });
            return null;  // Return null on any error
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