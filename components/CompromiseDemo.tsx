import React, { useState, useEffect, useCallback } from 'react';
import nlp from 'compromise';
import { useTextAnalysis } from '../contexts/TextAnalysisContext';

interface AnalysisResult {
  wordCount: number;
  sentences: number;
  nouns: string[];
  verbs: string[];
  adjectives: string[];
  people: string[];
  places: string[];
  topics: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
}

interface ToneAnalysis {
  humor: number;
  formality: number;
  respect: number;
  enthusiasm: number;
  explanation: {
    humor: string;
    formality: string;
    respect: string;
    enthusiasm: string;
  };
}

interface BrandArchetypes {
  innocent: number;
  explorer: number;
  sage: number;
  hero: number;
  outlaw: number;
  magician: number;
  regular: number;
  lover: number;
  jester: number;
  caregiver: number;
  ruler: number;
  creator: number;
  dominant: string;
  explanation: string;
}

interface MessageClarity {
  readabilityScore: number;
  averageWordsPerSentence: number;
  complexWords: number;
  jargonWords: string[];
  passiveVoiceCount: number;
  questionCount: number;
  clarityGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  improvements: string[];
}

interface AdvancedLinguistics {
  dates: string[];
  numbers: string[];
  organizations: string[];
  money: string[];
  phoneNumbers: string[];
  emails: string[];
  urls: string[];
  quotations: string[];
  contractions: string[];
  negations: string[];
  conditionals: string[];
  acronyms: string[];
}

interface CommunicationStyle {
  tensePastCount: number;
  tensePresentCount: number;
  tenseFutureCount: number;
  questionToStatementRatio: number;
  imperativeCount: number;
  declarativeCount: number;
  communicationTone: 'directive' | 'conversational' | 'informational' | 'questioning';
}

interface ContentStructure {
  sentenceVariety: number;
  averageWordLength: number;
  syllableComplexity: number;
  repetitionScore: number;
  transitionWords: string[];
  structureQuality: 'excellent' | 'good' | 'fair' | 'poor';
}

interface PersuasionAnalysis {
  callsToAction: string[];
  urgencyWords: string[];
  emotionalTriggers: string[];
  socialProof: string[];
  authorityWords: string[];
  scarcityWords: string[];
  persuasionScore: number;
  marketingTechniques: string[];
}

