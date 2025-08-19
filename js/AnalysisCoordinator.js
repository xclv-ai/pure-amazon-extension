/**
 * POKPOK.AI Chrome Extension v2.33.0
 * File: js/AnalysisCoordinator.js
 * Purpose: Main analysis flow orchestration and engine coordination
 * 
 * Key Features:
 * - analyzePage() for FULL_PAGE mode with Gemini API + fallback to local
 * - analyzeSelection() for SELECTION mode with local analysis
 * - AI engine selection coordination (Local vs Cloud)
 * - Analysis flow error handling and recovery
 * - Result distribution to UI update modules
 * - Progress feedback and button state management
 * 
 * Dependencies:
 * - UIController.js: Button state management and progress updates
 * - DataProcessor.js: Gemini data processing and UI updates
 * - ContentHandler.js: Chrome tabs API and content script communication
 * - GeminiAnalysisService.js: Gemini API integration
 * - basic_analysis.js: Local compromise.js analysis
 * - AnalysisSettings.js: Engine selection
 * 
 * Exposes:
 * - window.AnalysisCoordinator.analyzePage()
 * - window.AnalysisCoordinator.analyzeSelection()
 * 
 * Integration Points:
 * - event-handlers.js: mainAnalyzeBtn click triggers appropriate analysis
 * - Settings system: Engine selection determines analysis path
 * - Color extraction modules: Visual identity analysis in FULL_PAGE mode
 * - Chrome extension APIs: Tab querying and message passing
 * 
 * Analysis Flow:
 * 1. Determine current mode (FULL_PAGE vs SELECTION)
 * 2. Check AI engine selection (Local vs Cloud)
 * 3. Execute appropriate analysis path with error handling
 * 4. Update UI through UIController and DataProcessor
 * 5. Handle failures with graceful fallback
 * 
 * Preserved Functionality:
 * - Exact analysis flow from original analyzePage() and analyzeSelection()
 * - Gemini API integration with comprehensive-brand-analysis.md
 * - Automatic fallback from Cloud to Local analysis
 * - Button progress updates during API calls
 * - Color extraction for FULL_PAGE mode
 * - Element analysis for SELECTION mode
 * 
 * Last Updated: August 2024
 */

