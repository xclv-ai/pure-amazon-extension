import { TextSelection } from './TextAnalysisService';

export class ContentSelectionService {
  private static instance: ContentSelectionService;
  private selectionCallbacks: ((selection: TextSelection | null) => void)[] = [];
  private clickSelectionCallbacks: ((selection: TextSelection | null) => void)[] = [];
  private currentClickSelection: TextSelection | null = null;

  static getInstance(): ContentSelectionService {
    if (!ContentSelectionService.instance) {
      ContentSelectionService.instance = new ContentSelectionService();
    }
    return ContentSelectionService.instance;
  }

  constructor() {
    this.initializeSelectionListeners();
  }

  /**
   * Initialize event listeners for text selection
   */
  private initializeSelectionListeners(): void {
    // Listen for selection changes
    document.addEventListener('selectionchange', () => {
      this.handleSelectionChange();
    });

    // Listen for mouse up events (end of selection)
    document.addEventListener('mouseup', () => {
      setTimeout(() => this.handleSelectionChange(), 10);
    });
  }

  /**
   * Handle selection change events
   */
  private handleSelectionChange(): void {
    const selection = window.getSelection();
    
    if (!selection || selection.rangeCount === 0) {
      this.notifyCallbacks(null);
      return;
    }

    const selectedText = selection.toString().trim();
    
    if (selectedText.length === 0) {
      this.notifyCallbacks(null);
      return;
    }

    // Get the selected element and context
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const element = container.nodeType === Node.TEXT_NODE 
      ? container.parentElement 
      : container as Element;

    const textSelection: TextSelection = {
      content: selectedText,
      source: 'selected',
      element: element || undefined,
      context: this.getElementContext(element)
    };

    this.notifyCallbacks(textSelection);
  }

  /**
   * Set click-based selection (for interactive content blocks)
   */
  setClickSelection(content: string, element?: Element, context?: string): void {
    if (!content || content.trim().length === 0) {
      this.currentClickSelection = null;
    } else {
      this.currentClickSelection = {
        content: content.trim(),
        source: 'selected',
        element,
        context: context || 'Interactive content block'
      };
    }
    
    this.notifyClickSelectionCallbacks(this.currentClickSelection);
  }

  /**
   * Clear click-based selection
   */
  clearClickSelection(): void {
    this.currentClickSelection = null;
    this.notifyClickSelectionCallbacks(null);
  }

  /**
   * Get current click selection
   */
  getCurrentClickSelection(): TextSelection | null {
    return this.currentClickSelection;
  }

  /**
   * Get full page content for analysis
   */
  getFullPageContent(): TextSelection {
    // Get main content, avoiding navigation, headers, footers
    const contentSelectors = [
      'main',
      'article', 
      '[role="main"]',
      '.content',
      '.main-content',
      '#content',
      '#main'
    ];

    let contentElement: Element | null = null;
    
    for (const selector of contentSelectors) {
      contentElement = document.querySelector(selector);
      if (contentElement) break;
    }

    // Fallback to body if no main content found
    if (!contentElement) {
      contentElement = document.body;
    }

    const content = this.extractTextContent(contentElement);

    return {
      content,
      source: 'fullPage',
      element: contentElement,
      context: 'Full page content'
    };
  }

  /**
   * Extract clean text content from element
   */
  private extractTextContent(element: Element): string {
    if (!element) return '';

    // Clone element to avoid modifying original
    const clone = element.cloneNode(true) as Element;

    // Remove script, style, and other non-content elements
    const unwantedSelectors = [
      'script',
      'style', 
      'nav',
      'header',
      'footer',
      '.navigation',
      '.nav',
      '.menu',
      '.sidebar',
      '.advertisement',
      '.ad',
      '[style*="display: none"]',
      '[style*="visibility: hidden"]'
    ];

    unwantedSelectors.forEach(selector => {
      const unwanted = clone.querySelectorAll(selector);
      unwanted.forEach(el => el.remove());
    });

    return clone.textContent || '';
  }

  /**
   * Get context information about selected element
   */
  private getElementContext(element: Element | null): string {
    if (!element) return 'Unknown element';

    const tagName = element.tagName.toLowerCase();
    const className = element.className ? `.${element.className.split(' ').join('.')}` : '';
    const id = element.id ? `#${element.id}` : '';
    
    let context = tagName;
    if (id) context += id;
    if (className) context += className;

    // Add semantic context
    if (element.closest('header')) context += ' (in header)';
    else if (element.closest('nav')) context += ' (in navigation)';
    else if (element.closest('main')) context += ' (in main content)';
    else if (element.closest('article')) context += ' (in article)';
    else if (element.closest('aside')) context += ' (in sidebar)';
    else if (element.closest('footer')) context += ' (in footer)';

    return context;
  }

  /**
   * Subscribe to selection changes (text selection)
   */
  onSelectionChange(callback: (selection: TextSelection | null) => void): () => void {
    this.selectionCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.selectionCallbacks.indexOf(callback);
      if (index > -1) {
        this.selectionCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Subscribe to click selection changes
   */
  onClickSelectionChange(callback: (selection: TextSelection | null) => void): () => void {
    this.clickSelectionCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.clickSelectionCallbacks.indexOf(callback);
      if (index > -1) {
        this.clickSelectionCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Notify all callbacks of selection changes
   */
  private notifyCallbacks(selection: TextSelection | null): void {
    this.selectionCallbacks.forEach(callback => {
      try {
        callback(selection);
      } catch (error) {
        console.error('Error in selection callback:', error);
      }
    });
  }

  /**
   * Notify all callbacks of click selection changes
   */
  private notifyClickSelectionCallbacks(selection: TextSelection | null): void {
    this.clickSelectionCallbacks.forEach(callback => {
      try {
        callback(selection);
      } catch (error) {
        console.error('Error in click selection callback:', error);
      }
    });
  }

  /**
   * Get current selection (text selection)
   */
  getCurrentSelection(): TextSelection | null {
    const selection = window.getSelection();
    
    if (!selection || selection.rangeCount === 0) {
      return null;
    }

    const selectedText = selection.toString().trim();
    
    if (selectedText.length === 0) {
      return null;
    }

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const element = container.nodeType === Node.TEXT_NODE 
      ? container.parentElement 
      : container as Element;

    return {
      content: selectedText,
      source: 'selected',
      element: element || undefined,
      context: this.getElementContext(element)
    };
  }

  /**
   * Clear current selection
   */
  clearSelection(): void {
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  }
}