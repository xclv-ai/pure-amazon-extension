# POKPOK.AI - Tone Analysis Chrome Extension v2.7.0

A Chrome extension for advanced brand voice analysis using Nielsen's 4-dimensional framework. Real-time tone analysis with integrated UI sliders and animated feedback.

## 🌟 Current Features

### Core Analysis System
- **Nielsen's 4-Dimensional Tone Framework**: Real-time analysis across 4 dimensions:
  - Formal vs. Casual (0-100% scale)
  - Serious vs. Funny (Humorous in analysis, Funny in UI)
  - Respectful vs. Irreverent 
  - Matter-of-fact vs. Enthusiastic (Enthusiastic vs. Matter-of-fact in analysis)
- **Live Slider Updates**: Analysis results directly update visual sliders (no more popup interruption)
- **Button State Animations**: "ANALYZING..." pulse animation → "ANALYZED" rose color confirmation
- **Auto-Collapse**: Parsed content automatically collapses after analysis to show slider results
- **Brand Archetype Analysis**: 12 Jungian archetypes with expandable details

### Text Selection & Analysis
- **Element Selection Mode**: Click webpage elements for targeted analysis
- **Text Selection Mode**: Select any text on webpage for analysis  
- **Parsed Content Display**: Shows selected element metadata (words, sentences, tags)
- **Universal Analysis Flow**: Works with current compromise.js (future Gemini API ready)

## 🏗️ Technical Architecture (Updated 2024)

### Project Cleanup
- **✅ Node.js Dependencies Removed**: Eliminated 16MB of redundant files
- **Pure Chrome Extension**: No build process needed - runs vanilla JS
- **Pre-built Libraries**: Uses `lib/compromise.min.js` (340KB) directly in browser
- **Clean Structure**: No package.json, node_modules, or npm dependencies

### Modular JavaScript Architecture

#### **Core Files**
```
pure-amazon-extension/
├── manifest.json              # v2.7.0 - Extension config
├── analysis-simple.html       # Main UI (1380+ lines, includes CSS)
├── analysis.js                # Main controller (594 lines, reduced from 782)
├── background.js              # Service worker
├── content-script.js          # Page interaction
├── content-styles.css         # Injected styles
├── lib/compromise.min.js      # Pre-built NLP library (340KB)
└── js/                        # Modular architecture:
    ├── basic_analysis.js      # (397 lines) Text analysis logic
    ├── content-generators.js  # (95 lines) Static HTML generators  
    ├── event-handlers.js      # (188 lines) DOM event bindings
    ├── AnimatedLogo.js        # (78 lines) Logo animation
    └── [Other modules...]     # Additional UI components
```

#### **Module Loading Order** (analysis-simple.html)
```javascript
1. lib/compromise.min.js           // NLP engine (compromise.js)
2. js/basic_analysis.js            // Core tone analysis functions
3. js/content-generators.js       // Static content templates  
4. js/chrome-api.js                // Chrome extension API wrapper
5. js/Settings.js                  // Configuration management
6. js/AnimatedLogo.js              // Logo symbol animation
7. js/StatusBar.js                 // Connection status UI
8. js/Navigation.js                // Tab navigation
9. js/ContentAnalysisSwitch.js     // Mode switching logic
10. js/ToneAnalysisDisplay.js      // Slider display components
11. js/CompromiseDemo.js           // Analysis demo controls
12. js/BrandAnalysisCards.js       # Static archetype UI
13. js/event-handlers.js           # DOM event listeners (NEW v2.5.0)
14. analysis.js                    # Main application controller
```

### **Key Integration Points**

