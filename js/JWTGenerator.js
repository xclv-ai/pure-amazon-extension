/**
 * POKPOK.AI Chrome Extension
 * File: js/JWTGenerator.js
 * Purpose: JWT token generation for Google Drive API service account authentication
 * 
 * SECURITY NOTICE:
 * This module generates JWT tokens for service account authentication using
 * Chrome's Web Crypto API. All operations are performed in-browser without
 * exposing private keys.
 */

window.JWTGenerator = (function() {
    'use strict';

    // Base64 URL encoding (JWT standard)
    function base64urlEncode(data) {
        return btoa(data)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    // Convert PEM private key to CryptoKey
    async function importPrivateKey(pemPrivateKey) {
        try {
            // Remove PEM header/footer and whitespace
            const pemHeader = "-----BEGIN PRIVATE KEY-----";
            const pemFooter = "-----END PRIVATE KEY-----";
            const pemContents = pemPrivateKey
                .replace(pemHeader, '')
                .replace(pemFooter, '')
                .replace(/\s/g, '');
            
            // Convert base64 to ArrayBuffer
            const binaryDer = atob(pemContents);
            const der = new Uint8Array(binaryDer.length);
            for (let i = 0; i < binaryDer.length; i++) {
                der[i] = binaryDer.charCodeAt(i);
            }

            // Import the key
            return await window.crypto.subtle.importKey(
                'pkcs8',
                der,
                {
                    name: 'RSASSA-PKCS1-v1_5',
                    hash: 'SHA-256'
                },
                false,
                ['sign']
            );
        } catch (error) {
            console.error('❌ Failed to import private key:', error);
            throw new Error('Invalid private key format');
        }
    }

    // Generate JWT token for Google Drive API
    async function generateJWT(serviceAccountData) {
        try {
            console.log('🔑 Generating JWT token for Google Drive API...');
            
            const now = Math.floor(Date.now() / 1000);
            
            // JWT header
            const header = {
                alg: 'RS256',
                typ: 'JWT'
            };

            // JWT payload (claims)
            const payload = {
                iss: serviceAccountData.client_email,
                sub: serviceAccountData.client_email,
                scope: 'https://www.googleapis.com/auth/drive',
                aud: 'https://oauth2.googleapis.com/token',
                iat: now,
                exp: now + 3600 // 1 hour expiration
            };

            // Encode header and payload
            const encodedHeader = base64urlEncode(JSON.stringify(header));
            const encodedPayload = base64urlEncode(JSON.stringify(payload));
            const unsignedToken = `${encodedHeader}.${encodedPayload}`;

            // Import private key
            const privateKey = await importPrivateKey(serviceAccountData.private_key);

            // Sign the token
            const signature = await window.crypto.subtle.sign(
                'RSASSA-PKCS1-v1_5',
                privateKey,
                new TextEncoder().encode(unsignedToken)
            );

            // Encode signature
            const encodedSignature = base64urlEncode(
                String.fromCharCode.apply(null, new Uint8Array(signature))
            );

            const jwt = `${unsignedToken}.${encodedSignature}`;
            
            console.log('✅ JWT token generated successfully');
            return jwt;
        } catch (error) {
            console.error('❌ JWT generation failed:', error);
            throw error;
        }
    }

    // Get Google OAuth2 access token using JWT
    async function getAccessToken(serviceAccountData) {
        try {
            console.log('🎫 Requesting Google OAuth2 access token...');
            
            const jwt = await generateJWT(serviceAccountData);
            
            const response = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('❌ OAuth2 token request failed:', response.status, errorData);
                throw new Error(`OAuth2 token request failed: ${response.status}`);
            }

            const tokenData = await response.json();
            
            if (!tokenData.access_token) {
                console.error('❌ No access token in response:', tokenData);
                throw new Error('Invalid OAuth2 response - no access token');
            }

            console.log('✅ Access token obtained successfully');
            console.log('⏰ Token expires in:', tokenData.expires_in, 'seconds');
            
            return {
                access_token: tokenData.access_token,
                token_type: tokenData.token_type || 'Bearer',
                expires_in: tokenData.expires_in || 3600,
                expires_at: Date.now() + ((tokenData.expires_in || 3600) * 1000)
            };
        } catch (error) {
            console.error('❌ Access token generation failed:', error);
            throw error;
        }
    }

    // Token caching to avoid excessive requests
    let cachedToken = null;

    // Get access token with caching
    async function getCachedAccessToken(serviceAccountData) {
        try {
            // Check if we have a valid cached token (with 5-minute buffer)
            if (cachedToken && cachedToken.expires_at > (Date.now() + 5 * 60 * 1000)) {
                console.log('♻️ Using cached access token');
                return cachedToken;
            }

            // Generate new token
            console.log('🔄 Generating fresh access token');
            cachedToken = await getAccessToken(serviceAccountData);
            return cachedToken;
        } catch (error) {
            console.error('❌ Failed to get access token:', error);
            cachedToken = null; // Clear cache on error
            throw error;
        }
    }

    // Clear token cache
    function clearTokenCache() {
        cachedToken = null;
        console.log('🗑️ Access token cache cleared');
    }

    // Public API
    return {
        generateJWT: generateJWT,
        getAccessToken: getAccessToken,
        getCachedAccessToken: getCachedAccessToken,
        clearTokenCache: clearTokenCache
    };
})();

console.log('🔑 JWTGenerator module loaded - service account authentication ready');