// POKPOK.AI Content Script - Injected into web pages

// Install error handlers IMMEDIATELY before any other code
(function installErrorHandlers() {
  window.addEventListener('error', function(event) {
    if (event.error && event.error.message && (
      event.error.message.includes('Extension context invalidated') ||
      event.error.message.includes('chrome-extension')
    )) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return true;
    }
  }, true);

  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && event.reason.message && (
      event.reason.message.includes('Extension context invalidated') ||
      event.reason.message.includes('chrome-extension')
    )) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return true;
    }
  }, true);
})();

// Wrap entire script in error protection
(function() {
  'use strict';
  
  try {
    console.log('POKPOK.AI content script loaded');
  } catch (e) {
    // Even console.log can fail if context is invalidated
  }

// Additional protection - suppress any content-script related errors
window.addEventListener('error', (event) => {
  if (event.filename && event.filename.includes('content-script.js')) {
    event.preventDefault();
    event.stopPropagation();
    return true;
  }
});

// Wrap all functionality in a massive try-catch
try {

// Check if extension context is still valid
function isExtensionContextValid() {
  try {
    return !!(chrome && chrome.runtime && chrome.runtime.id);
  } catch (error) {
    return false;
  }
}

// Helper function to safely send messages
function safeSendMessage(message) {
  // Multiple layers of validation
  if (!isExtensionContextValid()) {
    return Promise.resolve();
  }
  
  if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.sendMessage) {
    return Promise.resolve();
  }
  
  try {
    // Double-check context validity before sending
    if (!chrome.runtime.id) {
      return Promise.resolve();
    }
    
    const promise = chrome.runtime.sendMessage(message);
    if (!promise || typeof promise.catch !== 'function') {
      return Promise.resolve();
    }
    
    return promise.catch(error => {
      // Completely suppress extension context errors
      return Promise.resolve();
    });
  } catch (error) {
    // Any error in sending - silently ignore
    return Promise.resolve();
  }
}

// Track text selection for analysis
let currentSelection = '';
let selectionChangeTimeout;

// Track element selection for analysis
let currentSelectedElement = null;
let extensionMode = 'FULL_PAGE'; // Track current extension mode

// Safe text selection handler
function handleTextSelection() {
  if (!isExtensionContextValid()) {
    return; // Exit early if extension context is invalid
  }
  
  try {
    const selection = window?.getSelection?.();
    if (!selection) return;
    
    const selectedText = selection.toString()?.trim() || '';
    
    if (selectedText !== currentSelection && selectedText) {
      currentSelection = selectedText;
      
      // Send selection to extension (with additional safety)
      if (selectedText.length > 0 && isExtensionContextValid()) {
        safeSendMessage({
          type: 'TEXT_SELECTED',
          text: selectedText,
          timestamp: Date.now()
        });
      }
    }
  } catch (error) {
    // Silently handle any errors during text selection
    if (error.message && !error.message.includes('Extension context invalidated')) {
      console.log('Text selection error:', error.message);
    }
  }
}

// Listen for text selection changes with error protection
try {
  document.addEventListener('selectionchange', () => {
    clearTimeout(selectionChangeTimeout);
    selectionChangeTimeout = setTimeout(handleTextSelection, 300);
  });
} catch (error) {
  console.log('Failed to add selection change listener:', error.message);
}

// Function to extract element data for analysis
function extractElementData(element) {
  try {
    if (!element) return null;
    
    // Get element attributes
    const attributes = {};
    if (element.attributes) {
      Array.from(element.attributes).forEach(attr => {
        if (attr && attr.name) {
          attributes[attr.name] = attr.value || '';
        }
      });
    }
    
    // Get parent context
    const parent = element.parentElement;
    const parentInfo = parent ? {
      tagName: parent.tagName || '',
      className: parent.className || '',
      id: parent.id || ''
    } : null;
    
    return {
      tagName: element.tagName || '',
      textContent: (element.textContent || element.innerText || '').trim(),
      className: element.className || '',
      id: element.id || '',
      attributes: attributes,
      parent: parentInfo,
      elementType: getElementType(element),
      timestamp: Date.now()
    };
  } catch (error) {
    console.log('Error extracting element data:', error.message);
    return null;
  }
}

// Helper function to determine element type
function getElementType(element) {
  try {
    if (!element || !element.tagName) return 'other';
    
    const tag = element.tagName.toLowerCase();
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) return 'heading';
    if (tag === 'p') return 'paragraph';
    if (tag === 'a') return 'link';
    if (['button', 'input'].includes(tag)) return 'button';
    if (['img', 'picture', 'figure'].includes(tag)) return 'image';
    if (['span', 'div'].includes(tag)) return 'container';
    if (['li', 'ul', 'ol'].includes(tag)) return 'list';
    return 'other';
  } catch (error) {
    return 'other';
  }
}

// Function to clear current element selection
function clearElementSelection() {
  if (currentSelectedElement) {
    currentSelectedElement.classList.remove('pokpok-element-selected');
    currentSelectedElement = null;
  }
}

// Function to select an element
function selectElement(element) {
  // Clear previous selection
  clearElementSelection();
  
  // Only select if in SELECTION mode
  if (extensionMode !== 'SELECTION') return;
  
  // Avoid selecting the body, html, or script elements
  if (!element || ['BODY', 'HTML', 'SCRIPT', 'STYLE'].includes(element.tagName)) {
    return;
  }
  
  // Set new selection
  currentSelectedElement = element;
  element.classList.add('pokpok-element-selected');
  
  // Extract element data
  const elementData = extractElementData(element);
  
  // Send element selection to extension
  safeSendMessage({
    type: 'ELEMENT_SELECTED',
    element: elementData
  });
}

// Listen for click events to track content interaction
document.addEventListener('click', (event) => {
  try {
    const target = event.target;
    if (!target) return;
    
    // Handle element selection for SELECTION mode
    if (extensionMode === 'SELECTION') {
      event.preventDefault(); // Prevent default click behavior in selection mode
      selectElement(target);
      return;
    }
    
    // Original click tracking for other modes
    if (target && (target.textContent || target.innerText)) {
      const content = {
        text: target.textContent || target.innerText || '',
        tagName: target.tagName || '',
        className: target.className || '',
        id: target.id || '',
        timestamp: Date.now()
      };
      
      // Send click content to extension
      safeSendMessage({
        type: 'CONTENT_CLICKED',
        content: content
      });
    }
  } catch (error) {
    console.log('Click handler error:', error.message);
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
      
    case 'GET_ELEMENT_SELECTION':
      const elementData = currentSelectedElement ? extractElementData(currentSelectedElement) : null;
      sendResponse({ success: true, element: elementData });
      break;
      
    case 'SET_MODE':
      extensionMode = message.mode;
      console.log('POKPOK.AI mode changed to:', extensionMode);
      
      // Clear element selection when switching away from SELECTION mode
      if (extensionMode !== 'SELECTION') {
        clearElementSelection();
      }
      
      sendResponse({ success: true, mode: extensionMode });
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
      
    case 'CLEAR_ELEMENT_SELECTION':
      clearElementSelection();
      sendResponse({ success: true });
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

// Send initial page load event (with delay to ensure extension is ready)
setTimeout(() => {
  if (isExtensionContextValid()) {
    safeSendMessage({
      type: 'PAGE_LOADED',
      url: window.location.href,
      title: document.title,
      timestamp: Date.now()
    });
  }
}, 1000); // Wait 1 second before sending initial message

} catch (globalError) {
  // Catch any remaining errors from the entire script
  try {
    if (!globalError.message || !globalError.message.includes('Extension context invalidated')) {
      console.log('Global content script error:', globalError.message);
    }
  } catch (e) {
    // Even error logging can fail
  }
}

// Close the protective wrapper
})();