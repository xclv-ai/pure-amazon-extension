// POKPOK.AI Chrome Extension - Main JavaScript
// All functionality for the Tone Analysis interface

// Simple language detection function
function detectLanguage(text) {
    // Polish-specific character patterns
    const polishChars = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/;
    const polishWords = /\b(jest|to|nie|się|na|w|z|do|że|i|a|o|jak|ale|czy|przez|przy|po|dla|od|bez|nad|pod|za|przed|między|oraz|lub|lecz|więc|zatem|ponieważ|gdyż|jeśli|jeżeli|firma|polska|polski|polskie)\b/i;
    
    if (polishChars.test(text) || polishWords.test(text)) {
        return 'polish';
    }
    
    // Default to English
    return 'english';
}

// Polish-specific vocabulary for analysis
const polishVocabulary = {
    formal: ['szanowny', 'szanowna', 'uprzejmie', 'państwo', 'pan', 'pani', 'proszę', 'dziękuję', 'przepraszam', 'pozwolić', 'zechcieć', 'raczyć', 'łaskawy', 'uprzejmy', 'grzeczny'],
    informal: ['cześć', 'hej', 'siema', 'nara', 'spoko', 'fajny', 'super', 'ekstra', 'kozak', 'ty', 'twój', 'ciebie'],
    enthusiastic: ['wspaniały', 'świetny', 'fantastyczny', 'niesamowity', 'cudowny', 'rewelacyjny', 'genialny', 'doskonały', 'znakomity', 'wybitny'],
    respectful: ['szacunek', 'poważanie', 'honor', 'godność', 'uznanie', 'cenić', 'doceniać', 'podziwiać'],
    humorous: ['żart', 'śmieszny', 'zabawny', 'wesoły', 'dowcip', 'haha', 'hihi'],
    business: ['firma', 'przedsiębiorstwo', 'spółka', 'klient', 'produkt', 'usługa', 'oferta', 'współpraca', 'profesjonalny', 'jakość', 'gwarancja'],
    positive: ['dobry', 'świetny', 'doskonały', 'najlepszy', 'polecam', 'zadowolony', 'satysfakcja', 'sukces', 'korzyść', 'wartość'],
    negative: ['zły', 'słaby', 'kiepski', 'problem', 'wada', 'brak', 'niedobry', 'niezadowolony', 'rozczarowany']
};

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

// IMPORTANT: Define analysis functions first to avoid reference errors
function analyzeText(text) {
    console.log('analyzeText function called with:', text.substring(0, 50));
    
    // Detect language
    const language = detectLanguage(text);
    console.log('Detected language:', language);
    
    // Use compromise.js for English, custom analysis for Polish
    if (language === 'polish') {
        return analyzePolishText(text);
    }
    
    // Original English analysis with compromise.js
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
        language: language,
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

// Polish text analysis function
function analyzePolishText(text) {
    const textLower = text.toLowerCase();
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Calculate Polish-specific raw percentage scores
    const rawScores = {
        'Formal vs. Casual': calculatePolishFormalityScore(text),
        'Enthusiastic vs. Matter-of-fact': calculatePolishEnthusiasmScore(text),
        'Respectful vs. Irreverent': calculatePolishRespectScore(text),
        'Serious vs. Humorous': calculatePolishHumorScore(text)
    };
    
    // Convert to formatted results
    const formattedTones = {};
    Object.keys(rawScores).forEach(toneName => {
        formattedTones[toneName] = convertToScaleFormat(rawScores[toneName], toneName);
    });
    
    const analysis = {
        text: text,
        language: 'polish',
        tones: formattedTones,
        rawScores: rawScores, // Keep raw scores for slider positioning
        nlpData: {
            sentences: sentences.length,
            words: words.length,
            nouns: 0, // Simplified for Polish
            verbs: 0, // Simplified for Polish
            adjectives: 0, // Simplified for Polish
            sentiment: analyzePolishSentiment(text)
        },
        summary: `Polish text: ${text.length} characters, ${words.length} words, ${sentences.length} sentences.`
    };
    
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(analysis);
        }, 500);
    });
}

// Polish-specific scoring functions
function calculatePolishFormalityScore(text) {
    let score = 50;
    const textLower = text.toLowerCase();
    
    // Check for formal Polish words
    polishVocabulary.formal.forEach(word => {
        if (textLower.includes(word)) score += 5;
    });
    
    // Check for informal Polish words
    polishVocabulary.informal.forEach(word => {
        if (textLower.includes(word)) score -= 5;
    });
    
    // Business language increases formality
    polishVocabulary.business.forEach(word => {
        if (textLower.includes(word)) score += 3;
    });
    
    // Check for formal address (Pan/Pani with capital)
    if (text.match(/\bPan\b|\bPani\b|\bPaństwo\b/)) score += 10;
    
    // Long sentences suggest formality
    const avgWordPerSentence = text.split(/[.!?]/).map(s => s.split(/\s+/).length).reduce((a,b) => a+b, 0) / Math.max(1, text.split(/[.!?]/).length);
    if (avgWordPerSentence > 15) score += 10;
    
    return Math.max(0, Math.min(100, score));
}