#### **Analysis Flow (v2.6.0 → v2.7.0)**
```javascript
// 1. User clicks "ANALYZE SELECTION" button
analyzeSelection() {
    setButtonAnalyzing();              // Button → "ANALYZING..." + pulse animation
    
    // 2. Call analysis engine  
    const analysis = await window.BasicAnalysis.analyzeText(text);
    
    // 3. Update UI sliders (no popup!)
    displayToneAnalysis(analysis, text) → updateToneSliders(analysis);
    
    // 4. Completion feedback
    setButtonAnalyzed();               // Button → "ANALYZED" + rose color
    setParsedContentState('collapsed'); // Auto-collapse to show sliders
    
    // 5. Auto-reset after 3 seconds
    setTimeout(() => resetButtonState(), 3000);
}
```

#### **Slider Integration System (v2.6.0)**
```javascript
// Analysis data format (compromise.js → future Gemini API)
analysis = {
    rawScores: {
        'Formal vs. Casual': 60,              // 0-100% for slider positioning
        'Serious vs. Humorous': 20,           // Maps to "Serious vs. Funny" in UI
        'Respectful vs. Irreverent': 80,
        'Enthusiastic vs. Matter-of-fact': 40 // Maps to "Matter-of-fact vs. Enthusiastic"
    },
    tones: {
        'Formal vs. Casual': { scale: 3, label: 'Balanced' } // For display text
    }
}

// UI mapping system
updateToneSliders(analysis) {
    // Find UI elements by .tone-title text matching
    // Update .tone-score (e.g. "2/5" → "3/5")  
    // Update .tone-position (e.g. "Slightly Formal" → "Balanced")
    // Update .slider-indicator style.left (e.g. "40%" → "60%")
}
```

### **Critical Architecture Decisions**

#### **Tone Mapping Challenges & Solutions**
**Problem**: Analysis engine keys don't match UI display text
```javascript
// Analysis Engine (basic_analysis.js)   →   UI Display (HTML)
'Serious vs. Humorous'                  →   'Serious vs. Funny'
'Enthusiastic vs. Matter-of-fact'       →   'Matter-of-fact vs. Enthusiastic'
```

**Solution**: Universal mapping system in `updateToneSliders()`
```javascript
const toneMapping = {
    'Formal vs. Casual': 'Formal vs. Casual',                    // ✅ Direct match
    'Serious vs. Humorous': 'Serious vs. Funny',                // ✅ Mapped
    'Respectful vs. Irreverent': 'Respectful vs. Irreverent',   // ✅ Direct match  
    'Enthusiastic vs. Matter-of-fact': 'Matter-of-fact vs. Enthusiastic' // ✅ Mapped
};
```

#### **Mode Management System**
```javascript
// Global mode state (accessible across modules)
window.currentMode = 'FULL_PAGE' | 'SELECTION';

// Button text updates based on mode
switchMode('SELECTION') → button.textContent = 'ANALYZE SELECTION'
switchMode('FULL_PAGE') → button.textContent = 'ANALYZE FULL PAGE'
```

## 🔄 Recent Major Updates

