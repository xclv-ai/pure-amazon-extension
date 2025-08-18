// StatusBar.js - Simple status bar handling
// Direct DOM manipulation approach

(function() {
    let connectionStatus = 'connected';
    let statusMessage = 'Ready';

    function init() {
        console.log('StatusBar initialized');
        
        // Initialize status display
        updateConnectionStatus();
        
        // Listen for Chrome extension events
        setupChromeListeners();
    }

    function setupChromeListeners() {
        // Listen for connection status changes
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            // Check initial connection
            chrome.runtime.sendMessage({ type: 'PING' })
                .then(() => {
                    setConnectionStatus('connected', 'Ready');
                })
                .catch(() => {
                    setConnectionStatus('disconnected', 'Extension not responding');
                });
                
            // Listen for tab updates
            if (chrome.tabs && chrome.tabs.onUpdated) {
                chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
                    if (changeInfo.status === 'complete') {
                        setConnectionStatus('connected', 'Page loaded');
                    }
                });
            }
        }
    }

    function setConnectionStatus(status, message) {
        connectionStatus = status;
        statusMessage = message || (status === 'connected' ? 'Ready' : 'Disconnected');
        updateConnectionStatus();
    }

    function updateConnectionStatus() {
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
            const indicator = statusElement.querySelector('.w-2.h-2');
            const text = statusElement.querySelector('span');
            
            if (indicator) {
                // Update indicator color
                indicator.className = `w-2 h-2 rounded-full ${getStatusColor()}`;
            }
            
            if (text) {
                text.textContent = statusMessage;
            }
        }
    }

    function getStatusColor() {
        switch (connectionStatus) {
            case 'connected':
                return 'bg-brand-success';
            case 'disconnected':
                return 'bg-brand-error';
            case 'connecting':
                return 'bg-brand-warning';
            default:
                return 'bg-brand-text-tertiary';
        }
    }

    function updateStatusMessage(message, timeout = 3000) {
        const originalMessage = statusMessage;
        statusMessage = message;
        updateConnectionStatus();
        
        // Auto-revert after timeout
        if (timeout > 0) {
            setTimeout(() => {
                statusMessage = originalMessage;
                updateConnectionStatus();
            }, timeout);
        }
    }

    // Export for external use
    window.POKPOK = window.POKPOK || {};
    window.POKPOK.setStatus = setConnectionStatus;
    window.POKPOK.showStatusMessage = updateStatusMessage;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();