function calculatePolishEnthusiasmScore(text) {
    let score = 50;
    const textLower = text.toLowerCase();
    
    // Check for enthusiastic Polish words
    polishVocabulary.enthusiastic.forEach(word => {
        if (textLower.includes(word)) score += 7;
    });
    
    // Exclamation marks
    const exclamations = (text.match(/!/g) || []).length;
    score += exclamations * 10;
    
    // Multiple exclamation marks
    if (text.includes('!!')) score += 15;
    
    // Positive words increase enthusiasm
    polishVocabulary.positive.forEach(word => {
        if (textLower.includes(word)) score += 5;
    });
    
    // Percentage signs with high numbers (100%, 99%)
    if (text.match(/\b(100|99|98|97|96|95)%/)) score += 8;
    
    return Math.max(0, Math.min(100, score));
}

function calculatePolishRespectScore(text) {
    let score = 50;
    const textLower = text.toLowerCase();
    
    // Check for respectful Polish words
    polishVocabulary.respectful.forEach(word => {
        if (textLower.includes(word)) score += 8;
    });
    
    // Formal address forms
    if (text.match(/\bPan[a-z]*\b|\bPani[a-z]*\b/)) score += 10;
    
    // Business and professional terms
    if (textLower.includes('profesjon') || textLower.includes('ekspert') || textLower.includes('specjalist')) {
        score += 7;
    }
    
    // Family-oriented language (common in Polish business)
    if (textLower.includes('rodzinn')) score += 5;
    if (textLower.includes('tradycj')) score += 5;
    
    return Math.max(0, Math.min(100, score));
}

function calculatePolishHumorScore(text) {
    let score = 50;
    const textLower = text.toLowerCase();
    
    // Check for humorous Polish words
    polishVocabulary.humorous.forEach(word => {
        if (textLower.includes(word)) score += 12;
    });
    
    // Emoticons
    const emoticons = text.match(/:\)|:\(|:D|;-?\)|:-?\(/g) || [];
    score += emoticons.length * 10;
    
    // Diminutives (common in casual/playful Polish)
    if (textLower.match(/[a-z]+(ek|ka|ko|uszek|uszka|eńka|uś|usia|usio)/)) {
        score += 5;
    }
    
    // Serious business language reduces humor
    if (textLower.includes('gwarancj') || textLower.includes('certyfik') || textLower.includes('norma')) {
        score -= 10;
    }
    
    return Math.max(0, Math.min(100, score));
}

