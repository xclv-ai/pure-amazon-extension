// POKPOK.AI Chrome Extension - Main JavaScript
// UI and interaction functionality - Analysis delegated to basic_analysis.js
function displayToneAnalysis(analysis, originalText) {
    console.log('Displaying tone analysis:', analysis);
    
    // Replace popup with slider updates
    updateToneSliders(analysis);
    console.log(`Tone analysis completed for: "${originalText.substring(0, 50)}${originalText.length > 50 ? '...' : ''}"`);
}

// Update tone sliders with analysis results - works with existing UI
function updateToneSliders(analysis) {
    console.log('Updating tone sliders with analysis:', analysis);
    
    if (!analysis || !analysis.rawScores) {
        console.warn('No analysis data provided for slider updates');
        return;
    }
    
    // Map analysis keys to UI tone titles (exact matches)
    const toneMapping = {
        'Formal vs. Casual': 'Formal vs. Casual',
        'Serious vs. Humorous': 'Serious vs. Funny',
        'Respectful vs. Irreverent': 'Respectful vs. Irreverent', 
        'Enthusiastic vs. Matter-of-fact': 'Matter-of-fact vs. Enthusiastic'
    };
    
    // Update each tone dimension
    Object.keys(analysis.rawScores).forEach(analysisKey => {
        const uiTitle = toneMapping[analysisKey];
        if (!uiTitle) {
            console.warn(`No UI mapping found for analysis key: ${analysisKey}`);
            return;
        }
        
        // Find the tone item by title
        const toneItems = document.querySelectorAll('.tone-item');
        let targetItem = null;
        
        toneItems.forEach(item => {
            const titleElement = item.querySelector('.tone-title');
            if (titleElement && titleElement.textContent.trim() === uiTitle) {
                targetItem = item;
            }
        });
        
        if (!targetItem) {
            console.warn(`Could not find tone item for: ${uiTitle}`);
            return;
        }
        
        // Get analysis values
        const rawScore = analysis.rawScores[analysisKey]; // 0-100
        const toneData = analysis.tones[analysisKey];
        
        // Update score (X/5 format)
        const scoreElement = targetItem.querySelector('.tone-score');
        if (scoreElement && toneData) {
            scoreElement.textContent = `${toneData.scale}/5`;
        }
        
        // Update position label
        const positionElement = targetItem.querySelector('.tone-position');
        if (positionElement && toneData) {
            positionElement.textContent = toneData.label;
        }
        
        // Update slider indicator position
        const indicatorElement = targetItem.querySelector('.slider-indicator');
        if (indicatorElement) {
            const leftPercentage = Math.max(0, Math.min(100, rawScore));
            indicatorElement.style.left = `${leftPercentage}%`;
        }
        
        console.log(`Updated ${uiTitle}: ${rawScore}% → ${toneData ? toneData.scale : '?'}/5`);
    });
}


// Card toggle functionality
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

// Section toggle functionality
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

