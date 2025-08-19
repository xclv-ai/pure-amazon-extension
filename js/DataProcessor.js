/**
 * POKPOK.AI Chrome Extension v2.27.0
 * File: js/DataProcessor.js
 * Purpose: Analysis data transformation, validation, and UI coordination
 * 
 * Key Features:
 * - Gemini data processing and UI section updates
 * - Tone analysis data transformation and slider updates
 * - Brand archetype data processing with position-based mapping
 * - Dynamic justification system for tone and archetype expandables
 * - Data validation and sanitization
 * - Format conversion for UI display
 * 
 * Dependencies:
 * - Global variables: geminiAnalysisData, toneAnalysisData (preserved exactly)
 * - DOM elements: tone sliders, archetype items, UI sections
 * - Archetype description mapping for proper short descriptions
 * 
 * Exposes:
 * - window.DataProcessor.updateUIWithGeminiData()
 * - window.DataProcessor.displayToneAnalysis()
 * - window.DataProcessor.updateToneSliders()
 * - window.DataProcessor.updateToneAnalysisData()
 * - window.DataProcessor.updateArchetypeJustifications()
 * - window.DataProcessor.updateToneOfVoiceFromGemini()
 * - window.DataProcessor.updateBrandArchetypesFromGemini()
 * - window.DataProcessor.updateBrandInsightsFromGemini()
 * 
 * Integration Points:
 * - AnalysisCoordinator.js: Receives analysis results for processing
 * - Original analysis.js: Global variables and fallback functions
 * - Tone click-to-show system: Dynamic justification generation
 * - Archetype expandable system: Position-based content lookup
 * 
 * Data Processing Flow:
 * 1. Receive raw analysis data (Gemini API or local compromise.js)
 * 2. Transform data format for UI compatibility
 * 3. Update global variables for dynamic content systems
 * 4. Update UI elements with processed data
 * 5. Handle error cases with graceful fallbacks
 * 
 * Preserved Functionality:
 * - Exact tone analysis data format and slider updates
 * - Position-based archetype mapping (primary/secondary/tertiary)
 * - Dynamic justification systems for click-to-show
 * - Global data storage for expandable content
 * - All original data transformation logic
 * 
 * Global Variables Managed:
 * - geminiAnalysisData: Fresh Gemini analysis for dynamic content
 * - toneAnalysisData: Tone justifications for click-to-show system
 * 
 * Last Updated: August 2024
 */