// Polish sentiment analysis
function analyzePolishSentiment(text) {
    const textLower = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    
    polishVocabulary.positive.forEach(word => {
        if (textLower.includes(word)) positiveCount++;
    });
    
    polishVocabulary.negative.forEach(word => {
        if (textLower.includes(word)) negativeCount++;
    });
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
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

function displayToneAnalysis(analysis, originalText) {
    console.log('Displaying tone analysis:', analysis);
    
    // Update sliders using raw percentage scores for positioning
    if (analysis.rawScores) {
        Object.keys(analysis.rawScores).forEach(toneName => {
            const slider = document.querySelector(`[data-tone="${toneName}"]`);
            if (slider) {
                slider.value = analysis.rawScores[toneName];
            }
        });
    }
    
    // Create formatted results display
    const resultsText = Object.entries(analysis.tones).map(([tone, data]) => {
        return `${tone}: ${data.scale}/5`;
    }).join('\n');
    
    alert(`Tone Analysis Complete!\n\nAnalyzed: "${originalText.substring(0, 50)}${originalText.length > 50 ? '...' : ''}"\n\nResults:\n${resultsText}`);
}

// Logo animation
const symbols = [
    '*', '•', '◆', '▲', '●', '■', '▼', '◄', '►', '♦', '♠', '♣', '♥',
    '★', '☆', '✦', '✧', '⬢', '⬡', '◉', '◎', '○', '◇', '◈', '⟐', '⟡'
];

let animationStage = 'idle';
let cycleCount = 0;

function triggerLogoAnimation() {
    if (animationStage === 'idle') {
        animationStage = 'cycling';
        cycleCount = 0;
        cycleSymbols();
    }
}

function cycleSymbols() {
    if (animationStage !== 'cycling') return;
    
    const logoSymbol = document.getElementById('logoSymbol');
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    
    logoSymbol.textContent = randomSymbol;
    logoSymbol.className = 'logo-symbol cycling';
    
    cycleCount++;
    
    if (cycleCount >= 20) {
        animationStage = 'settling';
        settleAnimation();
    } else {
        setTimeout(cycleSymbols, 80);
    }
}

function settleAnimation() {
    const settleSymbols = ['◆', '●', '▲', '♦', '*'];
    let settleIndex = 0;
    const logoSymbol = document.getElementById('logoSymbol');
    
    function settle() {
        logoSymbol.textContent = settleSymbols[settleIndex];
        logoSymbol.className = 'logo-symbol settling';
        settleIndex++;
        
        if (settleIndex >= settleSymbols.length) {
            logoSymbol.textContent = '*';
            logoSymbol.className = 'logo-symbol';
            animationStage = 'idle';
            cycleCount = 0;
        } else {
            setTimeout(settle, 200);
        }
    }
    
    settle();
}


// Card toggle functionality
function toggleCard(header) {
    const card = header.closest('.analysis-card');
    const bracket = header.querySelector('.bracket');
    const toggle = header.querySelector('.toggle');
    const content = card.querySelector('.card-content');
    
    const isExpanded = bracket.textContent === '[*]';
    
    if (isExpanded) {
        // Collapse
        bracket.textContent = '[ ]';
        toggle.textContent = '[+]';
        content.classList.add('hidden');
        header.classList.remove('pink', 'teal');
        header.classList.add('collapsed');
    } else {
        // Expand
        bracket.textContent = '[*]';
        toggle.textContent = '[-]';
        content.classList.remove('hidden');
        header.classList.remove('collapsed');
        
        // Restore original color
        if (header.querySelector('.card-title').textContent.includes('Brand Archetypes Mix')) {
            header.classList.add('teal');
        } else {
            header.classList.add('pink');
        }
    }
}

// Section toggle functionality
function toggleSection(sectionHeader) {
    const bracket = sectionHeader.querySelector('.bracket');
    const toggle = sectionHeader.querySelector('.section-toggle');
    const sectionTitle = sectionHeader.querySelector('.section-title').textContent.trim();
    let content = sectionHeader.nextElementSibling;
    
    const isExpanded = bracket.textContent === '[*]';
    
    if (isExpanded) {
        // Collapse
        bracket.textContent = '[ ]';
        toggle.textContent = 'details';
        toggle.classList.add('hidden');
        if (content && content.classList.contains('section-content')) {
            content.classList.add('hidden');
        }
    } else {
        // Expand
        bracket.textContent = '[*]';
        toggle.textContent = 'hide';
        toggle.classList.remove('hidden');
        
        // Check if we need to create content for sections that don't have it
        if (!content || !content.classList.contains('section-content')) {
            // Create content for sections like LOOK & FEEL, DISTINCTIVE ASSETS, etc.
            if (sectionTitle.includes('LOOK & FEEL')) {
                content = createLookAndFeelContent();
                sectionHeader.parentNode.insertBefore(content, sectionHeader.nextSibling);
            } else if (sectionTitle.includes('DISTINCTIVE ASSETS')) {
                content = createDistinctiveAssetsContent();
                sectionHeader.parentNode.insertBefore(content, sectionHeader.nextSibling);
            } else if (sectionTitle.includes('OVERALL PERCEPTION')) {
                content = createOverallPerceptionContent();
                sectionHeader.parentNode.insertBefore(content, sectionHeader.nextSibling);
            } else if (sectionTitle.includes('COMMUNICATION FOCUS')) {
                content = createCommunicationFocusContent();
                sectionHeader.parentNode.insertBefore(content, sectionHeader.nextSibling);
            }
        }
        
        if (content && content.classList.contains('section-content')) {
            content.classList.remove('hidden');
        }
    }
}

function createLookAndFeelContent() {
    const contentDiv = document.createElement('div');
    contentDiv.className = 'section-content';
    contentDiv.innerHTML = `
        <div class="section-comment">// LOOK_AND_FEEL</div>
        <p style="font-size: 14px; color: #04252b; line-height: 1.6;">
            A cheerful, inviting, and optimistic aesthetic that consistently evokes <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">sunshine</span>, <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">natural warmth</span>, and a sense of ease. The brand identity is <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">clean, structured</span>, and focused on conveying <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">natural beauty</span> and <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">effortless results</span>.
        </p>
    `;
    return contentDiv;
}

function createDistinctiveAssetsContent() {
    const contentDiv = document.createElement('div');
    contentDiv.className = 'section-content';
    contentDiv.innerHTML = `
        <div class="section-comment">// DISTINCTIVE_ASSETS</div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: start; gap: 12px;">
                <span style="font-size: 12px; color: #717182; width: 16px;">—</span>
                <div style="font-size: 14px; color: #2d5a5a; text-transform: uppercase;">BRIGHT YELLOW PALETTE</div>
            </div>
            <div style="display: flex; align-items: start; gap: 12px;">
                <span style="font-size: 12px; color: #717182; width: 16px;">—</span>
                <div style="font-size: 14px; color: #2d5a5a; text-transform: uppercase;">BOLD TEXT FOR PROMOTIONAL MESSAGES</div>
            </div>
            <div style="display: flex; align-items: start; gap: 12px;">
                <span style="font-size: 12px; color: #717182; width: 16px;">—</span>
                <div style="font-size: 14px; color: #2d5a5a; text-transform: uppercase;">GRADIENT DOTTED PATTERN</div>
            </div>
            <div style="display: flex; align-items: start; gap: 12px;">
                <span style="font-size: 12px; color: #717182; width: 16px;">—</span>
                <div style="font-size: 14px; color: #2d5a5a; text-transform: uppercase;">BEIGE-GOLD GRADIENT/TONES</div>
            </div>
            <div style="display: flex; align-items: start; gap: 12px;">
                <span style="font-size: 12px; color: #717182; width: 16px;">—</span>
                <div style="font-size: 14px; color: #2d5a5a; text-transform: uppercase;">BOLD, SERIF TYPOGRAPHY</div>
            </div>
            <div style="display: flex; align-items: start; gap: 12px;">
                <span style="font-size: 12px; color: #717182; width: 16px;">—</span>
                <div style="font-size: 14px; color: #2d5a5a; text-transform: uppercase;">COLORFUL CIRCLES/BADGES HIGHLIGHTING BENEFITS</div>
            </div>
            <div style="display: flex; align-items: start; gap: 12px;">
                <span style="font-size: 12px; color: #717182; width: 16px;">—</span>
                <div style="font-size: 14px; color: #2d5a5a; text-transform: uppercase;">PRODUCT TUBES WITH CLEAR BRANDING</div>
            </div>
            <div style="display: flex; align-items: start; gap: 12px;">
                <span style="font-size: 12px; color: #717182; width: 16px;">—</span>
                <div style="font-size: 14px; color: #2d5a5a; text-transform: uppercase;">CREAM SMEAR/PRODUCT TEXTURE SHOTS</div>
            </div>
            <div style="display: flex; align-items: start; gap: 12px;">
                <span style="font-size: 12px; color: #717182; width: 16px;">—</span>
                <div style="font-size: 14px; color: #2d5a5a; text-transform: uppercase;">'DERMATOLOGIST RECOMMENDED' BADGE</div>
            </div>
        </div>
    `;
    return contentDiv;
}

function createOverallPerceptionContent() {
    const contentDiv = document.createElement('div');
    contentDiv.className = 'section-content';
    contentDiv.innerHTML = `
        <div class="section-comment">// OVERALL_PERCEPTION</div>
        <p style="font-size: 14px; color: #04252b; line-height: 1.6;">
            Jergens Natural Glow is perceived as a trustworthy, accessible, and uplifting beauty brand that empowers consumers to achieve a natural, healthy-looking glow with simplicity and confidence. It skillfully blends the emotional appeal of happiness and self-enhancement (The Innocent) with the reassurance of expert care and proven benefits (The Caregiver & The Sage).<br/><br/>
            
            The communication is direct, positive, and enthusiastic, devoid of unnecessary complexity. Visually, the brand communicates warmth, vibrancy, and a sunny disposition, reinforcing its promise of a beautiful, natural tan achieved effortlessly as part of a daily skincare routine. It positions itself not just as a product for tanning, but as a holistic approach to feeling good about one's skin and embracing a positive self-image.
        </p>
    `;
    return contentDiv;
}

function createCommunicationFocusContent() {
    const contentDiv = document.createElement('div');
    contentDiv.className = 'section-content';
    contentDiv.innerHTML = `
        <div class="section-comment">// COMMUNICATION_FOCUS</div>
        <p style="font-size: 14px; color: #04252b; line-height: 1.6;">
            The primary communication focus is on achieving a gradual, natural-looking, flawless tan with ease and convenience (<span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">hassle-free, daily moisturizer application</span>), while also emphasizing skin health and nourishment through key ingredients.<br/><br/>
            
            There's a strong underlying message of self-empowerment and positivity (<span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">'Create your own sunshine'</span>).
        </p>
    `;
    return contentDiv;
}

// Archetype toggle with expandable content
function toggleArchetype(item) {
    const archetypeName = item.querySelector('.archetype-name').textContent;
    console.log('Archetype clicked:', archetypeName);
    
    // Check if expandable content already exists
    let expandableContent = item.nextElementSibling;
    if (expandableContent && expandableContent.classList.contains('archetype-expandable')) {
        // Toggle existing content
        if (expandableContent.style.display === 'none') {
            expandableContent.style.display = 'block';
        } else {
            expandableContent.style.display = 'none';
        }
        return;
    }
    
    // Create expandable content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'archetype-expandable';
    contentDiv.style.background = '#faf9f7';
    contentDiv.style.padding = '12px';
    contentDiv.style.fontFamily = 'JetBrains Mono, monospace';
    contentDiv.style.borderTop = '1px solid #e2ddd4';
    
    // Get content based on archetype
    let content = '';
    let commentHeader = '';
    
    if (archetypeName === 'The Innocent') {
        commentHeader = 'PRIMARY_ARCHETYPE_ANALYSIS';
        content = '<strong>Seeking happiness and simplicity:</strong><br/><br/>The brand consistently projects an aura of happiness, simplicity, and natural optimism, making The Innocent the dominant archetype. Phrases like <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'FLAWLESS SELF TANNER\'</span> and <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'hassle-free, streak-free color\'</span> underscore an easy, problem-free approach to beauty.<br/><br/>The \'Brand story visual analysis\' explicitly states the brand promotes <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'positivity and self-confidence\'</span>, encouraging consumers to <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'create your own sunshine\'</span> with a <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'bright yellow background, suggesting energy and positivity\'</span>. This cheerfulness and aspiration for a <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'natural glow\'</span> permeates all descriptions, promising a simple, uplifting transformation without complexity or artifice, directly aligning with the Innocent\'s desire for pure happiness and effortless beauty.';
    } else if (archetypeName === 'The Caregiver') {
        commentHeader = 'SECONDARY_ARCHETYPE_ANALYSIS';
        content = '<strong>Compassion and service to others:</strong><br/><br/>The Jergens brand heavily emphasizes nurturing and protecting the skin, aligning strongly with The Caregiver archetype. The product is consistently presented as a <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'Daily Moisturizer\'</span> that provides <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'Hydrating, Moisturizing, Smoothening, Nourishing\'</span> benefits as seen in \'At a glance\'.<br/><br/>\'About this item\' highlights the inclusion of <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'antioxidants and Vitamin E\'</span> to <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'boost moisturization for healthier-looking skin\'</span>, showing a clear focus on skin wellness. Furthermore, the recurrent claim of being the <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'#1 U.S. Dermatologist Recommended Sunless Tanner Brand\'</span> across multiple Product Gallery images signifies trusted, expert care and a commitment to overall skin health.';
    } else if (archetypeName === 'The Sage') {
        commentHeader = 'TERTIARY_ARCHETYPE_ANALYSIS';
        content = '<strong>Driven by knowledge and truth:</strong><br/><br/>Jergens reinforces trust and informed decision-making by positioning itself as knowledgeable and authoritative, embodying The Sage archetype. The prominent claim of being the <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'#1 U.S. Dermatologist Recommended Sunless Tanner Brand\'</span> (seen in multiple image analyses like Image 2, 3, 6, 7) provides expert endorsement and validates the product\'s effectiveness and safety.<br/><br/>Additionally, the detailed breakdown of ingredients and their scientifically-backed benefits, such as <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'Coconut oil: Known to hydrate and help skin retain moisture\'</span> and <span style="background: white; padding: 2px 4px; border-radius: 2px; font-weight: 500;">\'Antioxidants: Known to help keep skin looking healthy and nourished\'</span> in Product Gallery Image 5, demonstrates a commitment to transparency and educating the consumer, solidifying its role as a reliable source of beauty wisdom and proven results.';
    }
    
    contentDiv.innerHTML = `
        <div style="font-size: 12px; color: #717182; margin-bottom: 12px;">
            // ${commentHeader}
        </div>
        <div style="font-size: 14px; color: #04252b; line-height: 1.6;">
            ${content}
        </div>
    `;
    
    // Insert after the clicked item
    item.parentNode.insertBefore(contentDiv, item.nextSibling);
}


// Action functions
function analyzePage() {
    console.log('Analyzing current page...');
}

async function analyzeSelection() {
    if (selectedElementData) {
        console.log('Analyzing selected element:', selectedElementData);
        
        // Create analysis text from element
        const analysisText = selectedElementData.textContent || 'No text content';
        
        if (analysisText.length > 10) {
            // Use the existing analysis functions
            console.log('About to call analyzeText function, typeof analyzeText:', typeof analyzeText);
            if (typeof analyzeText === 'function') {
                const toneAnalysis = await analyzeText(analysisText);
                displayToneAnalysis(toneAnalysis, analysisText);
            } else {
                console.error('analyzeText function is not available');
                alert('Analysis function not available. Please reload the extension.');
            }
        } else {
            console.log('Selected element has insufficient text content for analysis');
            alert('Selected element has insufficient text content for meaningful analysis. Please select an element with more text.');
        }
    } else {
        console.log('Analyzing selected text...');
        
        // Get selected text from content script
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: 'GET_SELECTED_TEXT'
                }).then(response => {
                    if (response.success && response.text && response.text.length > 10) {
                        analyzeText(response.text).then(analysis => {
                            displayToneAnalysis(analysis, response.text);
                        });
                    } else {
                        alert('Please select some text on the page first.');
                    }
                }).catch(error => {
                    console.error('Failed to get selected text:', error);
                    alert('Failed to get selected text. Please try again.');
                });
            }
        });
    }
}

