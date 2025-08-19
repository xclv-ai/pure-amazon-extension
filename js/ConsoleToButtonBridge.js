/**
 * POKPOK.AI Chrome Extension v2.32.0
 * File: js/ConsoleToButtonBridge.js
 * Purpose: Console output interceptor that displays all logs as animated button labels
 * 
 * Key Features:
 * - Intercepts console.log, console.warn, console.error calls
 * - Displays all console messages as button labels during analysis
 * - Filters and formats messages for better user experience
 * - Maintains original console functionality for debugging
 * - Provides real-time analysis progress visibility
 * 
 * User Experience:
 * - Users see every step of the analysis process
 * - Errors and warnings are clearly visible
 * - Technical messages are formatted for readability
 * - Smooth transitions between status updates
 * 
 * Integration:
 * - Works with existing updateButtonProgress system
 * - Automatically captures all console outputs during analysis
 * - Preserves original console for developer debugging
 * 
 * Last Updated: August 2024
 */

window.ConsoleToButtonBridge = (function() {
    'use strict';

    // Configuration
    const MESSAGE_DISPLAY_DURATION = 2000; // 2 seconds per message
    const RAPID_MESSAGE_DELAY = 800; // Delay for rapid successive messages
    const MAX_MESSAGE_LENGTH = 50; // Truncate long messages
    
    // State management
    let isAnalyzing = false;
    let messageQueue = [];
    let displayTimeout = null;
    let isProcessingQueue = false;
    
    // Store original console functions
    const originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error
    };

    // Initialize the bridge system
    function initialize() {
        console.log('ConsoleToButtonBridge module initialized');
        setupConsoleInterception();
    }

    // Set up console interception
    function setupConsoleInterception() {
        // Intercept console.log
        console.log = function(...args) {
            const message = formatMessage('log', args);
            if (isAnalyzing && shouldDisplayMessage(message)) {
                queueButtonMessage(message, '🔄');
            }
            // Always call original console for debugging
            originalConsole.log.apply(console, args);
        };

        // Intercept console.warn
        console.warn = function(...args) {
            const message = formatMessage('warn', args);
            if (isAnalyzing && shouldDisplayMessage(message)) {
                queueButtonMessage(message, '⚠️');
            }
            originalConsole.warn.apply(console, args);
        };

        // Intercept console.error
        console.error = function(...args) {
            const message = formatMessage('error', args);
            if (isAnalyzing && shouldDisplayMessage(message)) {
                queueButtonMessage(message, '❌');
            }
            originalConsole.error.apply(console, args);
        };
    }

    // Format console message for button display
    function formatMessage(level, args) {
        let message = args.map(arg => {
            if (typeof arg === 'object') {
                return JSON.stringify(arg, null, 0);
            }
            return String(arg);
        }).join(' ');

        // Clean up common technical patterns
        message = message
            .replace(/\s+/g, ' ') // Normalize whitespace
            .replace(/^[🔄🎯🚀📝🔍⚠️❌✅📊🎬🤖☁️📄🔑🌐]*\s*/, '') // Remove existing emojis
            .trim();

        // Truncate if too long
        if (message.length > MAX_MESSAGE_LENGTH) {
            message = message.substring(0, MAX_MESSAGE_LENGTH - 3) + '...';
        }

        return message;
    }

    // Check if message should be displayed on button
    function shouldDisplayMessage(message) {
        // Filter out messages that aren't user-relevant
        const skipPatterns = [
            /module (loaded|initialized)/i,
            /DOM loaded/i,
            /event handlers initialized/i,
            /settings.*successfully/i,
            /available.*keys/i,
            /migration/i,
            /^Button updated:/,
            /debug/i,
            /compatibility layer/i,
            /architecture status/i
        ];

        // Skip empty or very short messages
        if (!message || message.length < 5) {
            return false;
        }

        // Check against skip patterns
        for (const pattern of skipPatterns) {
            if (pattern.test(message)) {
                return false;
            }
        }

        return true;
    }

    // Queue a message for button display
    function queueButtonMessage(message, icon) {
        const formattedMessage = `${icon} ${message}`;
        messageQueue.push({
            text: formattedMessage,
            timestamp: Date.now(),
            level: icon === '❌' ? 'error' : icon === '⚠️' ? 'warn' : 'info'
        });

        // Start processing queue if not already processing
        if (!isProcessingQueue) {
            processMessageQueue();
        }
    }

    // Process the message queue with appropriate delays
    async function processMessageQueue() {
        if (isProcessingQueue || messageQueue.length === 0) {
            return;
        }

        isProcessingQueue = true;

        while (messageQueue.length > 0) {
            const messageObj = messageQueue.shift();
            
            // Update button with current message
            updateButton(messageObj.text, messageObj.level);
            
            // Wait before showing next message
            const delay = messageQueue.length > 5 ? RAPID_MESSAGE_DELAY : MESSAGE_DISPLAY_DURATION;
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        isProcessingQueue = false;
    }

    // Update the button with a message
    function updateButton(message, level) {
        const btn = document.getElementById('mainAnalyzeBtn');
        if (btn && isAnalyzing) {
            btn.textContent = message;
            
            // Add visual class based on level
            btn.classList.remove('button-info', 'button-warn', 'button-error');
            if (level === 'error') {
                btn.classList.add('button-error');
            } else if (level === 'warn') {
                btn.classList.add('button-warn');
            } else {
                btn.classList.add('button-info');
            }
        }
    }

    // Start analysis mode (begin intercepting messages for button display)
    function startAnalysisMode() {
        isAnalyzing = true;
        messageQueue = [];
        
        // RE-SETUP console interception for this analysis session
        setupConsoleInterception();
        
        console.log('🎬 Console-to-button bridge activated for analysis');
    }

    // End analysis mode (stop intercepting messages for button display)
    function endAnalysisMode() {
        // Immediately stop intercepting console messages for button display
        isAnalyzing = false;
        
        // RESTORE ORIGINAL CONSOLE FUNCTIONS - Stop interception completely!
        console.log = originalConsole.log;
        console.warn = originalConsole.warn;
        console.error = originalConsole.error;
        
        // Clear any pending timeouts immediately
        if (displayTimeout) {
            clearTimeout(displayTimeout);
            displayTimeout = null;
        }
        
        // Clean up button classes
        const btn = document.getElementById('mainAnalyzeBtn');
        if (btn) {
            btn.classList.remove('button-info', 'button-warn', 'button-error');
        }
        
        // Clear queues immediately
        messageQueue = [];
        isProcessingQueue = false;
        
        // Use ORIGINAL console to log (not intercepted)
        originalConsole.log('🏁 Console-to-button bridge deactivated - console restored to normal');
    }

    // Manual message display (for specific important messages)
    function displayMessage(message, icon = '🔄', duration = MESSAGE_DISPLAY_DURATION) {
        if (isAnalyzing) {
            queueButtonMessage(message, icon);
        }
    }

    // Get queue status for debugging
    function getQueueStatus() {
        return {
            isAnalyzing: isAnalyzing,
            queueLength: messageQueue.length,
            isProcessing: isProcessingQueue
        };
    }

    // Restore original console functions (for testing/debugging)
    function restoreConsole() {
        console.log = originalConsole.log;
        console.warn = originalConsole.warn;
        console.error = originalConsole.error;
    }

    // Public API
    return {
        initialize: initialize,
        startAnalysisMode: startAnalysisMode,
        endAnalysisMode: endAnalysisMode,
        displayMessage: displayMessage,
        getQueueStatus: getQueueStatus,
        restoreConsole: restoreConsole
    };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.ConsoleToButtonBridge.initialize);
} else {
    window.ConsoleToButtonBridge.initialize();
}