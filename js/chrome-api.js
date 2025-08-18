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
    }
};

console.log('POKPOK.AI extension loaded successfully');