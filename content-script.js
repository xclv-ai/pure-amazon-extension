// POKPOK.AI Content Script - Injected into web pages

console.log('POKPOK.AI content script loaded');

// Track text selection for analysis
let currentSelection = '';
let selectionChangeTimeout;

// Listen for text selection changes
document.addEventListener('selectionchange', () => {
  clearTimeout(selectionChangeTimeout);
  selectionChangeTimeout = setTimeout(() => {
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString().trim() : '';
    
    if (selectedText !== currentSelection) {
      currentSelection = selectedText;
      
      // Send selection to extension
      if (selectedText.length > 0) {
        chrome.runtime.sendMessage({
          type: 'TEXT_SELECTED',
          text: selectedText,
          timestamp: Date.now()
        }).catch(error => {
          console.log('Failed to send selection to extension:', error);
        });
      }
    }
  }, 300); // Debounce selection changes
});

// Listen for click events to track content interaction
document.addEventListener('click', (event) => {
  const target = event.target;
  
  // Extract content from clicked element
  if (target && (target.textContent || target.innerText)) {
    const content = {
      text: target.textContent || target.innerText || '',
      tagName: target.tagName,
      className: target.className,
      id: target.id,
      timestamp: Date.now()
    };
    
    // Send click content to extension
    chrome.runtime.sendMessage({
      type: 'CONTENT_CLICKED',
      content: content
    }).catch(error => {
      console.log('Failed to send click content to extension:', error);
    });
  }
});

// Helper function to extract structured content from page
function extractStructuredContent() {
  const content = {
    title: document.title,
    url: window.location.href,
    meta: {
      description: document.querySelector('meta[name="description"]')?.content || '',
      keywords: document.querySelector('meta[name="keywords"]')?.content || '',
      author: document.querySelector('meta[name="author"]')?.content || ''
    },
    headings: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
      level: parseInt(h.tagName.substring(1)),
      text: (h.textContent || h.innerText || '').trim(),
      id: h.id
    })).filter(h => h.text.length > 0),
    paragraphs: Array.from(document.querySelectorAll('p')).map(p => 
      (p.textContent || p.innerText || '').trim()
    ).filter(text => text.length > 20), // Filter out very short paragraphs
    articles: Array.from(document.querySelectorAll('article')).map(article => ({
      text: (article.textContent || article.innerText || '').trim(),
      headings: Array.from(article.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => 
        (h.textContent || h.innerText || '').trim()
      )
    })),
    lists: Array.from(document.querySelectorAll('ul, ol')).map(list => ({
      type: list.tagName.toLowerCase(),
      items: Array.from(list.querySelectorAll('li')).map(li => 
        (li.textContent || li.innerText || '').trim()
      ).filter(text => text.length > 0)
    })),
    buttons: Array.from(document.querySelectorAll('button, [role="button"], input[type="submit"], input[type="button"]')).map(btn => ({
      text: (btn.textContent || btn.innerText || btn.value || '').trim(),
      type: btn.type || 'button'
    })).filter(btn => btn.text.length > 0),
    links: Array.from(document.querySelectorAll('a[href]')).map(a => ({
      text: (a.textContent || a.innerText || '').trim(),
      href: a.href,
      title: a.title
    })).filter(link => link.text.length > 0 && link.text.length < 200) // Filter out very long link texts
  };
  
  return content;
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_PAGE_CONTENT':
      try {
        const content = extractStructuredContent();
        sendResponse({ success: true, content });
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
      break;
      
    case 'GET_SELECTED_TEXT':
      const selection = window.getSelection();
      const selectedText = selection ? selection.toString().trim() : '';
      sendResponse({ success: true, text: selectedText });
      break;
      
    case 'HIGHLIGHT_TEXT':
      // Highlight specific text on the page
      try {
        highlightText(message.text);
        sendResponse({ success: true });
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
      break;
      
    default:
      sendResponse({ success: false, error: 'Unknown message type' });
  }
  
  return true; // Keep message channel open for async response
});

// Function to highlight text on the page
function highlightText(searchText) {
  if (!searchText || searchText.length < 3) return;
  
  // Remove existing highlights
  removeHighlights();
  
  // Create highlight style if it doesn't exist
  if (!document.getElementById('pokpok-highlight-style')) {
    const style = document.createElement('style');
    style.id = 'pokpok-highlight-style';
    style.textContent = `
      .pokpok-highlight {
        background-color: rgba(246, 249, 81, 0.4) !important;
        border-radius: 2px !important;
        padding: 1px 2px !important;
        box-shadow: 0 0 0 1px rgba(246, 249, 81, 0.6) !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Simple text highlighting
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  const textNodes = [];
  let node;
  while (node = walker.nextNode()) {
    if (node.textContent.toLowerCase().includes(searchText.toLowerCase())) {
      textNodes.push(node);
    }
  }
  
  textNodes.forEach(textNode => {
    const parent = textNode.parentNode;
    if (parent && !parent.classList.contains('pokpok-highlight')) {
      const text = textNode.textContent;
      const regex = new RegExp(`(${searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      
      if (regex.test(text)) {
        const highlightedHTML = text.replace(regex, '<span class="pokpok-highlight">$1</span>');
        const wrapper = document.createElement('div');
        wrapper.innerHTML = highlightedHTML;
        
        // Replace text node with highlighted content
        while (wrapper.firstChild) {
          parent.insertBefore(wrapper.firstChild, textNode);
        }
        parent.removeChild(textNode);
      }
    }
  });
}

// Function to remove highlights
function removeHighlights() {
  const highlights = document.querySelectorAll('.pokpok-highlight');
  highlights.forEach(highlight => {
    const parent = highlight.parentNode;
    parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
    parent.normalize(); // Merge adjacent text nodes
  });
}

// Initialize content script
console.log('POKPOK.AI content script initialized for:', window.location.href);

// Send initial page load event
chrome.runtime.sendMessage({
  type: 'PAGE_LOADED',
  url: window.location.href,
  title: document.title,
  timestamp: Date.now()
}).catch(error => {
  console.log('Failed to send page load event:', error);
});