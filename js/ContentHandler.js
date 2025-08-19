/**
 * POKPOK.AI Chrome Extension v2.28.0
 * File: js/ContentHandler.js
 * Purpose: Page content extraction, processing, and Chrome tabs API wrapper
 * 
 * Key Features:
 * - Page content extraction for analysis (full page text, selected text)
 * - Chrome tabs API communication wrapper
 * - Content script message handling and error recovery
 * - Element selection and metadata extraction
 * - Page color extraction for visual identity analysis
 * - Content validation and preprocessing
 * 
 * Dependencies:
 * - Chrome tabs API: tabs.query, tabs.sendMessage
 * - content-script.js: Message handlers for content extraction
 * - Chrome runtime API: Message passing between extension and content script
 * 
 * Exposes:
 * - window.ContentHandler.getFullPageText()
 * - window.ContentHandler.getPageColors()
 * - window.ContentHandler.getSelectedText()
 * - window.ContentHandler.getCurrentPageUrl()
 * - window.ContentHandler.sendModeChange()
 * 
 * Integration Points:
 * - AnalysisCoordinator.js: Provides content for analysis
 * - content-script.js: Receives and processes extraction requests
 * - GeminiAnalysisService.js: Provides content for API analysis
 * - UIController.js: Element selection feedback
 * 
 * Message Types Handled:
 * - GET_FULL_PAGE_TEXT: Extract all page text for analysis
 * - GET_PAGE_COLORS: Extract CSS colors for visual identity
 * - GET_SELECTED_TEXT: Get user-selected text
 * - SET_MODE: Communicate mode changes to content script
 * - ELEMENT_SELECTED: Handle element selection feedback
 * 
 * Error Handling:
 * - Content script unavailable: Graceful fallback
 * - Message timeout: Retry logic and error reporting
 * - Invalid content: Validation and sanitization
 * - Tab access errors: Clear error messages
 * 
 * Preserved Functionality:
 * - Exact Chrome tabs API usage patterns
 * - All message types and response formats
 * - Content script communication protocol
 * - Error handling and recovery mechanisms
 * - Content validation and preprocessing
 * 
 * Last Updated: August 2024
 */

