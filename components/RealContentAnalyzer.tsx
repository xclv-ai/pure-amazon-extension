import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTextAnalysis } from '../contexts/TextAnalysisContext';

interface ContentSource {
  id: string;
  name: string;
  type: 'url' | 'html' | 'file' | 'iframe';
  content?: string;
  url?: string;
  lastUpdated?: Date;
  wordCount?: number;
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
}

// HTML content extraction utilities
const extractTextContent = (html: string): string => {
  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Remove script and style elements
  const scripts = tempDiv.querySelectorAll('script, style, noscript');
  scripts.forEach(el => el.remove());
  
  // Get text content and clean it up
  let textContent = tempDiv.textContent || tempDiv.innerText || '';
  
  // Clean up whitespace and normalize
  textContent = textContent
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();
  
  return textContent;
};

const extractMetadata = (html: string) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  const title = tempDiv.querySelector('title')?.textContent || '';
  const metaDescription = tempDiv.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const headings = Array.from(tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => h.textContent).filter(Boolean);
  
  return { title, metaDescription, headings };
};

export function RealContentAnalyzer() {
  const { state, setClickSelection, clearClickSelection } = useTextAnalysis();
  const [contentSources, setContentSources] = useState<ContentSource[]>([]);
  const [activeSourceId, setActiveSourceId] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [htmlInput, setHtmlInput] = useState('');
  const [showHtmlInput, setShowHtmlInput] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample real-world HTML content for demonstration
  const sampleHtmlSources = [
    {
      name: 'E-commerce Product Page',
      html: `
        <html>
          <head><title>Premium Wireless Headphones - AudioTech</title></head>
          <body>
            <header>
              <h1>AudioTech Premium Wireless Headphones</h1>
              <nav>Home | Products | About | Contact</nav>
            </header>
            <main>
              <section class="product-hero">
                <h2>Experience Ultimate Sound Quality</h2>
                <p>Our flagship wireless headphones deliver crystal-clear audio with industry-leading noise cancellation technology. Perfect for professionals, audiophiles, and everyday music lovers.</p>
                <button>Buy Now - $299</button>
                <button>Add to Cart</button>
              </section>
              <section class="features">
                <h3>Key Features</h3>
                <ul>
                  <li>40-hour battery life with quick charge</li>
                  <li>Advanced noise cancellation</li>
                  <li>Premium leather ear cushions</li>
                  <li>Bluetooth 5.0 connectivity</li>
                  <li>Voice assistant integration</li>
                </ul>
              </section>
              <section class="reviews">
                <h3>Customer Reviews</h3>
                <blockquote>"Amazing sound quality! These headphones have completely transformed my daily commute. The noise cancellation is incredible."</blockquote>
                <blockquote>"Worth every penny. The build quality is exceptional and the battery life exceeds expectations."</blockquote>
              </section>
            </main>
            <footer>
              <p>© 2024 AudioTech. Premium audio solutions for discerning listeners.</p>
            </footer>
          </body>
        </html>
      `
    },
    {
      name: 'Corporate About Page',
      html: `
        <html>
          <head><title>About InnovateCorp - Leading Innovation</title></head>
          <body>
            <header>
              <h1>InnovateCorp</h1>
              <p>Transforming Industries Through Technology</p>
            </header>
            <main>
              <section class="mission">
                <h2>Our Mission</h2>
                <p>At InnovateCorp, we believe technology should empower human potential. We develop cutting-edge solutions that help businesses thrive in the digital era while maintaining focus on sustainability and ethical practices.</p>
              </section>
              <section class="values">
                <h2>Core Values</h2>
                <div class="value">
                  <h3>Innovation First</h3>
                  <p>We push boundaries and challenge conventional thinking to create breakthrough solutions.</p>
                </div>
                <div class="value">
                  <h3>Integrity Always</h3>
                  <p>Transparency, honesty, and ethical conduct guide every decision we make.</p>
                </div>
                <div class="value">
                  <h3>Customer Success</h3>
                  <p>Our clients' success is our success. We partner with them to achieve exceptional outcomes.</p>
                </div>
              </section>
              <section class="leadership">
                <h2>Leadership Team</h2>
                <p>Our diverse leadership team brings decades of experience from top-tier technology companies and research institutions.</p>
              </section>
            </main>
          </body>
        </html>
      `
    },
    {
      name: 'Blog Article',
      html: `
        <html>
          <head><title>The Future of Sustainable Technology</title></head>
          <body>
            <article>
              <header>
                <h1>The Future of Sustainable Technology: A Comprehensive Guide</h1>
                <p class="byline">By Dr. Sarah Chen | Published March 15, 2024</p>
              </header>
              <section>
                <h2>Introduction</h2>
                <p>As climate change accelerates and resources become scarce, the tech industry faces unprecedented pressure to innovate sustainably. This comprehensive analysis explores emerging trends, breakthrough technologies, and practical strategies for creating a more sustainable digital future.</p>
              </section>
              <section>
                <h2>Key Technological Breakthroughs</h2>
                <p>Recent advances in quantum computing, renewable energy integration, and circular economy principles are reshaping how we approach technology development. Companies are increasingly adopting lifecycle thinking and implementing carbon-neutral practices.</p>
                <h3>Renewable Energy Integration</h3>
                <p>Solar and wind power are becoming more efficient and cost-effective, enabling data centers to operate with minimal environmental impact.</p>
                <h3>Circular Design Principles</h3>
                <p>Modern product development emphasizes repairability, upgradability, and end-of-life recycling to minimize waste.</p>
              </section>
              <section>
                <h2>Industry Impact</h2>
                <p>Forward-thinking organizations are discovering that sustainable practices not only benefit the environment but also drive innovation, reduce costs, and enhance brand reputation.</p>
              </section>
              <section>
                <h2>Conclusion</h2>
                <p>The transition to sustainable technology is not just an environmental imperative—it's a business opportunity. Companies that embrace these changes today will lead tomorrow's markets.</p>
              </section>
            </article>
          </body>
        </html>
      `
    }
  ];

  // Initialize with sample content
  useEffect(() => {
    const initialSources: ContentSource[] = sampleHtmlSources.map((sample, index) => ({
      id: `sample-${index}`,
      name: sample.name,
      type: 'html',
      content: extractTextContent(sample.html),
      lastUpdated: new Date(),
      wordCount: extractTextContent(sample.html).split(/\s+/).length,
      status: 'success'
    }));
    
    setContentSources(initialSources);
  }, []);

  const addContentSource = useCallback((source: Omit<ContentSource, 'id' | 'lastUpdated'>) => {
    const newSource: ContentSource = {
      ...source,
      id: `source-${Date.now()}`,
      lastUpdated: new Date(),
    };
    
    setContentSources(prev => [...prev, newSource]);
    return newSource.id;
  }, []);

  const updateContentSource = useCallback((id: string, updates: Partial<ContentSource>) => {
    setContentSources(prev => prev.map(source => 
      source.id === id 
        ? { ...source, ...updates, lastUpdated: new Date() }
        : source
    ));
  }, []);

  const deleteContentSource = useCallback((id: string) => {
    setContentSources(prev => prev.filter(source => source.id !== id));
    if (activeSourceId === id) {
      setActiveSourceId(null);
      clearClickSelection();
    }
  }, [activeSourceId, clearClickSelection]);

  const handleUrlSubmit = useCallback(async () => {
    if (!urlInput.trim()) return;
    
    const sourceId = addContentSource({
      name: `URL: ${urlInput}`,
      type: 'url',
      url: urlInput,
      status: 'loading'
    });
    
    try {
      // In a real implementation, you would use a CORS proxy or server-side fetching
      // For demo purposes, we'll simulate URL fetching
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate fetched content
      const simulatedContent = `
        Content fetched from: ${urlInput}
        
        This is simulated content that would be extracted from the webpage at the provided URL. In a real implementation, this would involve:
        
        1. Fetching the HTML content from the URL
        2. Parsing the HTML to extract meaningful text
        3. Removing scripts, styles, and other non-content elements
        4. Organizing the content for analysis
        
        The fetched content would include page title, meta descriptions, headings, paragraphs, and other textual content that provides insight into the page's tone and messaging strategy.
        
        Sample extracted content: "Welcome to our innovative platform where technology meets creativity. We believe in empowering users through intuitive design and cutting-edge functionality."
      `;
      
      updateContentSource(sourceId, {
        content: simulatedContent,
        wordCount: simulatedContent.split(/\s+/).length,
        status: 'success'
      });
      
      setUrlInput('');
      setShowUrlInput(false);
    } catch (error) {
      updateContentSource(sourceId, {
        status: 'error',
        error: 'Failed to fetch URL content. This may be due to CORS restrictions or network issues.'
      });
    }
  }, [urlInput, addContentSource, updateContentSource]);

  const handleHtmlSubmit = useCallback(() => {
    if (!htmlInput.trim()) return;
    
    try {
      const extractedContent = extractTextContent(htmlInput);
      const metadata = extractMetadata(htmlInput);
      
      if (!extractedContent.trim()) {
        throw new Error('No text content found in HTML');
      }
      
      const sourceId = addContentSource({
        name: metadata.title || 'Custom HTML Content',
        type: 'html',
        content: extractedContent,
        wordCount: extractedContent.split(/\s+/).length,
        status: 'success'
      });
      
      setHtmlInput('');
      setShowHtmlInput(false);
    } catch (error) {
      // Show error message
      console.error('HTML parsing error:', error);
    }
  }, [htmlInput, addContentSource]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      try {
        let extractedContent: string;
        let name: string;
        
        if (file.type === 'text/html' || file.name.endsWith('.html')) {
          extractedContent = extractTextContent(content);
          const metadata = extractMetadata(content);
          name = metadata.title || file.name;
        } else {
          // Treat as plain text
          extractedContent = content;
          name = file.name;
        }
        
        addContentSource({
          name: `File: ${name}`,
          type: 'file',
          content: extractedContent,
          wordCount: extractedContent.split(/\s+/).length,
          status: 'success'
        });
      } catch (error) {
        console.error('File processing error:', error);
      }
    };
    
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [addContentSource]);

  const handleSourceSelect = useCallback((source: ContentSource) => {
    if (source.status !== 'success' || !source.content) return;
    
    if (activeSourceId === source.id) {
      // Deselect
      setActiveSourceId(null);
      clearClickSelection();
    } else {
      // Select new source
      setActiveSourceId(source.id);
      setClickSelection(
        source.content, 
        undefined, 
        `Real content source: ${source.name}`
      );
    }
  }, [activeSourceId, setClickSelection, clearClickSelection]);

  const getSourceIcon = (type: ContentSource['type']) => {
    switch (type) {
      case 'url': return '🌐';
      case 'html': return '📄';
      case 'file': return '📁';
      case 'iframe': return '🖼️';
      default: return '📄';
    }
  };

  const getStatusColor = (status: ContentSource['status']) => {
    switch (status) {
      case 'loading': return 'text-blue-600 bg-blue-50';
      case 'success': return 'text-green-600 bg-green-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="mt-16 bg-white border border-brand-border-light rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-jetbrains-medium text-brand-text-primary mb-2">
          🌐 Real Content Analysis
        </h2>
        <p className="text-brand-text-secondary mb-4">
          Analyze real HTML content from websites, files, or direct input
        </p>
        
        {/* Content Input Controls */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors font-jetbrains-medium text-sm"
          >
            🌐 Add URL
          </button>
          
          <button
            onClick={() => setShowHtmlInput(!showHtmlInput)}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors font-jetbrains-medium text-sm"
          >
            📄 Paste HTML
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors font-jetbrains-medium text-sm"
          >
            📁 Upload File
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".html,.htm,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* URL Input */}
        {showUrlInput && (
          <div className="bg-brand-bg-muted p-4 rounded-lg mb-4">
            <label className="block text-sm font-jetbrains-medium text-brand-text-primary mb-2">
              Website URL:
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 p-2 border border-brand-border-light rounded bg-white font-jetbrains-normal text-sm"
              />
              <button
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim()}
                className="px-4 py-2 bg-brand-accent-yellow text-brand-text-primary rounded font-jetbrains-medium text-sm disabled:opacity-50"
              >
                Fetch
              </button>
            </div>
            <p className="text-xs text-brand-text-secondary mt-2">
              Note: Due to CORS restrictions, this demo simulates URL fetching. In a real Chrome extension, you would have access to fetch any URL.
            </p>
          </div>
        )}

        {/* HTML Input */}
        {showHtmlInput && (
          <div className="bg-brand-bg-muted p-4 rounded-lg mb-4">
            <label className="block text-sm font-jetbrains-medium text-brand-text-primary mb-2">
              HTML Content:
            </label>
            <textarea
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              placeholder="<html><body>Your HTML content here...</body></html>"
              className="w-full h-32 p-2 border border-brand-border-light rounded bg-white font-jetbrains-normal text-sm resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-brand-text-secondary">
                Paste HTML content to extract and analyze text
              </p>
              <button
                onClick={handleHtmlSubmit}
                disabled={!htmlInput.trim()}
                className="px-4 py-2 bg-brand-accent-yellow text-brand-text-primary rounded font-jetbrains-medium text-sm disabled:opacity-50"
              >
                Process HTML
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content Sources List */}
      <div className="space-y-4">
        <h3 className="font-jetbrains-medium text-brand-text-primary">
          Available Content Sources ({contentSources.length})
        </h3>
        
        {contentSources.length === 0 ? (
          <div className="text-center py-8 text-brand-text-secondary">
            <p>No content sources available. Use the buttons above to add content.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {contentSources.map((source) => (
              <div
                key={source.id}
                className={`border rounded-lg p-4 transition-all cursor-pointer ${
                  activeSourceId === source.id
                    ? 'border-brand-accent-yellow bg-brand-bg-muted shadow-md'
                    : 'border-brand-border-light hover:border-gray-300 hover:bg-brand-bg-muted'
                } ${source.status === 'success' ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={() => handleSourceSelect(source)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-xl">{getSourceIcon(source.type)}</span>
                    <div className="flex-1">
                      <h4 className="font-jetbrains-medium text-brand-text-primary">
                        {source.name}
                      </h4>
                      <div className="flex items-center gap-4 mt-1 text-xs text-brand-text-secondary">
                        <span>Type: {source.type.toUpperCase()}</span>
                        {source.wordCount && <span>Words: {source.wordCount}</span>}
                        {source.lastUpdated && (
                          <span>Updated: {source.lastUpdated.toLocaleTimeString()}</span>
                        )}
                      </div>
                      
                      {source.status === 'error' && source.error && (
                        <p className="text-xs text-red-600 mt-2">{source.error}</p>
                      )}
                      
                      {source.content && activeSourceId === source.id && (
                        <div className="mt-3 p-3 bg-white border border-brand-border-light rounded text-xs">
                          <div className="font-jetbrains-medium text-brand-text-primary mb-2">Content Preview:</div>
                          <div className="text-brand-text-secondary line-clamp-3">
                            {source.content.substring(0, 200)}...
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-jetbrains-medium ${getStatusColor(source.status)}`}>
                      {source.status === 'loading' && (
                        <div className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-1"></div>
                      )}
                      {source.status}
                    </span>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteContentSource(source.id);
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete source"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                
                {activeSourceId === source.id && (
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-brand-accent-yellow rounded-full animate-pulse"></div>
                    <span className="text-brand-text-secondary">Selected for analysis</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Usage Instructions */}
      <div className="mt-8 pt-6 border-t border-brand-border-light">
        <div className="bg-brand-bg-muted p-4 rounded-lg">
          <h4 className="font-jetbrains-medium text-brand-text-primary mb-2">💡 How to Use</h4>
          <div className="text-sm text-brand-text-secondary space-y-1">
            <p>• <strong>Add URL:</strong> Fetch content from any website (simulated in demo)</p>
            <p>• <strong>Paste HTML:</strong> Directly input HTML code for analysis</p>
            <p>• <strong>Upload File:</strong> Upload .html or .txt files from your computer</p>
            <p>• <strong>Select Sources:</strong> Click on any content source to select it for analysis</p>
            <p>• <strong>Analyze:</strong> Selected content will automatically populate the Compromise.js analyzer below</p>
          </div>
        </div>
      </div>
    </div>
  );
}