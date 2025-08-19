/**
 * POKPOK.AI Chrome Extension v2.48.0
 * File: analysis.js
 * Purpose: Legacy compatibility layer and module delegation coordinator
 * 
 * REFACTORED ARCHITECTURE:
 * This file now serves as a compatibility layer that delegates to the new modular architecture.
 * The original 1,295-line monolithic file has been broken down into 5 focused modules:
 * 
 * - UIController.js: Button states, mode switching, parsed content (≤300 lines)
 * - AnalysisCoordinator.js: Analysis orchestration and engine coordination (≤300 lines) 
 * - DataProcessor.js: Gemini data processing and UI updates (≤300 lines)
 * - ContentHandler.js: Chrome tabs API and content script communication (≤300 lines)
 * - SettingsManager.js: Settings coordination and Chrome storage (≤300 lines)
 * 
 * Key Features Preserved:
 * - All original functionality maintained exactly
 * - Backward compatibility for any direct function calls
 * - Global variables preserved (geminiAnalysisData, toneAnalysisData, etc.)
 * - Dynamic tone justification system (click-to-show)
 * - Dynamic brand archetype expandable system with position-based mapping
 * - Button progress updates during API calls
 * - Chrome extension architecture and communication
 * 
 * Migration Status:
 * ✅ Button state management → UIController.js
 * ✅ Analysis orchestration → AnalysisCoordinator.js
 * ✅ Data processing → DataProcessor.js
 * ✅ Content extraction → ContentHandler.js
 * ✅ Settings management → SettingsManager.js
 * ✅ All global variables preserved
 * ✅ All event handlers preserved
 * ✅ All UI interactions preserved
 * 
 * Benefits:
 * - Files ≤300 lines for optimal AI assistant context
 * - Clear separation of concerns
 * - Enhanced maintainability
 * - Easier testing and debugging
 * - Zero functionality loss
 * 
 * Dependencies:
 * - All new modular architecture files
 * - All existing modules preserved
 * - Global variables and event systems maintained
 * 
 * Last Updated: August 2024
 */

// =============================================================================
// GLOBAL VARIABLES (Preserved exactly from original)
// =============================================================================

// Global storage for Gemini analysis data (used by dynamic expandable systems)
let geminiAnalysisData = null;

// Tone analysis data with justifications for click-to-show system
let toneAnalysisData = {
    'Formal vs. Casual': {
        score: 40,
        position: 'Slightly Formal',
        justification: 'Jergens Natural Glow maintains a professional, trustworthy tone without being overly formal. Product descriptions use clear, confident language like "FLAWLESS SELF TANNER" and "#1 U.S. Dermatologist Recommended" which suggests authority and reliability. However, the communication remains accessible with phrases like "hassle-free" and "create your own sunshine," balancing professionalism with approachability to appeal to everyday consumers seeking effective beauty solutions.'
    },
    'Serious vs. Funny': {
        score: 20,
        position: 'Completely Serious',
        justification: 'The brand maintains a consistently serious, focused approach to beauty and skincare. All product descriptions emphasize functional benefits like "Hydrating, Moisturizing, Smoothening, Nourishing" and scientific credibility through dermatologist recommendations. There are no playful elements, jokes, or humorous language—the tone is earnest and results-oriented, positioning the product as a serious skincare solution rather than a fun beauty experiment.'
    },
    'Respectful vs. Irreverent': {
        score: 20,
        position: 'Deeply Respectful',
        justification: 'Jergens shows deep respect for its customers\' intelligence and skin health concerns. The brand provides detailed ingredient information, emphasizes safety through dermatologist endorsements, and uses inclusive language about "natural glow" without making assumptions about desired skin tones. The respectful approach is evident in the careful, informative product descriptions that educate rather than pressure, treating customers as informed decision-makers who value quality and expert validation.'
    },
    'Matter-of-fact vs. Enthusiastic': {
        score: 40,
        position: 'Slightly Matter-of-fact',
        justification: 'While the brand expresses some enthusiasm through phrases like "create your own sunshine" and positive imagery, the overall tone leans toward being matter-of-fact and results-focused. Product descriptions systematically list benefits, ingredients, and credentials in a straightforward manner. The enthusiasm is measured and purposeful rather than excessive, maintaining credibility while expressing optimism about the product\'s ability to deliver promised results.'
    }
};