### **v2.7.0 - Button Animation & Auto-Collapse**
- **Added**: CSS button states (.analyzing, .analyzed, @keyframes pulse)
- **Added**: Button state management functions (setButtonAnalyzing, setButtonAnalyzed, resetButtonState)
- **Enhanced**: analyzeSelection() with visual feedback flow
- **Added**: Auto-collapse parsed content after analysis completion
- **Colors**: Rose (#f1c7d6) for completion state, yellow (#f6f951) with pulse for analyzing

### **v2.6.0 - Slider Integration** 
- **Removed**: Popup alert() interruption 
- **Added**: Live slider updates with analysis data
- **Added**: updateToneSliders() universal function
- **Fixed**: Tone mapping between analysis engine and UI display
- **Enhanced**: displayToneAnalysis() to call slider updates instead of popup

### **v2.5.0 - Event Handler Extraction**
- **Extracted**: 188-line event listener setup into dedicated module
- **Added**: js/event-handlers.js with initializeEventHandlers()
- **Modularized**: DOM event binding system
- **Enhanced**: Global variable accessibility (window.currentMode)

### **v2.4.0 - Content Generation Extraction**
- **Extracted**: Static HTML template functions (95 lines)
- **Added**: js/content-generators.js module
- **Separated**: Pure template functions from main logic
- **Improved**: Code organization and maintainability

### **v2.3.0 - Text Analysis Extraction**
- **Extracted**: Core analysis logic (397 lines) from monolithic file
- **Added**: js/basic_analysis.js module  
- **Separated**: compromise.js analysis from UI logic
- **Prepared**: Architecture for future Gemini API integration

### **v2.2.0 - Logo Animation Fix**
- **Fixed**: Working logo animation extracted to dedicated module
- **Added**: js/AnimatedLogo.js with proper symbol cycling
- **Preserved**: Existing visual behavior exactly as working

### **v2.1.1 → v2.2.0 - Polish Analysis Removal**
- **Removed**: 204 lines of Polish language detection (compromise.js limitation)
- **Simplified**: Universal English analysis only  
- **Prepared**: System for future Gemini API multilingual support

## 🚨 Common Errors & Solutions

### **File Permission Issues**
**Problem**: "Error editing file" in Google Drive CloudStorage
**Root Cause**: Google Drive sync locks + Chrome file caching + extended attributes
**Solutions**:
```bash
# Option 1: Fix permissions
xattr -d com.google.drivefs.attributes "filename.js"  # Remove Google Drive metadata
chmod 644 "filename.js"                               # Set proper permissions

# Option 2: Work locally (Recommended)
cp -r project-folder ~/Desktop/pokpok-local           # Copy to local directory
# Work locally, sync back to Google Drive when done
```

### **Module Loading Errors**
**Problem**: `window.BasicAnalysis is undefined` or similar
**Root Cause**: Script loading order or IIFE initialization failure
**Debug Steps**:
```javascript
// Check module availability in browser console
console.log(typeof window.BasicAnalysis);              // Should be 'object'
console.log(typeof window.BasicAnalysis.analyzeText);  // Should be 'function'
console.log(typeof window.EventHandlers);              // Should be 'object'

// Check script loading in Network tab (Chrome DevTools)
// Ensure all js/ files load before analysis.js
```

### **Slider Update Issues**  
**Problem**: Analysis completes but sliders don't update
**Debug Process**:
```javascript
// 1. Check analysis data format
console.log('Analysis object:', analysis);
// Should have: { rawScores: {...}, tones: {...} }

// 2. Check tone mapping
const toneMapping = { /* ... */ };
Object.keys(analysis.rawScores).forEach(key => {
    console.log(`Analysis key "${key}" maps to UI "${toneMapping[key]}"`);
});

// 3. Check DOM elements exist
document.querySelectorAll('.tone-item').forEach((item, index) => {
    const title = item.querySelector('.tone-title')?.textContent;
    console.log(`Tone item ${index}: "${title}"`);
});
```

### **Button Animation Stuck**
**Problem**: Button stays in "ANALYZING..." state
**Root Cause**: Error in analysis flow breaks state management
**Solution**: Always use try/catch with resetButtonState() in catch block
```javascript
try {
    setButtonAnalyzing();
    const analysis = await window.BasicAnalysis.analyzeText(text);
    setButtonAnalyzed();
    setTimeout(() => resetButtonState(), 3000);
} catch (error) {
    console.error('Analysis failed:', error);
    resetButtonState(); // ← Critical: Always reset on error
}
```

## 🔮 Future Integration (Gemini API)

### **Ready Architecture**
- **Universal Data Format**: Same analysis object structure expected
- **Flexible Analysis Call**: Replace `window.BasicAnalysis.analyzeText()` with Gemini API call
- **Button States**: Same animation system will work for API calls
- **Error Handling**: Already prepared for async failures

### **Integration Point**
```javascript
// Current: compromise.js
const analysis = await window.BasicAnalysis.analyzeText(text);

// Future: Gemini API  
const analysis = await window.GeminiAPI.analyzeText(text, settings);
// ↑ Same data format expected: { rawScores: {...}, tones: {...} }
```

## 🎯 Development Workflow

### **Safe Development Practices**
1. **Always backup before changes**: `git add . && git commit -m "Backup before changes"`
2. **Read files first**: Use Read tool before editing to understand context
3. **Test incrementally**: Small changes, test in Chrome after each
4. **Version management**: Update manifest.json + HTML version after any functional change
5. **Module approach**: Prefer editing existing files over creating new ones

### **Testing Checklist**
```bash
# 1. Load extension in Chrome
chrome://extensions/ → Developer mode → Load unpacked

# 2. Test selection analysis  
# - Navigate to any webpage
# - Switch to SELECTION mode
# - Click webpage element  
# - Click "ANALYZE SELECTION"
# - Verify: Button animation → Sliders update → Parsed content collapses

# 3. Check console for errors
# Right-click extension → Inspect → Console tab
# Should see: "POKPOK.AI Chrome Extension loaded (Recreated from React version)"
```

### **File Structure Best Practices**
- **analysis.js**: Main coordinator (avoid making too large)
- **js/modules**: Extract large function groups (100+ lines)
- **HTML**: Keep all CSS inline (no separate CSS files)  
- **lib/**: Pre-built libraries only (no source code)

## 📊 Code Metrics (Current)

| File | Lines | Purpose | Status |
|------|-------|---------|--------|
| analysis.js | 594 | Main controller | ✅ Reduced from 782 |
| analysis-simple.html | 1380+ | UI + CSS | ✅ Complete |
| js/basic_analysis.js | 397 | Text analysis | ✅ Extracted |
| js/event-handlers.js | 188 | Event listeners | ✅ Extracted |  
| js/content-generators.js | 95 | HTML templates | ✅ Extracted |
| js/AnimatedLogo.js | 78 | Logo animation | ✅ Working |
| **Total Reduction** | **-924 lines** | From monolith | ✅ Modularized |

## 🛡️ Security & Permissions

### **Manifest V3 Compliance**
- `sidePanel`: Analysis interface display
- `activeTab`: Current webpage content access  
- `storage`: Local settings persistence
- `scripting`: Content script injection
- `host_permissions`: All websites (`*://*/*`)

### **Privacy Features**  
- **No external requests**: All processing local
- **No data collection**: Zero telemetry
- **Local storage only**: Settings saved in Chrome storage API

## 📞 Debugging Support

### **Console Logging Strategy**
```javascript
// Analysis flow
console.log('POKPOK.AI: DOM loaded, delegating to EventHandlers module...');
console.log('Displaying tone analysis:', analysis);
console.log('Updating tone sliders with analysis:', analysis);
console.log(`Updated ${uiTitle}: ${rawScore}% → ${toneData.scale}/5`);

// Button state changes  
console.log('Tone analysis completed and sliders updated');
console.log(`Tone analysis completed for: "${text.substring(0, 50)}..."`);
```

### **Common Console Errors & Fixes**
```javascript
// ❌ "analyzeText function is not available"
// ✅ Fix: Check js/basic_analysis.js loaded before analysis.js

// ❌ "Cannot read property 'analyzeText' of undefined"  
// ✅ Fix: Verify window.BasicAnalysis object exists

// ❌ "No UI mapping found for analysis key: X"
// ✅ Fix: Update toneMapping object in updateToneSliders()

// ❌ "Could not find tone item for: X"
// ✅ Fix: Check .tone-title text matches exactly in HTML
```

---

**POKPOK.AI v2.7.0** - Advanced Brand Voice Analysis  
**Architecture**: Modular Chrome Extension (Manifest V3)  
**Analysis Engine**: compromise.js → Future Gemini API  
**UI Framework**: Vanilla JS with shadcn/ui styling  
**Last Updated**: August 2024