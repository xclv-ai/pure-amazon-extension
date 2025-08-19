/**
 * POKPOK.AI Chrome Extension v2.25.0
 * File: js/basic_analysis.js
 * Purpose: Local text analysis using compromise.js and Nielsen's 4-dimensional framework
 * 
 * Key Features:
 * - Nielsen's 4-dimensional tone analysis (Formal, Serious, Respectful, Enthusiastic)
 * - Pure analysis functions with no UI dependencies
 * - Fast offline processing using compromise.js NLP library
 * - Consistent data structure output compatible with UI sliders
 * 
 * Dependencies:
 * - lib/compromise.min.js (loaded globally)
 * 
 * Exposes:
 * - window.BasicAnalysis.analyzeText() - Main analysis function
 * 
 * Analysis Dimensions:
 * - Formal vs. Casual: Professional tone assessment (0-100%)
 * - Serious vs. Funny: Humor detection and measurement
 * - Respectful vs. Irreverent: Respect level analysis  
 * - Matter-of-fact vs. Enthusiastic: Energy and enthusiasm detection
 * 
 * Data Structure Output:
 * {
 *   rawScores: {
 *     'Formal vs. Casual': 60,              // 0-100% for slider positioning
 *     'Serious vs. Humorous': 20,           // Maps to "Serious vs. Funny" in UI
 *     'Respectful vs. Irreverent': 80,
 *     'Enthusiastic vs. Matter-of-fact': 40 // Maps to "Matter-of-fact vs. Enthusiastic"
 *   },
 *   tones: {
 *     'Formal vs. Casual': { scale: 3, label: 'Balanced' }
 *   }
 * }
 * 
 * Integration Points:
 * - analysis.js: Called for local analysis mode
 * - ToneAnalysisDisplay.js: Provides data for UI slider updates
 * - Compromise.js: Natural language processing engine
 * 
 * Last Updated: August 2024
 */