// Selection mode functionality (preserved exactly)
window.currentMode = 'FULL_PAGE';
let selectedElementData = null; // Track selected element data
let parsedContentState = 'hidden'; // 'hidden', 'collapsed', 'expanded'

// Make global variables accessible to modules
window.toneAnalysisData = toneAnalysisData;
window.geminiAnalysisData = geminiAnalysisData;
window.selectedElementData = selectedElementData;

console.log('🔗 Global variables attached to window:', {
    toneAnalysisData: !!window.toneAnalysisData,
    geminiAnalysisData: window.geminiAnalysisData === null,
    selectedElementData: window.selectedElementData === null,
    toneKeys: Object.keys(window.toneAnalysisData)
});

// =============================================================================
// DELEGATION FUNCTIONS (Route to new modular architecture)
// =============================================================================

// Button state management functions (delegate to UIController)
function setButtonAnalyzing() {
    if (window.UIController && window.UIController.setButtonAnalyzing) {
        return window.UIController.setButtonAnalyzing();
    }
    console.warn('UIController not available, button state not updated');
}

function setButtonAnalyzed() {
    if (window.UIController && window.UIController.setButtonAnalyzed) {
        return window.UIController.setButtonAnalyzed();
    }
    console.warn('UIController not available, button state not updated');
}

function resetButtonState() {
    if (window.UIController && window.UIController.resetButtonState) {
        return window.UIController.resetButtonState();
    }
    console.warn('UIController not available, button state not updated');
}

function updateButtonProgress(message) {
    if (window.UIController && window.UIController.updateButtonProgress) {
        return window.UIController.updateButtonProgress(message);
    }
    console.warn('UIController not available, button progress not updated');
}

// Analysis functions (delegate to AnalysisCoordinator)
async function analyzePage() {
    if (window.AnalysisCoordinator && window.AnalysisCoordinator.analyzePage) {
        return await window.AnalysisCoordinator.analyzePage();
    }
    console.error('AnalysisCoordinator not available, analysis cannot proceed');
    alert('Analysis system not available. Please reload the extension.');
}

async function analyzeSelection() {
    if (window.AnalysisCoordinator && window.AnalysisCoordinator.analyzeSelection) {
        return await window.AnalysisCoordinator.analyzeSelection();
    }
    console.error('AnalysisCoordinator not available, analysis cannot proceed');
    alert('Analysis system not available. Please reload the extension.');
}

// Data processing functions (delegate to DataProcessor)
async function updateUIWithGeminiData(geminiData) {
    if (window.DataProcessor && window.DataProcessor.updateUIWithGeminiData) {
        const result = await window.DataProcessor.updateUIWithGeminiData(geminiData);
        // Keep local and global variables synchronized
        geminiAnalysisData = geminiData;
        window.geminiAnalysisData = geminiData;
        return result;
    }
    console.warn('DataProcessor not available, falling back to original function');
    // Fallback: Store data globally for expandable functions
    geminiAnalysisData = geminiData;
    window.geminiAnalysisData = geminiData;
}

function displayToneAnalysis(analysis, originalText) {
    if (window.DataProcessor && window.DataProcessor.displayToneAnalysis) {
        return window.DataProcessor.displayToneAnalysis(analysis, originalText);
    }
    console.warn('DataProcessor not available, using fallback tone analysis');
    console.log('Displaying tone analysis:', analysis);
    updateToneSliders(analysis);
}

function updateToneSliders(analysis) {
    if (window.DataProcessor && window.DataProcessor.updateToneSliders) {
        return window.DataProcessor.updateToneSliders(analysis);
    }
    console.warn('DataProcessor not available, tone sliders not updated');
}