// Tone analysis data with justifications
const toneAnalysisData = {
    'Formal vs. Casual': {
        score: 40,
        position: 'Slightly Formal',
        justification: 'Jergens Natural Glow maintains a professional, trustworthy tone without being overly formal. Product descriptions use clear, confident language like "FLAWLESS SELF TANNER" and "#1 U.S. Dermatologist Recommended" which suggests authority and reliability. However, the communication remains accessible with phrases like "hassle-free" and "create your own sunshine," balancing professionalism with approachability to appeal to everyday consumers seeking effective beauty solutions.'
    },
    'Serious vs. Funny': {
        score: 20,
        position: 'Completely Serious',
        justification: 'The brand maintains a consistently serious, focused approach to beauty and skincare. All product descriptions emphasize functional benefits like "Hydrating, Moisturizing, Smoothening, Nourishing" and scientific credibility through dermatologist recommendations. There are no playful elements, jokes, or humorous language—the tone is earnest and results-oriented, positioning the product as a serious skincare solution rather than a fun beauty experiment.'
    },
    'Respectful vs. Irreverent': {
        score: 20,
        position: 'Deeply Respectful',
        justification: 'Jergens shows deep respect for its customers\' intelligence and skin health concerns. The brand provides detailed ingredient information, emphasizes safety through dermatologist endorsements, and uses inclusive language about "natural glow" without making assumptions about desired skin tones. The respectful approach is evident in the careful, informative product descriptions that educate rather than pressure, treating customers as informed decision-makers who value quality and expert validation.'
    },
    'Matter-of-fact vs. Enthusiastic': {
        score: 40,
        position: 'Slightly Matter-of-fact',
        justification: 'While the brand expresses some enthusiasm through phrases like "create your own sunshine" and positive imagery, the overall tone leans toward being matter-of-fact and results-focused. Product descriptions systematically list benefits, ingredients, and credentials in a straightforward manner. The enthusiasm is measured and purposeful rather than excessive, maintaining credibility while expressing optimism about the product\'s ability to deliver promised results.'
    }
};