(function() {
    // Convert percentage score to 1-5 scale and position label
    function convertToScaleFormat(percentScore, toneName) {
        // Convert 0-100 to 1-5 scale
        const scale = Math.max(1, Math.min(5, Math.round(percentScore / 20)));
        
        // Generate position labels based on tone and score
        const labels = {
            'Formal vs. Casual': {
                1: 'Very Casual', 2: 'Casual', 3: 'Balanced', 4: 'Formal', 5: 'Very Formal'
            },
            'Enthusiastic vs. Matter-of-fact': {
                1: 'Very Matter-of-fact', 2: 'Matter-of-fact', 3: 'Balanced', 4: 'Enthusiastic', 5: 'Very Enthusiastic'
            },
            'Respectful vs. Irreverent': {
                1: 'Very Irreverent', 2: 'Irreverent', 3: 'Balanced', 4: 'Respectful', 5: 'Very Respectful'
            },
            'Serious vs. Humorous': {
                1: 'Very Serious', 2: 'Serious', 3: 'Balanced', 4: 'Humorous', 5: 'Very Humorous'
            }
        };
        
        return {
            scale: scale,
            label: labels[toneName] ? labels[toneName][scale] : `${scale}/5`,
            percentage: Math.round(percentScore)
        };
    }

    // Main analysis function
    function analyzeText(text) {
        console.log('BasicAnalysis: analyzeText called with:', text.substring(0, 50));
        
        // Direct analysis with compromise.js
        const doc = nlp(text);
        
        // Calculate raw percentage scores
        const rawScores = {
            'Formal vs. Casual': calculateFormalityScore(doc, text),
            'Enthusiastic vs. Matter-of-fact': calculateEnthusiasmScore(doc, text),
            'Respectful vs. Irreverent': calculateRespectScore(doc, text),
            'Serious vs. Humorous': calculateHumorScore(doc, text)
        };
        
        // Convert to formatted results
        const formattedTones = {};
        Object.keys(rawScores).forEach(toneName => {
            formattedTones[toneName] = convertToScaleFormat(rawScores[toneName], toneName);
        });
        
        const analysis = {
            text: text,
            tones: formattedTones,
            rawScores: rawScores, // Keep raw scores for slider positioning
            nlpData: {
                sentences: doc.sentences().length,
                words: doc.terms().length,
                nouns: doc.nouns().length,
                verbs: doc.verbs().length,
                adjectives: doc.adjectives().length,
                sentiment: analyzeSentiment(doc)
            },
            summary: `Analysis of ${text.length} characters, ${doc.terms().length} words, ${doc.sentences().length} sentences.`
        };
        
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(analysis);
            }, 500);
        });
    }

    // Universal linguistic analysis using compromise.js - Nielsen Framework
    function calculateFormalityScore(doc, text) {
        let score = 50; // Start at neutral
        
        // CASUAL INDICATORS (using compromise.js linguistic analysis)
        // 1. Contractions - use compromise.js detection
        const contractions = doc.contractions().length;
        const totalTerms = doc.terms().length;
        if (totalTerms > 0) {
            const contractionRatio = contractions / totalTerms;
            score -= contractionRatio * 40; // Contractions = casual
        }
        
        // 2. Imperative sentences (commands) - casual/direct
        const sentences = doc.sentences();
        let imperativeCount = 0;
        sentences.forEach(sentence => {
            // Check if sentence starts with bare infinitive verb
            const firstTerm = sentence.terms().first();
            if (firstTerm.has('#Verb') && !firstTerm.has('#Modal') && !firstTerm.has('#Auxiliary')) {
                imperativeCount++;
            }
        });
        if (sentences.length > 0) {
            score -= (imperativeCount / sentences.length) * 30;
        }
        
        // 3. All caps words (very casual/aggressive)
        const allCapsWords = doc.match('@isUpperCase').length;
        if (totalTerms > 0) {
            score -= (allCapsWords / totalTerms) * 25;
        }
        
        // FORMAL INDICATORS
        // 1. Complex sentence structure - longer sentences are more formal
        const avgWordsPerSentence = sentences.length > 0 ? totalTerms / sentences.length : 0;
        if (avgWordsPerSentence > 20) score += 20;
        else if (avgWordsPerSentence > 15) score += 10;
        else if (avgWordsPerSentence < 8) score -= 10; // Very short = casual
        
        // 2. Passive voice (formal indicator)
        const passivePatterns = doc.match('(was|were|been|being) #PastTense').length + 
                               doc.match('#Noun (was|were) #PastTense').length;
        score += passivePatterns * 8;
        
        // 3. Complex vocabulary - longer words tend to be more formal
        let complexWordCount = 0;
        doc.terms().forEach(term => {
            if (term.text.length > 8 && term.has('#Noun|#Adjective|#Adverb')) {
                complexWordCount++;
            }
        });
        if (totalTerms > 0) {
            const complexRatio = complexWordCount / totalTerms;
            score += complexRatio * 30;
        }
        
        // 4. Modal verbs (may, might, could) - more tentative/formal
        const modalCount = doc.match('#Modal').length;
        score += modalCount * 6;
        
        // 5. Subordinate clauses (which, that, because) - more complex/formal
        const subordinateMarkers = doc.match('(which|that|because|although|whereas|however)').length;
        score += subordinateMarkers * 5;
        
        return Math.max(0, Math.min(100, score));
    }

    function calculateEnthusiasmScore(doc, text) {
        let score = 50; // Start at neutral
        const totalTerms = doc.terms().length;
        
        // ENTHUSIASTIC INDICATORS (using compromise.js)
        // 1. Exclamation marks - key Nielsen indicator
        const exclamations = (text.match(/!/g) || []).length;
        const sentences = doc.sentences().length;
        if (sentences > 0) {
            const exclamationRatio = exclamations / sentences;
            score += exclamationRatio * 50; // High impact
        }
        
        // 2. Superlatives and intensifiers - compromise.js can detect these
        const superlatives = doc.match('#Superlative').length;
        const intensifiers = doc.match('(very|really|absolutely|extremely|incredibly|totally|completely|so)').length;
        if (totalTerms > 0) {
            const intensityRatio = (superlatives + intensifiers) / totalTerms;
            score += intensityRatio * 40;
        }
        
        // 3. ALL CAPS words - high energy indicator
        const allCapsWords = doc.match('@isUpperCase').length;
        if (totalTerms > 0) {
            const capsRatio = allCapsWords / totalTerms;
            score += capsRatio * 35;
        }
        
        // 4. Emotional adjectives - compromise.js can identify positive adjectives
        const positiveAdjectives = doc.match('#Positive #Adjective').length;
        if (totalTerms > 0) {
            const positiveRatio = positiveAdjectives / totalTerms;
            score += positiveRatio * 30;
        }
        
        // 5. Multiple punctuation (!!!, ???) - indicates high emotion
        const multiplePunctuation = (text.match(/[!?]{2,}/g) || []).length;
        score += multiplePunctuation * 15;
        
        // 6. Short, energetic sentences - enthusiasm often uses brevity for impact
        let shortSentences = 0;
        doc.sentences().forEach(sentence => {
            if (sentence.terms().length <= 4) {
                shortSentences++;
            }
        });
        if (sentences > 0) {
            const shortRatio = shortSentences / sentences;
            score += shortRatio * 20;
        }
        
        // MATTER-OF-FACT INDICATORS (reduce enthusiasm)
        // 1. Neutral, qualifying language
        const qualifyingWords = doc.match('(simply|basically|essentially|merely|just|only|perhaps|possibly|might|may)').length;
        if (totalTerms > 0) {
            const qualifyingRatio = qualifyingWords / totalTerms;
            score -= qualifyingRatio * 25;
        }
        
        // 2. Long, complex sentences - matter-of-fact tends to be more detailed
        let longSentences = 0;
        doc.sentences().forEach(sentence => {
            if (sentence.terms().length > 20) {
                longSentences++;
            }
        });
        if (sentences > 0) {
            const longRatio = longSentences / sentences;
            score -= longRatio * 15;
        }
        
        // 3. Passive voice - reduces energy/enthusiasm
        const passiveMarkers = doc.match('(was|were|been|being) #PastTense').length;
        if (totalTerms > 0) {
            const passiveRatio = passiveMarkers / totalTerms;
            score -= passiveRatio * 20;
        }
        
        return Math.max(0, Math.min(100, score));
    }

    function calculateRespectScore(doc, text) {
        let score = 50; // Start at neutral
        const totalTerms = doc.terms().length;
        
        // RESPECTFUL INDICATORS (using compromise.js)
        // 1. Polite language patterns - modal verbs show deference
        const politeModals = doc.match('(please|would|could|might|may) #Verb').length;
        const conditionalRequests = doc.match('(would you|could you|may i|might i)').length;
        score += (politeModals + conditionalRequests) * 12;
        
        // 2. Formal address patterns - compromise.js can detect proper nouns/people
        const properNouns = doc.match('#ProperNoun').length;
        const people = doc.people().length;
        if (totalTerms > 0) {
            const formalAddressRatio = (properNouns + people) / totalTerms;
            score += formalAddressRatio * 25;
        }
        
        // 3. Tentative, respectful language - hedging and softening
        const hedgingWords = doc.match('(perhaps|possibly|presumably|apparently|seemingly)').length;
        const softeningWords = doc.match('(rather|quite|somewhat|fairly|relatively)').length;
        if (totalTerms > 0) {
            const tentativeRatio = (hedgingWords + softeningWords) / totalTerms;
            score += tentativeRatio * 20;
        }
        
        // 4. Question forms - respectful inquiry vs demanding
        const questions = doc.match('.? .').length; // Questions end with ?
        const sentences = doc.sentences().length;
        if (sentences > 0) {
            const questionRatio = questions / sentences;
            score += questionRatio * 15;
        }
        
        // IRREVERENT INDICATORS (reduce respect)
        // 1. Imperative commands without politeness - direct/demanding
        let bareImperatives = 0;
        doc.sentences().forEach(sentence => {
            const firstTerm = sentence.terms().first();
            if (firstTerm.has('#Verb') && !sentence.has('(please|would|could|may|might)')) {
                bareImperatives++;
            }
        });
        if (sentences > 0) {
            const imperativeRatio = bareImperatives / sentences;
            score -= imperativeRatio * 25;
        }
        
        // 2. ALL CAPS - aggressive/disrespectful tone
        const allCapsWords = doc.match('@isUpperCase').length;
        if (totalTerms > 0) {
            const capsRatio = allCapsWords / totalTerms;
            score -= capsRatio * 20;
        }
        
        // 3. Negative adjectives towards others - compromise.js can detect sentiment
        const negativeAdjectives = doc.match('#Negative #Adjective').length;
        if (totalTerms > 0) {
            const negativeRatio = negativeAdjectives / totalTerms;
            score -= negativeRatio * 15;
        }
        
        // 4. Dismissive language patterns
        const dismissivePatterns = doc.match('(whatever|who cares|so what|big deal)').length;
        score -= dismissivePatterns * 20;
        
        // 5. Excessive punctuation - can indicate aggression
        const excessivePunctuation = (text.match(/[!]{2,}/g) || []).length;
        score -= excessivePunctuation * 10;
        
        return Math.max(0, Math.min(100, score));
    }

    function calculateHumorScore(doc, text) {
        let score = 50; // Start at neutral
        const totalTerms = doc.terms().length;
        
        // HUMOROUS INDICATORS (using compromise.js linguistic analysis)
        // 1. Creative wordplay and metaphors - unexpected combinations
        let unusualMetaphors = 0;
        doc.sentences().forEach(sentence => {
            // Look for creative verb-noun combinations that don't literally make sense
            const verbs = sentence.match('#Verb');
            const nouns = sentence.match('#Noun');
            if (verbs.length > 0 && nouns.length > 0) {
                // This is simplified - real implementation would use semantic analysis
                unusualMetaphors += 0.5;
            }
        });
        score += unusualMetaphors * 8;
        
        // 2. Alliteration and sound play - compromise.js can analyze phonetics
        let alliterationCount = 0;
        const terms = doc.terms().out('array');
        for (let i = 0; i < terms.length - 1; i++) {
            if (terms[i] && terms[i+1] && 
                terms[i][0] && terms[i+1][0] && 
                terms[i][0].toLowerCase() === terms[i+1][0].toLowerCase()) {
                alliterationCount++;
            }
        }
        score += alliterationCount * 10;
        
        // 3. Exclamation marks (can indicate playfulness)
        const exclamations = (text.match(/!/g) || []).length;
        const sentences = doc.sentences().length;
        if (sentences > 0) {
            const exclamationRatio = exclamations / sentences;
            score += exclamationRatio * 25; // Moderate impact - can be serious too
        }
        
        // 4. Unexpected juxtapositions - serious words in casual context
        const seriousWords = doc.match('(murder|kill|destroy|crush|annihilate)').length;
        const casualContext = doc.match('(thirst|hunger|craving|desire)').length;
        if (seriousWords > 0 && casualContext > 0) {
            score += (seriousWords + casualContext) * 15; // Humorous incongruity
        }
        
        // 5. Emoticons and informal punctuation
        const emoticons = text.match(/:\)|:\(|:D|;-?\)|:-?\(|:-?P|:-?\/|<3|:o|:p/gi) || [];
        score += emoticons.length * 20;
        
        // 6. Playful interjections
        const interjections = doc.match('(wow|whoa|hey|oh|ah|ooh|aha)').length;
        score += interjections * 12;
        
        // SERIOUS INDICATORS (reduce humor)
        // 1. Academic/technical language density
        const technicalTerms = doc.match('#Noun').filter(term => term.text.length > 8).length;
        if (totalTerms > 0) {
            const technicalRatio = technicalTerms / totalTerms;
            score -= technicalRatio * 25;
        }
        
        // 2. Formal sentence structure - long, complex sentences
        let complexSentences = 0;
        doc.sentences().forEach(sentence => {
            const subordinateClauses = sentence.match('(that|which|because|although|while|whereas)').length;
            if (subordinateClauses > 1 || sentence.terms().length > 25) {
                complexSentences++;
            }
        });
        if (sentences > 0) {
            const complexRatio = complexSentences / sentences;
            score -= complexRatio * 20;
        }
        
        // 3. Passive voice - less engaging/playful
        const passiveMarkers = doc.match('(was|were|been|being) #PastTense').length;
        if (totalTerms > 0) {
            const passiveRatio = passiveMarkers / totalTerms;
            score -= passiveRatio * 15;
        }
        
        // 4. Qualifying language - hedging reduces playfulness
        const qualifiers = doc.match('(however|nevertheless|furthermore|moreover|therefore)').length;
        if (totalTerms > 0) {
            const qualifierRatio = qualifiers / totalTerms;
            score -= qualifierRatio * 18;
        }
        
        return Math.max(0, Math.min(100, score));
    }

    function analyzeSentiment(doc) {
        // Simple sentiment analysis using compromise.js
        const positive = doc.match('#Positive').length;
        const negative = doc.match('#Negative').length;
        
        if (positive > negative) return 'positive';
        if (negative > positive) return 'negative';
        return 'neutral';
    }

    // Export the module
    window.BasicAnalysis = {
        analyzeText: analyzeText
    };
    
    console.log('BasicAnalysis module loaded');
})();