window.DataProcessor = (function() {
    'use strict';

    // Initialize data processor
    function initialize() {
        console.log('DataProcessor module initialized');
    }

    // Archetype description mapping (preserved exactly from original)
    const archetypeDescriptions = {
        "The Innocent": "Seeking happiness and simplicity",
        "The Sage": "Driven by knowledge and truth", 
        "The Caregiver": "Compassion and service to others",
        "The Explorer": "Freedom and finding yourself",
        "The Hero": "Courage and mastery",
        "The Outlaw": "Revolution and change",
        "The Magician": "Vision and transformation", 
        "The Regular Guy": "Belonging and connection",
        "The Lover": "Passion and commitment",
        "The Jester": "Fun and enjoyment",
        "The Ruler": "Control and responsibility",
        "The Creator": "Innovation and imagination"
    };

    // Update UI sections with Gemini analysis data (preserved exactly)
    async function updateUIWithGeminiData(geminiData) {
        console.log('🎨 Updating UI sections with Gemini data...');
        
        try {
            // Store Gemini data globally for use by expandable functions
            window.geminiAnalysisData = geminiData;
            console.log('📦 Stored Gemini analysis data globally for expandable content');
            console.log('🔍 Available archetypes in data:', geminiData.brand_archetypes ? Object.keys(geminiData.brand_archetypes) : 'none');
            
            // 1. Update Tone of Voice Analysis
            if (geminiData.tone_of_voice) {
                console.log('🎯 Updating Tone of Voice section...');
                try {
                    updateToneOfVoiceFromGemini(geminiData.tone_of_voice);
                    // Also update tone analysis data for expandable justifications
                    updateToneAnalysisData(geminiData.tone_of_voice);
                } catch (toneError) {
                    console.error('❌ Error updating tone of voice data:', toneError);
                    // Continue with other updates instead of crashing
                }
            }
            
            // 2. Update Brand Archetypes Mix
            if (geminiData.brand_archetypes) {
                console.log('🏛️ Updating Brand Archetypes section...');
                updateBrandArchetypesFromGemini(geminiData.brand_archetypes);
            }
            
            // 3. Update Visual Identity (keep existing color analysis)
            console.log('🎨 Keeping existing Visual Identity analysis...');
            // Visual Identity will continue to use existing color extraction
            
            // 4. Update Brand Insights
            if (geminiData.recommendations || geminiData.competitive_positioning) {
                console.log('💡 Updating Brand Insights section...');
                updateBrandInsightsFromGemini(geminiData);
            }
            
            console.log('✅ All UI sections updated with Gemini data');
            
        } catch (error) {
            console.error('❌ Failed to update UI with Gemini data:', error);
            // Don't throw the error - allow the analysis to continue with fallbacks
            console.warn('⚠️ Continuing analysis despite UI update errors...');
            return false; // Indicate partial failure
        }
    }

    // Display tone analysis and update sliders (preserved exactly)
    function displayToneAnalysis(analysis, originalText) {
        console.log('Displaying tone analysis:', analysis);
        
        // Replace popup with slider updates
        updateToneSliders(analysis);
        console.log(`Tone analysis completed for: "${originalText.substring(0, 50)}${originalText.length > 50 ? '...' : ''}"`);
    }

    // Update tone sliders with analysis results (preserved exactly)
    function updateToneSliders(analysis) {
        console.log('Updating tone sliders with analysis:', analysis);
        
        if (!analysis || !analysis.rawScores) {
            console.warn('No analysis data provided for slider updates');
            return;
        }
        
        // Map analysis keys to UI tone titles (exact matches)
        const toneMapping = {
            'Formal vs. Casual': 'Formal vs. Casual',
            'Serious vs. Humorous': 'Serious vs. Funny',
            'Respectful vs. Irreverent': 'Respectful vs. Irreverent', 
            'Enthusiastic vs. Matter-of-fact': 'Matter-of-fact vs. Enthusiastic'
        };
        
        // Update each tone dimension
        Object.keys(analysis.rawScores).forEach(analysisKey => {
            const uiTitle = toneMapping[analysisKey];
            if (!uiTitle) {
                console.warn(`No UI mapping found for analysis key: ${analysisKey}`);
                return;
            }
            
            // Find the tone item by title
            const toneItems = document.querySelectorAll('.tone-item');
            let targetItem = null;
            
            toneItems.forEach(item => {
                const titleElement = item.querySelector('.tone-title');
                if (titleElement && titleElement.textContent.trim() === uiTitle) {
                    targetItem = item;
                }
            });
            
            if (!targetItem) {
                console.warn(`Could not find tone item for: ${uiTitle}`);
                return;
            }
            
            // Get analysis values
            const rawScore = analysis.rawScores[analysisKey]; // 0-100
            const toneData = analysis.tones[analysisKey];
            
            // Update score (X/5 format)
            const scoreElement = targetItem.querySelector('.tone-score');
            if (scoreElement && toneData) {
                scoreElement.textContent = `${toneData.scale}/5`;
            }
            
            // Update position label
            const positionElement = targetItem.querySelector('.tone-position');
            if (positionElement && toneData) {
                positionElement.textContent = toneData.label;
            }
            
            // Update slider indicator position
            const indicatorElement = targetItem.querySelector('.slider-indicator');
            if (indicatorElement) {
                const leftPercentage = Math.max(0, Math.min(100, rawScore));
                indicatorElement.style.left = `${leftPercentage}%`;
            }
            
            console.log(`Updated ${uiTitle}: ${rawScore}% → ${toneData ? toneData.scale : '?'}/5`);
        });
    }

    // Update Tone of Voice section from Gemini data (preserved exactly)
    function updateToneOfVoiceFromGemini(toneData) {
        console.log('🎯 Processing Gemini tone data:', toneData);
        
        // Convert Gemini tone format to existing slider format
        const analysisFormat = {
            rawScores: {},
            tones: {}
        };
        
        // Map Gemini tone dimensions to our UI dimensions
        const toneMappings = {
            'formal_vs_casual': 'Formal vs. Casual',
            'serious_vs_funny': 'Serious vs. Humorous', 
            'respectful_vs_irreverent': 'Respectful vs. Irreverent',
            'matteroffact_vs_enthusiastic': 'Enthusiastic vs. Matter-of-fact'
        };
        
        Object.keys(toneMappings).forEach(geminiKey => {
            if (toneData[geminiKey]) {
                const uiKey = toneMappings[geminiKey];
                const score = parseInt(toneData[geminiKey].score) || 3;
                
                // Convert 1-5 scale to 0-100 scale
                const rawScore = ((score - 1) / 4) * 100;
                
                analysisFormat.rawScores[uiKey] = rawScore;
                analysisFormat.tones[uiKey] = {
                    scale: score,
                    label: getScaleLabel(score, geminiKey)
                };
                
                console.log(`  - ${uiKey}: ${score}/5 (${rawScore}%)`);
            }
        });
        
        // Use existing updateToneSliders function
        updateToneSliders(analysisFormat);
        
        // Update tone justifications in comment sections
        updateToneJustifications(toneData);
    }

    // Get appropriate scale label based on score and dimension (preserved exactly)
    function getScaleLabel(score, dimension) {
        const labels = {
            'formal_vs_casual': ['Very Formal', 'Formal', 'Balanced', 'Casual', 'Very Casual'],
            'serious_vs_funny': ['Very Serious', 'Serious', 'Balanced', 'Funny', 'Very Funny'],
            'respectful_vs_irreverent': ['Very Respectful', 'Respectful', 'Balanced', 'Irreverent', 'Very Irreverent'],
            'matteroffact_vs_enthusiastic': ['Very Matter-of-fact', 'Matter-of-fact', 'Balanced', 'Enthusiastic', 'Very Enthusiastic']
        };
        
        return labels[dimension] ? labels[dimension][score - 1] : 'Balanced';
    }

    // Update tone justifications (preserved exactly)
    function updateToneJustifications(toneData) {
        console.log('📝 Tone justifications will be updated via updateToneAnalysisData() - no static HTML replacement needed');
        
        // Note: This function is no longer needed because tone justifications are created dynamically
        // when users click on tone items. The justifications are sourced from the global toneAnalysisData
        // object which is updated by updateToneAnalysisData() function when new Gemini data arrives.
    }

    // Update Brand Archetypes section from Gemini data (preserved exactly)
    function updateBrandArchetypesFromGemini(archetypeData) {
        console.log('🏛️ Processing Gemini archetype data:', archetypeData);
        
        try {
            // Update spectrum segments
            if (archetypeData.primary) {
                const primarySegment = document.getElementById('primarySegment');
                if (primarySegment) {
                    primarySegment.textContent = `${archetypeData.primary.percentage}%`;
                    console.log(`  - Primary: ${archetypeData.primary.percentage}%`);
                }
            }
            
            if (archetypeData.secondary) {
                const secondarySegment = document.getElementById('secondarySegment');
                if (secondarySegment) {
                    secondarySegment.textContent = `${archetypeData.secondary.percentage}%`;
                    console.log(`  - Secondary: ${archetypeData.secondary.percentage}%`);
                }
            }
            
            if (archetypeData.tertiary) {
                const tertiarySegment = document.getElementById('tertiarySegment');
                if (tertiarySegment) {
                    tertiarySegment.textContent = `${archetypeData.tertiary.percentage}%`;
                    console.log(`  - Tertiary: ${archetypeData.tertiary.percentage}%`);
                }
            }
            
            // Update archetype list items
            const archetypeItems = document.querySelectorAll('.archetype-item');
            
            [archetypeData.primary, archetypeData.secondary, archetypeData.tertiary].forEach((archetype, index) => {
                if (archetype && archetypeItems[index]) {
                    const item = archetypeItems[index];
                    
                    // Update badge
                    const badge = item.querySelector('.archetype-badge');
                    if (badge) {
                        badge.textContent = archetype.percentage;
                    }
                    
                    // Update name
                    const nameElement = item.querySelector('.archetype-name');
                    if (nameElement) {
                        nameElement.textContent = archetype.archetype;
                    }
                    
                    // Update description - use proper short description from mapping
                    const descElement = item.querySelector('.archetype-desc');
                    if (descElement) {
                        const shortDesc = archetypeDescriptions[archetype.archetype] || "Brand archetype analysis";
                        descElement.textContent = shortDesc;
                    }
                    
                    console.log(`  - ${archetype.archetype}: ${archetype.percentage}%`);
                }
            });
            
            // Update justification comment section with Gemini's analysis
            updateArchetypeJustifications(archetypeData);
            
            console.log('✅ Brand Archetypes section updated');
            
        } catch (error) {
            console.error('❌ Failed to update Brand Archetypes:', error);
        }
    }

    // Clear existing archetype expandable divs for fresh Gemini data (preserved exactly)
    function updateArchetypeJustifications(archetypeData) {
        console.log('🏛️ Archetype justifications will be updated via geminiAnalysisData - clearing existing expandable divs');
        
        try {
            // Remove any existing archetype expandable divs so they can be recreated with fresh data
            const existingExpandables = document.querySelectorAll('.archetype-expandable');
            existingExpandables.forEach(expandable => {
                expandable.remove();
                console.log('🗑️ Removed existing archetype expandable div for fresh data');
            });
            
            console.log('✅ Existing archetype expandable divs cleared - fresh content will be generated on click');
            
        } catch (error) {
            console.error('❌ Failed to clear archetype expandable divs:', error);
        }
        
        // Note: Fresh archetype justifications will be sourced from the global geminiAnalysisData
        // object when users click archetype items. The toggleArchetype() function handles this.
    }

    // Update Brand Insights section from Gemini data (preserved exactly)
    function updateBrandInsightsFromGemini(geminiData) {
        console.log('💡 Processing Gemini insights data...');
        
        // For now, we'll log the insights data
        // The HTML structure for Brand Insights is minimal, so we'll prepare for future expansion
        console.log('  - Recommendations:', geminiData.recommendations);
        console.log('  - Competitive Positioning:', geminiData.competitive_positioning);
        console.log('  - Quick Wins:', geminiData.quick_wins);
        console.log('  - Risk Areas:', geminiData.risk_areas);
        
        // TODO: Expand Brand Insights HTML structure to display this rich data
        console.log('💡 Brand Insights data logged (UI expansion needed)');
    }

    // Update tone analysis data with Gemini justifications (preserved exactly)
    function updateToneAnalysisData(geminiToneData) {
        console.log('📝 Updating tone analysis data with Gemini justifications...');
        
        if (!geminiToneData) {
            console.warn('⚠️ No Gemini tone data provided');
            return;
        }
        
        if (!window.toneAnalysisData) {
            console.error('❌ window.toneAnalysisData is not available - global variable access issue');
            return;
        }
        
        // First, remove any existing tone justification divs so they can be recreated with fresh data
        const existingJustifications = document.querySelectorAll('.tone-justification');
        existingJustifications.forEach(justification => {
            justification.remove();
            console.log('🗑️ Removed existing tone justification div for fresh data');
        });
        
        // Map Gemini keys to UI tone titles
        const toneMappings = {
            'formal_vs_casual': 'Formal vs. Casual',
            'serious_vs_funny': 'Serious vs. Funny',
            'respectful_vs_irreverent': 'Respectful vs. Irreverent',
            'matteroffact_vs_enthusiastic': 'Matter-of-fact vs. Enthusiastic'
        };
        
        Object.keys(toneMappings).forEach(geminiKey => {
            const uiTitle = toneMappings[geminiKey];
            const geminiTone = geminiToneData[geminiKey];
            
            if (geminiTone && geminiTone.justification) {
                if (window.toneAnalysisData[uiTitle]) {
                    window.toneAnalysisData[uiTitle].justification = geminiTone.justification;
                    console.log(`  - Updated ${uiTitle} justification from Gemini`);
                } else {
                    console.warn(`⚠️ UI title '${uiTitle}' not found in window.toneAnalysisData`);
                    console.log('Available keys:', Object.keys(window.toneAnalysisData));
                }
            } else {
                console.log(`  - No justification for ${geminiKey} in Gemini data`);
            }
        });
        
        console.log('✅ Tone analysis data updated with Gemini justifications');
    }

    // Public API - exactly matching original functions
    return {
        initialize: initialize,
        updateUIWithGeminiData: updateUIWithGeminiData,
        displayToneAnalysis: displayToneAnalysis,
        updateToneSliders: updateToneSliders,
        updateToneAnalysisData: updateToneAnalysisData,
        updateArchetypeJustifications: updateArchetypeJustifications,
        updateToneOfVoiceFromGemini: updateToneOfVoiceFromGemini,
        updateBrandArchetypesFromGemini: updateBrandArchetypesFromGemini,
        updateBrandInsightsFromGemini: updateBrandInsightsFromGemini
    };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.DataProcessor.initialize);
} else {
    window.DataProcessor.initialize();
}