function updateToneAnalysisData(geminiToneData) {
    if (window.DataProcessor && window.DataProcessor.updateToneAnalysisData) {
        return window.DataProcessor.updateToneAnalysisData(geminiToneData);
    }
    console.warn('DataProcessor not available, tone analysis data not updated');
}

// UI control functions (delegate to UIController)
function switchMode(mode) {
    if (window.UIController && window.UIController.switchMode) {
        return window.UIController.switchMode(mode);
    }
    console.warn('UIController not available, mode not switched');
}

function setParsedContentState(newState) {
    if (window.UIController && window.UIController.setParsedContentState) {
        return window.UIController.setParsedContentState(newState);
    }
    console.warn('UIController not available, parsed content state not updated');
}

function showParsedContent(elementData) {
    if (window.UIController && window.UIController.showParsedContent) {
        return window.UIController.showParsedContent(elementData);
    }
    console.warn('UIController not available, parsed content not shown');
}

function hideParsedContent() {
    if (window.UIController && window.UIController.hideParsedContent) {
        return window.UIController.hideParsedContent();
    }
    console.warn('UIController not available, parsed content not hidden');
}

function toggleParsedContent() {
    if (window.UIController && window.UIController.toggleParsedContent) {
        return window.UIController.toggleParsedContent();
    }
    console.warn('UIController not available, parsed content not toggled');
}

function handleElementSelection(elementData) {
    if (window.UIController && window.UIController.handleElementSelection) {
        return window.UIController.handleElementSelection(elementData);
    }
    console.warn('UIController not available, element selection not handled');
}

function initializeIndicatorPosition() {
    if (window.UIController && window.UIController.initializeIndicatorPosition) {
        return window.UIController.initializeIndicatorPosition();
    }
    console.warn('UIController not available, indicator position not initialized');
}

function showSettings() {
    if (window.UIController && window.UIController.showSettings) {
        return window.UIController.showSettings();
    }
    console.warn('UIController not available, settings not shown');
}

function hideSettings() {
    if (window.UIController && window.UIController.hideSettings) {
        return window.UIController.hideSettings();
    }
    console.warn('UIController not available, settings not hidden');
}

// Settings functions (delegate to SettingsManager)
async function loadSettingsOnStartup() {
    if (window.SettingsManager && window.SettingsManager.loadSettingsOnStartup) {
        return await window.SettingsManager.loadSettingsOnStartup();
    }
    console.warn('SettingsManager not available, settings not loaded');
}

async function waitForModule(moduleName, timeout) {
    if (window.SettingsManager && window.SettingsManager.waitForModule) {
        return await window.SettingsManager.waitForModule(moduleName, timeout);
    }
    console.warn('SettingsManager not available, module waiting not available');
}

// =============================================================================
// PRESERVED ORIGINAL FUNCTIONS (Still needed for UI interactions)
// =============================================================================

// Card toggle functionality (preserved exactly)
function toggleCard(header) {
    const card = header.closest('.analysis-card');
    const bracket = header.querySelector('.bracket');
    const toggle = header.querySelector('.toggle');
    const content = card.querySelector('.card-content');
    
    const isExpanded = bracket.textContent === '[*]';
    
    if (isExpanded) {
        // Collapse
        bracket.textContent = '[ ]';
        toggle.textContent = '[+]';
        content.classList.add('hidden');
        header.classList.remove('pink', 'teal');
        header.classList.add('collapsed');
    } else {
        // Expand
        bracket.textContent = '[*]';
        toggle.textContent = '[-]';
        content.classList.remove('hidden');
        header.classList.remove('collapsed');
        
        // Restore original color
        if (header.querySelector('.card-title').textContent.includes('Brand Archetypes Mix')) {
            header.classList.add('teal');
        } else {
            header.classList.add('pink');
        }
    }
}

