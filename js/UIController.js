/**
 * POKPOK.AI Chrome Extension v2.28.0
 * File: js/UIController.js
 * Purpose: Central UI state management and coordination
 * 
 * Key Features:
 * - Button state management (analyzing, analyzed, reset)
 * - Mode switching (FULL_PAGE ↔ SELECTION) with indicator animation
 * - Parsed content container state management (hidden/collapsed/expanded)
 * - Status text updates and UI coordination
 * - Global UI state synchronization
 * 
 * Dependencies:
 * - Chrome tabs API for mode communication to content script
 * - DOM elements: mainAnalyzeBtn, fullPageMode, selectionMode, etc.
 * - Global variables: window.currentMode, selectedElementData
 * 
 * Exposes:
 * - window.UIController.setButtonAnalyzing()
 * - window.UIController.setButtonAnalyzed()
 * - window.UIController.resetButtonState()
 * - window.UIController.updateButtonProgress()
 * - window.UIController.switchMode()
 * - window.UIController.setParsedContentState()
 * - window.UIController.showParsedContent()
 * - window.UIController.hideParsedContent()
 * - window.UIController.toggleParsedContent()
 * - window.UIController.handleElementSelection()
 * - window.UIController.initializeIndicatorPosition()
 * 
 * Integration Points:
 * - event-handlers.js: DOM event binding for mode switches
 * - content-script.js: Mode communication and element selection
 * - analysis functions: Button state feedback during analysis
 * - Settings system: UI updates based on engine selection
 * 
 * UI State Variables:
 * - window.currentMode: 'FULL_PAGE' | 'SELECTION'
 * - selectedElementData: Selected element data for analysis
 * - parsedContentState: 'hidden' | 'collapsed' | 'expanded'
 * 
 * Preserved Functionality:
 * - Exact button animation states and timing
 * - Mode indicator positioning (15% for FULL_PAGE, 85% for SELECTION)
 * - Parsed content state transitions
 * - Element selection status updates
 * - Auto-collapse after analysis completion
 * 
 * Last Updated: August 2024
 */