// Archetype toggle with expandable content
function toggleArchetype(item) {
    const archetypeName = item.querySelector('.archetype-name').textContent;
    console.log('Archetype clicked:', archetypeName);
    
    // Check if expandable content already exists
    let expandableContent = item.nextElementSibling;
    if (expandableContent && expandableContent.classList.contains('archetype-expandable')) {
        // Toggle existing content
        if (expandableContent.style.display === 'none') {
            expandableContent.style.display = 'block';
        } else {
            expandableContent.style.display = 'none';
        }
        return;
    }
    
    // Create expandable content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'archetype-expandable';
    contentDiv.style.background = '#faf9f7';
    contentDiv.style.padding = '12px';
    contentDiv.style.fontFamily = 'JetBrains Mono, monospace';
    contentDiv.style.borderTop = '1px solid #e2ddd4';
    
    // Get content based on archetype
    let content = '';
    let commentHeader = '';
    
    if (archetypeName === 'The Innocent') {
        commentHeader = 'PRIMARY_ARCHETYPE_ANALYSIS';
        content = '<strong>Seeking happiness and simplicity:</strong><br/><br/>The brand consistently projects an aura of happiness, simplicity, and natural optimism, making The Innocent the dominant archetype. Phrases like <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'FLAWLESS SELF TANNER\'</span> and <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'hassle-free, streak-free color\'</span> underscore an easy, problem-free approach to beauty.<br/><br/>The \'Brand story visual analysis\' explicitly states the brand promotes <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'positivity and self-confidence\'</span>, encouraging consumers to <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'create your own sunshine\'</span> with a <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'bright yellow background, suggesting energy and positivity\'</span>. This cheerfulness and aspiration for a <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'natural glow\'</span> permeates all descriptions, promising a simple, uplifting transformation without complexity or artifice, directly aligning with the Innocent\'s desire for pure happiness and effortless beauty.';
    } else if (archetypeName === 'The Caregiver') {
        commentHeader = 'SECONDARY_ARCHETYPE_ANALYSIS';
        content = '<strong>Compassion and service to others:</strong><br/><br/>The Jergens brand heavily emphasizes nurturing and protecting the skin, aligning strongly with The Caregiver archetype. The product is consistently presented as a <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'Daily Moisturizer\'</span> that provides <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'Hydrating, Moisturizing, Smoothening, Nourishing\'</span> benefits as seen in \'At a glance\'.<br/><br/>\'About this item\' highlights the inclusion of <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'antioxidants and Vitamin E\'</span> to <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'boost moisturization for healthier-looking skin\'</span>, showing a clear focus on skin wellness. Furthermore, the recurrent claim of being the <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'#1 U.S. Dermatologist Recommended Sunless Tanner Brand\'</span> across multiple Product Gallery images signifies trusted, expert care and a commitment to overall skin health.';
    } else if (archetypeName === 'The Sage') {
        commentHeader = 'TERTIARY_ARCHETYPE_ANALYSIS';
        content = '<strong>Driven by knowledge and truth:</strong><br/><br/>Jergens reinforces trust and informed decision-making by positioning itself as knowledgeable and authoritative, embodying The Sage archetype. The prominent claim of being the <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'#1 U.S. Dermatologist Recommended Sunless Tanner Brand\'</span> (seen in multiple image analyses like Image 2, 3, 6, 7) provides expert endorsement and validates the product\'s effectiveness and safety.<br/><br/>Additionally, the detailed breakdown of ingredients and their scientifically-backed benefits, such as <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'Coconut oil: Known to hydrate and help skin retain moisture\'</span> and <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'Antioxidants: Known to help keep skin looking healthy and nourished\'</span> in Product Gallery Image 5, demonstrates a commitment to transparency and educating the consumer, solidifying its role as a reliable source of beauty wisdom and proven results.';
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


// Action functions
function analyzePage() {
    console.log('Analyzing current page...');
}

async function analyzeSelection() {
    if (selectedElementData) {
        console.log('Analyzing selected element:', selectedElementData);
        
        // Create analysis text from element
        const analysisText = selectedElementData.textContent || 'No text content';
        
        if (analysisText.length > 10) {
            // Use the existing analysis functions
            console.log('About to call analyzeText function, typeof analyzeText:', typeof analyzeText);
            if (typeof window.BasicAnalysis !== 'undefined' && window.BasicAnalysis.analyzeText) {
                const toneAnalysis = await window.BasicAnalysis.analyzeText(analysisText);
                displayToneAnalysis(toneAnalysis, analysisText);
            } else {
                console.error('analyzeText function is not available');
                alert('Analysis function not available. Please reload the extension.');
            }
        } else {
            console.log('Selected element has insufficient text content for analysis');
            alert('Selected element has insufficient text content for meaningful analysis. Please select an element with more text.');
        }
    } else {
        console.log('Analyzing selected text...');
        
        // Get selected text from content script
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: 'GET_SELECTED_TEXT'
                }).then(response => {
                    if (response.success && response.text && response.text.length > 10) {
                        window.BasicAnalysis.analyzeText(response.text).then(analysis => {
                            displayToneAnalysis(analysis, response.text);
                        });
                    } else {
                        alert('Please select some text on the page first.');
                    }
                }).catch(error => {
                    console.error('Failed to get selected text:', error);
                    alert('Failed to get selected text. Please try again.');
                });
            }
        });
    }
}

