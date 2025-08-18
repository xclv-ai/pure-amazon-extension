// CompromiseDemo.js - Simple text analysis handling
// Direct DOM manipulation approach

(function() {
    function init() {
        console.log('CompromiseDemo initialized');
        
        // Setup analysis button
        setupAnalysisButton();
    }

    function setupAnalysisButton() {
        const runAnalysisBtn = document.getElementById('run-analysis-btn');
        
        if (runAnalysisBtn) {
            runAnalysisBtn.addEventListener('click', async () => {
                await handleRunAnalysis();
            });
        }
    }

    async function handleRunAnalysis() {
        const input = document.getElementById('analysis-input');
        const text = input ? input.value.trim() : '';
        
        if (!text) {
            showAnalysisError('Please enter some text to analyze');
            return;
        }
        
        console.log('Running text analysis...');
        
        // Show loading state
        setButtonLoading('run-analysis-btn', true);
        
        try {
            // Perform simple text analysis
            const analysis = performSimpleAnalysis(text);
            displayAnalysisResults(analysis);
            
            console.log('Text analysis completed:', analysis);
        } catch (error) {
            console.error('Analysis error:', error);
            showAnalysisError('Error during text analysis');
        } finally {
            setButtonLoading('run-analysis-btn', false);
        }
    }

    function performSimpleAnalysis(text) {
        // Simple analysis without external libraries
        const words = text.split(/\s+/).filter(word => word.length > 0);
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const characters = text.length;
        const charactersNoSpaces = text.replace(/\s/g, '').length;
        
        // Word frequency
        const wordFreq = {};
        words.forEach(word => {
            const clean = word.toLowerCase().replace(/[^\w]/g, '');
            if (clean.length > 2) {
                wordFreq[clean] = (wordFreq[clean] || 0) + 1;
            }
        });
        
        // Top words
        const topWords = Object.entries(wordFreq)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
        
        // Simple readability metrics
        const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
        const avgCharsPerWord = charactersNoSpaces / Math.max(words.length, 1);
        
        // Sentiment indicators
        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'best', 'perfect', 'happy'];
        const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'disgusting', 'poor', 'disappointing', 'sad'];
        
        const positiveCount = words.filter(word => 
            positiveWords.includes(word.toLowerCase().replace(/[^\w]/g, ''))
        ).length;
        const negativeCount = words.filter(word => 
            negativeWords.includes(word.toLowerCase().replace(/[^\w]/g, ''))
        ).length;
        
        return {
            basic: {
                words: words.length,
                sentences: sentences.length,
                characters: characters,
                charactersNoSpaces: charactersNoSpaces
            },
            readability: {
                avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
                avgCharsPerWord: Math.round(avgCharsPerWord * 10) / 10,
                complexity: avgWordsPerSentence > 20 ? 'High' : avgWordsPerSentence > 15 ? 'Medium' : 'Low'
            },
            frequency: {
                topWords: topWords
            },
            sentiment: {
                positive: positiveCount,
                negative: negativeCount,
                overall: positiveCount > negativeCount ? 'Positive' : 
                        negativeCount > positiveCount ? 'Negative' : 'Neutral'
            }
        };
    }

    function displayAnalysisResults(analysis) {
        const resultsContainer = document.getElementById('analysis-results');
        const resultsContent = resultsContainer.querySelector('.bg-brand-bg-muted');
        
        if (resultsContainer && resultsContent) {
            // Show results container
            resultsContainer.classList.remove('hidden');
            
            // Generate HTML for results
            const html = generateResultsHtml(analysis);
            resultsContent.innerHTML = html;
            
            // Add fade-in animation
            resultsContainer.style.opacity = '0';
            setTimeout(() => {
                resultsContainer.style.opacity = '1';
                resultsContainer.style.transition = 'opacity 0.3s ease-in-out';
            }, 100);
        }
    }

    function generateResultsHtml(analysis) {
        return `
            <div class="space-y-3">
                <div>
                    <div class="font-jetbrains-medium text-brand-text-primary mb-1">📊 Basic Statistics</div>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div>Words: <span class="text-brand-accent-teal">${analysis.basic.words}</span></div>
                        <div>Sentences: <span class="text-brand-accent-teal">${analysis.basic.sentences}</span></div>
                        <div>Characters: <span class="text-brand-accent-teal">${analysis.basic.characters}</span></div>
                        <div>No spaces: <span class="text-brand-accent-teal">${analysis.basic.charactersNoSpaces}</span></div>
                    </div>
                </div>
                
                <div>
                    <div class="font-jetbrains-medium text-brand-text-primary mb-1">📈 Readability</div>
                    <div class="text-xs space-y-1">
                        <div>Avg words/sentence: <span class="text-brand-accent-teal">${analysis.readability.avgWordsPerSentence}</span></div>
                        <div>Avg chars/word: <span class="text-brand-accent-teal">${analysis.readability.avgCharsPerWord}</span></div>
                        <div>Complexity: <span class="text-brand-accent-${analysis.readability.complexity === 'High' ? 'rose' : analysis.readability.complexity === 'Medium' ? 'yellow' : 'teal'}">${analysis.readability.complexity}</span></div>
                    </div>
                </div>
                
                ${analysis.frequency.topWords.length > 0 ? `
                <div>
                    <div class="font-jetbrains-medium text-brand-text-primary mb-1">🔤 Top Words</div>
                    <div class="text-xs space-y-1">
                        ${analysis.frequency.topWords.map(([word, count]) => 
                            `<div><span class="text-brand-accent-teal">${word}</span> (${count})</div>`
                        ).join('')}
                    </div>
                </div>
                ` : ''}
                
                <div>
                    <div class="font-jetbrains-medium text-brand-text-primary mb-1">💭 Sentiment</div>
                    <div class="text-xs space-y-1">
                        <div>Positive words: <span class="text-green-500">${analysis.sentiment.positive}</span></div>
                        <div>Negative words: <span class="text-red-500">${analysis.sentiment.negative}</span></div>
                        <div>Overall: <span class="text-brand-accent-${analysis.sentiment.overall === 'Positive' ? 'teal' : analysis.sentiment.overall === 'Negative' ? 'rose' : 'yellow'}">${analysis.sentiment.overall}</span></div>
                    </div>
                </div>
            </div>
        `;
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
        console.error('Analysis Error:', message);
        
        // Show error in results container
        const resultsContainer = document.getElementById('analysis-results');
        const resultsContent = resultsContainer.querySelector('.bg-brand-bg-muted');
        
        if (resultsContainer && resultsContent) {
            resultsContainer.classList.remove('hidden');
            resultsContent.innerHTML = `<div class="text-brand-error">⚠️ ${escapeHtml(message)}</div>`;
            
            // Auto-hide error after 3 seconds
            setTimeout(() => {
                resultsContainer.classList.add('hidden');
            }, 3000);
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Export for external use
    window.POKPOK = window.POKPOK || {};
    window.POKPOK.runTextAnalysis = handleRunAnalysis;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();