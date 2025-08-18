// POKPOK.AI Chrome Extension - Main JavaScript
// All functionality for the Tone Analysis interface

// Logo animation
const symbols = [
    '*', '•', '◆', '▲', '●', '■', '▼', '◄', '►', '♦', '♠', '♣', '♥',
    '★', '☆', '✦', '✧', '⬢', '⬡', '◉', '◎', '○', '◇', '◈', '⟐', '⟡'
];

let animationStage = 'idle';
let cycleCount = 0;

function triggerLogoAnimation() {
    if (animationStage === 'idle') {
        animationStage = 'cycling';
        cycleCount = 0;
        cycleSymbols();
    }
}

function cycleSymbols() {
    if (animationStage !== 'cycling') return;
    
    const logoSymbol = document.getElementById('logoSymbol');
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    
    logoSymbol.textContent = randomSymbol;
    logoSymbol.className = 'logo-symbol cycling';
    
    cycleCount++;
    
    if (cycleCount >= 20) {
        animationStage = 'settling';
        settleAnimation();
    } else {
        setTimeout(cycleSymbols, 80);
    }
}

function settleAnimation() {
    const settleSymbols = ['◆', '●', '▲', '♦', '*'];
    let settleIndex = 0;
    const logoSymbol = document.getElementById('logoSymbol');
    
    function settle() {
        logoSymbol.textContent = settleSymbols[settleIndex];
        logoSymbol.className = 'logo-symbol settling';
        settleIndex++;
        
        if (settleIndex >= settleSymbols.length) {
            logoSymbol.textContent = '*';
            logoSymbol.className = 'logo-symbol';
            animationStage = 'idle';
            cycleCount = 0;
        } else {
            setTimeout(settle, 200);
        }
    }
    
    settle();
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
                content = createLookAndFeelContent();
                sectionHeader.parentNode.insertBefore(content, sectionHeader.nextSibling);
            } else if (sectionTitle.includes('DISTINCTIVE ASSETS')) {
                content = createDistinctiveAssetsContent();
                sectionHeader.parentNode.insertBefore(content, sectionHeader.nextSibling);
            } else if (sectionTitle.includes('OVERALL PERCEPTION')) {
                content = createOverallPerceptionContent();
                sectionHeader.parentNode.insertBefore(content, sectionHeader.nextSibling);
            } else if (sectionTitle.includes('COMMUNICATION FOCUS')) {
                content = createCommunicationFocusContent();
                sectionHeader.parentNode.insertBefore(content, sectionHeader.nextSibling);
            }
        }
        
        if (content && content.classList.contains('section-content')) {
            content.classList.remove('hidden');
        }
    }
}

function createLookAndFeelContent() {
    const contentDiv = document.createElement('div');
    contentDiv.className = 'section-content';
    contentDiv.innerHTML = `
        <div class="section-comment">// LOOK_AND_FEEL</div>
        <p style="font-size: 14px; color: #04252b; line-height: 1.6;">
            A cheerful, inviting, and optimistic aesthetic that consistently evokes <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">sunshine</span>, <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">natural warmth</span>, and a sense of ease. The brand identity is <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">clean, structured</span>, and focused on conveying <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">natural beauty</span> and <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">effortless results</span>.
        </p>
    `;
    return contentDiv;
}