window.ContentHandler = (function() {
    'use strict';

    // Configuration
    const MESSAGE_TIMEOUT = 10000; // 10 seconds
    const RETRY_ATTEMPTS = 2;
    const RETRY_DELAY = 1000; // 1 second

    // Initialize content handler
    function initialize() {
        console.log('ContentHandler module initialized');
    }

    // Get current page URL (preserved exactly from GeminiAnalysisService.js)
    async function getCurrentPageUrl() {
        console.log('🌐 Getting current page URL...');
        
        return new Promise((resolve, reject) => {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                if (chrome.runtime.lastError) {
                    console.error('❌ Failed to get current tab:', chrome.runtime.lastError);
                    reject(new Error('Unable to get current page URL'));
                    return;
                }

                if (!tabs || tabs.length === 0) {
                    console.error('❌ No active tabs found');
                    reject(new Error('No active tab found'));
                    return;
                }

                const url = tabs[0].url;
                console.log('✅ Current page URL retrieved:', url);
                resolve(url);
            });
        });
    }

    // Send message to content script with retry logic
    async function sendMessageToContentScript(tabId, message, retryCount = 0) {
        try {
            console.log(`📤 Sending message to tab ${tabId}:`, message.type);
            
            const response = await chrome.tabs.sendMessage(tabId, message);
            console.log(`📥 Response received from tab ${tabId}:`, response.success ? 'Success' : `Failed: ${response.error}`);
            
            return response;
        } catch (error) {
            console.error(`❌ Message failed to tab ${tabId}:`, error);
            
            // Retry logic
            if (retryCount < RETRY_ATTEMPTS && error.message.includes('Could not establish connection')) {
                console.log(`🔄 Retrying message (attempt ${retryCount + 1}/${RETRY_ATTEMPTS + 1})...`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                return sendMessageToContentScript(tabId, message, retryCount + 1);
            }
            
            // Return error response in expected format
            return {
                success: false,
                error: `Content script communication failed: ${error.message}`
            };
        }
    }

    // Get full page text content for analysis (preserved exactly)
    async function getFullPageText(tabId) {
        console.log('📝 Requesting full page text from content script...');
        
        try {
            // Ensure content script is available before communication
            const isContentScriptReady = await ensureContentScript(tabId);
            if (!isContentScriptReady) {
                return {
                    success: false,
                    error: 'Content script not available and injection failed'
                };
            }
            
            const response = await sendMessageToContentScript(tabId, {
                type: 'GET_FULL_PAGE_TEXT'
            });
            
            if (response.success && response.text) {
                console.log('✅ Full page text extracted successfully', {
                    length: response.text.length,
                    preview: response.text.substring(0, 100) + '...'
                });
                
                // Validate and sanitize content
                const sanitizedText = sanitizeText(response.text);
                if (sanitizedText.length < 50) {
                    console.warn('⚠️ Extracted text is very short, may not provide meaningful analysis');
                }
                
                return {
                    success: true,
                    text: sanitizedText,
                    metadata: {
                        originalLength: response.text.length,
                        sanitizedLength: sanitizedText.length
                    }
                };
            } else {
                console.error('❌ Failed to extract full page text:', response.error);
                return response;
            }
        } catch (error) {
            console.error('❌ Error extracting full page text:', error);
            return {
                success: false,
                error: `Failed to extract page text: ${error.message}`
            };
        }
    }

    // Get page colors for visual identity analysis (preserved exactly)
    async function getPageColors(tabId) {
        console.log('🎨 Requesting page colors from content script...');
        
        try {
            // Ensure content script is available before communication
            const isContentScriptReady = await ensureContentScript(tabId);
            if (!isContentScriptReady) {
                return {
                    success: false,
                    error: 'Content script not available and injection failed'
                };
            }
            
            const response = await sendMessageToContentScript(tabId, {
                type: 'GET_PAGE_COLORS'
            });
            
            if (response.success && response.colors) {
                console.log('✅ Page colors extracted successfully', {
                    colorsCount: response.colors.length,
                    preview: response.colors.slice(0, 5)
                });
                
                // Validate color data
                const validColors = validateColors(response.colors);
                
                return {
                    success: true,
                    colors: validColors,
                    metadata: {
                        originalCount: response.colors.length,
                        validCount: validColors.length
                    }
                };
            } else {
                console.error('❌ Failed to extract page colors:', response.error);
                return response;
            }
        } catch (error) {
            console.error('❌ Error extracting page colors:', error);
            return {
                success: false,
                error: `Failed to extract page colors: ${error.message}`
            };
        }
    }

    // Get selected text content (preserved exactly)
    async function getSelectedText(tabId) {
        console.log('📝 Requesting selected text from content script...');
        
        try {
            // Ensure content script is available before communication
            const isContentScriptReady = await ensureContentScript(tabId);
            if (!isContentScriptReady) {
                return {
                    success: false,
                    error: 'Content script not available and injection failed'
                };
            }
            
            const response = await sendMessageToContentScript(tabId, {
                type: 'GET_SELECTED_TEXT'
            });
            
            if (response.success && response.text) {
                console.log('✅ Selected text extracted successfully', {
                    length: response.text.length,
                    preview: response.text.substring(0, 50) + '...'
                });
                
                // Validate and sanitize selected text
                const sanitizedText = sanitizeText(response.text);
                
                return {
                    success: true,
                    text: sanitizedText,
                    metadata: {
                        originalLength: response.text.length,
                        sanitizedLength: sanitizedText.length
                    }
                };
            } else {
                console.warn('⚠️ No text selected or extraction failed:', response.error);
                return response;
            }
        } catch (error) {
            console.error('❌ Error extracting selected text:', error);
            return {
                success: false,
                error: `Failed to extract selected text: ${error.message}`
            };
        }
    }

    // Send mode change to content script (preserved exactly)
    async function sendModeChange(tabId, mode) {
        console.log(`🔄 Sending mode change to content script: ${mode}`);
        
        try {
            // Ensure content script is available before communication
            const isContentScriptReady = await ensureContentScript(tabId);
            if (!isContentScriptReady) {
                return {
                    success: false,
                    error: 'Content script not available and injection failed'
                };
            }
            
            const response = await sendMessageToContentScript(tabId, {
                type: 'SET_MODE',
                mode: mode
            });
            
            if (response.success) {
                console.log(`✅ Mode change communicated successfully: ${mode}`);
            } else {
                console.warn(`⚠️ Mode change communication failed: ${response.error}`);
            }
            
            return response;
        } catch (error) {
            console.error('❌ Error sending mode change:', error);
            return {
                success: false,
                error: `Failed to communicate mode change: ${error.message}`
            };
        }
    }

    // Sanitize extracted text content
    function sanitizeText(text) {
        if (!text || typeof text !== 'string') {
            return '';
        }
        
        // Remove excessive whitespace and normalize
        let sanitized = text
            .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
            .replace(/[\r\n]+/g, ' ') // Replace line breaks with spaces
            .trim(); // Remove leading/trailing whitespace
        
        // Remove common unwanted characters and sequences
        sanitized = sanitized
            .replace(/[^\w\s.,!?;:()\-'"/&@#$%+=<>[\]{}|\\`~]/g, '') // Keep common punctuation
            .replace(/\s{2,}/g, ' '); // Final whitespace cleanup
        
        return sanitized;
    }

    // Validate color data format
    function validateColors(colors) {
        if (!Array.isArray(colors)) {
            return [];
        }
        
        const validColors = colors.filter(color => {
            // Check if color is a valid CSS color string
            if (typeof color !== 'string') {
                return false;
            }
            
            // Basic validation for hex, rgb, rgba, hsl, hsla, and named colors
            const colorRegex = /^(#[0-9a-fA-F]{3,8}|rgb\(.*\)|rgba\(.*\)|hsl\(.*\)|hsla\(.*\)|[a-zA-Z]+)$/;
            return colorRegex.test(color.trim());
        });
        
        // Remove duplicates
        return [...new Set(validColors)];
    }

    // Get active tab information
    async function getActiveTab() {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                
                if (!tabs || tabs.length === 0) {
                    reject(new Error('No active tab found'));
                    return;
                }
                
                resolve(tabs[0]);
            });
        });
    }

    // Check if content script is available on tab
    async function isContentScriptAvailable(tabId) {
        try {
            const response = await chrome.tabs.sendMessage(tabId, {
                type: 'PING'
            });
            return response && response.success;
        } catch (error) {
            return false;
        }
    }

    // Inject content script if not available
    async function ensureContentScript(tabId) {
        const isAvailable = await isContentScriptAvailable(tabId);
        if (!isAvailable) {
            console.log('📋 Content script not available, attempting injection...');
            try {
                // Inject CSS styles first
                await chrome.scripting.insertCSS({
                    target: { tabId: tabId },
                    files: ['content-styles.css']
                });
                console.log('✅ Content styles injected successfully');
                
                // Then inject JavaScript
                await chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['content-script.js']
                });
                console.log('✅ Content script injected successfully');
                
                // Wait a moment for initialization
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Verify the injection worked
                const isNowAvailable = await isContentScriptAvailable(tabId);
                if (!isNowAvailable) {
                    console.error('❌ Content script injection failed verification');
                    return false;
                }
                
                return true;
            } catch (error) {
                console.error('❌ Failed to inject content script:', error);
                return false;
            }
        }
        return true;
    }

    // Public API - providing abstracted content extraction methods
    return {
        initialize: initialize,
        getCurrentPageUrl: getCurrentPageUrl,
        getFullPageText: getFullPageText,
        getPageColors: getPageColors,
        getSelectedText: getSelectedText,
        sendModeChange: sendModeChange,
        getActiveTab: getActiveTab,
        isContentScriptAvailable: isContentScriptAvailable,
        ensureContentScript: ensureContentScript
    };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.ContentHandler.initialize);
} else {
    window.ContentHandler.initialize();
}