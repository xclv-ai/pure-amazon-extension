/**
 * POKPOK.AI Chrome Extension v2.25.0
 * File: js/event-handlers.js
 * Purpose: DOM event binding system and user interaction management
 * 
 * Key Features:
 * - Complete DOM event listener setup for extension interface
 * - Tone item click handling (click-to-show justifications)
 * - Brand archetype click handling (expandable content)
 * - Analysis button click management
 * - Mode switching between FULL_PAGE and SELECTION
 * - Settings overlay controls
 * 
 * Dependencies:
 * - analysis.js: Functions like toggleArchetype(), toggleToneItem()
 * - All UI modules that provide interactive functionality
 * 
 * Exposes:
 * - window.EventHandlers.initializeEventHandlers() - Main initialization function
 * 
 * Event Handlers Managed:
 * - .tone-item click events → toggleToneItem() for dynamic justifications
 * - .archetype-item click events → toggleArchetype() for expandable content
 * - .section-header click events → toggleSection() for collapsible sections
 * - #mainAnalyzeBtn click → analysis execution
 * - Mode switching buttons (FULL_PAGE, SELECTION)
 * - Settings overlay show/hide controls
 * 
 * Integration Points:
 * - analysis.js: Core analysis functions and UI updates
 * - Settings.js: Settings panel management
 * - Navigation.js: Tab switching functionality
 * - All interactive UI components
 * 
 * Initialization Flow:
 * 1. Set up tone item click listeners for justification system
 * 2. Set up archetype item click listeners for expandable content
 * 3. Set up section header toggling
 * 4. Set up analysis mode switching
 * 5. Set up main analysis button
 * 6. Set up settings controls
 * 
 * Last Updated: August 2024
 */