// Section toggle functionality (preserved exactly)
function toggleSection(sectionHeader) {
    const bracket = sectionHeader.querySelector('.bracket');
    const toggle = sectionHeader.querySelector('.section-toggle');
    const sectionTitle = sectionHeader.querySelector('.section-title').textContent.trim();
    let content = sectionHeader.nextElementSibling;
    
    const isExpanded = bracket.textContent === '[*]';
    
    if (isExpanded) {
        // Collapse
        bracket.textContent = '[ ]';
        toggle.textContent = 'details';
        toggle.classList.add('hidden');
        if (content && content.classList.contains('section-content')) {
            content.classList.add('hidden');
        }
    } else {
        // Expand
        bracket.textContent = '[*]';
        toggle.textContent = 'hide';
        toggle.classList.remove('hidden');
        
        // Check if we need to create content for sections that don't have it
        if (!content || !content.classList.contains('section-content')) {
            // Create content for sections like LOOK & FEEL, DISTINCTIVE ASSETS, etc.
            if (sectionTitle.includes('LOOK & FEEL')) {
                content = window.ContentGenerators ? window.ContentGenerators.createLookAndFeel() : null;
                if (content) sectionHeader.parentNode.insertBefore(content, sectionHeader.nextSibling);
            } else if (sectionTitle.includes('DISTINCTIVE ASSETS')) {
                content = window.ContentGenerators ? window.ContentGenerators.createDistinctiveAssets() : null;
                if (content) sectionHeader.parentNode.insertBefore(content, sectionHeader.nextSibling);
            } else if (sectionTitle.includes('OVERALL PERCEPTION')) {
                content = window.ContentGenerators ? window.ContentGenerators.createOverallPerception() : null;
                if (content) sectionHeader.parentNode.insertBefore(content, sectionHeader.nextSibling);
            } else if (sectionTitle.includes('COMMUNICATION FOCUS')) {
                content = window.ContentGenerators ? window.ContentGenerators.createCommunicationFocus() : null;
                if (content) sectionHeader.parentNode.insertBefore(content, sectionHeader.nextSibling);
            }
        }
        
        if (content && content.classList.contains('section-content')) {
            content.classList.remove('hidden');
        }
    }
}