function createDistinctiveAssetsContent() {
    const contentDiv = document.createElement('div');
    contentDiv.className = 'section-content';
    contentDiv.innerHTML = `
        <div class="section-comment">// DISTINCTIVE_ASSETS</div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: start; gap: 12px;">
                <span style="font-size: 12px; color: #717182; width: 16px;">—</span>
                <div style="font-size: 14px; color: #2d5a5a; text-transform: uppercase;">BRIGHT YELLOW PALETTE</div>
            </div>
            <div style="display: flex; align-items: start; gap: 12px;">
                <span style="font-size: 12px; color: #717182; width: 16px;">—</span>
                <div style="font-size: 14px; color: #2d5a5a; text-transform: uppercase;">BOLD TEXT FOR PROMOTIONAL MESSAGES</div>
            </div>
            <div style="display: flex; align-items: start; gap: 12px;">
                <span style="font-size: 12px; color: #717182; width: 16px;">—</span>
                <div style="font-size: 14px; color: #2d5a5a; text-transform: uppercase;">GRADIENT DOTTED PATTERN</div>
            </div>
            <div style="display: flex; align-items: start; gap: 12px;">
                <span style="font-size: 12px; color: #717182; width: 16px;">—</span>
                <div style="font-size: 14px; color: #2d5a5a; text-transform: uppercase;">BEIGE-GOLD GRADIENT/TONES</div>
            </div>
            <div style="display: flex; align-items: start; gap: 12px;">
                <span style="font-size: 12px; color: #717182; width: 16px;">—</span>
                <div style="font-size: 14px; color: #2d5a5a; text-transform: uppercase;">BOLD, SERIF TYPOGRAPHY</div>
            </div>
            <div style="display: flex; align-items: start; gap: 12px;">
                <span style="font-size: 12px; color: #717182; width: 16px;">—</span>
                <div style="font-size: 14px; color: #2d5a5a; text-transform: uppercase;">COLORFUL CIRCLES/BADGES HIGHLIGHTING BENEFITS</div>
            </div>
            <div style="display: flex; align-items: start; gap: 12px;">
                <span style="font-size: 12px; color: #717182; width: 16px;">—</span>
                <div style="font-size: 14px; color: #2d5a5a; text-transform: uppercase;">PRODUCT TUBES WITH CLEAR BRANDING</div>
            </div>
            <div style="display: flex; align-items: start; gap: 12px;">
                <span style="font-size: 12px; color: #717182; width: 16px;">—</span>
                <div style="font-size: 14px; color: #2d5a5a; text-transform: uppercase;">CREAM SMEAR/PRODUCT TEXTURE SHOTS</div>
            </div>
            <div style="display: flex; align-items: start; gap: 12px;">
                <span style="font-size: 12px; color: #717182; width: 16px;">—</span>
                <div style="font-size: 14px; color: #2d5a5a; text-transform: uppercase;">'DERMATOLOGIST RECOMMENDED' BADGE</div>
            </div>
        </div>
    `;
    return contentDiv;
}

function createOverallPerceptionContent() {
    const contentDiv = document.createElement('div');
    contentDiv.className = 'section-content';
    contentDiv.innerHTML = `
        <div class="section-comment">// OVERALL_PERCEPTION</div>
        <p style="font-size: 14px; color: #04252b; line-height: 1.6;">
            Jergens Natural Glow is perceived as a trustworthy, accessible, and uplifting beauty brand that empowers consumers to achieve a natural, healthy-looking glow with simplicity and confidence. It skillfully blends the emotional appeal of happiness and self-enhancement (The Innocent) with the reassurance of expert care and proven benefits (The Caregiver & The Sage).<br/><br/>
            
            The communication is direct, positive, and enthusiastic, devoid of unnecessary complexity. Visually, the brand communicates warmth, vibrancy, and a sunny disposition, reinforcing its promise of a beautiful, natural tan achieved effortlessly as part of a daily skincare routine. It positions itself not just as a product for tanning, but as a holistic approach to feeling good about one's skin and embracing a positive self-image.
        </p>
    `;
    return contentDiv;
}