(function() {
    function init() {
        console.log('EventHandlers module loaded');
    }

    // Initialize all event listeners when DOM is loaded
    function initializeEventHandlers() {
        console.log('POKPOK.AI: DOM loaded, initializing event handlers...');
        
        // Set up event listeners for logo animation
        const logoText = document.querySelector('.logo-text');
        const triggerButton = document.querySelector('.trigger-button');
        
        if (logoText) {
            logoText.addEventListener('click', () => {
                if (window.POKPOK && window.POKPOK.triggerLogoAnimation) {
                    window.POKPOK.triggerLogoAnimation();
                }
            });
        }
        
        if (triggerButton) {
            triggerButton.addEventListener('click', () => {
                if (window.POKPOK && window.POKPOK.triggerLogoAnimation) {
                    window.POKPOK.triggerLogoAnimation();
                }
            });
        }
        
        
        // Set up card header clicks (but prevent tone controls from triggering card toggle)
        const cardHeaders = document.querySelectorAll('.card-header');
        cardHeaders.forEach(header => {
            header.addEventListener('click', (e) => {
                // Don't toggle card if clicking on tone controls
                if (!e.target.classList.contains('tone-controls')) {
                    if (typeof toggleCard === 'function') {
                        toggleCard(header);
                    }
                }
            });
        });
        
        // Set up tone controls
        const toneControls = document.getElementById('toneControls');
        if (toneControls) {
            toneControls.addEventListener('click', (e) => {
                e.stopPropagation();
                if (typeof toggleToneControls === 'function') {
                    toggleToneControls();
                }
            });
        }
        
        // Set up parsed content toggle
        const parsedContentContainer = document.getElementById('parsedContentContainer');
        if (parsedContentContainer) {
            const sectionHeader = parsedContentContainer.querySelector('.section-header');
            if (sectionHeader) {
                sectionHeader.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (typeof toggleParsedContent === 'function') {
                        toggleParsedContent();
                    }
                });
                sectionHeader.style.cursor = 'pointer';
            }
        }
        
        // Set up settings overlay functionality
        const versionText = document.getElementById('versionText');
        const settingsOverlay = document.getElementById('settingsOverlay');
        const settingsHideBtn = document.getElementById('settingsHideBtn');
        
        if (versionText && settingsOverlay && settingsHideBtn) {
            // Show settings when clicking version text
            versionText.addEventListener('click', () => {
                if (typeof showSettings === 'function') {
                    showSettings();
                }
            });
            
            // Hide settings when clicking hide button
            settingsHideBtn.addEventListener('click', () => {
                if (typeof hideSettings === 'function') {
                    hideSettings();
                }
            });
        }
        
        // Set up popover controls
        const cancelBtn = document.getElementById('cancelToneControls');
        const applyBtn = document.getElementById('applyToneControls');
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                document.getElementById('tonePopover').classList.remove('visible');
            });
        }
        
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                document.getElementById('tonePopover').classList.remove('visible');
            });
        }
        
        // Set up tone item clicks
        const toneItems = document.querySelectorAll('.tone-item');
        toneItems.forEach(item => {
            item.addEventListener('click', () => {
                if (typeof toggleToneItem === 'function') {
                    toggleToneItem(item);
                }
            });
        });
        
        // Set up section header clicks
        const sectionHeaders = document.querySelectorAll('.section-header');
        sectionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                if (typeof toggleSection === 'function') {
                    toggleSection(header);
                }
            });
        });
        
        // Set up archetype clicks
        const archetypeItems = document.querySelectorAll('.archetype-item');
        archetypeItems.forEach(item => {
            item.addEventListener('click', () => {
                if (typeof toggleArchetype === 'function') {
                    toggleArchetype(item);
                }
            });
        });
        
        // Set up selection mode controls
        const fullPageBtn = document.getElementById('fullPageMode');
        const selectionBtn = document.getElementById('selectionMode');
        const mainAnalyzeBtn = document.getElementById('mainAnalyzeBtn');
        
        if (fullPageBtn) {
            fullPageBtn.addEventListener('click', () => {
                if (typeof switchMode === 'function') {
                    switchMode('FULL_PAGE');
                }
            });
        }
        
        if (selectionBtn) {
            selectionBtn.addEventListener('click', () => {
                if (typeof switchMode === 'function') {
                    switchMode('SELECTION');
                }
            });
        }
        
        if (mainAnalyzeBtn) {
            mainAnalyzeBtn.addEventListener('click', () => {
                if (typeof window.currentMode !== 'undefined') {
                    if (window.currentMode === 'FULL_PAGE') {
                        if (typeof analyzePage === 'function') {
                            analyzePage();
                        }
                    } else {
                        if (typeof analyzeSelection === 'function') {
                            analyzeSelection();
                        }
                    }
                }
            });
        }
        
        // Initialize indicator position
        setTimeout(() => {
            if (typeof initializeIndicatorPosition === 'function') {
                initializeIndicatorPosition();
            }
        }, 100);
        
        // Listen for element selection messages from content script
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.type === 'ELEMENT_SELECTED') {
                if (typeof handleElementSelection === 'function') {
                    handleElementSelection(message.element);
                }
                sendResponse({ success: true });
            }
            return true; // Keep message channel open
        });
        
        // Close popover when clicking outside
        document.addEventListener('click', (e) => {
            const popover = document.getElementById('tonePopover');
            const toneControls = document.getElementById('toneControls');
            
            if (popover && !popover.contains(e.target) && e.target !== toneControls) {
                popover.classList.remove('visible');
            }
        });
        
        // Auto trigger logo animation on load
        setTimeout(() => {
            if (window.POKPOK && window.POKPOK.triggerLogoAnimation) {
                window.POKPOK.triggerLogoAnimation();
            }
        }, 1000);
        
        // Trigger spectrum animation on load with staggered delays
        setTimeout(() => {
            const primarySegment = document.getElementById('primarySegment');
            const secondarySegment = document.getElementById('secondarySegment');
            const tertiarySegment = document.getElementById('tertiarySegment');
            
            if (primarySegment) {
                primarySegment.classList.add('animated');
                setTimeout(() => {
                    if (secondarySegment) {
                        secondarySegment.classList.add('animated');
                        setTimeout(() => {
                            if (tertiarySegment) {
                                tertiarySegment.classList.add('animated');
                            }
                        }, 300);
                    }
                }, 200);
            }
        }, 1500);
        
        // Load saved settings on startup
        if (typeof loadSettingsOnStartup === 'function') {
            loadSettingsOnStartup();
        }
        
        console.log('POKPOK.AI Chrome Extension event handlers initialized');
    }

    // Export the module
    window.EventHandlers = {
        initializeEventHandlers: initializeEventHandlers
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();