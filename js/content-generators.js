// content-generators.js - Static HTML content generators
// Pure template functions - no dependencies, no side effects

(function() {
    function init() {
        console.log('ContentGenerators module loaded');
    }

    function createLookAndFeel() {
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

    function createDistinctiveAssets() {
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

    function createOverallPerception() {
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

    function createCommunicationFocus() {
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

    // Export the module
    window.ContentGenerators = {
        createLookAndFeel: createLookAndFeel,
        createDistinctiveAssets: createDistinctiveAssets,
        createOverallPerception: createOverallPerception,
        createCommunicationFocus: createCommunicationFocus
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();