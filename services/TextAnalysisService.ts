import nlp from 'compromise';

export interface ToneAnalysisResult {
  humor: number;
  formality: number;
  respect: number;
  enthusiasm: number;
  wordCount: number;
  sentenceCount: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  keyTerms: string[];
  analysisTimestamp: number;
}

export interface TextSelection {
  content: string;
  source: 'selected' | 'fullPage';
  element?: Element;
  context?: string;
}

export class TextAnalysisService {
  private static instance: TextAnalysisService;

  static getInstance(): TextAnalysisService {
    if (!TextAnalysisService.instance) {
      TextAnalysisService.instance = new TextAnalysisService();
    }
    return TextAnalysisService.instance;
  }

  /**
   * Main analysis function using compromise.js
   */
  analyzeText(text: string): ToneAnalysisResult {
    if (!text || text.trim().length === 0) {
      return this.getEmptyResult();
    }

    const doc = nlp(text);
    
    return {
      humor: this.analyzeHumor(doc),
      formality: this.analyzeFormalityLevel(doc),
      respect: this.analyzeRespectLevel(doc),
      enthusiasm: this.analyzeEnthusiasmLevel(doc),
      wordCount: doc.wordCount(),
      sentenceCount: doc.sentences().length,
      sentiment: this.analyzeSentiment(doc),
      keyTerms: this.extractKeyTerms(doc),
      analysisTimestamp: Date.now()
    };
  }

  /**
   * Analyze humor level (0-100)
   * Based on: jokes, wordplay, informal expressions, exclamations
   */
  private analyzeHumor(doc: any): number {
    let score = 0;
    
    // Detect humor indicators
    const humorWords = ['lol', 'haha', 'funny', 'joke', 'hilarious', 'amusing'];
    const exclamations = doc.match('#Exclamation').length;
    const questions = doc.questions().length;
    const informal = doc.match('#Informal').length;
    
    // Check for humor words
    humorWords.forEach(word => {
      if (doc.has(word)) score += 15;
    });
    
    // Exclamations can indicate humor
    score += Math.min(exclamations * 8, 30);
    
    // Questions can be rhetorical/humorous
    score += Math.min(questions * 5, 20);
    
    // Informal language
    score += Math.min(informal * 3, 15);
    
    return Math.min(score, 100);
  }

  /**
   * Analyze formality level (0-100)
   * Based on: complex sentences, formal vocabulary, passive voice
   */
  private analyzeFormalityLevel(doc: any): number {
    let score = 0;
    
    const totalWords = doc.wordCount();
    if (totalWords === 0) return 0;
    
    // Formal indicators
    const passiveVoice = doc.match('#Passive').length;
    const adjectives = doc.adjectives().length;
    const adverbs = doc.adverbs().length;
    const conjunctions = doc.match('#Conjunction').length;
    
    // Complex sentence structure
    const avgWordsPerSentence = totalWords / Math.max(doc.sentences().length, 1);
    
    // Scoring
    score += Math.min(passiveVoice * 10, 25);
    score += Math.min((adjectives / totalWords) * 200, 20);
    score += Math.min((adverbs / totalWords) * 150, 15);
    score += Math.min((conjunctions / totalWords) * 100, 15);
    
    // Longer sentences = more formal
    if (avgWordsPerSentence > 15) score += 25;
    else if (avgWordsPerSentence > 10) score += 15;
    
    return Math.min(score, 100);
  }

  /**
   * Analyze respect level (0-100)
   * Based on: polite language, courtesy words, inclusive language
   */
  private analyzeRespectLevel(doc: any): number {
    let score = 50; // Start with neutral
    
    const politeWords = ['please', 'thank', 'appreciate', 'respect', 'honor', 'welcome'];
    const courtesy = ['sir', 'madam', 'mr', 'ms', 'dr'];
    const inclusive = ['everyone', 'all', 'together', 'community', 'team'];
    
    // Positive indicators
    politeWords.forEach(word => {
      if (doc.has(word)) score += 10;
    });
    
    courtesy.forEach(word => {
      if (doc.has(word)) score += 8;
    });
    
    inclusive.forEach(word => {
      if (doc.has(word)) score += 5;
    });
    
    // Negative indicators
    const rude = ['stupid', 'idiot', 'hate', 'terrible', 'awful'];
    rude.forEach(word => {
      if (doc.has(word)) score -= 15;
    });
    
    return Math.max(0, Math.min(score, 100));
  }

  /**
   * Analyze enthusiasm level (0-100)
   * Based on: exclamations, positive adjectives, action verbs
   */
  private analyzeEnthusiasmLevel(doc: any): number {
    let score = 0;
    
    const totalWords = doc.wordCount();
    if (totalWords === 0) return 0;
    
    // Enthusiasm indicators
    const exclamations = doc.match('#Exclamation').length;
    const positiveWords = ['amazing', 'awesome', 'great', 'excellent', 'fantastic', 'wonderful'];
    const actionVerbs = doc.verbs().length;
    const capitalWords = doc.match('#TitleCase').length;
    
    // Scoring
    score += Math.min(exclamations * 15, 40);
    score += Math.min((actionVerbs / totalWords) * 100, 25);
    score += Math.min((capitalWords / totalWords) * 50, 20);
    
    positiveWords.forEach(word => {
      if (doc.has(word)) score += 8;
    });
    
    return Math.min(score, 100);
  }

  /**
   * Basic sentiment analysis
   */
  private analyzeSentiment(doc: any): 'positive' | 'negative' | 'neutral' {
    const positive = ['good', 'great', 'awesome', 'amazing', 'excellent', 'love', 'like', 'happy'];
    const negative = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'sad', 'angry', 'disappointed'];
    
    let positiveScore = 0;
    let negativeScore = 0;
    
    positive.forEach(word => {
      if (doc.has(word)) positiveScore++;
    });
    
    negative.forEach(word => {
      if (doc.has(word)) negativeScore++;
    });
    
    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  }

  /**
   * Extract key terms using NLP
   */
  private extractKeyTerms(doc: any): string[] {
    const nouns = doc.nouns().out('array').slice(0, 5);
    const adjectives = doc.adjectives().out('array').slice(0, 3);
    
    return [...nouns, ...adjectives]
      .filter((term, index, arr) => arr.indexOf(term) === index)
      .slice(0, 8);
  }

  /**
   * Get empty analysis result
   */
  private getEmptyResult(): ToneAnalysisResult {
    return {
      humor: 0,
      formality: 50,
      respect: 50,
      enthusiasm: 0,
      wordCount: 0,
      sentenceCount: 0,
      sentiment: 'neutral',
      keyTerms: [],
      analysisTimestamp: Date.now()
    };
  }
}