window.UIController = (function() {
    'use strict';

    // UI State Variables (preserved from original)
    let parsedContentState = 'hidden'; // 'hidden', 'collapsed', 'expanded'

    // Initialize UI controller
    function initialize() {
        console.log('UIController module initialized');
    }

    // Button state management functions (preserved exactly)
    function setButtonAnalyzing() {
        const btn = document.getElementById('mainAnalyzeBtn');
        if (btn) {
            btn.textContent = 'ANALYZING...';
            btn.classList.add('analyzing');
            btn.classList.remove('analyzed');
        }
    }

    // Update button text with progress message (now works with ConsoleToButtonBridge)
    function updateButtonProgress(message) {
        // The ConsoleToButtonBridge will automatically capture and display console messages
        // so we just need to log the message and it will appear on the button
        console.log(message);
    }

    function setButtonAnalyzed() {
        const btn = document.getElementById('mainAnalyzeBtn');
        if (btn) {
            btn.textContent = 'ANALYZED';
            btn.classList.remove('analyzing');
            btn.classList.add('analyzed');
            
            // Auto-collapse parsed content to show updated sliders
            setParsedContentState('collapsed');
        }
    }

    function resetButtonState() {
        const btn = document.getElementById('mainAnalyzeBtn');
        if (btn) {
            btn.classList.remove('analyzing', 'analyzed');
            // Restore original text based on current mode
            if (window.currentMode === 'FULL_PAGE') {
                btn.textContent = 'ANALYZE FULL PAGE';
            } else {
                btn.textContent = 'ANALYZE SELECTION';
            }
        }
    }

    // Mode switching functionality (preserved exactly)
    function switchMode(mode) {
        window.currentMode = mode;
        window.selectedElementData = null; // Clear selected element when switching modes
        
        const fullPageBtn = document.getElementById('fullPageMode');
        const selectionBtn = document.getElementById('selectionMode');
        const statusText = document.getElementById('statusText');
        const analyzeBtn = document.getElementById('mainAnalyzeBtn');
        const indicator = document.getElementById('modeIndicator');
        
        // Update button states
        fullPageBtn.classList.toggle('active', mode === 'FULL_PAGE');
        selectionBtn.classList.toggle('active', mode === 'SELECTION');
        
        // Update indicator position to center under labels
        if (mode === 'FULL_PAGE') {
            indicator.style.left = '15%'; // Center under FULL PAGE
            statusText.textContent = 'Full page mode active';
            analyzeBtn.textContent = 'ANALYZE FULL PAGE';
            analyzeBtn.classList.add('active');
            
            // Hide parsed content since it's not relevant for full page analysis
            hideParsedContent();
        } else {
            indicator.style.left = '85%'; // Center under SELECTION
            statusText.textContent = 'Selection mode active - click content to select';
            analyzeBtn.textContent = 'ANALYZE SELECTION';
            analyzeBtn.classList.remove('active'); // Inactive until something is selected
        }
        
        // Communicate mode change to content script through ContentHandler
        chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
            if (tabs[0] && window.ContentHandler && window.ContentHandler.sendModeChange) {
                try {
                    const response = await window.ContentHandler.sendModeChange(tabs[0].id, mode);
                    if (!response.success) {
                        console.log('Failed to send mode change to content script:', response.error);
                    }
                } catch (error) {
                    console.log('Error sending mode change to content script:', error);
                }
            } else {
                console.warn('ContentHandler not available for mode change communication');
            }
        });
    }

    // Parsed content state management (preserved exactly)
    function setParsedContentState(newState) {
        console.log(`📊 State change: ${parsedContentState} → ${newState}`);
        parsedContentState = newState;
        
        const container = document.getElementById('parsedContentContainer');
        const body = document.getElementById('parsedContentBody');
        const bracket = container.querySelector('.parsed-content-bracket');
        const toggle = document.getElementById('parsedContentToggle');
        
        switch (newState) {
            case 'hidden':
                container.classList.add('hidden');
                bracket.textContent = '[ ]';
                toggle.textContent = 'expand';
                body.style.display = 'none';
                break;
                
            case 'collapsed':
                container.classList.remove('hidden');
                bracket.textContent = '[ ]';
                toggle.textContent = 'expand';
                body.style.display = 'none';
                break;
                
            case 'expanded':
                container.classList.remove('hidden');
                bracket.textContent = '[*]';
                toggle.textContent = 'hide';
                body.style.display = 'block';
                break;
        }
    }

    // Show parsed content display (preserved exactly)
    function showParsedContent(elementData) {
        if (elementData && elementData.textContent) {
            const textDiv = document.getElementById('parsedTextContent');
            const metaDiv = document.getElementById('parsedMetadata');
            
            // Display text content
            textDiv.textContent = elementData.textContent;
            
            // Analyze with compromise.js for additional metadata
            const doc = nlp(elementData.textContent);
            const sentences = doc.sentences().length;
            const words = doc.terms().length;
            const chars = elementData.textContent.length;
            
            // Show metadata (safely)
            metaDiv.textContent = ''; // Clear existing content
            
            const metadata = [
                ['Element:', elementData.tagName.toLowerCase()],
                ['Type:', elementData.elementType],
                ['Words:', words.toString()],
                ['Sentences:', sentences.toString()],
                ['Characters:', chars.toString()],
                ['Nouns:', doc.nouns().length.toString()],
                ['Verbs:', doc.verbs().length.toString()],
                ['Adjectives:', doc.adjectives().length.toString()]
            ];
            
            metadata.forEach(([label, value]) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'parsed-metadata-item';
                
                const labelSpan = document.createElement('span');
                labelSpan.className = 'parsed-metadata-label';
                labelSpan.textContent = label;
                
                const valueSpan = document.createElement('span');
                valueSpan.textContent = value;
                
                itemDiv.appendChild(labelSpan);
                itemDiv.appendChild(valueSpan);
                metaDiv.appendChild(itemDiv);
            });
            
            // Set to expanded state using state management
            console.log('✅ showParsedContent calling setParsedContentState(expanded)');
            setParsedContentState('expanded');
        } else {
            console.log('❌ showParsedContent calling setParsedContentState(hidden)');
            setParsedContentState('hidden');
        }
    }

    // Hide parsed content display (preserved exactly)
    function hideParsedContent() {
        setParsedContentState('hidden');
    }

    // Toggle parsed content visibility (preserved exactly)
    function toggleParsedContent() {
        console.log(`🖱️ Toggle clicked - current state: ${parsedContentState}`);
        // Toggle between collapsed and expanded (never hidden from toggle)
        if (parsedContentState === 'expanded') {
            setParsedContentState('collapsed');
        } else {
            setParsedContentState('expanded');
        }
    }

    // Handle element selection from content script (preserved exactly)
    function handleElementSelection(elementData) {
        window.selectedElementData = elementData;
        
        const statusText = document.getElementById('statusText');
        const analyzeBtn = document.getElementById('mainAnalyzeBtn');
        
        if (elementData && window.currentMode === 'SELECTION') {
            // Update status to show element is selected
            const elementType = elementData.elementType || 'element';
            const elementTag = elementData.tagName || 'unknown';
            statusText.textContent = `Selected ${elementType} (${elementTag.toLowerCase()}) - ready to analyze`;
            
            // Activate the analyze button
            analyzeBtn.classList.add('active');
            
            // Show parsed content
            showParsedContent(elementData);
            
            console.log('Element selected:', elementData);
        } else {
            // No element selected
            statusText.textContent = 'Selection mode active - click content to select';
            analyzeBtn.classList.remove('active');
            hideParsedContent();
        }
    }

    // Initialize indicator position on load (preserved exactly)
    function initializeIndicatorPosition() {
        const indicator = document.getElementById('modeIndicator');
        if (indicator && window.currentMode === 'FULL_PAGE') {
            indicator.style.left = '15%'; // Center under FULL PAGE
        }
    }

    // Settings overlay functions (preserved exactly)
    function showSettings() {
        const settingsOverlay = document.getElementById('settingsOverlay');
        if (settingsOverlay) {
            settingsOverlay.classList.remove('hidden');
            // Ensure settings are loaded when showing overlay with enhanced retry
            if (typeof window.Settings !== 'undefined') {
                window.Settings.ensureSettingsLoaded().catch(error => {
                    console.error('Failed to load settings when opening overlay:', error);
                });
            }
        }
    }

    function hideSettings() {
        const settingsOverlay = document.getElementById('settingsOverlay');
        if (settingsOverlay) {
            settingsOverlay.classList.add('hidden');
        }
    }

    // Public API - exactly matching original functions
    return {
        initialize: initialize,
        setButtonAnalyzing: setButtonAnalyzing,
        setButtonAnalyzed: setButtonAnalyzed,
        resetButtonState: resetButtonState,
        updateButtonProgress: updateButtonProgress,
        switchMode: switchMode,
        setParsedContentState: setParsedContentState,
        showParsedContent: showParsedContent,
        hideParsedContent: hideParsedContent,
        toggleParsedContent: toggleParsedContent,
        handleElementSelection: handleElementSelection,
        initializeIndicatorPosition: initializeIndicatorPosition,
        showSettings: showSettings,
        hideSettings: hideSettings
    };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.UIController.initialize);
} else {
    window.UIController.initialize();
}