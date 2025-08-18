// ToneAnalysisDisplay.js - Simple tone analysis slider handling
// Direct DOM manipulation approach

(function() {
    const sliders = {
        formality: { slider: null, value: null },
        humor: { slider: null, value: null },
        respect: { slider: null, value: null },
        enthusiasm: { slider: null, value: null }
    };

    function init() {
        console.log('ToneAnalysisDisplay initialized');
        
        // Find and setup all sliders
        setupSliders();
        
        // Setup analysis buttons
        setupAnalysisButtons();
    }

    function setupSliders() {
        Object.keys(sliders).forEach(key => {
            const slider = document.getElementById(`${key}-slider`);
            const valueDisplay = document.getElementById(`${key}-value`);
            
            if (slider && valueDisplay) {
                sliders[key].slider = slider;
                sliders[key].value = valueDisplay;
                
                // Add event listeners
                slider.addEventListener('input', (e) => {
                    updateSliderValue(key, e.target.value);
                });
                
                // Add glow animation
                slider.addEventListener('mouseenter', () => {
                    slider.classList.add('slider-glow');
                });
                
                slider.addEventListener('mouseleave', () => {
                    slider.classList.remove('slider-glow');
                });
                
                // Initialize display
                updateSliderValue(key, slider.value);
            }
        });
    }

    function updateSliderValue(sliderName, value) {
        const sliderData = sliders[sliderName];
        if (sliderData && sliderData.value) {
            sliderData.value.textContent = `${value}%`;
            
            // Add loading animation effect
            sliderData.slider.classList.add('slider-load');
            setTimeout(() => {
                sliderData.slider.classList.remove('slider-load');
            }, 1000);
        }
    }

    function setupAnalysisButtons() {
        // Analyze Page Button
        const analyzePageBtn = document.getElementById('analyze-page-btn');
        if (analyzePageBtn) {
            analyzePageBtn.addEventListener('click', async () => {
                await handlePageAnalysis();
            });
        }

        // Analyze Selection Button
        const analyzeSelectionBtn = document.getElementById('analyze-selection-btn');
        if (analyzeSelectionBtn) {
            analyzeSelectionBtn.addEventListener('click', async () => {
                await handleSelectionAnalysis();
            });
        }
    }

    async function handlePageAnalysis() {
        console.log('Analyzing current page...');
        
        // Show loading state
        setButtonLoading('analyze-page-btn', true);
        
        try {
            // Get page content via Chrome extension API
            const response = await window.POKPOK.getPageContent();
            
            if (response.success) {
                // Simulate analysis with random values for demo
                const analysis = generateMockAnalysis(response.content);
                applyAnalysisToSliders(analysis);
                
                console.log('Page analysis completed:', analysis);
            } else {
                console.error('Failed to get page content:', response.error);
                showAnalysisError('Failed to analyze page content');
            }
        } catch (error) {
            console.error('Page analysis error:', error);
            showAnalysisError('Error during page analysis');
        } finally {
            setButtonLoading('analyze-page-btn', false);
        }
    }

    async function handleSelectionAnalysis() {
        console.log('Analyzing selected text...');
        
        // Show loading state
        setButtonLoading('analyze-selection-btn', true);
        
        try {
            // Get selected text via Chrome extension API
            const response = await window.POKPOK.analyzeSelection();
            
            if (response.success && response.selectedText) {
                // Simulate analysis with selected text
                const analysis = generateMockAnalysis(response.selectedText);
                applyAnalysisToSliders(analysis);
                
                console.log('Selection analysis completed:', analysis);
            } else {
                console.error('No text selected or failed to get selection');
                showAnalysisError('Please select some text to analyze');
            }
        } catch (error) {
            console.error('Selection analysis error:', error);
            showAnalysisError('Error during selection analysis');
        } finally {
            setButtonLoading('analyze-selection-btn', false);
        }
    }

    function generateMockAnalysis(content) {
        // Mock analysis - in real implementation this would use NLP
        const wordCount = content.split(' ').length;
        const hasExclamation = content.includes('!');
        const hasQuestion = content.includes('?');
        const avgWordLength = content.split(' ').reduce((sum, word) => sum + word.length, 0) / wordCount;
        
        return {
            formality: Math.min(90, Math.max(10, 30 + avgWordLength * 8)),
            humor: hasExclamation ? Math.random() * 40 + 40 : Math.random() * 30 + 10,
            respect: hasQuestion ? Math.random() * 30 + 50 : Math.random() * 40 + 30,
            enthusiasm: hasExclamation ? Math.random() * 30 + 60 : Math.random() * 50 + 20
        };
    }

    function applyAnalysisToSliders(analysis) {
        Object.keys(analysis).forEach(key => {
            const value = Math.round(analysis[key]);
            const sliderData = sliders[key];
            
            if (sliderData && sliderData.slider) {
                // Animate slider to new value
                animateSliderToValue(key, value);
            }
        });
    }

    function animateSliderToValue(sliderName, targetValue) {
        const sliderData = sliders[sliderName];
        if (!sliderData || !sliderData.slider) return;
        
        const currentValue = parseInt(sliderData.slider.value);
        const step = targetValue > currentValue ? 2 : -2;
        const animationStep = () => {
            const current = parseInt(sliderData.slider.value);
            
            if ((step > 0 && current < targetValue) || (step < 0 && current > targetValue)) {
                const nextValue = current + step;
                sliderData.slider.value = nextValue;
                updateSliderValue(sliderName, nextValue);
                requestAnimationFrame(animationStep);
            } else {
                // Final value
                sliderData.slider.value = targetValue;
                updateSliderValue(sliderName, targetValue);
            }
        };
        
        requestAnimationFrame(animationStep);
    }

    function setButtonLoading(buttonId, isLoading) {
        const button = document.getElementById(buttonId);
        if (button) {
            if (isLoading) {
                button.disabled = true;
                button.style.opacity = '0.6';
                const originalText = button.textContent;
                button.dataset.originalText = originalText;
                button.textContent = '⟳ Analyzing...';
            } else {
                button.disabled = false;
                button.style.opacity = '1';
                button.textContent = button.dataset.originalText || button.textContent;
            }
        }
    }

    function showAnalysisError(message) {
        // Simple error display - could be enhanced with toast notifications
        console.error('Analysis Error:', message);
        
        // Briefly flash error state on UI
        const display = document.getElementById('tone-analysis-display');
        if (display) {
            display.style.borderColor = 'var(--brand-error)';
            setTimeout(() => {
                display.style.borderColor = '';
            }, 2000);
        }
    }

    // Export functions for external use
    window.POKPOK = window.POKPOK || {};
    window.POKPOK.updateToneAnalysis = applyAnalysisToSliders;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();