function createCommunicationFocusContent() {
    const contentDiv = document.createElement('div');
    contentDiv.className = 'section-content';
    contentDiv.innerHTML = `
        <div class="section-comment">// COMMUNICATION_FOCUS</div>
        <p style="font-size: 14px; color: #04252b; line-height: 1.6;">
            The primary communication focus is on achieving a gradual, natural-looking, flawless tan with ease and convenience (<span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">hassle-free, daily moisturizer application</span>), while also emphasizing skin health and nourishment through key ingredients.<br/><br/>
            
            There's a strong underlying message of self-empowerment and positivity (<span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">'Create your own sunshine'</span>).
        </p>
    `;
    return contentDiv;
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
        content = `<strong>Seeking happiness and simplicity:</strong><br/><br/>The brand consistently projects an aura of happiness, simplicity, and natural optimism, making The Innocent the dominant archetype. Phrases like <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">'FLAWLESS SELF TANNER'</span> and <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">'hassle-free, streak-free color'</span> underscore an easy, problem-free approach to beauty.<br/><br/>The 'Brand story visual analysis' explicitly states the brand promotes <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">'positivity and self-confidence'</span>, encouraging consumers to <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">'create your own sunshine'</span> with a <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">'bright yellow background, suggesting energy and positivity'</span>. This cheerfulness and aspiration for a <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">'natural glow'</span> permeates all descriptions, promising a simple, uplifting transformation without complexity or artifice, directly aligning with the Innocent's desire for pure happiness and effortless beauty.`;
    } else if (archetypeName === 'The Caregiver') {
        commentHeader = 'SECONDARY_ARCHETYPE_ANALYSIS';
        content = `<strong>Compassion and service to others:</strong><br/><br/>The Jergens brand heavily emphasizes nurturing and protecting the skin, aligning strongly with The Caregiver archetype. The product is consistently presented as a <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">'Daily Moisturizer'</span> that provides <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">'Hydrating, Moisturizing, Smoothening, Nourishing'</span> benefits as seen in 'At a glance'.<br/><br/>'About this item' highlights the inclusion of <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">'antioxidants and Vitamin E'</span> to <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">'boost moisturization for healthier-looking skin'</span>, showing a clear focus on skin wellness. Furthermore, the recurrent claim of being the <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">'#1 U.S. Dermatologist Recommended Sunless Tanner Brand'</span> across multiple Product Gallery images signifies trusted, expert care and a commitment to overall skin health.`;
    } else if (archetypeName === 'The Sage') {
        commentHeader = 'TERTIARY_ARCHETYPE_ANALYSIS';
        content = `<strong>Driven by knowledge and truth:</strong><br/><br/>Jergens reinforces trust and informed decision-making by positioning itself as knowledgeable and authoritative, embodying The Sage archetype. The prominent claim of being the <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">'#1 U.S. Dermatologist Recommended Sunless Tanner Brand'</span> (seen in multiple image analyses like Image 2, 3, 6, 7) provides expert endorsement and validates the product's effectiveness and safety.<br/><br/>Additionally, the detailed breakdown of ingredients and their scientifically-backed benefits, such as <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">'Coconut oil: Known to hydrate and help skin retain moisture'</span> and <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">'Antioxidants: Known to help keep skin looking healthy and nourished'</span> in Product Gallery Image 5, demonstrates a commitment to transparency and educating the consumer, solidifying its role as a reliable source of beauty wisdom and proven results.`;
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

function analyzeSelection() {
    console.log('Analyzing selected text...');
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

// Selection mode functionality
let currentMode = 'FULL_PAGE';

function switchMode(mode) {
    currentMode = mode;
    
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
}

// Initialize indicator position on load
function initializeIndicatorPosition() {
    const indicator = document.getElementById('modeIndicator');
    if (indicator && currentMode === 'FULL_PAGE') {
        indicator.style.left = '15%'; // Center under FULL PAGE
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('POKPOK.AI: DOM loaded, initializing...');
    
    // Set up event listeners for logo animation
    const logoText = document.querySelector('.logo-text');
    const triggerButton = document.querySelector('.trigger-button');
    
    if (logoText) {
        logoText.addEventListener('click', triggerLogoAnimation);
    }
    
    if (triggerButton) {
        triggerButton.addEventListener('click', triggerLogoAnimation);
    }
    
    
    // Set up card header clicks (but prevent tone controls from triggering card toggle)
    const cardHeaders = document.querySelectorAll('.card-header');
    cardHeaders.forEach(header => {
        header.addEventListener('click', (e) => {
            // Don't toggle card if clicking on tone controls
            if (!e.target.classList.contains('tone-controls')) {
                toggleCard(header);
            }
        });
    });
    
    // Set up tone controls
    const toneControls = document.getElementById('toneControls');
    if (toneControls) {
        toneControls.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleToneControls();
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
        item.addEventListener('click', () => toggleToneItem(item));
    });
    
    // Set up section header clicks
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.addEventListener('click', () => toggleSection(header));
    });
    
    // Set up archetype clicks
    const archetypeItems = document.querySelectorAll('.archetype-item');
    archetypeItems.forEach(item => {
        item.addEventListener('click', () => toggleArchetype(item));
    });
    
    // Set up selection mode controls
    const fullPageBtn = document.getElementById('fullPageMode');
    const selectionBtn = document.getElementById('selectionMode');
    const mainAnalyzeBtn = document.getElementById('mainAnalyzeBtn');
    
    if (fullPageBtn) {
        fullPageBtn.addEventListener('click', () => switchMode('FULL_PAGE'));
    }
    
    if (selectionBtn) {
        selectionBtn.addEventListener('click', () => switchMode('SELECTION'));
    }
    
    if (mainAnalyzeBtn) {
        mainAnalyzeBtn.addEventListener('click', () => {
            if (currentMode === 'FULL_PAGE') {
                analyzePage();
            } else {
                analyzeSelection();
            }
        });
    }
    
    // Initialize indicator position
    setTimeout(() => {
        initializeIndicatorPosition();
    }, 100);
    
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
        triggerLogoAnimation();
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
    
    console.log('POKPOK.AI Chrome Extension loaded (Recreated from React version)');
});