// Tone analysis data with justifications
const toneAnalysisData = {
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

// Tone slider functionality
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

// Tone controls popover
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

// Selection mode functionality - globally accessible
window.currentMode = 'FULL_PAGE';
let selectedElementData = null; // Track selected element data

// Parsed content state management
let parsedContentState = 'hidden'; // 'hidden', 'collapsed', 'expanded'

// Single function to update UI based on state
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

function switchMode(mode) {
    window.currentMode = mode;
    selectedElementData = null; // Clear selected element when switching modes
    
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
    } else {
        indicator.style.left = '85%'; // Center under SELECTION
        statusText.textContent = 'Selection mode active - click content to select';
        analyzeBtn.textContent = 'ANALYZE SELECTION';
        analyzeBtn.classList.remove('active'); // Inactive until something is selected
    }
    
    // Communicate mode change to content script
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: 'SET_MODE',
                mode: mode
            }).catch(error => {
                console.log('Failed to send mode change to content script:', error);
            });
        }
    });
}

// Handle element selection from content script
function handleElementSelection(elementData) {
    selectedElementData = elementData;
    
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

// Show parsed content display
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

// Hide parsed content display
function hideParsedContent() {
    setParsedContentState('hidden');
}

// Toggle parsed content visibility
function toggleParsedContent() {
    console.log(`🖱️ Toggle clicked - current state: ${parsedContentState}`);
    // Toggle between collapsed and expanded (never hidden from toggle)
    if (parsedContentState === 'expanded') {
        setParsedContentState('collapsed');
    } else {
        setParsedContentState('expanded');
    }
}

// Settings overlay functions
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

// Initialize indicator position on load
function initializeIndicatorPosition() {
    const indicator = document.getElementById('modeIndicator');
    if (indicator && window.currentMode === 'FULL_PAGE') {
        indicator.style.left = '15%'; // Center under FULL PAGE
    }
}

// POKPOK.AI Analysis Functions

// Initialize when DOM is loaded - delegated to EventHandlers module
document.addEventListener('DOMContentLoaded', function() {
    console.log('POKPOK.AI: DOM loaded, delegating to EventHandlers module...');
    
    // Initialize event handlers through the dedicated module
    if (window.EventHandlers && window.EventHandlers.initializeEventHandlers) {
        window.EventHandlers.initializeEventHandlers();
    } else {
        console.error('EventHandlers module not available');
    }
    
    console.log('POKPOK.AI Chrome Extension loaded (Recreated from React version)');
});

// Load settings on startup with enhanced reliability
async function loadSettingsOnStartup() {
    try {
        console.log('Loading settings on startup...');
        
        // Wait for Settings module to be available
        await waitForModule('Settings', 5000);
        
        if (typeof window.Settings !== 'undefined' && window.Settings.ensureSettingsLoaded) {
            const settings = await window.Settings.ensureSettingsLoaded();
            if (settings) {
                console.log('Settings loaded on startup:', {
                    version: settings.version,
                    model: settings.model,
                    hasApiKey: !!settings.apiKey,
                    supabaseDb: settings.supabaseDb
                });
                
                // Store settings globally for use in other modules
                window.pokpokSettings = settings;
            } else {
                console.log('No saved settings found on startup');
            }
        } else {
            console.warn('Settings module not available, falling back to direct storage access');
            
            // Fallback to direct storage access
            if (typeof window.POKPOK !== 'undefined' && window.POKPOK.storage) {
                const settings = await window.POKPOK.storage.loadSettings();
                if (settings) {
                    window.pokpokSettings = settings;
                    console.log('Settings loaded via fallback method');
                }
            }
        }
    } catch (error) {
        console.error('Failed to load settings on startup:', error);
        // Don't throw - extension should still work without saved settings
    }
}

// Wait for a module to be available
async function waitForModule(moduleName, timeout = 5000) {
    const start = Date.now();
    
    while (Date.now() - start < timeout) {
        if (typeof window[moduleName] !== 'undefined') {
            return window[moduleName];
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error(`Module ${moduleName} not available after ${timeout}ms`);
}