// Tone slider functionality
function toggleToneItem(toneItem) {
    const toneTitle = toneItem.querySelector('.tone-title').textContent;
    const data = toneAnalysisData[toneTitle];
    
    if (!data) return;
    
    // Check if justification already exists
    let justification = toneItem.nextElementSibling;
    if (justification && justification.classList.contains('tone-justification')) {
        // Toggle existing justification
        justification.classList.toggle('visible');
        return;
    }
    
    // Create justification content
    const justificationDiv = document.createElement('div');
    justificationDiv.className = 'tone-justification visible';
    justificationDiv.innerHTML = `
        <div style="font-size: 12px; color: #717182; margin-bottom: 12px;">
            // ${toneTitle.toUpperCase().replace(/\s+/g, '_')}_JUSTIFICATION
        </div>
        <div style="font-size: 14px; color: #04252b; line-height: 1.6;">
            ${data.justification}
        </div>
    `;
    
    // Insert after the tone item
    toneItem.parentNode.insertBefore(justificationDiv, toneItem.nextSibling);
}

// Tone controls popover
function toggleToneControls() {
    const popover = document.getElementById('tonePopover');
    const isVisible = popover.classList.contains('visible');
    
    if (isVisible) {
        popover.classList.remove('visible');
    } else {
        // Position popover near the button
        const button = document.getElementById('toneControls');
        const rect = button.getBoundingClientRect();
        
        popover.style.top = (rect.bottom + 10) + 'px';
        popover.style.left = Math.max(10, rect.left - 200) + 'px';
        
        popover.classList.add('visible');
        
        // Create slider controls if not already created
        createSliderControls();
    }
}

