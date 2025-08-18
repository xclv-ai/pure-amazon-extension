// RealContentAnalyzer.js - Simple real content analysis handling
// Direct DOM manipulation approach

(function() {
    function init() {
        console.log('RealContentAnalyzer initialized');
        
        // Setup get content button
        setupGetContentButton();
    }

    function setupGetContentButton() {
        const getContentBtn = document.getElementById('get-page-content-btn');
        
        if (getContentBtn) {
            getContentBtn.addEventListener('click', async () => {
                await handleGetPageContent();
            });
        }
    }

    async function handleGetPageContent() {
        console.log('Getting page content...');
        
        // Show loading state
        setButtonLoading('get-page-content-btn', true);
        
        try {
            // Get page content via Chrome extension API
            const response = await window.POKPOK.getPageContent();
            
            if (response.success) {
                displayContentPreview(response.content);
                console.log('Page content retrieved successfully');
            } else {
                console.error('Failed to get page content:', response.error);
                showContentError('Failed to retrieve page content');
            }
        } catch (error) {
            console.error('Get content error:', error);
            showContentError('Error retrieving page content');
        } finally {
            setButtonLoading('get-page-content-btn', false);
        }
    }

    function displayContentPreview(content) {
        const preview = document.getElementById('content-preview');
        const contentText = document.getElementById('content-text');
        
        if (preview && contentText) {
            // Show preview container
            preview.classList.remove('hidden');
            
            // Create summary of content
            const summary = createContentSummary(content);
            contentText.innerHTML = summary;
            
            // Add fade-in animation
            preview.style.opacity = '0';
            setTimeout(() => {
                preview.style.opacity = '1';
                preview.style.transition = 'opacity 0.3s ease-in-out';
            }, 100);
        }
    }

    function createContentSummary(content) {
        if (typeof content === 'string') {
            // Simple text content
            const preview = content.length > 200 ? content.substring(0, 200) + '...' : content;
            return `<div class="mb-2"><strong>Text Content:</strong></div><div>${escapeHtml(preview)}</div>`;
        } else if (content && typeof content === 'object') {
            // Structured content object
            let summary = '';
            
            if (content.title) {
                summary += `<div class="mb-2"><strong>Title:</strong> ${escapeHtml(content.title)}</div>`;
            }
            
            if (content.url) {
                summary += `<div class="mb-2"><strong>URL:</strong> ${escapeHtml(content.url)}</div>`;
            }
            
            if (content.paragraphs && content.paragraphs.length > 0) {
                summary += `<div class="mb-2"><strong>Paragraphs:</strong> ${content.paragraphs.length}</div>`;
                const firstParagraph = content.paragraphs[0];
                if (firstParagraph) {
                    const preview = firstParagraph.length > 150 ? firstParagraph.substring(0, 150) + '...' : firstParagraph;
                    summary += `<div class="text-xs mt-1 p-2 bg-brand-bg-card rounded border-l-2 border-brand-accent-teal">${escapeHtml(preview)}</div>`;
                }
            }
            
            if (content.headings && content.headings.length > 0) {
                summary += `<div class="mb-2 mt-3"><strong>Headings:</strong> ${content.headings.length}</div>`;
                content.headings.slice(0, 3).forEach(heading => {
                    summary += `<div class="text-xs text-brand-text-tertiary">• ${escapeHtml(heading.text)}</div>`;
                });
            }
            
            return summary;
        }
        
        return '<div class="text-brand-text-tertiary">No content available</div>';
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function setButtonLoading(buttonId, isLoading) {
        const button = document.getElementById(buttonId);
        if (button) {
            if (isLoading) {
                button.disabled = true;
                button.style.opacity = '0.6';
                const originalText = button.textContent;
                button.dataset.originalText = originalText;
                button.textContent = '⟳ Getting Content...';
            } else {
                button.disabled = false;
                button.style.opacity = '1';
                button.textContent = button.dataset.originalText || button.textContent;
            }
        }
    }

    function showContentError(message) {
        console.error('Content Error:', message);
        
        const preview = document.getElementById('content-preview');
        const contentText = document.getElementById('content-text');
        
        if (preview && contentText) {
            preview.classList.remove('hidden');
            contentText.innerHTML = `<div class="text-brand-error">⚠️ ${escapeHtml(message)}</div>`;
            
            // Auto-hide error after 3 seconds
            setTimeout(() => {
                preview.classList.add('hidden');
            }, 3000);
        }
    }

    // Export for external use
    window.POKPOK = window.POKPOK || {};
    window.POKPOK.refreshContent = handleGetPageContent;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();