/**
 * POKPOK.AI Chrome Extension v2.48.0
 * File: js/GeminiAnalysisService.js
 * Purpose: Gemini API integration service with comprehensive brand analysis
 * 
 * v2.48.0 GOOGLE DRIVE INTEGRATION + ALWAYS SAVE JSON:
 * - 🔄 ALWAYS save JSON - no conditions, no exceptions, every analysis
 * - ☁️ Google Drive integration - automatic backup to Drive folder
 * - 💾 Dual save: Downloads folder + Google Drive simultaneously
 * - 🔗 Folder ID: 1HvMD_wcGjFwnDarI8UBEOKobZ5wgB5hv
 * 
 * v2.47.0 UI SIMPLIFICATION (User Control Only):
 * - 🗑️ REMOVED Analysis Mode selector (Structured JSON / Natural Language)
 * - ❌ DELETED all automatic feature overriding and "compatibility" logic
 * - 🎯 User checkboxes directly control API parameters - no automatic changes
 * - 📊 Clean interface: just 4 feature checkboxes with explanations
 * 
 * v2.46.0 CRITICAL FIX (Pure Prompt Respect):
 * - 📝 REMOVED automatic prompt modification - user prompts sent exactly as written
 * - ❌ DELETED "CRITICAL: RESPOND ONLY WITH JSON..." automatic addition
 * - ✨ System prompt handles all JSON formatting requirements
 * - 🎯 User maintains complete control over all prompt content
 * 
 * v2.45.0 CRITICAL BUG FIX (Features Fallback Logic):
 * - 🐛 CRITICAL FIX: Fixed geminiFeatures fallback that was ignoring user disabled settings
 * - 🔧 Changed fallback from enabled-by-default to disabled-by-default to respect user preferences
 * - 🔍 Enhanced debug logging to show actual features being processed
 * 
 * v2.43.0 ENHANCEMENTS (Settings Bug Fixes & JSON Enforcement):
 * - 🐛 CRITICAL FIX: Checkbox reading logic - unchecked boxes now properly save as 'false'
 * - 🔍 Enhanced Debug Logging: Shows actual features loaded from settings and API request structure
 * - 🚨 Strengthened JSON Format Enforcement: More aggressive JSON-only instructions in system prompt
 * - 🛡️ Enhanced Tool Compatibility Checks: Warns about URL Context + JSON conflicts
 * - 📋 Enhanced User Message: Reinforces JSON requirement when structured output needed
 * - 💾 Better Natural Language Handling: Saves complete responses as downloadable text files
 * - 🎛️ Analysis Mode Separation: Clear distinction between Structured JSON vs Natural Language
 * - ⚙️ Smart Settings UI: Individual checkboxes with proper state persistence
 * - 🔧 Auto-Tool Disabling: Automatically disables conflicting tools for JSON output
 * 
 * v2.40.0 PREVIOUS ENHANCEMENTS:
 * - Dynamic prompt loading: Fresh system prompt loaded from file on each analysis
 * - Gemini API 2025 compliance: Proper systemInstruction + contents structure
 * - Increased timeout: 60 seconds for comprehensive analysis results
 * - Real-time prompt iteration: Edit prompts without extension reload
 * 
 * Key Features:
 * - Complete Gemini API integration with robust error handling
 * - API retry mechanism (2 attempts with 2-second delay between retries)
 * - Real-time button progress updates during analysis process
 * - JSON output saving with advanced metadata (thoughts, grounding, search results)
 * - Dynamic prompt loading from /prompts/ folder (system + user prompts)
 * - Settings integration for API key and model selection
 * - Advanced 2025 API features with progressive fallback system
 * - URL placeholder replacement in user prompt templates
 * - Smart feature detection: Tries all features, falls back gracefully
 * 
 * Dependencies:
 * - Chrome storage API for settings
 * - Chrome tabs API for current page URL
 * - /prompts/comprehensive-brand-analysis.md (system prompt)
 * - /prompts/user-prompt.md (user prompt template with {{url}} placeholder)
 * 
 * Exposes:
 * - window.GeminiAnalysisService.analyzePageWithGemini() - Main analysis function
 * 
 * API Configuration:
 * - Base URL: https://generativelanguage.googleapis.com/v1beta/models/
 * - Supported models: gemini-2.5-pro, gemini-2.5-flash, gemini-2.5-flash-lite
 * - Max retries: 2 attempts with exponential backoff
 * - Timeout: 120 seconds per request
 * 
 * Data Structure Output:
 * - tone_of_voice: Nielsen's 4-dimensional framework with justifications
 * - brand_archetypes: Jung's 12 archetypes with position-based mapping
 * - visual_identity: Color palette and design analysis
 * - recommendations: Strategic brand insights
 * 
 * Button Progress Updates:
 * - "📄 Loading system prompt..." → "✅ System prompt loaded successfully"
 * - "🔑 Loading API configuration..." → "✅ API configuration loaded"  
 * - "🚀 Calling Gemini API..." → "✅ API response received"
 * - "⚡ Parsing analysis data..." → "🎉 Analysis completed!"
 * 
 * Error Handling:
 * - Network failures: Automatic retry with delay
 * - API key errors: Clear error messages
 * - Rate limiting: Respectful backoff
 * - JSON parsing: Fallback error handling
 * 
 * Integration Points:
 * - Settings.js: API key and model configuration
 * - analysis.js: UI updates and progress feedback
 * - Button element: Real-time progress updates
 * 
 * Last Updated: August 2024
 */