window.AnalysisCoordinator = (function() {
    'use strict';

    // Initialize analysis coordinator
    function initialize() {
        console.log('AnalysisCoordinator module initialized');
    }

    // Main FULL_PAGE analysis function (preserved exactly from original)
    async function analyzePage() {
        // Start console-to-button bridge for live progress display
        if (window.ConsoleToButtonBridge) {
            window.ConsoleToButtonBridge.startAnalysisMode();
        }
        
        console.log('🔄 FULL_PAGE Analysis Started');
        console.log('📋 Current mode:', window.currentMode);
        
        // Verify we're in FULL_PAGE mode
        if (window.currentMode !== 'FULL_PAGE') {
            console.warn('⚠️ analyzePage() called but not in FULL_PAGE mode');
            if (window.ConsoleToButtonBridge) {
                window.ConsoleToButtonBridge.endAnalysisMode();
            }
            return;
        }
        
        // Start button animation
        console.log('🎬 Starting button animation');
        window.UIController.setButtonAnalyzing();
        
        // Check current AI engine selection
        const currentEngine = window.AnalysisSettings ? window.AnalysisSettings.getCurrentEngine() : 'local';
        console.log('🤖 Current AI Engine:', currentEngine);
        
        // Check for Cloud AI requirements
        if (currentEngine === 'cloud') {
            console.log('☁️ Cloud AI selected - checking Gemini service...');
            console.log('  - GeminiAnalysisService:', typeof window.GeminiAnalysisService);
            
            if (window.GeminiAnalysisService) {
                console.log('🚀 Attempting Gemini analysis...');
                
                try {
                    // Create a modified Gemini service that updates button progress
                    const geminiResultPromise = window.GeminiAnalysisService.analyzePageWithGemini();
                    
                    // Show progress updates based on typical Gemini service flow
                    window.UIController.updateButtonProgress('📄 Loading system prompt...');
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    window.UIController.updateButtonProgress('🔑 Loading API config...');
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    window.UIController.updateButtonProgress('🌐 Getting current page URL...');
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    window.UIController.updateButtonProgress('📝 Preparing system prompt...');
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    window.UIController.updateButtonProgress('🤖 Making Gemini API call...');
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    const geminiResult = await geminiResultPromise;
                    
                    if (geminiResult.success) {
                        window.UIController.updateButtonProgress('🔍 Parsing Gemini response...');
                        await new Promise(resolve => setTimeout(resolve, 500));
                        
                        window.UIController.updateButtonProgress('🎨 Updating UI sections...');
                        console.log('✅ Gemini analysis successful! Updating UI sections...');
                        
                        // Update UI sections with Gemini data through DataProcessor
                        if (window.DataProcessor) {
                            await window.DataProcessor.updateUIWithGeminiData(geminiResult.data);
                        }
                        
                        window.UIController.updateButtonProgress('💾 Saving JSON output...');
                        await new Promise(resolve => setTimeout(resolve, 500));
                        
                        // Set button to analyzed state
                        console.log('🎬 Setting button to analyzed state');
                        window.UIController.setButtonAnalyzed();
                        
                        // End console-to-button bridge BEFORE any further console messages
                        if (window.ConsoleToButtonBridge) {
                            window.ConsoleToButtonBridge.endAnalysisMode();
                        }
                        
                        // Reset button after 3 seconds
                        setTimeout(() => {
                            console.log('🎬 Resetting button state');
                            window.UIController.resetButtonState();
                        }, 3000);
                        
                        return; // Success - exit function
                    } else {
                        console.warn('⚠️ Gemini analysis failed, falling back to local analysis:', geminiResult.error);
                        window.UIController.updateButtonProgress('⚠️ Gemini failed, using local...');
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                } catch (error) {
                    console.error('❌ Gemini analysis error, falling back to local analysis:', error);
                    window.UIController.updateButtonProgress('❌ Gemini error, using local...');
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } else {
                console.warn('⚠️ GeminiAnalysisService not available, falling back to local analysis');
            }
            
            console.log('🔄 Proceeding with local analysis fallback...');
        }
        
        // Local AI analysis path (preserved exactly from original)
        await executeLocalAnalysis();
    }

    // Execute local analysis with color extraction (preserved exactly)
    async function executeLocalAnalysis() {
        // Check for required modules (Local AI path)
        console.log('🔍 Checking local analysis module availability:');
        console.log('  - ColorExtractor:', typeof window.ColorExtractor);
        console.log('  - visualIdentityUpdater:', typeof window.visualIdentityUpdater);
        console.log('  - BasicAnalysis:', typeof window.BasicAnalysis);
        
        try {
            console.log('🌐 Querying active tab...');
            
            // Get full page content and screenshot for color analysis
            chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
                if (tabs[0]) {
                    console.log('✅ Active tab found:', tabs[0].url);
                    
                    try {
                        // Get page text content for tone analysis through ContentHandler
                        let textResponse, colorsResponse;
                        
                        if (window.ContentHandler) {
                            textResponse = await window.ContentHandler.getFullPageText(tabs[0].id);
                            colorsResponse = await window.ContentHandler.getPageColors(tabs[0].id);
                        } else {
                            // Fallback to direct Chrome API if ContentHandler not available
                            textResponse = await chrome.tabs.sendMessage(tabs[0].id, {
                                type: 'GET_FULL_PAGE_TEXT'
                            });
                            colorsResponse = await chrome.tabs.sendMessage(tabs[0].id, {
                                type: 'GET_PAGE_COLORS'
                            });
                        }
                        
                        console.log('📝 Text response:', textResponse.success ? `Success (${textResponse.text?.length} chars)` : `Failed: ${textResponse.error}`);
                        console.log('🎨 Colors response:', colorsResponse.success ? `Success (${colorsResponse.colors?.length} colors)` : `Failed: ${colorsResponse.error}`);
                        
                        // Perform tone analysis if we have text
                        if (textResponse.success && textResponse.text && textResponse.text.length > 50) {
                            console.log('🎯 Starting tone analysis...');
                            const toneAnalysis = await window.BasicAnalysis.analyzeText(textResponse.text);
                            console.log('🎯 Tone analysis completed:', toneAnalysis);
                            
                            if (window.DataProcessor) {
                                window.DataProcessor.displayToneAnalysis(toneAnalysis, textResponse.text);
                            } else {
                                // Fallback to original function
                                displayToneAnalysis(toneAnalysis, textResponse.text);
                            }
                            console.log('✅ Tone sliders updated');
                        } else {
                            console.warn('⚠️ Insufficient text for tone analysis');
                        }
                        
                        // Perform color analysis if we have CSS colors
                        if (colorsResponse.success && colorsResponse.colors && colorsResponse.colors.length > 0) {
                            console.log('🎨 Starting CSS color processing...');
                            console.log('🎨 Found CSS colors:', colorsResponse.colors);
                            
                            if (window.ColorExtractor && window.visualIdentityUpdater) {
                                console.log('🎨 Initializing ColorExtractor...');
                                const colorExtractor = new window.ColorExtractor();
                                
                                console.log('🎨 Processing CSS colors...');
                                const extractedColors = await colorExtractor.extractColorsFromCSS(colorsResponse.colors);
                                console.log('🎨 Color processing result:', extractedColors);
                                
                                console.log('🎨 Updating Visual Identity section...');
                                const updateResult = window.visualIdentityUpdater.updateVisualIdentity(extractedColors);
                                console.log('🎨 Visual Identity update result:', updateResult);
                                
                                if (updateResult.success) {
                                    console.log('✅ Visual Identity section updated with extracted colors');
                                    console.log(`   - Colors updated: ${updateResult.colorsUpdated}/6`);
                                    if (updateResult.errors.length > 0) {
                                        console.warn('   - Update errors:', updateResult.errors);
                                    }
                                } else {
                                    console.error('❌ Failed to update Visual Identity:', updateResult.errors);
                                }
                            } else {
                                console.error('❌ Color extraction modules not available');
                                console.log('   - ColorExtractor available:', !!window.ColorExtractor);
                                console.log('   - visualIdentityUpdater available:', !!window.visualIdentityUpdater);
                            }
                        } else {
                            console.warn('⚠️ No CSS colors available for analysis');
                            console.log('   - Colors response:', colorsResponse);
                        }
                        
                        // Set button to analyzed state
                        console.log('🎬 Setting button to analyzed state');
                        window.UIController.setButtonAnalyzed();
                        
                        console.log('✅ FULL_PAGE Analysis Completed Successfully');
                        
                        // End console-to-button bridge BEFORE any further console messages
                        if (window.ConsoleToButtonBridge) {
                            window.ConsoleToButtonBridge.endAnalysisMode();
                        }
                        
                        // Reset button after 3 seconds
                        setTimeout(() => {
                            console.log('🎬 Resetting button state');
                            window.UIController.resetButtonState();
                        }, 3000);
                        
                    } catch (error) {
                        console.error('❌ Full page analysis failed:', error);
                        console.error('   Error details:', {
                            message: error.message,
                            stack: error.stack
                        });
                        window.UIController.resetButtonState();
                        
                        // End console-to-button bridge on error
                        if (window.ConsoleToButtonBridge) {
                            window.ConsoleToButtonBridge.endAnalysisMode();
                        }
                        
                        alert('Full page analysis failed. Check console for details.');
                    }
                } else {
                    console.error('❌ No active tab found for analysis');
                    window.UIController.resetButtonState();
                    
                    // End console-to-button bridge
                    if (window.ConsoleToButtonBridge) {
                        window.ConsoleToButtonBridge.endAnalysisMode();
                    }
                    
                    alert('No active tab found for analysis.');
                }
            });
        } catch (error) {
            console.error('❌ Error starting full page analysis:', error);
            console.error('   Error details:', {
                message: error.message,
                stack: error.stack
            });
            window.UIController.resetButtonState();
            alert('Analysis failed. Check console for details.');
        }
    }

    // Main SELECTION analysis function (preserved exactly from original)
    async function analyzeSelection() {
        // Start console-to-button bridge for live progress display
        if (window.ConsoleToButtonBridge) {
            window.ConsoleToButtonBridge.startAnalysisMode();
        }
        
        console.log('🎯 SELECTION Analysis Started');
        console.log('📋 Current mode:', window.currentMode);
        
        // This function should only handle SELECTION mode
        if (window.currentMode === 'FULL_PAGE') {
            console.warn('⚠️ analyzeSelection() called in FULL_PAGE mode - use analyzePage() instead');
            if (window.ConsoleToButtonBridge) {
                window.ConsoleToButtonBridge.endAnalysisMode();
            }
            return;
        }
        
        // SELECTION mode logic with element data
        if (window.selectedElementData) {
            console.log('Analyzing selected element:', window.selectedElementData);
            
            // Create analysis text from element
            const analysisText = window.selectedElementData.textContent || 'No text content';
            
            if (analysisText.length > 10) {
                // Start button animation
                window.UIController.setButtonAnalyzing();
                
                // Use the existing analysis functions
                console.log('About to call analyzeText function, typeof analyzeText:', typeof analyzeText);
                if (typeof window.BasicAnalysis !== 'undefined' && window.BasicAnalysis.analyzeText) {
                    try {
                        const toneAnalysis = await window.BasicAnalysis.analyzeText(analysisText);
                        
                        if (window.DataProcessor) {
                            window.DataProcessor.displayToneAnalysis(toneAnalysis, analysisText);
                        } else {
                            // Fallback to original function
                            displayToneAnalysis(toneAnalysis, analysisText);
                        }
                        
                        // Set button to analyzed state and collapse parsed content
                        window.UIController.setButtonAnalyzed();
                        
                        // END CONSOLE-TO-BUTTON BRIDGE (was missing!)
                        if (window.ConsoleToButtonBridge) {
                            window.ConsoleToButtonBridge.endAnalysisMode();
                        }
                        
                        // Reset button after 3 seconds
                        setTimeout(() => {
                            window.UIController.resetButtonState();
                        }, 3000);
                    } catch (error) {
                        console.error('Analysis failed:', error);
                        window.UIController.resetButtonState();
                        alert('Analysis failed. Please try again.');
                    }
                } else {
                    console.error('analyzeText function is not available');
                    window.UIController.resetButtonState();
                    alert('Analysis function not available. Please reload the extension.');
                }
            } else {
                console.log('Selected element has insufficient text content for analysis');
                alert('Selected element has insufficient text content for meaningful analysis. Please select an element with more text.');
            }
        } else {
            // Analyze selected text from content script
            console.log('Analyzing selected text...');
            
            // Start button animation
            window.UIController.setButtonAnalyzing();
            
            // Get selected text from content script
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        type: 'GET_SELECTED_TEXT'
                    }).then(response => {
                        if (response.success && response.text && response.text.length > 10) {
                            window.BasicAnalysis.analyzeText(response.text).then(analysis => {
                                if (window.DataProcessor) {
                                    window.DataProcessor.displayToneAnalysis(analysis, response.text);
                                } else {
                                    // Fallback to original function
                                    displayToneAnalysis(analysis, response.text);
                                }
                                
                                // Set button to analyzed state and collapse parsed content
                                window.UIController.setButtonAnalyzed();
                                
                                // END CONSOLE-TO-BUTTON BRIDGE (moved before setTimeout!)
                                if (window.ConsoleToButtonBridge) {
                                    window.ConsoleToButtonBridge.endAnalysisMode();
                                }
                                
                                // Reset button after 3 seconds
                                setTimeout(() => {
                                    window.UIController.resetButtonState();
                                }, 3000);
                            }).catch(error => {
                                console.error('Analysis failed:', error);
                                window.UIController.resetButtonState();
                                
                                // End console-to-button bridge on error
                                if (window.ConsoleToButtonBridge) {
                                    window.ConsoleToButtonBridge.endAnalysisMode();
                                }
                                
                                alert('Analysis failed. Please try again.');
                            });
                        } else {
                            window.UIController.resetButtonState();
                            
                            // End console-to-button bridge
                            if (window.ConsoleToButtonBridge) {
                                window.ConsoleToButtonBridge.endAnalysisMode();
                            }
                            
                            alert('Please select some text on the page first.');
                        }
                    }).catch(error => {
                        console.error('Failed to get selected text:', error);
                        window.UIController.resetButtonState();
                        
                        // End console-to-button bridge on error
                        if (window.ConsoleToButtonBridge) {
                            window.ConsoleToButtonBridge.endAnalysisMode();
                        }
                        
                        alert('Failed to get selected text. Please try again.');
                    });
                }
            });
        }
    }

    // Public API - exactly matching original functions
    return {
        initialize: initialize,
        analyzePage: analyzePage,
        analyzeSelection: analyzeSelection
    };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.AnalysisCoordinator.initialize);
} else {
    window.AnalysisCoordinator.initialize();
}