function createSliderControls() {
    const content = document.querySelector('.popover-content');
    const existingSliders = content.querySelector('.slider-controls');
    
    if (existingSliders) return; // Already created
    
    const slidersDiv = document.createElement('div');
    slidersDiv.className = 'slider-controls';
    
    const sliders = [
        { label: 'FORMALITY', leftLabel: 'Casual', rightLabel: 'Formal', value: 40 },
        { label: 'HUMOR', leftLabel: 'Serious', rightLabel: 'Funny', value: 20 },
        { label: 'RESPECT', leftLabel: 'Irreverent', rightLabel: 'Respectful', value: 20 },
        { label: 'ENTHUSIASM', leftLabel: 'Matter-of-fact', rightLabel: 'Enthusiastic', value: 40 }
    ];
    
    sliders.forEach((slider, index) => {
        const sliderDiv = document.createElement('div');
        sliderDiv.style.marginBottom = '16px';
        sliderDiv.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 12px; color: #717182; width: 24px;">[${index + 1}]</span>
                    <span style="font-size: 12px; font-weight: 500; color: #717182; width: 80px;">${slider.label}</span>
                </div>
                <span style="font-size: 12px; color: #04252b; width: 32px; text-align: right;">${slider.value}</span>
            </div>
            <div style="margin-left: 32px;">
                <div style="position: relative; width: 100%; height: 20px; background: #f5f3f0; border-radius: 10px; margin-bottom: 8px;">
                    <div style="position: absolute; width: ${slider.value}%; height: 100%; background: #2d5a5a; border-radius: 10px;"></div>
                    <div style="position: absolute; width: 12px; height: 12px; background: white; border: 2px solid #2d5a5a; border-radius: 50%; top: 4px; left: calc(${slider.value}% - 6px); cursor: pointer;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: #717182;">
                    <span>${slider.leftLabel}</span>
                    <span>${slider.rightLabel}</span>
                </div>
            </div>
        `;
        slidersDiv.appendChild(sliderDiv);
    });
    
    content.appendChild(slidersDiv);
}

// Selection mode functionality
let currentMode = 'FULL_PAGE';
let selectedElementData = null; // Track selected element data

// Parsed content state management
let parsedContentState = 'hidden'; // 'hidden', 'collapsed', 'expanded'

// Single function to update UI based on state
function setParsedContentState(newState) {
    console.log(`📊 State change: ${parsedContentState} → ${newState}`);
    parsedContentState = newState;
    
    const container = document.getElementById('parsedContentContainer');
    const body = document.getElementById('parsedContentBody');
    const bracket = container.querySelector('.parsed-content-bracket');
    const toggle = document.getElementById('parsedContentToggle');
    
    switch (newState) {
        case 'hidden':
            container.classList.add('hidden');
            bracket.textContent = '[ ]';
            toggle.textContent = 'expand';
            body.style.display = 'none';
            break;
            
        case 'collapsed':
            container.classList.remove('hidden');
            bracket.textContent = '[ ]';
            toggle.textContent = 'expand';
            body.style.display = 'none';
            break;
            
        case 'expanded':
            container.classList.remove('hidden');
            bracket.textContent = '[*]';
            toggle.textContent = 'hide';
            body.style.display = 'block';
            break;
    }
}

function switchMode(mode) {
    currentMode = mode;
    selectedElementData = null; // Clear selected element when switching modes
    
    const fullPageBtn = document.getElementById('fullPageMode');
    const selectionBtn = document.getElementById('selectionMode');
    const statusText = document.getElementById('statusText');
    const analyzeBtn = document.getElementById('mainAnalyzeBtn');
    const indicator = document.getElementById('modeIndicator');
    
    // Update button states
    fullPageBtn.classList.toggle('active', mode === 'FULL_PAGE');
    selectionBtn.classList.toggle('active', mode === 'SELECTION');
    
    // Update indicator position to center under labels
    if (mode === 'FULL_PAGE') {
        indicator.style.left = '15%'; // Center under FULL PAGE
        statusText.textContent = 'Full page mode active';
        analyzeBtn.textContent = 'ANALYZE FULL PAGE';
        analyzeBtn.classList.add('active');
    } else {
        indicator.style.left = '85%'; // Center under SELECTION
        statusText.textContent = 'Selection mode active - click content to select';
        analyzeBtn.textContent = 'ANALYZE SELECTION';
        analyzeBtn.classList.remove('active'); // Inactive until something is selected
    }
    
    // Communicate mode change to content script
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: 'SET_MODE',
                mode: mode
            }).catch(error => {
                console.log('Failed to send mode change to content script:', error);
            });
        }
    });
}

// Handle element selection from content script
function handleElementSelection(elementData) {
    selectedElementData = elementData;
    
    const statusText = document.getElementById('statusText');
    const analyzeBtn = document.getElementById('mainAnalyzeBtn');
    
    if (elementData && currentMode === 'SELECTION') {
        // Update status to show element is selected
        const elementType = elementData.elementType || 'element';
        const elementTag = elementData.tagName || 'unknown';
        statusText.textContent = `Selected ${elementType} (${elementTag.toLowerCase()}) - ready to analyze`;
        
        // Activate the analyze button
        analyzeBtn.classList.add('active');
        
        // Show parsed content
        showParsedContent(elementData);
        
        console.log('Element selected:', elementData);
    } else {
        // No element selected
        statusText.textContent = 'Selection mode active - click content to select';
        analyzeBtn.classList.remove('active');
        hideParsedContent();
    }
}

// Show parsed content display
function showParsedContent(elementData) {
    if (elementData && elementData.textContent) {
        const textDiv = document.getElementById('parsedTextContent');
        const metaDiv = document.getElementById('parsedMetadata');
        
        // Display text content
        textDiv.textContent = elementData.textContent;
        
        // Analyze with compromise.js for additional metadata
        const doc = nlp(elementData.textContent);
        const sentences = doc.sentences().length;
        const words = doc.terms().length;
        const chars = elementData.textContent.length;
        
        // Show metadata (safely)
        metaDiv.textContent = ''; // Clear existing content
        
        const metadata = [
            ['Element:', elementData.tagName.toLowerCase()],
            ['Type:', elementData.elementType],
            ['Words:', words.toString()],
            ['Sentences:', sentences.toString()],
            ['Characters:', chars.toString()],
            ['Nouns:', doc.nouns().length.toString()],
            ['Verbs:', doc.verbs().length.toString()],
            ['Adjectives:', doc.adjectives().length.toString()]
        ];
        
        metadata.forEach(([label, value]) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'parsed-metadata-item';
            
            const labelSpan = document.createElement('span');
            labelSpan.className = 'parsed-metadata-label';
            labelSpan.textContent = label;
            
            const valueSpan = document.createElement('span');
            valueSpan.textContent = value;
            
            itemDiv.appendChild(labelSpan);
            itemDiv.appendChild(valueSpan);
            metaDiv.appendChild(itemDiv);
        });
        
        // Set to expanded state using state management
        console.log('✅ showParsedContent calling setParsedContentState(expanded)');
        setParsedContentState('expanded');
    } else {
        console.log('❌ showParsedContent calling setParsedContentState(hidden)');
        setParsedContentState('hidden');
    }
}

// Hide parsed content display
function hideParsedContent() {
    setParsedContentState('hidden');
}

// Toggle parsed content visibility
function toggleParsedContent() {
    console.log(`🖱️ Toggle clicked - current state: ${parsedContentState}`);
    // Toggle between collapsed and expanded (never hidden from toggle)
    if (parsedContentState === 'expanded') {
        setParsedContentState('collapsed');
    } else {
        setParsedContentState('expanded');
    }
}

// Settings overlay functions
function showSettings() {
    const settingsOverlay = document.getElementById('settingsOverlay');
    if (settingsOverlay) {
        settingsOverlay.classList.remove('hidden');
        // Ensure settings are loaded when showing overlay with enhanced retry
        if (typeof window.Settings !== 'undefined') {
            window.Settings.ensureSettingsLoaded().catch(error => {
                console.error('Failed to load settings when opening overlay:', error);
            });
        }
    }
}

function hideSettings() {
    const settingsOverlay = document.getElementById('settingsOverlay');
    if (settingsOverlay) {
        settingsOverlay.classList.add('hidden');
    }
}

// Initialize indicator position on load
function initializeIndicatorPosition() {
    const indicator = document.getElementById('modeIndicator');
    if (indicator && currentMode === 'FULL_PAGE') {
        indicator.style.left = '15%'; // Center under FULL PAGE
    }
}

// POKPOK.AI Analysis Functions

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('POKPOK.AI: DOM loaded, initializing...');
    
    // Set up event listeners for logo animation
    const logoText = document.querySelector('.logo-text');
    const triggerButton = document.querySelector('.trigger-button');
    
    if (logoText) {
        logoText.addEventListener('click', triggerLogoAnimation);
    }
    
    if (triggerButton) {
        triggerButton.addEventListener('click', triggerLogoAnimation);
    }
    
    
    // Set up card header clicks (but prevent tone controls from triggering card toggle)
    const cardHeaders = document.querySelectorAll('.card-header');
    cardHeaders.forEach(header => {
        header.addEventListener('click', (e) => {
            // Don't toggle card if clicking on tone controls
            if (!e.target.classList.contains('tone-controls')) {
                toggleCard(header);
            }
        });
    });
    
    // Set up tone controls
    const toneControls = document.getElementById('toneControls');
    if (toneControls) {
        toneControls.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleToneControls();
        });
    }
    
    // Set up parsed content toggle
    const parsedContentContainer = document.getElementById('parsedContentContainer');
    if (parsedContentContainer) {
        const sectionHeader = parsedContentContainer.querySelector('.section-header');
        if (sectionHeader) {
            sectionHeader.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleParsedContent();
            });
            sectionHeader.style.cursor = 'pointer';
        }
    }
    
    // Set up settings overlay functionality
    const versionText = document.getElementById('versionText');
    const settingsOverlay = document.getElementById('settingsOverlay');
    const settingsHideBtn = document.getElementById('settingsHideBtn');
    
    if (versionText && settingsOverlay && settingsHideBtn) {
        // Show settings when clicking version text
        versionText.addEventListener('click', () => {
            showSettings();
        });
        
        // Hide settings when clicking hide button
        settingsHideBtn.addEventListener('click', () => {
            hideSettings();
        });
    }
    
    // Set up popover controls
    const cancelBtn = document.getElementById('cancelToneControls');
    const applyBtn = document.getElementById('applyToneControls');
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            document.getElementById('tonePopover').classList.remove('visible');
        });
    }
    
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            document.getElementById('tonePopover').classList.remove('visible');
        });
    }
    
    // Set up tone item clicks
    const toneItems = document.querySelectorAll('.tone-item');
    toneItems.forEach(item => {
        item.addEventListener('click', () => toggleToneItem(item));
    });
    
    // Set up section header clicks
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.addEventListener('click', () => toggleSection(header));
    });
    
    // Set up archetype clicks
    const archetypeItems = document.querySelectorAll('.archetype-item');
    archetypeItems.forEach(item => {
        item.addEventListener('click', () => toggleArchetype(item));
    });
    
    // Set up selection mode controls
    const fullPageBtn = document.getElementById('fullPageMode');
    const selectionBtn = document.getElementById('selectionMode');
    const mainAnalyzeBtn = document.getElementById('mainAnalyzeBtn');
    
    if (fullPageBtn) {
        fullPageBtn.addEventListener('click', () => switchMode('FULL_PAGE'));
    }
    
    if (selectionBtn) {
        selectionBtn.addEventListener('click', () => switchMode('SELECTION'));
    }
    
    if (mainAnalyzeBtn) {
        mainAnalyzeBtn.addEventListener('click', () => {
            if (currentMode === 'FULL_PAGE') {
                analyzePage();
            } else {
                analyzeSelection();
            }
        });
    }
    
    // Initialize indicator position
    setTimeout(() => {
        initializeIndicatorPosition();
    }, 100);
    
    // Listen for element selection messages from content script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'ELEMENT_SELECTED') {
            handleElementSelection(message.element);
            sendResponse({ success: true });
        }
        return true; // Keep message channel open
    });
    
    // Close popover when clicking outside
    document.addEventListener('click', (e) => {
        const popover = document.getElementById('tonePopover');
        const toneControls = document.getElementById('toneControls');
        
        if (popover && !popover.contains(e.target) && e.target !== toneControls) {
            popover.classList.remove('visible');
        }
    });
    
    // Auto trigger logo animation on load
    setTimeout(() => {
        triggerLogoAnimation();
    }, 1000);
    
    // Trigger spectrum animation on load with staggered delays
    setTimeout(() => {
        const primarySegment = document.getElementById('primarySegment');
        const secondarySegment = document.getElementById('secondarySegment');
        const tertiarySegment = document.getElementById('tertiarySegment');
        
        if (primarySegment) {
            primarySegment.classList.add('animated');
            setTimeout(() => {
                if (secondarySegment) {
                    secondarySegment.classList.add('animated');
                    setTimeout(() => {
                        if (tertiarySegment) {
                            tertiarySegment.classList.add('animated');
                        }
                    }, 300);
                }
            }, 200);
        }
    }, 1500);
    
    // Load saved settings on startup
    loadSettingsOnStartup();
    
    console.log('POKPOK.AI Chrome Extension loaded (Recreated from React version)');
});

// Load settings on startup with enhanced reliability
async function loadSettingsOnStartup() {
    try {
        console.log('Loading settings on startup...');
        
        // Wait for Settings module to be available
        await waitForModule('Settings', 5000);
        
        if (typeof window.Settings !== 'undefined' && window.Settings.ensureSettingsLoaded) {
            const settings = await window.Settings.ensureSettingsLoaded();
            if (settings) {
                console.log('Settings loaded on startup:', {
                    version: settings.version,
                    model: settings.model,
                    hasApiKey: !!settings.apiKey,
                    supabaseDb: settings.supabaseDb
                });
                
                // Store settings globally for use in other modules
                window.pokpokSettings = settings;
            } else {
                console.log('No saved settings found on startup');
            }
        } else {
            console.warn('Settings module not available, falling back to direct storage access');
            
            // Fallback to direct storage access
            if (typeof window.POKPOK !== 'undefined' && window.POKPOK.storage) {
                const settings = await window.POKPOK.storage.loadSettings();
                if (settings) {
                    window.pokpokSettings = settings;
                    console.log('Settings loaded via fallback method');
                }
            }
        }
    } catch (error) {
        console.error('Failed to load settings on startup:', error);
        // Don't throw - extension should still work without saved settings
    }
}

// Wait for a module to be available
async function waitForModule(moduleName, timeout = 5000) {
    const start = Date.now();
    
    while (Date.now() - start < timeout) {
        if (typeof window[moduleName] !== 'undefined') {
            return window[moduleName];
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error(`Module ${moduleName} not available after ${timeout}ms`);
}