window.GeminiAnalysisService = (function() {
    'use strict';

    // Configuration
    const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
    const DEFAULT_MODEL = 'gemini-2.5-flash';
    const REQUEST_TIMEOUT = 60000; // 60 seconds - increased for comprehensive analysis
    const MAX_RETRIES = 2;

    // Note: System prompt is loaded fresh from file on each analysis (no caching)
    // This allows real-time prompt updates without extension reload

    // Initialize service
    function initialize() {
        console.log('🚀 GeminiAnalysisService initialized');
    }

    // Load system prompt from file (always fresh, no caching)
    async function loadSystemPrompt() {
        console.log('📄 Loading fresh system prompt from file...');
        
        try {
            const response = await fetch(chrome.runtime.getURL('prompts/comprehensive-brand-analysis.md'));
            if (!response.ok) {
                throw new Error(`Failed to load system prompt: ${response.status}`);
            }
            
            const content = await response.text();
            console.log('✅ Fresh system prompt loaded successfully', { 
                length: content.length,
                timestamp: new Date().toISOString() 
            });
            return content;
        } catch (error) {
            console.error('❌ Failed to load system prompt:', error);
            throw new Error('Unable to load analysis prompt');
        }
    }

    // Load user prompt from file (always fresh, no caching)
    async function loadUserPrompt() {
        console.log('📝 Loading fresh user prompt from file...');
        
        try {
            const response = await fetch(chrome.runtime.getURL('prompts/user-prompt.md'));
            if (!response.ok) {
                throw new Error(`Failed to load user prompt: ${response.status}`);
            }
            
            const content = await response.text();
            console.log('✅ Fresh user prompt loaded successfully', { 
                length: content.length,
                timestamp: new Date().toISOString() 
            });
            return content;
        } catch (error) {
            console.error('❌ Failed to load user prompt:', error);
            throw new Error('Unable to load user prompt');
        }
    }

    // Get saved API configuration
    async function getApiConfig() {
        console.log('🔑 Loading API configuration...');
        
        try {
            if (!window.POKPOK || !window.POKPOK.storage) {
                throw new Error('Storage service not available');
            }

            const settings = await window.POKPOK.storage.loadSettings();
            if (!settings) {
                throw new Error('No settings found');
            }

            console.log('🔍 Available settings keys:', Object.keys(settings));
            console.log('🔑 Looking for apiKey in settings:', !!settings.apiKey);

            const apiKey = settings.apiKey;
            const model = settings.model || DEFAULT_MODEL;
            const geminiFeatures = settings.geminiFeatures || {
                thinkingMode: true,
                urlContext: true,
                googleSearch: true,
                highTemperature: true
            };

            if (!apiKey) {
                throw new Error('Gemini API key not configured');
            }

            console.log('✅ API configuration loaded', { 
                selectedModel: model, 
                keyLength: apiKey.length,
                isUserSelected: !!settings.model,
                fallbackUsed: !settings.model,
                geminiFeatures: geminiFeatures
            });
            return { apiKey, model, geminiFeatures };
        } catch (error) {
            console.error('❌ Failed to load API configuration:', error);
            throw error;
        }
    }

    // Get current page URL
    async function getCurrentPageUrl() {
        console.log('🌐 Getting current page URL...');
        
        return new Promise((resolve, reject) => {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                if (chrome.runtime.lastError) {
                    console.error('❌ Failed to get current tab:', chrome.runtime.lastError);
                    reject(new Error('Unable to get current page URL'));
                    return;
                }

                if (!tabs || tabs.length === 0) {
                    console.error('❌ No active tabs found');
                    reject(new Error('No active tab found'));
                    return;
                }

                const url = tabs[0].url;
                console.log('✅ Current page URL retrieved:', url);
                resolve(url);
            });
        });
    }

    // Prepare system prompt (remove URL placeholders since URL goes in user message)
    function prepareSystemPrompt(systemPromptContent, url) {
        console.log('📝 Preparing system prompt...');
        
        if (!systemPromptContent) {
            throw new Error('System prompt content not provided');
        }

        // Remove the **WEBSITE:** {{url}} line since we'll send URL as user message
        let preparedPrompt = systemPromptContent.replace(/\*\*WEBSITE:\*\*\s*\{\{url\}\}\s*/g, '');
        
        // Also remove any remaining {{url}} placeholders
        preparedPrompt = preparedPrompt.replace(/\{\{url\}\}/g, '');
        
        console.log('✅ System prompt prepared', { 
            originalLength: systemPromptContent.length, 
            preparedLength: preparedPrompt.length,
            url: url 
        });
        
        return preparedPrompt;
    }

    // Prepare user prompt (replace URL placeholder with actual URL)
    function prepareUserPrompt(userPromptContent, url) {
        console.log('📝 Preparing user prompt with URL replacement...');
        
        if (!userPromptContent) {
            throw new Error('User prompt content not provided');
        }

        // Replace {{url}} placeholder with actual URL
        const preparedPrompt = userPromptContent.replace(/\{\{url\}\}/g, url);
        
        console.log('✅ User prompt prepared', { 
            originalLength: userPromptContent.length, 
            preparedLength: preparedPrompt.length,
            url: url,
            hasPlaceholder: userPromptContent.includes('{{url}}'),
            replacementSuccess: preparedPrompt.includes(url),
            preview: preparedPrompt.substring(0, 200) + '...'
        });
        
        return preparedPrompt;
    }

    // Make Gemini API call with user-selected features and progressive fallback
    async function callGeminiApi(apiKey, model, systemPrompt, userMessage, geminiFeatures = null, retryCount = 0) {
        console.log('🤖 Making Gemini API call with user-selected features...', { 
            model, 
            systemPromptLength: systemPrompt.length,
            userMessage,
            geminiFeatures,
            retryCount 
        });

        const apiUrl = `${API_BASE_URL}/${model}:generateContent`;
        
        // Use user-selected features or fall back to default disabled features
        const features = geminiFeatures && typeof geminiFeatures === 'object' 
            ? geminiFeatures 
            : {
                thinkingMode: false,
                urlContext: false,
                googleSearch: false,
                highTemperature: false
            };
        
        // 🔍 DEBUG: Show what features are actually being used
        console.log('🛠️ Final features being passed to API:', features);
        console.log('📊 Features summary:', {
            thinkingMode: features.thinkingMode ? '✅ ENABLED' : '❌ DISABLED',
            urlContext: features.urlContext ? '✅ ENABLED' : '❌ DISABLED', 
            googleSearch: features.googleSearch ? '✅ ENABLED' : '❌ DISABLED',
            highTemperature: features.highTemperature ? '✅ ENABLED' : '❌ DISABLED'
        });
        
        // Start with user-selected features, will fallback progressively if needed
        return await tryApiCallWithFeatures(apiUrl, apiKey, systemPrompt, userMessage, features, 'user-selected');
    }

    // Progressive feature detection - try features and fallback gracefully
    async function tryApiCallWithFeatures(apiUrl, apiKey, systemPrompt, userMessage, features, level = 'user-selected') {
        let requestBody;
        
        if (level === 'user-selected' || level === 'full') {
            // Try with user-selected features or all features
            requestBody = buildRequestWithFeatures(systemPrompt, userMessage, features);
            const enabledFeatures = Object.entries(features).filter(([_, enabled]) => enabled).map(([feature, _]) => feature).join(', ');
            console.log(`🚀 Trying with features: ${enabledFeatures}...`);
        } else if (level === 'no-search') {
            // Try without search grounding  
            const noSearchFeatures = { ...features, googleSearch: false };
            requestBody = buildRequestWithFeatures(systemPrompt, userMessage, noSearchFeatures);
            console.log('🔄 Trying without Google Search...');
        } else if (level === 'minimal') {
            // Try with thinking mode only
            const minimalFeatures = { thinkingMode: features.thinkingMode, urlContext: false, googleSearch: false, highTemperature: false };
            requestBody = buildRequestWithFeatures(systemPrompt, userMessage, minimalFeatures);
            console.log('⚡ Trying minimal features (Thinking Mode only)...');
        } else {
            // Basic request without advanced features
            requestBody = buildBasicRequest(systemPrompt, userMessage);
            console.log('📦 Using basic API structure (no advanced features)...');
        }

        try {
            const result = await makeApiRequest(apiUrl, apiKey, requestBody);
            console.log(`✅ API call successful with feature level: ${level}`);
            return result;
        } catch (error) {
            console.log(`❌ API call failed with feature level: ${level}`, error.message);
            
            // Progressive fallback
            if ((level === 'user-selected' || level === 'full') && (error.message.includes('Search Grounding is not supported') || error.message.includes('google_search'))) {
                console.log('🔄 Google Search not supported, trying without it...');
                return await tryApiCallWithFeatures(apiUrl, apiKey, systemPrompt, userMessage, features, 'no-search');
            } else if (level === 'no-search' && (error.message.includes('url_context') || error.message.includes('URL context'))) {
                console.log('🔄 URL Context not supported, trying minimal features...');
                return await tryApiCallWithFeatures(apiUrl, apiKey, systemPrompt, userMessage, features, 'minimal');
            } else if (level === 'minimal' && error.message.includes('thinkingConfig')) {
                console.log('🔄 Thinking Mode not supported, using basic API...');
                return await tryApiCallWithFeatures(apiUrl, apiKey, systemPrompt, userMessage, features, 'basic');
            }
            
            // If all else fails, throw the error
            throw error;
        }
    }

    // Build request with user-selected features
    function buildRequestWithFeatures(systemPrompt, userMessage, features) {
        console.log('🛠️ Building API request with features:', features);
        
        // Send user-selected features exactly as chosen - no automatic overrides
        
        // Send user message exactly as written - NO automatic modifications
        let finalUserMessage = userMessage;
        
        const requestBody = {
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
            contents: [
                {
                    role: "user",
                    parts: [{ text: finalUserMessage }]
                }
            ],
            generationConfig: {
                temperature: features.highTemperature ? 1.0 : 0.5,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 18192
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        // Add thinking mode if enabled
        if (features.thinkingMode) {
            requestBody.generationConfig.thinkingConfig = {
                includeThoughts: true,
                thinkingBudget: 2048
            };
            console.log('✅ Added thinking mode with 2048 token budget');
        }

        // Build tools array based on enabled features
        const tools = [];
        if (features.urlContext) {
            tools.push({ "url_context": {} });
            console.log('✅ Added URL context tool');
        }
        if (features.googleSearch) {
            tools.push({ "google_search": {} });
            console.log('✅ Added Google Search tool');
        }

        if (tools.length > 0) {
            requestBody.tools = tools;
        }

        console.log('🛠️ Request built with features:', {
            thinkingMode: features.thinkingMode,
            urlContext: features.urlContext,
            googleSearch: features.googleSearch,
            highTemperature: features.highTemperature,
            temperature: requestBody.generationConfig.temperature,
            toolsCount: tools.length
        });
        
        // 🔍 DEBUG: Show actual API request structure
        console.log('🔍 ACTUAL API REQUEST BEING SENT:');
        console.log('📋 System Prompt Preview:', requestBody.systemInstruction.parts[0].text.substring(0, 200) + '...');
        console.log('📋 User Message:', requestBody.contents[0].parts[0].text);
        console.log('📋 Tools:', requestBody.tools || 'No tools');
        console.log('📋 Generation Config:', requestBody.generationConfig);

        return requestBody;
    }

    // Build request with all 2025 features (LEGACY - use buildRequestWithFeatures instead)
    function buildFullFeaturesRequest(systemPrompt, userMessage) {
        return {
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
            contents: [
                {
                    role: "user",
                    parts: [{ text: userMessage }]
                }
            ],
            generationConfig: {
                temperature: 0.5,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 18192,
                thinkingConfig: {
                    includeThoughts: true,
                    thinkingBudget: 2048
                }
            },
            tools: [
                { "url_context": {} },
                { "google_search": {} }
            ],
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };
    }

    // Build request without search grounding
    function buildNoSearchRequest(systemPrompt, userMessage) {
        return {
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
            contents: [
                {
                    role: "user",
                    parts: [{ text: userMessage }]
                }
            ],
            generationConfig: {
                temperature: 0.5,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 18192,
                thinkingConfig: {
                    includeThoughts: true,
                    thinkingBudget: 2048
                }
            },
            tools: [
                { "url_context": {} }
            ],
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };
    }

    // Build request with thinking mode only
    function buildMinimalRequest(systemPrompt, userMessage) {
        return {
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
            contents: [
                {
                    role: "user",
                    parts: [{ text: userMessage }]
                }
            ],
            generationConfig: {
                temperature: 0.5,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 18192,
                thinkingConfig: {
                    includeThoughts: true,
                    thinkingBudget: 2048
                }
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };
    }

    // Build basic request without advanced features
    function buildBasicRequest(systemPrompt, userMessage) {
        return {
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
            contents: [
                {
                    role: "user",
                    parts: [{ text: userMessage }]
                }
            ],
            generationConfig: {
                temperature: 0.5,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 18192
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };
    }

    // Make the actual API request
    async function makeApiRequest(apiUrl, apiKey, requestBody) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey
                },
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            console.log('📥 API response received', { 
                status: response.status,
                statusText: response.statusText,
                ok: response.ok 
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API error response:', errorText);
                throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ API response parsed successfully', { 
                hasCandidates: !!(data.candidates && data.candidates.length > 0),
                hasThoughts: !!(data.candidates?.[0]?.content?.thoughts),
                hasGroundingMetadata: !!(data.groundingMetadata),
                hasUrlContextMetadata: !!(data.urlContextMetadata),
                searchQueriesUsed: data.groundingMetadata?.webSearchQueries?.length || 0
            });

            // Return both response data and request metadata for debugging
            return {
                responseData: data,
                requestMetadata: {
                    systemPrompt: requestBody.systemInstruction?.parts?.[0]?.text,
                    userMessage: requestBody.contents?.[0]?.parts?.[0]?.text,
                    generationConfig: requestBody.generationConfig,
                    tools: requestBody.tools,
                    apiUrl,
                    requestBody
                }
            };
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('❌ API request failed:', error);
            throw error;
        }
    }

    // Save natural language output as readable text file
    async function saveNaturalLanguageOutput(responseText, url) {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const domain = new URL(url).hostname.replace(/[^a-zA-Z0-9]/g, '-');
            const filename = `gemini-natural-analysis-${domain}-${timestamp}.txt`;
            
            const outputContent = `GEMINI NATURAL LANGUAGE ANALYSIS
${'='.repeat(60)}

Website: ${url}
Analysis Date: ${new Date().toISOString()}
Model: Gemini 2.5 with Google Search & URL Context
Version: 2.43.0

${'='.repeat(60)}
COMPLETE ANALYSIS RESPONSE:
${'='.repeat(60)}

${responseText}

${'='.repeat(60)}
End of Analysis
Generated by POKPOK.AI Chrome Extension v2.42.0
`;
            
            // Create and download the text file
            const blob = new Blob([outputContent], { type: 'text/plain' });
            const url_blob = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url_blob;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url_blob);
            
            console.log('📄 Natural language output saved as text file:', filename);
            return filename;
        } catch (error) {
            console.error('❌ Failed to save natural language output:', error);
        }
    }

    // Save JSON output to /outputs folder
    async function saveJsonOutput(requestData, responseData, analysisData, url, geminiFeatures = {}) {
        // ALWAYS SAVE JSON - NO CONDITIONS, NO EXCEPTIONS
        console.log('💾 ALWAYS saving JSON output...');
        
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const domain = new URL(url).hostname.replace(/[^a-zA-Z0-9]/g, '-');
            const filename = `gemini-analysis-${domain}-${timestamp}.json`;
            
            const outputData = {
                metadata: {
                    timestamp: new Date().toISOString(),
                    url: url,
                    domain: domain,
                    model: requestData.model,
                    version: window.POKPOK_VERSION || "2.50.0",
                    features: {
                        thinkingMode: geminiFeatures.thinkingMode || false,
                        urlContext: geminiFeatures.urlContext || false,
                        googleSearch: geminiFeatures.googleSearch || false,
                        highTemperature: geminiFeatures.highTemperature || false,
                        thinkingBudget: geminiFeatures.thinkingMode ? 2048 : 0
                    }
                },
                request: {
                    model: requestData.model,
                    systemPromptLength: requestData.systemPrompt?.length || 0,
                    userMessage: requestData.userMessage,
                    generationConfig: requestData.generationConfig,
                    apiUrl: requestData.apiUrl
                },
                rawResponse: {
                    candidates: responseData.candidates,
                    usageMetadata: responseData.usageMetadata,
                    modelVersion: responseData.modelVersion,
                    thoughts: responseData.candidates?.[0]?.content?.thoughts || null,
                    groundingMetadata: responseData.groundingMetadata || null,
                    urlContextMetadata: responseData.urlContextMetadata || null,
                    // 🔍 DEBUG: Extract the actual text content for easy access
                    fullResponseText: responseData.candidates?.[0]?.content?.parts?.[0]?.text || null
                },
                parsedAnalysis: analysisData,
                debugInfo: {
                    requestSize: JSON.stringify(requestData.requestBody || {}).length,
                    responseSize: JSON.stringify(responseData).length,
                    parseSuccess: !!analysisData,
                    featuresUsed: {
                        thinkingMode: !!responseData.candidates?.[0]?.content?.thoughts,
                        groundingUsed: !!responseData.groundingMetadata,
                        urlContextUsed: !!responseData.urlContextMetadata,
                        searchResults: responseData.groundingMetadata?.webSearchQueries?.length || 0
                    }
                }
            };
            
            // Convert to JSON string with pretty formatting
            const jsonString = JSON.stringify(outputData, null, 2);
            
            // Create blob and download link (since we can't directly write files in Chrome extension)
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url_blob = URL.createObjectURL(blob);
            
            // Create download link
            const a = document.createElement('a');
            a.href = url_blob;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url_blob);
            
            console.log('💾 JSON output saved as download:', filename);
            
            // ALSO save to Google Drive (non-blocking)
            if (window.GoogleDriveService) {
                // Ensure GoogleDrive is initialized before trying to save
                if (!window.GoogleDriveService.initialized) {
                    console.log('☁️ GoogleDrive not initialized, attempting initialization...');
                    await window.GoogleDriveService.initialize();
                }
                window.GoogleDriveService.saveEverywhere(outputData, filename);
            }
            
            return filename;
        } catch (error) {
            console.error('❌ Failed to save JSON output:', error);
            // Even if local save fails, try Google Drive
            if (window.GoogleDriveService) {
                // Ensure GoogleDrive is initialized before trying to save
                if (!window.GoogleDriveService.initialized) {
                    console.log('☁️ GoogleDrive not initialized, attempting initialization...');
                    await window.GoogleDriveService.initialize();
                }
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                const domain = url ? new URL(url).hostname.replace(/[^a-zA-Z0-9]/g, '-') : 'unknown';
                const filename = `gemini-analysis-${domain}-${timestamp}.json`;
                window.GoogleDriveService.saveEverywhere({error: error.message, responseData, analysisData}, filename);
            }
        }
    }

    // Parse Gemini response
    function parseGeminiResponse(apiResult) {
        console.log('🔍 Parsing Gemini API response...');
        
        const apiResponse = apiResult.responseData;
        const requestMetadata = apiResult.requestMetadata;
        
        // Show which features were enabled for this request
        if (requestMetadata) {
            console.log('🛠️ Request features used:', {
                tools: requestMetadata.tools?.map(tool => Object.keys(tool)[0]) || [],
                temperature: requestMetadata.generationConfig?.temperature,
                hasThinking: !!requestMetadata.generationConfig?.thinkingConfig,
                maxTokens: requestMetadata.generationConfig?.maxOutputTokens
            });
        }
        
        try {
            if (!apiResponse.candidates || apiResponse.candidates.length === 0) {
                throw new Error('No candidates in API response');
            }

            const candidate = apiResponse.candidates[0];
            if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
                throw new Error('No content in API response candidate');
            }

            const responseText = candidate.content.parts[0].text;
            console.log('📄 Raw response text received', { length: responseText.length });
            
            // 🔍 FULL RESPONSE DEBUG - Show complete Gemini output
            console.log('🔍 COMPLETE GEMINI RESPONSE:');
            console.log('=' .repeat(80));
            console.log(responseText);
            console.log('=' .repeat(80));

            // Parse JSON response
            let analysisData;
            try {
                // Advanced cleaning for various response formats
                let cleanedText = responseText.trim();
                
                // Remove markdown code blocks
                cleanedText = cleanedText.replace(/```json\s*|\s*```/g, '');
                
                // Remove any text before the first {
                const jsonStart = cleanedText.indexOf('{');
                if (jsonStart > 0) {
                    console.warn('⚠️ Found text before JSON, removing:', cleanedText.substring(0, jsonStart));
                    cleanedText = cleanedText.substring(jsonStart);
                }
                
                // Remove any text after the last }
                const jsonEnd = cleanedText.lastIndexOf('}');
                if (jsonEnd >= 0 && jsonEnd < cleanedText.length - 1) {
                    console.warn('⚠️ Found text after JSON, removing:', cleanedText.substring(jsonEnd + 1));
                    cleanedText = cleanedText.substring(0, jsonEnd + 1);
                }
                
                // Try to parse the cleaned JSON
                analysisData = JSON.parse(cleanedText);
                
            } catch (parseError) {
                console.error('❌ JSON parsing failed:', parseError);
                console.error('📄 First 500 chars of raw response:', responseText.substring(0, 500));
                console.error('📄 Last 200 chars of raw response:', responseText.substring(Math.max(0, responseText.length - 200)));
                
                // Check if response looks like natural language instead of JSON
                if (responseText.includes('**') || responseText.includes('Analysis') || responseText.includes('brand')) {
                    console.log('📄 Detected natural language response instead of JSON');
                    
                    // This is actually a natural language response - save it and return special object
                    console.log('💾 Saving natural language analysis for user review...');
                    
                    return {
                        isNaturalLanguage: true,
                        responseText: responseText,
                        message: 'Gemini returned comprehensive natural language analysis instead of JSON format'
                    };
                } else {
                    throw new Error('Invalid JSON response from API');
                }
            }

            console.log('✅ Analysis data parsed successfully', { 
                hasBrandName: !!analysisData.brand_name,
                hasToneOfVoice: !!analysisData.tone_of_voice,
                hasBrandArchetypes: !!analysisData.brand_archetypes,
                hasRecommendations: !!analysisData.recommendations 
            });

            return analysisData;
        } catch (error) {
            console.error('❌ Failed to parse Gemini response:', error);
            throw error;
        }
    }

    // Helper function to update button progress (now works with ConsoleToButtonBridge)
    function updateButtonProgress(message) {
        // The ConsoleToButtonBridge will automatically capture and display console messages
        // so we just need to log the message and it will appear on the button
        console.log(message);
    }

    // Main analysis function
    async function analyzePageWithGemini() {
        console.log('🎯 Starting Gemini page analysis with fresh prompts...');
        
        try {
            // Step 1: Always load fresh system prompt (no caching)
            updateButtonProgress('📄 Loading fresh system prompt...');
            const freshSystemPrompt = await loadSystemPrompt();
            updateButtonProgress('✅ Fresh system prompt loaded');

            // Step 2: Always load fresh user prompt (no caching)  
            updateButtonProgress('📝 Loading fresh user prompt...');
            const freshUserPrompt = await loadUserPrompt();
            updateButtonProgress('✅ Fresh user prompt loaded');

            // Step 3: Get API configuration
            updateButtonProgress('🔑 Loading API configuration...');
            const { apiKey, model, geminiFeatures } = await getApiConfig();
            
            // 🔍 DEBUG: Show what features were loaded from settings
            console.log('🔍 LOADED FEATURES FROM SETTINGS:', geminiFeatures);
            console.log('📊 Feature Status:');
            console.log('  - Thinking Mode:', geminiFeatures.thinkingMode ? '✅ ENABLED' : '❌ DISABLED');
            console.log('  - URL Context:', geminiFeatures.urlContext ? '✅ ENABLED' : '❌ DISABLED');
            console.log('  - Google Search:', geminiFeatures.googleSearch ? '✅ ENABLED' : '❌ DISABLED');
            console.log('  - High Temperature:', geminiFeatures.highTemperature ? '✅ ENABLED' : '❌ DISABLED');
            
            updateButtonProgress('✅ API configuration loaded');

            // Step 3b: Initialize Google Drive service now that storage is confirmed working
            if (window.GoogleDriveService && !window.GoogleDriveService.initialized) {
                console.log('☁️ Initializing Google Drive service...');
                await window.GoogleDriveService.initialize();
            }

            // Step 4: Get current page URL
            updateButtonProgress('🌐 Getting page URL...');
            const currentUrl = await getCurrentPageUrl();

            // Step 5: Prepare both prompts
            updateButtonProgress('📝 Preparing analysis prompts...');
            const preparedSystemPrompt = prepareSystemPrompt(freshSystemPrompt, currentUrl);
            const preparedUserPrompt = prepareUserPrompt(freshUserPrompt, currentUrl);

            // Step 6: Make API call with user-selected features
            updateButtonProgress('🚀 Calling Gemini API with selected features...');
            const apiResult = await callGeminiApi(apiKey, model, preparedSystemPrompt, preparedUserPrompt, geminiFeatures);
            updateButtonProgress('✅ API response received');

            // Step 7: Parse response
            updateButtonProgress('⚡ Parsing analysis data...');
            const analysisData = parseGeminiResponse(apiResult);

            // Step 8: Handle different response types
            updateButtonProgress('💾 Saving results...');
            
            if (analysisData.isNaturalLanguage) {
                // Natural language response - save as text file
                console.log('📄 Processing natural language response...');
                try {
                    await saveNaturalLanguageOutput(analysisData.responseText, currentUrl);
                    updateButtonProgress('📄 Natural language analysis saved!');
                } catch (saveError) {
                    console.warn('⚠️ Failed to save natural language output:', saveError);
                }
                
                // Still save JSON debug data
                try {
                    await saveJsonOutput(apiResult.requestMetadata, apiResult.responseData, null, currentUrl, geminiFeatures);
                } catch (saveError) {
                    console.warn('⚠️ Failed to save JSON debug output:', saveError);
                }
                
                updateButtonProgress('✅ Natural language analysis completed!');
                console.log('📄 Gemini provided natural language analysis - check Downloads folder');
                
                return {
                    success: true,
                    isNaturalLanguage: true,
                    message: analysisData.message,
                    responseText: analysisData.responseText,
                    url: currentUrl
                };
            } else {
                // Standard JSON response
                try {
                    await saveJsonOutput(apiResult.requestMetadata, apiResult.responseData, analysisData, currentUrl, geminiFeatures);
                } catch (saveError) {
                    console.warn('⚠️ Failed to save JSON output (continuing with analysis):', saveError);
                }
                
                updateButtonProgress('🎉 Analysis completed!');
                console.log('🎉 Gemini analysis completed successfully with dynamic prompts!');
                return {
                    success: true,
                    data: analysisData,
                    url: currentUrl
                };
            }

        } catch (error) {
            console.error('❌ Gemini analysis failed:', error);
            updateButtonProgress('❌ Analysis failed');
            return {
                success: false,
                error: error.message,
                fallbackToLocal: true
            };
        }
    }

    // Public API
    return {
        initialize: initialize,
        analyzePageWithGemini: analyzePageWithGemini,
        loadSystemPrompt: loadSystemPrompt,
        loadUserPrompt: loadUserPrompt,
        getApiConfig: getApiConfig
    };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.GeminiAnalysisService.initialize);
} else {
    window.GeminiAnalysisService.initialize();
}