// Archetype toggle with expandable content - POSITION-BASED MAPPING (no name matching!)
function toggleArchetype(item) {
    const archetypeName = item.querySelector('.archetype-name').textContent;
    console.log('🏛️ Archetype clicked:', archetypeName);
    console.log('🔍 Current geminiAnalysisData status:', window.geminiAnalysisData ? 'Available' : 'NULL');
    
    // Always remove existing expandable content to ensure fresh data
    let expandableContent = item.nextElementSibling;
    if (expandableContent && expandableContent.classList.contains('archetype-expandable')) {
        console.log('🗑️ Removing existing expandable content to refresh with latest data');
        expandableContent.remove();
        return; // Let user click again to create fresh content
    }
    
    // Create expandable content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'archetype-expandable';
    contentDiv.style.background = '#faf9f7';
    contentDiv.style.padding = '12px';
    contentDiv.style.fontFamily = 'JetBrains Mono, monospace';
    contentDiv.style.borderTop = '1px solid #e2ddd4';
    
    // GET POSITION OF CLICKED ITEM (0=primary, 1=secondary, 2=tertiary)
    const archetypeItems = document.querySelectorAll('.archetype-item');
    let position = -1;
    archetypeItems.forEach((archItem, index) => {
        if (archItem === item) {
            position = index;
        }
    });
    
    console.log(`📍 Clicked item position: ${position} (0=primary, 1=secondary, 2=tertiary)`);
    
    let content = '';
    let commentHeader = '';
    
    // Set comment header based on position (regardless of data availability)
    if (position === 0) {
        commentHeader = 'PRIMARY_ARCHETYPE_ANALYSIS';
    } else if (position === 1) {
        commentHeader = 'SECONDARY_ARCHETYPE_ANALYSIS';
    } else if (position === 2) {
        commentHeader = 'TERTIARY_ARCHETYPE_ANALYSIS';
    } else {
        commentHeader = 'ARCHETYPE_ANALYSIS';
    }
    
    // Map by POSITION, not by name!
    if (window.geminiAnalysisData && window.geminiAnalysisData.brand_archetypes) {
        console.log('📊 Processing Gemini data for position:', position);
        console.log('📊 Available archetypes:', Object.keys(window.geminiAnalysisData.brand_archetypes));
        let archetypeData = null;
        
        if (position === 0) {
            // First item = PRIMARY
            archetypeData = window.geminiAnalysisData.brand_archetypes.primary;
            console.log('✅ Using PRIMARY archetype data:', archetypeData?.name);
        } else if (position === 1) {
            // Second item = SECONDARY
            archetypeData = window.geminiAnalysisData.brand_archetypes.secondary;
            console.log('✅ Using SECONDARY archetype data:', archetypeData?.name);
        } else if (position === 2) {
            // Third item = TERTIARY
            archetypeData = window.geminiAnalysisData.brand_archetypes.tertiary;
            console.log('✅ Using TERTIARY archetype data:', archetypeData?.name);
        }
        
        if (archetypeData) {
            const definition = archetypeData.definition || `${archetypeName} analysis`;
            const justification = archetypeData.justification || 'No justification available from analysis.';
            content = `<strong>${definition}</strong><br/><br/>${justification}`;
            console.log(`✅ Generated content using position ${position} data from Gemini`);
        } else {
            console.warn(`⚠️ No Gemini data for position ${position}`);
        }
    } else {
        console.warn('⚠️ No geminiAnalysisData available - analysis not run yet');
        console.log('💡 Available data:', {
            geminiAnalysisData: !!window.geminiAnalysisData,
            brand_archetypes: window.geminiAnalysisData?.brand_archetypes ? 'exists' : 'missing'
        });
    }
    
    // Simple fallback if no Gemini data
    if (!content) {
        content = `<strong>${archetypeName}:</strong><br/><br/>Analysis data not available. Please run a new analysis to see detailed archetype justifications.`;
        console.warn(`⚠️ Using fallback content`);
    }
    
    contentDiv.innerHTML = `
        <div style="font-size: 12px; color: #717182; margin-bottom: 12px;">
            // ${commentHeader}
        </div>
        <div style="font-size: 14px; color: #04252b; line-height: 1.6;">
            ${content}
        </div>
    `;
    
    // Insert after the clicked item
    item.parentNode.insertBefore(contentDiv, item.nextSibling);
}

// Tone slider functionality (preserved exactly - critical for dynamic system)
function toggleToneItem(toneItem) {
    const toneTitle = toneItem.querySelector('.tone-title').textContent;
    const data = toneAnalysisData[toneTitle];
    
    if (!data) return;
    
    // Check if justification already exists
    let justification = toneItem.nextElementSibling;
    if (justification && justification.classList.contains('tone-justification')) {
        // Toggle existing justification
        justification.classList.toggle('visible');
        return;
    }
    
    // Create justification content
    const justificationDiv = document.createElement('div');
    justificationDiv.className = 'tone-justification visible';
    justificationDiv.innerHTML = `
        <div style="font-size: 12px; color: #717182; margin-bottom: 12px;">
            // ${toneTitle.toUpperCase().replace(/\s+/g, '_')}_JUSTIFICATION
        </div>
        <div style="font-size: 14px; color: #04252b; line-height: 1.6;">
            ${data.justification}
        </div>
    `;
    
    // Insert after the tone item
    toneItem.parentNode.insertBefore(justificationDiv, toneItem.nextSibling);
}

// Tone controls popover (preserved exactly)
function toggleToneControls() {
    const popover = document.getElementById('tonePopover');
    const isVisible = popover.classList.contains('visible');
    
    if (isVisible) {
        popover.classList.remove('visible');
    } else {
        // Position popover near the button
        const button = document.getElementById('toneControls');
        const rect = button.getBoundingClientRect();
        
        popover.style.top = (rect.bottom + 10) + 'px';
        popover.style.left = Math.max(10, rect.left - 200) + 'px';
        
        popover.classList.add('visible');
        
        // Create slider controls if not already created
        createSliderControls();
    }
}

