# POKPOK.AI - Tone Analysis Extension

A Chrome extension for advanced brand voice analysis using Nielsen's 4-dimensional framework. Analyze webpage content with comprehensive linguistic insights directly in your browser.

## 🌟 Features

### Core Analysis
- **Nielsen's 4-Dimensional Tone Framework**: Analyze text across humor, formality, respect, and enthusiasm dimensions
- **Brand Archetype Analysis**: Identify content alignment with 12 Jungian brand archetypes
- **Real-time Content Analysis**: Analyze selected text or entire page content instantly
- **Interactive Tone Sliders**: Visual representation of tone characteristics

### Advanced Capabilities  
- **Natural Language Processing**: Powered by Compromise.js for sophisticated text analysis
- **Structured Content Extraction**: Automatically extract headings, paragraphs, links, and other page elements
- **Text Selection Tracking**: Monitor user text selections for contextual analysis
- **Content Highlighting**: Visual highlighting of analyzed content on web pages

### User Experience
- **Side Panel Interface**: Clean, non-intrusive analysis workspace
- **Responsive Design**: Optimized for various screen sizes
- **Modern UI Components**: Built with shadcn/ui component library
- **JetBrains Mono Typography**: Professional, readable interface

## 🚀 Installation

### Development Installation
1. Clone this repository:
   ```bash
   git clone [repository-url]
   cd pure-amazon-extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select this project directory

### Chrome Web Store
*Coming soon - extension pending review*

## 📋 Usage

### Getting Started
1. Click the POKPOK.AI icon in your Chrome toolbar
2. The analysis panel will open on the right side of your browser
3. Navigate to any webpage to begin analysis

### Text Analysis Methods

#### Method 1: Page Analysis
- Click "Analyze Page" to process all content on the current webpage
- View comprehensive breakdown of headings, paragraphs, and key elements
- See overall tone characteristics and brand archetype alignment

#### Method 2: Text Selection
- Select any text on a webpage with your mouse
- The extension automatically captures and analyzes your selection
- View detailed linguistic insights in the side panel

#### Method 3: Click Analysis  
- Click on any text element on a webpage
- The extension captures the content and provides instant analysis
- Perfect for analyzing buttons, headings, or specific content blocks

### Analysis Results
Each analysis provides:
- **Tone Scores**: Visual sliders showing humor, formality, respect, and enthusiasm levels
- **Brand Archetype Match**: Identification of primary brand archetype with confidence score
- **Linguistic Insights**: Detailed breakdown of language patterns and characteristics
- **Content Structure**: Organized view of webpage elements (headings, paragraphs, lists, etc.)

## 🏗️ Technical Architecture

### Manifest V3 Compliance
Built using Chrome Extension Manifest V3 for:
- Enhanced security and performance
- Service worker background scripts
- Modern Chrome APIs

### Technology Stack
- **Frontend**: Vanilla JavaScript with React-style components
- **Styling**: Tailwind CSS + shadcn/ui components
- **NLP**: Compromise.js natural language processing
- **Icons**: Lucide React icon set
- **Typography**: JetBrains Mono font family

### Project Structure
```
pure-amazon-extension/
├── manifest.json           # Extension configuration
├── background.js           # Service worker background script
├── content-script.js       # Injected page interaction script
├── analysis-simple.html    # Main side panel interface
├── analysis.js            # Analysis logic and UI components
├── content-styles.css     # Styles for content injection
├── components/            # React-style UI components
│   ├── ui/               # shadcn/ui component library
│   ├── ToneAnalysisDisplay.tsx
│   ├── BrandAnalysisCards.tsx
│   └── ...
├── contexts/             # React context providers
├── services/             # Business logic and API services
├── hooks/               # Custom React hooks
├── styles/              # Global styles and themes
├── prompts/             # AI analysis prompts
├── icons/               # Extension icons (16, 32, 48, 128px)
└── js/                  # Compiled JavaScript modules
```

### Key Components

#### Background Service Worker (`background.js`)
- Manages extension lifecycle
- Handles side panel opening/closing
- Coordinates tab updates and permissions

#### Content Script (`content-script.js`)
- Injected into all web pages
- Captures text selections and clicks
- Extracts structured page content
- Provides text highlighting functionality

#### Analysis Interface (`analysis-simple.html` + `analysis.js`)
- Side panel user interface
- Real-time analysis display
- Interactive tone visualization
- Content management and export

## 🔧 Development

### Prerequisites
- Node.js 16+ and npm
- Chrome browser for testing
- Basic understanding of Chrome Extension development

### Development Workflow
1. Make code changes
2. Update version in `manifest.json` (required for all changes)
3. Reload extension in `chrome://extensions/`
4. Test functionality on target websites

### Key Development Files
- `manifest.json`: Extension permissions and configuration
- `background.js`: Service worker logic
- `content-script.js`: Page interaction functionality
- `analysis-simple.html`: Main UI interface
- `analysis.js`: Core analysis and rendering logic

### Testing
- Load extension in Chrome Developer Mode
- Test on various websites (Amazon, news sites, blogs)
- Verify text selection and analysis functionality
- Check side panel behavior across different tabs

## 📦 Build & Deployment

### Version Management
**Important**: Always update version numbers after any functional change:
1. Update `manifest.json` version field
2. Update version display in HTML interface
3. Follow semantic versioning (e.g., 1.60.0 → 1.61.0)

### Extension Packaging
1. Remove development files (`node_modules`, `.git`, etc.)
2. Zip remaining files for Chrome Web Store submission
3. Include all required icons and assets

## 🎯 Browser Support

- **Chrome**: Full support (primary target)
- **Edge**: Compatible with Chromium-based Edge
- **Firefox**: Not currently supported (different extension API)
- **Safari**: Not supported

## 📊 Analytics & Insights

The extension analyzes content across multiple dimensions:

### Tone Dimensions (Nielsen Framework)
1. **Humor**: Playful ↔ Serious
2. **Formality**: Casual ↔ Formal  
3. **Respect**: Irreverent ↔ Respectful
4. **Enthusiasm**: Matter-of-fact ↔ Enthusiastic

### Brand Archetypes
- Hero, Magician, Outlaw, Lover
- Jester, Everyman, Caregiver, Ruler
- Creator, Innocent, Sage, Explorer

## 🔒 Privacy & Security

### Data Handling
- **No data collection**: Extension processes content locally only
- **No external servers**: All analysis happens in your browser
- **No user tracking**: Zero telemetry or analytics collection
- **Secure permissions**: Minimal required Chrome permissions

### Permissions Used
- `sidePanel`: Display analysis interface
- `activeTab`: Access current webpage content
- `storage`: Save user preferences locally
- `scripting`: Inject content analysis scripts

## 🤝 Contributing

This is currently a private development project. For questions or suggestions:

1. Review existing code patterns and architecture
2. Follow the established component structure
3. Maintain consistency with shadcn/ui design system
4. Test thoroughly across different websites

## 📝 License

This project includes components from:
- [shadcn/ui](https://ui.shadcn.com/) - MIT License
- [Unsplash](https://unsplash.com) photos - Unsplash License

## 🔄 Version History

- **v1.60.0** (Current): Enhanced analysis capabilities and improved UI
- **v1.5x.x**: Core tone analysis framework implementation
- **v1.0.0**: Initial release with basic functionality

## 📞 Support

For technical issues or questions:
- Check browser console for error messages
- Verify extension permissions in Chrome settings
- Test with different websites to isolate issues
- Review Chrome extension developer documentation

---

**POKPOK.AI** - Advanced Brand Voice Analysis • Built with ♥️ for content creators and marketers