export function CompromiseDemo() {
  const { state, completeCompromiseAnalysis } = useTextAnalysis();
  const [inputText, setInputText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [toneAnalysis, setToneAnalysis] = useState<ToneAnalysis | null>(null);
  const [brandArchetypes, setBrandArchetypes] = useState<BrandArchetypes | null>(null);
  const [messageClarity, setMessageClarity] = useState<MessageClarity | null>(null);
  const [advancedLinguistics, setAdvancedLinguistics] = useState<AdvancedLinguistics | null>(null);
  const [communicationStyle, setCommunicationStyle] = useState<CommunicationStyle | null>(null);
  const [contentStructure, setContentStructure] = useState<ContentStructure | null>(null);
  const [persuasionAnalysis, setPersuasionAnalysis] = useState<PersuasionAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('tone');

  // Auto-populate text input when content is selected (NO auto-analysis)
  useEffect(() => {
    let selectedContent = '';
    
    if (state.currentClickSelection) {
      selectedContent = state.currentClickSelection.content;
    } else if (state.currentSelection) {
      selectedContent = state.currentSelection.content;
    }
    
    if (selectedContent && selectedContent !== inputText) {
      setInputText(selectedContent);
    }
  }, [state.currentClickSelection, state.currentSelection]);

  // Create reusable analyze function
  const analyzeText = useCallback(async (textToAnalyze?: string) => {
    const content = textToAnalyze || inputText;
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const doc = nlp(content);
      
      // Basic Analysis
      const nouns = doc.nouns().out('array').slice(0, 10);
      const verbs = doc.verbs().out('array').slice(0, 10);
      const adjectives = doc.adjectives().out('array').slice(0, 10);
      const people = doc.people().out('array').slice(0, 5);
      const places = doc.places().out('array').slice(0, 5);
      const topics = doc.topics().out('array').slice(0, 8);
      
      // Sentiment Analysis
      const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome', 'love', 'perfect', 'best'];
      const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'disappointing', 'poor', 'useless', 'stupid'];
      
      const words = doc.terms().out('array').map((w: string) => w.toLowerCase());
      const positiveCount = words.filter((word: string) => positiveWords.includes(word)).length;
      const negativeCount = words.filter((word: string) => negativeWords.includes(word)).length;
      
      let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
      if (positiveCount > negativeCount) sentiment = 'positive';
      else if (negativeCount > positiveCount) sentiment = 'negative';
      
      const basicResult: AnalysisResult = {
        wordCount: doc.terms().length,
        sentences: doc.sentences().length,
        nouns: nouns.filter((n: string) => n.trim()),
        verbs: verbs.filter((v: string) => v.trim()),
        adjectives: adjectives.filter((a: string) => a.trim()),
        people: people.filter((p: string) => p.trim()),
        places: places.filter((p: string) => p.trim()),
        topics: topics.filter((t: string) => t.trim()),
        sentiment
      };
      
      setAnalysis(basicResult);
      
      // All other analyses
      const toneResult = analyzeToneOfVoice(content, doc);
      setToneAnalysis(toneResult);
      
      const archetypeResult = analyzeBrandArchetypes(content, doc);
      setBrandArchetypes(archetypeResult);
      
      const clarityResult = analyzeMessageClarity(content, doc);
      setMessageClarity(clarityResult);
      
      const linguisticsResult = analyzeAdvancedLinguistics(content, doc);
      setAdvancedLinguistics(linguisticsResult);
      
      const styleResult = analyzeCommunicationStyle(content, doc);
      setCommunicationStyle(styleResult);
      
      const structureResult = analyzeContentStructure(content, doc);
      setContentStructure(structureResult);
      
      const persuasionResult = analyzePersuasionTechniques(content, doc);
      setPersuasionAnalysis(persuasionResult);
      
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [inputText]);

  // Listen for compromise analysis requests from the popup switch
  useEffect(() => {
    if (state.compriseAnalysisRequested) {
      let contentToAnalyze = '';
      
      if (state.currentClickSelection?.content) {
        contentToAnalyze = state.currentClickSelection.content;
      } else if (inputText.trim()) {
        contentToAnalyze = inputText;
      }
      
      if (contentToAnalyze.trim()) {
        analyzeText(contentToAnalyze).finally(() => {
          completeCompromiseAnalysis();
        });
      } else {
        completeCompromiseAnalysis();
      }
    }
  }, [state.compriseAnalysisRequested, state.currentClickSelection?.content, analyzeText, completeCompromiseAnalysis]);

  const analyzeToneOfVoice = (text: string, doc: any): ToneAnalysis => {
    const words = doc.terms().out('array').map((w: string) => w.toLowerCase());
    const sentences = doc.sentences().out('array');
    
    // Humor analysis
    const humorWords = ['funny', 'hilarious', 'joke', 'laugh', 'haha', 'lol', 'amusing', 'witty', 'clever', 'pun'];
    const humorCount = words.filter((word: string) => humorWords.some(h => word.includes(h))).length;
    const humorScore = Math.min(100, (humorCount / words.length) * 500 + (text.includes('!') ? 20 : 0));
    
    // Formality analysis
    const informalWords = ['gonna', 'wanna', 'yeah', 'ok', 'cool', 'awesome', 'totally', 'like'];
    const formalWords = ['therefore', 'furthermore', 'consequently', 'nevertheless', 'accordingly'];
    const informalCount = words.filter((word: string) => informalWords.includes(word)).length;
    const formalCount = words.filter((word: string) => formalWords.includes(word)).length;
    const avgWordsPerSentence = words.length / sentences.length;
    const formalityScore = Math.max(0, Math.min(100, 
      50 + (formalCount * 20) - (informalCount * 15) + (avgWordsPerSentence > 15 ? 20 : 0)
    ));
    
    // Respect analysis
    const respectfulWords = ['please', 'thank', 'appreciate', 'kindly', 'respect', 'honor', 'understand'];
    const disrespectfulWords = ['stupid', 'dumb', 'idiot', 'hate', 'terrible', 'awful'];
    const respectfulCount = words.filter((word: string) => respectfulWords.some(r => word.includes(r))).length;
    const disrespectfulCount = words.filter((word: string) => disrespectfulWords.includes(word)).length;
    const respectScore = Math.max(0, Math.min(100, 
      70 + (respectfulCount * 15) - (disrespectfulCount * 25)
    ));
    
    // Enthusiasm analysis
    const enthusiasticWords = ['amazing', 'excellent', 'fantastic', 'wonderful', 'excited', 'thrilled', 'love'];
    const enthusiasticCount = words.filter((word: string) => enthusiasticWords.some(e => word.includes(e))).length;
    const exclamationCount = (text.match(/!/g) || []).length;
    const capsCount = (text.match(/[A-Z]{2,}/g) || []).length;
    const enthusiasmScore = Math.min(100, 
      (enthusiasticCount / words.length) * 300 + exclamationCount * 10 + capsCount * 5 + 20
    );
    
    return {
      humor: Math.round(humorScore),
      formality: Math.round(formalityScore),
      respect: Math.round(respectScore),
      enthusiasm: Math.round(enthusiasmScore),
      explanation: {
        humor: humorCount > 0 ? `Found ${humorCount} humor-related terms` : 'No clear humor indicators detected',
        formality: formalityScore > 60 ? 'Formal language patterns detected' : formalityScore > 40 ? 'Moderately formal tone' : 'Informal conversational style',
        respect: respectScore > 70 ? 'Respectful and considerate language' : respectScore > 50 ? 'Generally respectful tone' : 'May contain dismissive language',
        enthusiasm: enthusiasmScore > 60 ? 'High energy and enthusiasm' : enthusiasmScore > 40 ? 'Moderate enthusiasm' : 'Calm, measured tone'
      }
    };
  };

  const analyzeBrandArchetypes = (text: string, doc: any): BrandArchetypes => {
    const words = doc.terms().out('array').map((w: string) => w.toLowerCase());
    
    const archetypeWords = {
      innocent: ['pure', 'simple', 'honest', 'optimistic', 'happy', 'fresh', 'clean', 'natural', 'wholesome', 'safe'],
      explorer: ['adventure', 'freedom', 'discover', 'journey', 'explore', 'experience', 'pioneer', 'bold', 'independent', 'authentic'],
      sage: ['wisdom', 'knowledge', 'truth', 'understanding', 'expert', 'intelligent', 'research', 'learn', 'insight', 'analysis'],
      hero: ['achieve', 'win', 'conquer', 'triumph', 'overcome', 'challenge', 'victory', 'strong', 'determined', 'courage'],
      outlaw: ['rebel', 'revolution', 'disrupt', 'break', 'change', 'radical', 'unconventional', 'freedom', 'wild', 'different'],
      magician: ['transform', 'magic', 'vision', 'dream', 'create', 'imagine', 'innovative', 'mystical', 'spiritual', 'healing'],
      regular: ['everyday', 'common', 'ordinary', 'practical', 'real', 'down-to-earth', 'reliable', 'friendly', 'family', 'community'],
      lover: ['passion', 'love', 'beauty', 'romance', 'sensual', 'intimate', 'attractive', 'desire', 'emotional', 'connection'],
      jester: ['fun', 'play', 'enjoy', 'laugh', 'humor', 'entertaining', 'cheerful', 'lighthearted', 'spontaneous', 'irreverent'],
      caregiver: ['care', 'help', 'support', 'nurture', 'protect', 'service', 'compassion', 'generous', 'maternal', 'healing'],
      ruler: ['power', 'control', 'authority', 'leadership', 'responsibility', 'order', 'stability', 'prestigious', 'exclusive', 'successful'],
      creator: ['create', 'build', 'design', 'artistic', 'original', 'innovative', 'express', 'imaginative', 'unique', 'craft']
    };
    
    const scores: any = {};
    let maxScore = 0;
    let dominantArchetype = 'innocent';
    
    Object.entries(archetypeWords).forEach(([archetype, keywords]) => {
      const matches = words.filter((word: string) => 
        keywords.some(keyword => word.includes(keyword) || keyword.includes(word))
      ).length;
      const score = Math.min(100, (matches / words.length) * 1000 + (matches * 10));
      scores[archetype] = Math.round(score);
      
      if (score > maxScore) {
        maxScore = score;
        dominantArchetype = archetype;
      }
    });
    
    const archetypeDescriptions: { [key: string]: string } = {
      innocent: 'Pure, optimistic, and wholesome brand voice',
      explorer: 'Adventurous, freedom-seeking, and authentic voice',
      sage: 'Wise, knowledgeable, and truth-seeking voice',
      hero: 'Determined, courageous, and achievement-focused voice',
      outlaw: 'Rebellious, disruptive, and revolutionary voice',
      magician: 'Transformative, visionary, and innovative voice',
      regular: 'Down-to-earth, relatable, and community-focused voice',
      lover: 'Passionate, emotional, and connection-focused voice',
      jester: 'Fun, entertaining, and lighthearted voice',
      caregiver: 'Nurturing, supportive, and service-oriented voice',
      ruler: 'Authoritative, prestigious, and leadership-focused voice',
      creator: 'Artistic, original, and innovation-focused voice'
    };
    
    return {
      ...scores,
      dominant: dominantArchetype,
      explanation: archetypeDescriptions[dominantArchetype]
    };
  };

  const analyzeMessageClarity = (text: string, doc: any): MessageClarity => {
    const words = doc.terms().out('array');
    const sentences = doc.sentences().out('array');
    const avgWordsPerSentence = words.length / sentences.length;
    
    // Complex words (3+ syllables)
    const complexWords = words.filter((word: string) => {
      const syllables = word.replace(/[^aeiouAEIOU]/g, '').length;
      return syllables >= 3;
    }).length;
    
    // Jargon detection
    const jargonWords = ['utilize', 'leverage', 'synergy', 'paradigm', 'facilitate', 'optimize', 'streamline', 'implement'];
    const foundJargon = words.filter((word: string) => 
      jargonWords.some(jargon => word.toLowerCase().includes(jargon))
    );
    
    // Passive voice detection (simplified)
    const passiveIndicators = ['was', 'were', 'been', 'being'];
    const passiveVoiceCount = words.filter((word: string) => 
      passiveIndicators.includes(word.toLowerCase())
    ).length;
    
    // Question count
    const questionCount = (text.match(/\?/g) || []).length;
    
    // Readability score (simplified Flesch formula)
    const readabilityScore = Math.max(0, Math.min(100, 
      206.835 - (1.015 * avgWordsPerSentence) - (84.6 * (complexWords / words.length))
    ));
    
    let clarityGrade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
    if (readabilityScore >= 90) clarityGrade = 'A';
    else if (readabilityScore >= 70) clarityGrade = 'B';
    else if (readabilityScore >= 50) clarityGrade = 'C';
    else if (readabilityScore >= 30) clarityGrade = 'D';
    
    const improvements: string[] = [];
    if (avgWordsPerSentence > 20) improvements.push('Shorten sentences for better readability');
    if (complexWords > words.length * 0.15) improvements.push('Reduce complex words');
    if (foundJargon.length > 0) improvements.push('Replace jargon with simpler terms');
    if (passiveVoiceCount > words.length * 0.1) improvements.push('Use more active voice');
    if (questionCount === 0 && sentences.length > 3) improvements.push('Consider adding questions for engagement');
    
    return {
      readabilityScore: Math.round(readabilityScore),
      averageWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
      complexWords,
      jargonWords: foundJargon,
      passiveVoiceCount,
      questionCount,
      clarityGrade,
      improvements
    };
  };

  const analyzeAdvancedLinguistics = (text: string, doc: any): AdvancedLinguistics => {
    // Safe extraction with fallbacks for methods that might not exist
    const safeExtract = (extractFn: () => string[], fallbackPattern?: RegExp): string[] => {
      try {
        return extractFn().slice(0, 10);
      } catch (error) {
        if (fallbackPattern) {
          const matches = text.match(fallbackPattern) || [];
          return matches.slice(0, 10);
        }
        return [];
      }
    };

    return {
      dates: safeExtract(
        () => doc.dates ? doc.dates().out('array') : [],
        /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}|January|February|March|April|May|June|July|August|September|October|November|December|\d{1,2}(?:st|nd|rd|th))/gi
      ),
      numbers: safeExtract(
        () => doc.numbers ? doc.numbers().out('array') : [],
        /\b\d+(?:,\d{3})*(?:\.\d+)?\b/g
      ),
      organizations: safeExtract(
        () => doc.organizations ? doc.organizations().out('array') : [],
        /\b[A-Z][a-zA-Z]* (?:Inc|Corp|LLC|Ltd|Company|Co)\b/g
      ),
      money: safeExtract(
        () => doc.money ? doc.money().out('array') : [],
        /\$\d+(?:,\d{3})*(?:\.\d{2})?|\b\d+(?:,\d{3})*(?:\.\d{2})? dollars?\b/gi
      ),
      phoneNumbers: safeExtract(
        () => doc.phoneNumbers ? doc.phoneNumbers().out('array') : [],
        /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g
      ),
      emails: safeExtract(
        () => doc.emails ? doc.emails().out('array') : [],
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
      ),
      urls: safeExtract(
        () => doc.urls ? doc.urls().out('array') : [],
        /https?:\/\/[^\s]+/g
      ),
      quotations: safeExtract(
        () => doc.quotations ? doc.quotations().out('array') : [],
        /"[^"]*"|'[^']*'/g
      ),
      contractions: safeExtract(
        () => doc.contractions ? doc.contractions().out('array') : [],
        /\b\w+'\w+\b/g
      ),
      negations: safeExtract(
        () => doc.negatives ? doc.negatives().out('array') : doc.not ? doc.not().out('array') : [],
        /\b(?:not|no|never|nothing|nowhere|nobody|none|neither|nor|can't|won't|don't|doesn't|isn't|aren't|wasn't|weren't)\b/gi
      ),
      conditionals: safeExtract(
        () => doc.conditionals ? doc.conditionals().out('array') : [],
        /\b(?:if|when|unless|provided|assuming|suppose)\b/gi
      ),
      acronyms: safeExtract(
        () => doc.acronyms ? doc.acronyms().out('array') : [],
        /\b[A-Z]{2,}\b/g
      )
    };
  };

  const analyzeCommunicationStyle = (text: string, doc: any): CommunicationStyle => {
    const verbs = doc.verbs();
    const sentences = doc.sentences().out('array');
    
    // Safe tense analysis
    let tensePast = 0;
    let tenseFuture = 0;
    let tensePresent = 0;
    
    try {
      tensePast = verbs.toPastTense ? verbs.toPastTense().out('array').length : 0;
      tenseFuture = verbs.toFutureTense ? verbs.toFutureTense().out('array').length : 0;
      tensePresent = verbs.toPresentTense ? verbs.toPresentTense().out('array').length : 0;
    } catch (error) {
      // Fallback tense detection using simple patterns
      const pastWords = text.match(/\b\w+ed\b|\bwas\b|\bwere\b|\bhad\b/gi) || [];
      const futureWords = text.match(/\bwill\b|\bshall\b|\bgoing to\b/gi) || [];
      const presentWords = text.match(/\bis\b|\bare\b|\bam\b|\bdo\b|\bdoes\b/gi) || [];
      
      tensePast = pastWords.length;
      tenseFuture = futureWords.length;
      tensePresent = presentWords.length;
    }
    
    const questionCount = (text.match(/\?/g) || []).length;
    const questionToStatementRatio = questionCount / Math.max(1, sentences.length - questionCount);
    
    // Simple imperative detection
    const imperativeCount = sentences.filter((sentence: string) => {
      const trimmed = sentence.trim();
      return trimmed.length > 0 && 
             /^[A-Z]?[a-z]*\s*[a-z]+/.test(trimmed) && 
             !trimmed.includes('?') &&
             (trimmed.startsWith('Please') || trimmed.startsWith('Do ') || trimmed.startsWith('Try '));
    }).length;
    
    const declarativeCount = sentences.length - questionCount - imperativeCount;
    
    let communicationTone: 'directive' | 'conversational' | 'informational' | 'questioning' = 'informational';
    if (imperativeCount > sentences.length * 0.3) communicationTone = 'directive';
    else if (questionCount > sentences.length * 0.3) communicationTone = 'questioning';
    else if (questionToStatementRatio > 0.2) communicationTone = 'conversational';
    
    return {
      tensePastCount: tensePast,
      tensePresentCount: tensePresent,
      tenseFutureCount: tenseFuture,
      questionToStatementRatio: Math.round(questionToStatementRatio * 100) / 100,
      imperativeCount,
      declarativeCount,
      communicationTone
    };
  };

  const analyzeContentStructure = (text: string, doc: any): ContentStructure => {
    const sentences = doc.sentences().out('array');
    const words = doc.terms().out('array');
    
    // Sentence variety (different lengths)
    const sentenceLengths = sentences.map((s: string) => s.split(' ').length);
    const avgLength = sentenceLengths.reduce((a: number, b: number) => a + b, 0) / sentenceLengths.length;
    const variance = sentenceLengths.reduce((acc: number, len: number) => acc + Math.pow(len - avgLength, 2), 0) / sentenceLengths.length;
    const sentenceVariety = Math.round(Math.sqrt(variance));
    
    // Average word length
    const totalChars = words.join('').length;
    const averageWordLength = Math.round((totalChars / words.length) * 10) / 10;
    
    // Syllable complexity (simplified)
    const syllableComplexity = Math.round(words.reduce((acc: number, word: string) => {
      const syllables = word.replace(/[^aeiouAEIOU]/g, '').length || 1;
      return acc + syllables;
    }, 0) / words.length * 10) / 10;
    
    // Repetition score
    const wordFreq: { [key: string]: number } = {};
    words.forEach((word: string) => {
      const w = word.toLowerCase();
      wordFreq[w] = (wordFreq[w] || 0) + 1;
    });
    const repeatedWords = Object.values(wordFreq).filter(count => count > 1).length;
    const repetitionScore = Math.round((repeatedWords / words.length) * 100);
    
    // Transition words
    const transitionWords = ['however', 'therefore', 'furthermore', 'meanwhile', 'consequently', 'additionally', 'moreover'];
    const foundTransitions = words.filter((word: string) => 
      transitionWords.includes(word.toLowerCase())
    );
    
    let structureQuality: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';
    const structureScore = sentenceVariety + (foundTransitions.length * 10) - (repetitionScore / 2);
    if (structureScore >= 40) structureQuality = 'excellent';
    else if (structureScore >= 25) structureQuality = 'good';
    else if (structureScore >= 15) structureQuality = 'fair';
    
    return {
      sentenceVariety,
      averageWordLength,
      syllableComplexity,
      repetitionScore,
      transitionWords: foundTransitions,
      structureQuality
    };
  };

  const analyzePersuasionTechniques = (text: string, doc: any): PersuasionAnalysis => {
    const words = doc.terms().out('array').map((w: string) => w.toLowerCase());
    
    // Call-to-action detection
    const ctaWords = ['buy', 'purchase', 'order', 'subscribe', 'download', 'register', 'join', 'start', 'try', 'get'];
    const callsToAction = words.filter((word: string) => ctaWords.includes(word));
    
    // Urgency words
    const urgencyWords = ['now', 'today', 'immediately', 'urgent', 'limited', 'hurry', 'fast', 'quick', 'deadline'];
    const foundUrgency = words.filter((word: string) => urgencyWords.includes(word));
    
    // Emotional triggers
    const emotionalWords = ['amazing', 'incredible', 'shocking', 'secret', 'exclusive', 'proven', 'guaranteed'];
    const emotionalTriggers = words.filter((word: string) => emotionalWords.includes(word));
    
    // Social proof indicators
    const socialProofWords = ['testimonial', 'review', 'customer', 'trusted', 'popular', 'bestseller', 'recommended'];
    const socialProof = words.filter((word: string) => socialProofWords.some(sp => word.includes(sp)));
    
    // Authority words
    const authorityWords = ['expert', 'professional', 'certified', 'award', 'leader', 'authority', 'official'];
    const foundAuthority = words.filter((word: string) => authorityWords.some(auth => word.includes(auth)));
    
    // Scarcity words
    const scarcityWords = ['limited', 'exclusive', 'rare', 'scarce', 'few', 'last', 'only'];
    const foundScarcity = words.filter((word: string) => scarcityWords.includes(word));
    
    const persuasionScore = Math.min(100, 
      (callsToAction.length * 15) + 
      (foundUrgency.length * 10) + 
      (emotionalTriggers.length * 8) + 
      (socialProof.length * 12) + 
      (foundAuthority.length * 10) + 
      (foundScarcity.length * 8)
    );
    
    const techniques: string[] = [];
    if (callsToAction.length > 0) techniques.push('Direct Call-to-Action');
    if (foundUrgency.length > 0) techniques.push('Urgency/Scarcity');
    if (emotionalTriggers.length > 0) techniques.push('Emotional Appeal');
    if (socialProof.length > 0) techniques.push('Social Proof');
    if (foundAuthority.length > 0) techniques.push('Authority/Expertise');
    if (foundScarcity.length > 0) techniques.push('Scarcity Marketing');
    
    return {
      callsToAction,
      urgencyWords: foundUrgency,
      emotionalTriggers,
      socialProof,
      authorityWords: foundAuthority,
      scarcityWords: foundScarcity,
      persuasionScore: Math.round(persuasionScore),
      marketingTechniques: techniques
    };
  };

  const clearAnalysis = () => {
    setInputText('');
    setAnalysis(null);
    setToneAnalysis(null);
    setBrandArchetypes(null);
    setMessageClarity(null);
    setAdvancedLinguistics(null);
    setCommunicationStyle(null);
    setContentStructure(null);
    setPersuasionAnalysis(null);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-brand-text-secondary bg-brand-bg-muted';
    }
  };

  const tabs = [
    { id: 'tone', label: '🎯 Tone Analysis', count: toneAnalysis ? 4 : 0 },
    { id: 'archetypes', label: '🎭 Brand Archetypes', count: brandArchetypes ? 12 : 0 },
    { id: 'clarity', label: '🔍 Message Clarity', count: messageClarity ? 1 : 0 },
    { id: 'linguistics', label: '📝 Advanced Linguistics', count: advancedLinguistics ? Object.values(advancedLinguistics).flat().length : 0 },
    { id: 'communication', label: '💬 Communication Style', count: communicationStyle ? 4 : 0 },
    { id: 'structure', label: '🏗️ Content Structure', count: contentStructure ? 5 : 0 },
    { id: 'persuasion', label: '🎪 Persuasion Analysis', count: persuasionAnalysis ? persuasionAnalysis.marketingTechniques.length : 0 },
    { id: 'basic', label: '📊 Basic Analysis', count: analysis ? 3 : 0 }
  ];

  return (
    <div className="mt-16 bg-white border border-brand-border-light rounded-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-jetbrains-medium text-brand-text-primary mb-2">
          🤖 Advanced Text Analysis Powered by Compromise.js
        </h2>
        <p className="text-brand-text-secondary mb-4">
          Enter text to analyze or click on content blocks above to auto-populate the input field. Then use the "ANALYZE SELECTION" button in the popup to run comprehensive analysis.
        </p>
      </div>

      {/* Text Input */}
      <div className="mb-6">
        <label htmlFor="text-input" className="block text-sm font-jetbrains-medium text-brand-text-primary mb-2">
          Text to Analyze
        </label>
        <textarea
          id="text-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text here or click content blocks to auto-populate..."
          className="w-full h-32 p-3 border border-brand-border-light rounded-lg font-jetbrains-normal text-sm text-brand-text-primary placeholder-brand-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-accent-teal focus:border-transparent resize-y"
        />
      </div>

      {/* Control buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => analyzeText()}
          disabled={!inputText.trim() || isAnalyzing}
          className="px-4 py-2 bg-brand-accent-yellow text-brand-text-primary font-jetbrains-medium text-sm rounded border border-brand-border-light hover:bg-brand-accent-rose transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-brand-text-tertiary mr-2"></div>
              Analyzing...
            </>
          ) : (
            'ANALYZE TEXT'
          )}
        </button>
        
        <button
          onClick={clearAnalysis}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-brand-bg-muted text-brand-text-secondary font-jetbrains-medium text-sm rounded border border-brand-border-light hover:bg-brand-bg-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear
        </button>
      </div>

      {/* Analysis Results */}
      {(analysis || toneAnalysis || brandArchetypes || messageClarity || advancedLinguistics || communicationStyle || contentStructure || persuasionAnalysis) && (
        <div className="border-t border-brand-border-light pt-6">
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-sm font-jetbrains-normal rounded-lg border transition-colors ${
                  activeTab === tab.id
                    ? 'bg-brand-accent-yellow text-brand-text-primary border-brand-border-primary'
                    : 'bg-brand-bg-muted text-brand-text-secondary border-brand-border-light hover:bg-brand-bg-card'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-brand-accent-teal text-white text-xs rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            {activeTab === 'tone' && toneAnalysis && (
              <div className="space-y-4">
                <h3 className="text-lg font-jetbrains-medium text-brand-text-primary mb-4">🎯 Tone of Voice Analysis</h3>
                
                {/* Tone Sliders */}
                {Object.entries(toneAnalysis).map(([dimension, value]) => {
                  if (dimension === 'explanation') return null;
                  
                  const numValue = typeof value === 'number' ? value : 0;
                  const explanation = toneAnalysis.explanation[dimension as keyof typeof toneAnalysis.explanation];
                  
                  return (
                    <div key={dimension} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-jetbrains-medium text-brand-text-primary capitalize">
                          {dimension}
                        </label>
                        <span className="text-sm font-jetbrains-normal text-brand-text-secondary">
                          {numValue}%
                        </span>
                      </div>
                      <div className="relative">
                        <div className="w-full h-2 bg-brand-bg-muted rounded-full">
                          <div 
                            className="h-2 bg-gradient-to-r from-brand-accent-teal to-brand-accent-yellow rounded-full transition-all duration-300"
                            style={{ width: `${numValue}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-brand-text-tertiary">{explanation}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'archetypes' && brandArchetypes && (
              <div className="space-y-4">
                <h3 className="text-lg font-jetbrains-medium text-brand-text-primary mb-4">🎭 Brand Archetype Analysis</h3>
                
                <div className="mb-4 p-4 bg-brand-accent-yellow bg-opacity-20 rounded-lg">
                  <h4 className="font-jetbrains-medium text-brand-text-primary capitalize mb-1">
                    Dominant Archetype: {brandArchetypes.dominant}
                  </h4>
                  <p className="text-sm text-brand-text-secondary">{brandArchetypes.explanation}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(brandArchetypes).map(([archetype, score]) => {
                    if (archetype === 'dominant' || archetype === 'explanation') return null;
                    
                    const numScore = typeof score === 'number' ? score : 0;
                    const isDominant = archetype === brandArchetypes.dominant;
                    
                    return (
                      <div key={archetype} className={`p-3 rounded-lg border ${
                        isDominant 
                          ? 'bg-brand-accent-yellow bg-opacity-30 border-brand-accent-yellow' 
                          : 'bg-brand-bg-card border-brand-border-light'
                      }`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-jetbrains-medium text-brand-text-primary capitalize">
                            {archetype}
                          </span>
                          <span className="text-sm font-jetbrains-normal text-brand-text-secondary">
                            {numScore}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-brand-bg-muted rounded-full">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              isDominant 
                                ? 'bg-brand-accent-yellow' 
                                : 'bg-brand-accent-teal'
                            }`}
                            style={{ width: `${numScore}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'clarity' && messageClarity && (
              <div className="space-y-4">
                <h3 className="text-lg font-jetbrains-medium text-brand-text-primary mb-4">🔍 Message Clarity Analysis</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-brand-bg-card border border-brand-border-light rounded-lg">
                    <div className="text-2xl font-jetbrains-medium text-brand-text-primary mb-1">
                      {messageClarity.clarityGrade}
                    </div>
                    <div className="text-sm text-brand-text-secondary">Clarity Grade</div>
                  </div>
                  
                  <div className="p-4 bg-brand-bg-card border border-brand-border-light rounded-lg">
                    <div className="text-2xl font-jetbrains-medium text-brand-text-primary mb-1">
                      {messageClarity.readabilityScore}
                    </div>
                    <div className="text-sm text-brand-text-secondary">Readability Score</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-brand-text-secondary">Average Words Per Sentence:</span>
                    <span className="text-sm font-jetbrains-medium text-brand-text-primary">
                      {messageClarity.averageWordsPerSentence}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-brand-text-secondary">Complex Words:</span>
                    <span className="text-sm font-jetbrains-medium text-brand-text-primary">
                      {messageClarity.complexWords}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-brand-text-secondary">Passive Voice Count:</span>
                    <span className="text-sm font-jetbrains-medium text-brand-text-primary">
                      {messageClarity.passiveVoiceCount}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-brand-text-secondary">Questions:</span>
                    <span className="text-sm font-jetbrains-medium text-brand-text-primary">
                      {messageClarity.questionCount}
                    </span>
                  </div>
                </div>

                {messageClarity.jargonWords.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-jetbrains-medium text-brand-text-primary mb-2">Jargon Words Found:</h4>
                    <div className="flex flex-wrap gap-2">
                      {messageClarity.jargonWords.map((word, index) => (
                        <span key={index} className="px-2 py-1 bg-brand-accent-rose bg-opacity-30 text-xs font-jetbrains-normal text-brand-text-primary rounded">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {messageClarity.improvements.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-jetbrains-medium text-brand-text-primary mb-2">Suggested Improvements:</h4>
                    <ul className="space-y-1">
                      {messageClarity.improvements.map((improvement, index) => (
                        <li key={index} className="text-sm text-brand-text-secondary flex items-start">
                          <span className="text-brand-accent-yellow mr-2">•</span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'linguistics' && advancedLinguistics && (
              <div className="space-y-4">
                <h3 className="text-lg font-jetbrains-medium text-brand-text-primary mb-4">📝 Advanced Linguistic Features</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(advancedLinguistics).map(([feature, items]) => (
                    <div key={feature} className="p-4 bg-brand-bg-card border border-brand-border-light rounded-lg">
                      <h4 className="text-sm font-jetbrains-medium text-brand-text-primary mb-2 capitalize">
                        {feature.replace(/([A-Z])/g, ' $1').trim()} ({Array.isArray(items) ? items.length : 0})
                      </h4>
                      {Array.isArray(items) && items.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {items.slice(0, 10).map((item, index) => (
                            <span key={index} className="px-2 py-1 bg-brand-accent-teal bg-opacity-20 text-xs font-jetbrains-normal text-brand-text-primary rounded">
                              {item}
                            </span>
                          ))}
                          {items.length > 10 && (
                            <span className="px-2 py-1 bg-brand-bg-muted text-xs font-jetbrains-normal text-brand-text-tertiary rounded">
                              +{items.length - 10} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-brand-text-tertiary">None found</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'communication' && communicationStyle && (
              <div className="space-y-4">
                <h3 className="text-lg font-jetbrains-medium text-brand-text-primary mb-4">💬 Communication Style Analysis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-brand-bg-card border border-brand-border-light rounded-lg">
                    <h4 className="text-sm font-jetbrains-medium text-brand-text-primary mb-3">Tense Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-brand-text-secondary">Past Tense:</span>
                        <span className="text-xs font-jetbrains-medium text-brand-text-primary">
                          {communicationStyle.tensePastCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-brand-text-secondary">Present Tense:</span>
                        <span className="text-xs font-jetbrains-medium text-brand-text-primary">
                          {communicationStyle.tensePresentCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-brand-text-secondary">Future Tense:</span>
                        <span className="text-xs font-jetbrains-medium text-brand-text-primary">
                          {communicationStyle.tenseFutureCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-brand-bg-card border border-brand-border-light rounded-lg">
                    <h4 className="text-sm font-jetbrains-medium text-brand-text-primary mb-3">Sentence Types</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-brand-text-secondary">Imperative:</span>
                        <span className="text-xs font-jetbrains-medium text-brand-text-primary">
                          {communicationStyle.imperativeCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-brand-text-secondary">Declarative:</span>
                        <span className="text-xs font-jetbrains-medium text-brand-text-primary">
                          {communicationStyle.declarativeCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-brand-text-secondary">Q/S Ratio:</span>
                        <span className="text-xs font-jetbrains-medium text-brand-text-primary">
                          {communicationStyle.questionToStatementRatio}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-brand-accent-yellow bg-opacity-20 rounded-lg">
                  <h4 className="text-sm font-jetbrains-medium text-brand-text-primary mb-1">
                    Communication Tone
                  </h4>
                  <span className="inline-block px-3 py-1 bg-brand-accent-yellow text-brand-text-primary text-sm font-jetbrains-medium rounded-full capitalize">
                    {communicationStyle.communicationTone}
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'structure' && contentStructure && (
              <div className="space-y-4">
                <h3 className="text-lg font-jetbrains-medium text-brand-text-primary mb-4">🏗️ Content Structure Analysis</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-brand-bg-card border border-brand-border-light rounded-lg">
                    <div className="text-xl font-jetbrains-medium text-brand-text-primary mb-1">
                      {contentStructure.sentenceVariety}
                    </div>
                    <div className="text-sm text-brand-text-secondary">Sentence Variety</div>
                  </div>
                  
                  <div className="p-4 bg-brand-bg-card border border-brand-border-light rounded-lg">
                    <div className="text-xl font-jetbrains-medium text-brand-text-primary mb-1">
                      {contentStructure.averageWordLength}
                    </div>
                    <div className="text-sm text-brand-text-secondary">Avg Word Length</div>
                  </div>
                  
                  <div className="p-4 bg-brand-bg-card border border-brand-border-light rounded-lg">
                    <div className="text-xl font-jetbrains-medium text-brand-text-primary mb-1">
                      {contentStructure.syllableComplexity}
                    </div>
                    <div className="text-sm text-brand-text-secondary">Syllable Complexity</div>
                  </div>
                  
                  <div className="p-4 bg-brand-bg-card border border-brand-border-light rounded-lg">
                    <div className="text-xl font-jetbrains-medium text-brand-text-primary mb-1">
                      {contentStructure.repetitionScore}%
                    </div>
                    <div className="text-sm text-brand-text-secondary">Repetition Score</div>
                  </div>
                </div>

                <div className="p-4 bg-brand-bg-card border border-brand-border-light rounded-lg">
                  <h4 className="text-sm font-jetbrains-medium text-brand-text-primary mb-2">
                    Structure Quality: <span className="capitalize text-brand-accent-teal">{contentStructure.structureQuality}</span>
                  </h4>
                  
                  {contentStructure.transitionWords.length > 0 ? (
                    <div>
                      <span className="text-sm text-brand-text-secondary">Transition words found: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {contentStructure.transitionWords.map((word, index) => (
                          <span key={index} className="px-2 py-1 bg-brand-accent-teal bg-opacity-20 text-xs font-jetbrains-normal text-brand-text-primary rounded">
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-brand-text-tertiary">No transition words found</span>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'persuasion' && persuasionAnalysis && (
              <div className="space-y-4">
                <h3 className="text-lg font-jetbrains-medium text-brand-text-primary mb-4">🎪 Persuasion & Marketing Analysis</h3>
                
                <div className="p-4 bg-brand-accent-yellow bg-opacity-20 rounded-lg mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-jetbrains-medium text-brand-text-primary">
                      Overall Persuasion Score
                    </span>
                    <span className="text-2xl font-jetbrains-medium text-brand-text-primary">
                      {persuasionAnalysis.persuasionScore}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'callsToAction', label: 'Calls to Action', items: persuasionAnalysis.callsToAction },
                    { key: 'urgencyWords', label: 'Urgency Words', items: persuasionAnalysis.urgencyWords },
                    { key: 'emotionalTriggers', label: 'Emotional Triggers', items: persuasionAnalysis.emotionalTriggers },
                    { key: 'socialProof', label: 'Social Proof', items: persuasionAnalysis.socialProof },
                    { key: 'authorityWords', label: 'Authority Words', items: persuasionAnalysis.authorityWords },
                    { key: 'scarcityWords', label: 'Scarcity Words', items: persuasionAnalysis.scarcityWords }
                  ].map(({ key, label, items }) => (
                    <div key={key} className="p-4 bg-brand-bg-card border border-brand-border-light rounded-lg">
                      <h4 className="text-sm font-jetbrains-medium text-brand-text-primary mb-2">
                        {label} ({items.length})
                      </h4>
                      {items.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {items.map((item, index) => (
                            <span key={index} className="px-2 py-1 bg-brand-accent-rose bg-opacity-30 text-xs font-jetbrains-normal text-brand-text-primary rounded">
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-brand-text-tertiary">None found</span>
                      )}
                    </div>
                  ))}
                </div>

                {persuasionAnalysis.marketingTechniques.length > 0 && (
                  <div className="p-4 bg-brand-bg-card border border-brand-border-light rounded-lg">
                    <h4 className="text-sm font-jetbrains-medium text-brand-text-primary mb-2">Marketing Techniques Detected:</h4>
                    <div className="flex flex-wrap gap-2">
                      {persuasionAnalysis.marketingTechniques.map((technique, index) => (
                        <span key={index} className="px-3 py-1 bg-brand-accent-teal bg-opacity-20 text-sm font-jetbrains-normal text-brand-text-primary rounded-full">
                          {technique}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'basic' && analysis && (
              <div className="space-y-4">
                <h3 className="text-lg font-jetbrains-medium text-brand-text-primary mb-4">📊 Basic Analysis</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-brand-bg-card border border-brand-border-light rounded-lg">
                    <div className="text-2xl font-jetbrains-medium text-brand-text-primary mb-1">
                      {analysis.wordCount}
                    </div>
                    <div className="text-sm text-brand-text-secondary">Words</div>
                  </div>
                  
                  <div className="p-4 bg-brand-bg-card border border-brand-border-light rounded-lg">
                    <div className="text-2xl font-jetbrains-medium text-brand-text-primary mb-1">
                      {analysis.sentences}
                    </div>
                    <div className="text-sm text-brand-text-secondary">Sentences</div>
                  </div>
                  
                  <div className="p-4 bg-brand-bg-card border border-brand-border-light rounded-lg col-span-2">
                    <div className={`inline-block px-3 py-1 text-sm font-jetbrains-medium rounded-full ${getSentimentColor(analysis.sentiment)}`}>
                      {analysis.sentiment}
                    </div>
                    <div className="text-sm text-brand-text-secondary mt-1">Sentiment</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'nouns', label: 'Nouns', items: analysis.nouns },
                    { key: 'verbs', label: 'Verbs', items: analysis.verbs },
                    { key: 'adjectives', label: 'Adjectives', items: analysis.adjectives },
                    { key: 'topics', label: 'Topics', items: analysis.topics },
                    { key: 'people', label: 'People', items: analysis.people },
                    { key: 'places', label: 'Places', items: analysis.places }
                  ].map(({ key, label, items }) => (
                    <div key={key} className="p-4 bg-brand-bg-card border border-brand-border-light rounded-lg">
                      <h4 className="text-sm font-jetbrains-medium text-brand-text-primary mb-2">
                        {label} ({items.length})
                      </h4>
                      {items.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {items.slice(0, 10).map((item, index) => (
                            <span key={index} className="px-2 py-1 bg-brand-accent-teal bg-opacity-20 text-xs font-jetbrains-normal text-brand-text-primary rounded">
                              {item}
                            </span>
                          ))}
                          {items.length > 10 && (
                            <span className="px-2 py-1 bg-brand-bg-muted text-xs font-jetbrains-normal text-brand-text-tertiary rounded">
                              +{items.length - 10} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-brand-text-tertiary">None found</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}