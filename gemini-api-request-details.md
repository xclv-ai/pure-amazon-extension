# Current Gemini API Request Parameters

## API Configuration
```javascript
const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 2;
```

## HTTP Request Structure
```javascript
// URL Format
`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

// Headers
{
    'Content-Type': 'application/json',
    'x-goog-api-key': apiKey
}

// Request Body
{
    contents: [
        {
            parts: [
                { text: systemPrompt },
                { text: `Perform comprehensive brand analysis for the following website content. Website: ${userMessage}` }
            ]
        }
    ],
    generationConfig: {
        temperature: 0.5,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 18192,
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
}
```

## Current Model Options
- **gemini-2.5-pro** - Most capable model
- **gemini-2.5-flash** - Fast and efficient (default)
- **gemini-2.5-flash-lite** - Lightweight version

## User Message Format
The user message is formatted as: `Perform comprehensive brand analysis for the following website content. Website: ${currentPageUrl}`

## System Prompt
Loaded from: `/prompts/comprehensive-brand-analysis.md`
- `{{url}}` placeholders are replaced with actual URL
- `**WEBSITE:** {{url}}` lines are removed since URL is sent in user message

## Generation Parameters Analysis
- **temperature: 0.3** - Fairly deterministic (good for consistent analysis)
- **topK: 40** - Moderate token selection diversity
- **topP: 0.95** - High nucleus sampling (allows for creativity while staying focused)
- **maxOutputTokens: 18192** - Should be sufficient for comprehensive JSON response

## Safety Settings
All categories set to "BLOCK_MEDIUM_AND_ABOVE" which should allow business content analysis while blocking harmful content.

## Notes for Optimization
1. Consider adjusting temperature based on analysis type needed
2. maxOutputTokens might need increase if JSON responses are getting cut off
3. Safety settings are appropriate for brand analysis use case