// Create slider controls (preserved exactly)
function createSliderControls() {
    const content = document.querySelector('.popover-content');
    const existingSliders = content.querySelector('.slider-controls');
    
    if (existingSliders) return; // Already created
    
    const slidersDiv = document.createElement('div');
    slidersDiv.className = 'slider-controls';
    
    const sliders = [
        { label: 'FORMALITY', leftLabel: 'Casual', rightLabel: 'Formal', value: 40 },
        { label: 'HUMOR', leftLabel: 'Serious', rightLabel: 'Funny', value: 20 },
        { label: 'RESPECT', leftLabel: 'Irreverent', rightLabel: 'Respectful', value: 20 },
        { label: 'ENTHUSIASM', leftLabel: 'Matter-of-fact', rightLabel: 'Enthusiastic', value: 40 }
    ];
    
    sliders.forEach((slider, index) => {
        const sliderDiv = document.createElement('div');
        sliderDiv.style.marginBottom = '16px';
        sliderDiv.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 12px; color: #717182; width: 24px;">[${index + 1}]</span>
                    <span style="font-size: 12px; font-weight: 500; color: #717182; width: 80px;">${slider.label}</span>
                </div>
                <span style="font-size: 12px; color: #04252b; width: 32px; text-align: right;">${slider.value}</span>
            </div>
            <div style="margin-left: 32px;">
                <div style="position: relative; width: 100%; height: 20px; background: #f5f3f0; border-radius: 10px; margin-bottom: 8px;">
                    <div style="position: absolute; width: ${slider.value}%; height: 100%; background: #2d5a5a; border-radius: 10px;"></div>
                    <div style="position: absolute; width: 12px; height: 12px; background: white; border: 2px solid #2d5a5a; border-radius: 50%; top: 4px; left: calc(${slider.value}% - 6px); cursor: pointer;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: #717182;">
                    <span>${slider.leftLabel}</span>
                    <span>${slider.rightLabel}</span>
                </div>
            </div>
        `;
        slidersDiv.appendChild(sliderDiv);
    });
    
    content.appendChild(slidersDiv);
}

// =============================================================================
// INITIALIZATION (Preserved exactly but with enhanced module coordination)
// =============================================================================

// Initialize when DOM is loaded - coordinated through EventHandlers module
document.addEventListener('DOMContentLoaded', function() {
    console.log('POKPOK.AI: DOM loaded, legacy analysis.js coordinating with new modular architecture...');
    
    // Initialize event handlers through the dedicated module
    if (window.EventHandlers && window.EventHandlers.initializeEventHandlers) {
        window.EventHandlers.initializeEventHandlers();
    } else {
        console.error('EventHandlers module not available');
    }
    
    // Load settings through new SettingsManager
    if (window.SettingsManager && window.SettingsManager.loadSettingsOnStartup) {
        window.SettingsManager.loadSettingsOnStartup();
    } else {
        console.warn('SettingsManager not available, falling back to direct settings load');
        if (typeof loadSettingsOnStartup === 'function') {
            loadSettingsOnStartup();
        }
    }
    
    console.log(`POKPOK.AI Chrome Extension loaded with new modular architecture (v${window.POKPOK_VERSION || "2.50.0"})`);
});

// =============================================================================
// COMPATIBILITY LAYER STATUS
// =============================================================================
console.log('✅ POKPOK.AI Legacy Compatibility Layer Active');
console.log('📦 Modular Architecture Status:');
console.log('  - UIController.js:', typeof window.UIController);
console.log('  - AnalysisCoordinator.js:', typeof window.AnalysisCoordinator);
console.log('  - DataProcessor.js:', typeof window.DataProcessor);
console.log('  - ContentHandler.js:', typeof window.ContentHandler);
console.log('  - SettingsManager.js:', typeof window.SettingsManager);
console.log('🎯 All original functionality preserved with enhanced modularity');