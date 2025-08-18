import React, { useState } from "react";

interface BrandArchetypeData {
  archetype: string;
  definition: string;
  percentage: number;
  justification: string;
}

interface BrandArchetypesData {
  brand_archetypes: {
    primary: BrandArchetypeData;
    secondary: BrandArchetypeData;
    tertiary: BrandArchetypeData;
  };
  analysis_metadata: {
    methodology: string;
    analysis_date: string;
    sources_analyzed: string[];
  };
  key_selling_points: string[];
  overall_perception: string;
  communication_focus: string;
}

interface ToneAnalysisData {
  brand_name: string;
  tone_of_voice: {
    formal_vs_casual: {
      score: number;
      position: string;
      justification: string;
    };
    serious_vs_funny: {
      score: number;
      position: string;
      justification: string;
    };
    respectful_vs_irreverent: {
      score: number;
      position: string;
      justification: string;
    };
    matteroffact_vs_enthusiastic: {
      score: number;
      position: string;
      justification: string;
    };
  };
  tov_summary: {
    overall_brand_voice: string;
    key_differentiators: string;
  };
  resonates_with: string;
  justification: string;
}

const mockVisualIdentityData = {
  "look_and_feel": "A cheerful, inviting, and optimistic aesthetic that consistently evokes sunshine, natural warmth, and a sense of ease. The brand identity is clean, structured, and focused on conveying natural beauty and effortless results.",
  "primary_palette": "Predominantly warm yellows, beige, gold, and brown tones, often with pink accents for promotional text or specific claims.",
  "distinctive_assets": [
    "Bright yellow palette",
    "Bold text for promotional messages",
    "Gradient dotted pattern",
    "Beige-gold gradient/tones",
    "Bold, serif typography",
    "Colorful circles/badges highlighting benefits",
    "Product tubes with clear branding",
    "Cream smear/product texture shots",
    "'Dermatologist recommended' badge"
  ]
};

const mockArchetypesData: BrandArchetypesData = {
  brand_archetypes: {
    primary: {
      archetype: "The Innocent",
      definition: "Seeking happiness and simplicity",
      percentage: 70,
      justification: "The brand consistently projects an aura of happiness, simplicity, and natural optimism, making The Innocent the dominant archetype. Phrases like 'FLAWLESS SELF TANNER' and 'hassle-free, streak-free color' underscore an easy, problem-free approach to beauty. The 'Brand story visual analysis' explicitly states the brand promotes 'positivity and self-confidence', encouraging consumers to 'create your own sunshine' with a 'bright yellow background, suggesting energy and positivity'. This cheerfulness and aspiration for a 'natural glow' permeates all descriptions, promising a simple, uplifting transformation without complexity or artifice, directly aligning with the Innocent's desire for pure happiness and effortless beauty."
    },
    tertiary: {
      archetype: "The Sage",
      definition: "Driven by knowledge and truth",
      percentage: 15,
      justification: "Jergens reinforces trust and informed decision-making by positioning itself as knowledgeable and authoritative, embodying The Sage archetype. The prominent claim of being the '#1 U.S. Dermatologist Recommended Sunless Tanner Brand' (seen in multiple image analyses like Image 2, 3, 6, 7) provides expert endorsement and validates the product's effectiveness and safety. Additionally, the detailed breakdown of ingredients and their scientifically-backed benefits, such as 'Coconut oil: Known to hydrate and help skin retain moisture' and 'Antioxidants: Known to help keep skin looking healthy and nourished' in Product Gallery Image 5, demonstrates a commitment to transparency and educating the consumer, solidifying its role as a reliable source of beauty wisdom and proven results."
    },
    secondary: {
      archetype: "The Caregiver",
      definition: "Compassion and service to others",
      percentage: 15,
      justification: "The Jergens brand heavily emphasizes nurturing and protecting the skin, aligning strongly with The Caregiver archetype. The product is consistently presented as a 'Daily Moisturizer' that provides 'Hydrating, Moisturizing, Smoothening, Nourishing' benefits as seen in 'At a glance'. 'About this item' highlights the inclusion of 'antioxidants and Vitamin E' to 'boost moisturization for healthier-looking skin', showing a clear focus on skin wellness. Furthermore, the recurrent claim of being the '#1 U.S. Dermatologist Recommended Sunless Tanner Brand' across multiple Product Gallery images (e.g., Image 2, 3, 6, 7) signifies trusted, expert care and a commitment to overall skin health."
    }
  },
  analysis_metadata: {
    methodology: "AI-powered content analysis leveraging specialized tools for Brand Archetypes and Tone of Voice, combined with manual synthesis of PDP text and visual analysis outputs.",
    analysis_date: "2024-05-15",
    sources_analyzed: [
      "BASE_CONTENT",
      "ABOUT_THE_BRAND",
      "PRODUCT_GALLERY"
    ]
  },
  key_selling_points: [
    "Gradual & Natural Glow: Provides a subtle, natural-looking, and streak-free tan that develops over several days/one week.",
    "Dual-Purpose Moisturizer: Functions as a daily body lotion, deeply hydrating and nourishing the skin.",
    "Skin Health Benefits: Infused with antioxidants, Vitamin E, and Coconut Oil for healthier-looking, moisturized, and smoothened skin.",
    "Dermatologist Recommended: Positioned as the #1 U.S. Dermatologist Recommended Sunless Tanner Brand, building trust and credibility.",
    "Ease of Use: 'Hassle-free' application, simply use as a daily lotion, with a fresh scent and no transfer."
  ],
  overall_perception: "Jergens Natural Glow is perceived as a trustworthy, accessible, and uplifting beauty brand that empowers consumers to achieve a natural, healthy-looking glow with simplicity and confidence. It skillfully blends the emotional appeal of happiness and self-enhancement (The Innocent) with the reassurance of expert care and proven benefits (The Caregiver & The Sage). The communication is direct, positive, and enthusiastic, devoid of unnecessary complexity. Visually, the brand communicates warmth, vibrancy, and a sunny disposition, reinforcing its promise of a beautiful, natural tan achieved effortlessly as part of a daily skincare routine. It positions itself not just as a product for tanning, but as a holistic approach to feeling good about one's skin and embracing a positive self-image.",
  communication_focus: "The primary communication focus is on achieving a gradual, natural-looking, flawless tan with ease and convenience (hassle-free, daily moisturizer application), while also emphasizing skin health and nourishment through key ingredients. There's a strong underlying message of self-empowerment and positivity ('Create your own sunshine')."
};

const mockData: ToneAnalysisData = {
  brand_name: "Essentially KateS",
  tone_of_voice: {
    formal_vs_casual: {
      score: 2,
      position: "Slightly Formal",
      justification:
        "Slightly Formal: The content uses precise botanical names like 'Mentha Piperita' and details like 'Steam Distilled', indicating a scientific approach. However, it balances this with accessible instructions for practical application, such as 'Add a few drops' and 'Gently massage onto your skin', making complex information user-friendly.",
    },
    serious_vs_funny: {
      score: 1,
      position: "Completely Serious",
      justification:
        "Completely Serious: The brand maintains a consistently serious and informative tone, focusing on factual descriptions of the oil's properties ('high menthol content') and practical applications ('External Use Only'). There is no attempt at humor or playful language; the safety and legal disclaimers reinforce a professional, no-nonsense stance.",
    },
    respectful_vs_irreverent: {
      score: 1,
      position: "Deeply Respectful",
      justification:
        "Deeply Respectful: The brand demonstrates deep respect for the customer by providing detailed information such as 'Botanical Name: Mentha Piperita' and clear instructions for use and even troubleshooting ('it may crystalize. If so, we would recommend placing the bottle in a hot water bath'). It treats the customer as intelligent and responsible, providing all necessary information without condescension.",
    },
    matteroffact_vs_enthusiastic: {
      score: 2,
      position: "Slightly Matter-of-fact",
      justification:
        "Slightly Matter-of-fact: While the tone is primarily factual and instructional, using phrases like 'A top note with a strong aroma' and 'Processing Method: Steam Distilled', it incorporates subtle positive framing like 'Soothing Skin Elixir' and 'Aromatherapy Oasis' to highlight benefits without resorting to excessive hype. The language remains grounded in practicality rather than overt excitement.",
    },
  },
  tov_summary: {
    overall_brand_voice:
      "Essentially KateS adopts a voice of practical authority, providing customers with precise, factual information about their essential oil while offering clear, actionable instructions for its diverse uses. The brand prioritizes transparency and user education, presenting itself as a trustworthy source for natural products, avoiding any frivolous or overly casual language.",
    key_differentiators:
      "1. Scientific precision ('Botanical Name: Mentha Piperita' and 'Steam Distilled' details). 2. Comprehensive user guidance (multiple application methods and troubleshooting for crystallization). 3. Unwavering seriousness and respect for the customer's intelligence, avoiding hype or casualness.",
  },
  resonates_with: "Efficiency-focused decision-makers",
  justification:
    "The brand's slightly formal, serious, respectful, and slightly matter-of-fact tone appeals to individuals who value clear, accurate information and practical utility. The detailed instructions for various uses ('Soothing Skin Elixir', 'Aromatherapy Oasis', 'Chemical-Free Cleaning Solution') and the transparency regarding product characteristics ('high menthol content', crystallization note) provide the precise details that efficiency-focused decision-makers seek to make informed choices and maximize product utility. They aren't looking for emotional appeals or humor, but rather reliable data and straightforward guidance.",
};

function ToneDimensionRow({
  title,
  position,
  score,
  justification,
  isExpanded,
  onToggle,
  maxScore = 5,
  animationDelay = 0,
  parentExpanded = true,
}: {
  title: string;
  position: string;
  score: number;
  justification: string;
  isExpanded: boolean;
  onToggle: () => void;
  maxScore?: number;
  animationDelay?: number;
  parentExpanded?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger loading animation when parent section becomes expanded
  React.useEffect(() => {
    if (parentExpanded) {
      // Staggered delay for each slider to create cascade effect
      const timer = setTimeout(() => setIsLoaded(true), 150 + animationDelay);
      return () => clearTimeout(timer);
    } else {
      // Reset when parent collapsed
      setIsLoaded(false);
    }
  }, [parentExpanded, animationDelay]);

  const getScoreColor = (score: number) => {
    // Use consistent darker teal color for all sliders
    return "bg-[#2d5a5a]";
  };

  return (
    <div 
      className={`space-y-3 cursor-pointer p-3 -m-3 rounded transition-colors duration-200 ${
        isHovered ? 'bg-[#faf9f7]' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onToggle}
    >
      {/* Dimension Header */}
      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-[#04252b]">
          {title}
        </span>
        <span className="text-xs text-[#04252b] font-[JetBrains_Mono] bg-[#faf9f7] px-2 py-1 rounded-full border border-[#e2ddd4]">
          {score}/{maxScore}
        </span>
      </div>

      {/* Position with Hover Details */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#2d5a5a]">
            {position}
          </span>

          {/* Details Button - Always reserves space */}
          <div className="text-right">
            <span
              className={`text-xs transition-all duration-200 whitespace-nowrap px-2 py-1 rounded ${
                isHovered || isExpanded
                  ? "text-[#717182] opacity-100 bg-[#F6F951]"
                  : "text-transparent opacity-0"
              }`}
            >
              {isExpanded ? "hide" : "details"}
            </span>
          </div>
        </div>

        {/* Animated Slider */}
        <div className="relative w-full h-4">
          {/* Background line - positioned at bottom */}
          <div className="absolute w-full h-px bg-[#2d5a5a] bottom-0"></div>

          {/* Score indicator - extends upward from the line with smooth animation */}
          <div
            className="absolute w-px h-3 bg-[#2d5a5a] bottom-0 transition-all duration-500 ease-out"
            style={{
              left: isLoaded ? `${(score / maxScore) * 100}%` : '0%',
              transform: "translateX(-50%)",
              transitionDelay: isLoaded ? '0ms' : `${animationDelay}ms`
            }}
          />
        </div>
      </div>

      {/* Expandable Justification - Technical Style */}
      {isExpanded && (
        <div className="bg-[#faf9f7] p-3 font-[JetBrains_Mono]">
          <div className="text-xs text-[#717182] mb-3 font-[JetBrains_Mono]">
            // ANALYSIS_OUTPUT
          </div>
          <p className="text-sm text-[#04252b] leading-relaxed">
            {(() => {
              const colonIndex = justification.indexOf(":");
              if (colonIndex !== -1) {
                const positionTerm = justification.substring(0, colonIndex);
                const restOfText = justification.substring(colonIndex + 1).trim();
                
                // Add line breaks and highlight quotes
                const formatText = (text: string) => {
                  // Split by sentences but keep the periods
                  const sentences = text.split(/(\.)/).filter(part => part.trim() !== '');
                  const result = [];
                  
                  for (let i = 0; i < sentences.length; i += 2) {
                    const sentence = sentences[i];
                    const period = sentences[i + 1];
                    
                    if (sentence && sentence.trim()) {
                      // Highlight quoted text
                      const highlightedSentence = sentence.replace(
                        /'([^']+)'/g, 
                        '<span class="bg-white px-1 rounded font-medium">\'$1\'</span>'
                      );
                      
                      result.push(
                        <span key={i}>
                          <span dangerouslySetInnerHTML={{ __html: highlightedSentence }} />
                          {period}
                          {i < sentences.length - 2 && <><br /><br /></>}
                        </span>
                      );
                    }
                  }
                  
                  return result;
                };
                
                return (
                  <>
                    <span className="font-semibold text-[#2d5a5a]">
                      {positionTerm}:
                    </span>
                    <br /><br />
                    {formatText(restOfText)}
                  </>
                );
              }
              return justification;
            })()}
          </p>
        </div>
      )}
    </div>
  );
}

function ToneAnalysisCard({
  data,
}: {
  data: ToneAnalysisData;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [cardHovered, setCardHovered] = useState(false);
  const [expandedDimensions, setExpandedDimensions] = useState<
    Record<string, boolean>
  >({});

  const toggleDimension = (key: string) => {
    setExpandedDimensions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toneMapping = [
    {
      key: "formal_vs_casual",
      title: "Formal vs. Casual",
      data: data.tone_of_voice.formal_vs_casual,
    },
    {
      key: "serious_vs_funny",
      title: "Serious vs. Funny",
      data: data.tone_of_voice.serious_vs_funny,
    },
    {
      key: "respectful_vs_irreverent",
      title: "Respectful vs. Irreverent",
      data: data.tone_of_voice.respectful_vs_irreverent,
    },
    {
      key: "matteroffact_vs_enthusiastic",
      title: "Matter-of-fact vs. Enthusiastic",
      data: data.tone_of_voice.matteroffact_vs_enthusiastic,
    },
  ];

  return (
    <div className="bg-white overflow-hidden">
      {/* Card Header - Clickable */}
      <div 
        className={`px-4 py-3 cursor-pointer transition-colors relative ${
          isExpanded 
            ? 'bg-[#f1c7d6] hover:bg-[#f0c2d1]' 
            : 'bg-white hover:bg-[#F6F951]'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
      >
        <div>
          <h3 className="text-xl font-normal text-[#04252b]">
            <span className="font-mono font-light">{isExpanded ? '[*]' : '[ ]'}</span> Tone of Voice Analysis
          </h3>
          <p className="text-sm text-[#717182] mt-1">
            Nielsen's 4-Dimensional Framework
          </p>
        </div>
        <span className={`absolute top-3 right-4 text-xs text-[#717182] hover:text-[#04252b] transition-all duration-200 ${cardHovered ? 'opacity-100' : 'opacity-0'}`}>
          {isExpanded ? "[-]" : "[+]"}
        </span>
      </div>

      {/* Tone Dimensions - Collapsible */}
      {isExpanded && (
        <div className="p-4 space-y-8">
          {toneMapping.map((tone, index) => (
            <ToneDimensionRow
              key={tone.key}
              title={tone.title}
              position={tone.data.position}
              score={tone.data.score}
              justification={tone.data.justification}
              isExpanded={expandedDimensions[tone.key] || false}
              onToggle={() => toggleDimension(tone.key)}
              animationDelay={index * 100}
              parentExpanded={isExpanded}
            />
          ))}
          
          {/* Brand Voice Summary - Part of Tone Analysis */}
          <div className="pt-6">
            <BrandSummaryCard data={data} />
          </div>
        </div>
      )}
    </div>
  );
}

function BrandSummaryCard({
  data,
}: {
  data: ToneAnalysisData;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [summaryHovered, setSummaryHovered] = useState(false);

  return (
    <div className="bg-[#faf9f7]">
      {/* Card Header - Clickable */}
      <div
        className="p-4 cursor-pointer hover:bg-[#f5f3f0] transition-colors relative"
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setSummaryHovered(true)}
        onMouseLeave={() => setSummaryHovered(false)}
      >
        <div>
          <h3 className="text-base font-medium text-[#04252b]">
            Brand Voice Summary
          </h3>
          <div className="mt-2 text-sm text-[#2d5a5a]">
            Target: {data.resonates_with}
          </div>
        </div>
        <span className={`absolute top-4 right-4 text-xs text-[#717182] hover:text-[#2d5a5a] transition-all duration-200 ${summaryHovered ? 'opacity-100' : 'opacity-0'}`}>
          {isExpanded ? "[-]" : "[+]"}
        </span>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="border-t border-[#e2ddd4] p-4 bg-[#f5f3f0] space-y-4">
          <div>
            <h4 className="text-sm font-medium text-[#04252b] mb-2">
              Overall Voice
            </h4>
            <p className="text-sm text-[#2d5a5a] leading-relaxed">
              {data.tov_summary.overall_brand_voice}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-[#04252b] mb-2">
              Key Differentiators
            </h4>
            <div className="space-y-3">
              {(() => {
                const text =
                  data.tov_summary.key_differentiators;
                const items = text
                  .split(/(?=\d+\.)/)
                  .filter((item) => item.trim());

                return items.map((item, index) => {
                  const cleanedItem = item
                    .replace(/^\d+\.\s*/, "")
                    .trim();
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 bg-[#F6F951] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-[#04252b]">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-sm text-[#2d5a5a] leading-relaxed flex-1">
                        {cleanedItem}
                      </p>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SpectrumArchetypeVisualization() {
  const [expandedArchetypes, setExpandedArchetypes] = useState<Record<string, boolean>>({});
  const [isAnimated, setIsAnimated] = useState(false);
  
  const archetypes = [
    { key: 'primary', ...mockArchetypesData.brand_archetypes.primary, rank: 'primary' },
    { key: 'secondary', ...mockArchetypesData.brand_archetypes.secondary, rank: 'secondary' },
    { key: 'tertiary', ...mockArchetypesData.brand_archetypes.tertiary, rank: 'tertiary' },
  ].sort((a, b) => b.percentage - a.percentage);

  // Trigger animation on mount
  React.useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleArchetype = (key: string) => {
    setExpandedArchetypes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Calculate cumulative percentages for positioning
  const sections = archetypes.map((archetype, index) => {
    const startPercentage = archetypes.slice(0, index).reduce((sum, a) => sum + a.percentage, 0);
    return {
      ...archetype,
      startPercentage,
      endPercentage: startPercentage + archetype.percentage
    };
  });

  const formatTextWithQuotes = (text: string) => {
    // Split by sentences but keep the periods
    const sentences = text.split(/(\.)/).filter(part => part.trim() !== '');
    const result = [];
    
    for (let i = 0; i < sentences.length; i += 2) {
      const sentence = sentences[i];
      const period = sentences[i + 1];
      
      if (sentence && sentence.trim()) {
        // Highlight quoted text and specific phrases
        const highlightedSentence = sentence
          .replace(
            /'([^']+)'/g, 
            '<span class="bg-white px-1 rounded font-medium">\'$1\'</span>'
          )
          .replace(
            /FLAWLESS SELF TANNER/g,
            '<span class="bg-white px-1 rounded font-medium">FLAWLESS SELF TANNER</span>'
          )
          .replace(
            /hassle-free, streak-free color/g,
            '<span class="bg-white px-1 rounded font-medium">hassle-free, streak-free color</span>'
          )
          .replace(
            /#1 U\.S\. Dermatologist Recommended Sunless Tanner Brand/g,
            '<span class="bg-white px-1 rounded font-medium">#1 U.S. Dermatologist Recommended Sunless Tanner Brand</span>'
          )
          .replace(
            /create your own sunshine/g,
            '<span class="bg-white px-1 rounded font-medium">create your own sunshine</span>'
          )
          .replace(
            /Daily Moisturizer/g,
            '<span class="bg-white px-1 rounded font-medium">Daily Moisturizer</span>'
          )
          .replace(
            /Hydrating, Moisturizing, Smoothening, Nourishing/g,
            '<span class="bg-white px-1 rounded font-medium">Hydrating, Moisturizing, Smoothening, Nourishing</span>'
          )
          .replace(
            /Coconut oil: Known to hydrate and help skin retain moisture/g,
            '<span class="bg-white px-1 rounded font-medium">Coconut oil: Known to hydrate and help skin retain moisture</span>'
          )
          .replace(
            /Antioxidants: Known to help keep skin looking healthy and nourished/g,
            '<span class="bg-white px-1 rounded font-medium">Antioxidants: Known to help keep skin looking healthy and nourished</span>'
          )
          .replace(
            /positivity and self-confidence/g,
            '<span class="bg-white px-1 rounded font-medium">positivity and self-confidence</span>'
          );
        
        result.push(
          <span key={i}>
            <span dangerouslySetInnerHTML={{ __html: highlightedSentence }} />
            {period}
            {i < sentences.length - 2 && <><br /><br /></>}
          </span>
        );
      }
    }
    
    return result;
  };

  return (
    <div className="py-6">
      <div className="text-xs text-[#717182] mb-6 font-[JetBrains_Mono]">
        // ARCHETYPE_SPECTRUM_ANALYSIS
      </div>
      
      {/* Main spectrum bar */}
      <div className="relative h-12 bg-[#e2ddd4] rounded-full overflow-hidden mb-6">
        {sections.map((section, index) => {
          return (
            <div
              key={section.key}
              className={`absolute top-0 h-full transition-all duration-700 ease-out ${
                section.rank === 'primary' ? 'bg-[#F6F951]' :
                section.rank === 'secondary' ? 'bg-[#f1c7d6]' : 'bg-[#717182]'
              }`}
              style={{
                left: `${section.startPercentage}%`,
                width: isAnimated ? `${section.percentage}%` : '0%',
                transitionDelay: `${index * 150}ms`
              }}
            >
              {/* Percentage label inside bar */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-[#04252b] transition-opacity duration-300">
                  {section.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Archetype details below */}
      <div className="space-y-4">
        {archetypes.map((archetype) => {
          const isExpanded = expandedArchetypes[archetype.key] || false;
          const [isHovered, setIsHovered] = useState(false);
          
          return (
            <div key={archetype.key} className="space-y-3">
              {/* Archetype Header - Clickable */}
              <div 
                className={`flex items-center gap-3 p-3 rounded transition-colors duration-200 cursor-pointer relative ${
                  isHovered ? 'bg-[#faf9f7]' : ''
                }`}
                onClick={() => toggleArchetype(archetype.key)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold ${
                  archetype.rank === 'primary' ? 'bg-[#F6F951] text-[#04252b]' :
                  archetype.rank === 'secondary' ? 'bg-[#f1c7d6] text-[#04252b]' : 
                  'bg-[#717182] text-white'
                }`}>
                  {archetype.percentage}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#04252b]">
                    {archetype.archetype}
                  </div>
                  <div className="text-xs text-[#717182]">
                    {archetype.definition}
                  </div>
                </div>
                <div className={`text-xs uppercase px-2 py-1 rounded ${
                  archetype.rank === 'primary' 
                    ? 'bg-[#F6F951] text-[#04252b] font-medium blink-slow' 
                    : 'text-[#717182]'
                }`}>
                  {archetype.rank}
                </div>
                
                {/* Dotted underline that matches hover block width */}
                <div 
                  className={`absolute bottom-0 left-3 right-3 h-px border-b border-dotted border-[#e2ddd4] transition-opacity duration-200 ${
                    isHovered ? 'opacity-100' : 'opacity-30'
                  }`}
                />
              </div>
              
              {/* Expandable Content */}
              {isExpanded && (
                <div className="bg-[#faf9f7] p-3 rounded font-[JetBrains_Mono] animate-in slide-in-from-top-2 duration-200">
                  <div className="text-xs text-[#717182] mb-3 font-[JetBrains_Mono]">
                    // {archetype.rank.toUpperCase()}_ARCHETYPE_ANALYSIS
                  </div>
                  <p className="text-sm text-[#04252b] leading-relaxed">
                    {formatTextWithQuotes(archetype.justification)}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BrandArchetypesCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);
  const [expandedArchetypes, setExpandedArchetypes] = useState<Record<string, boolean>>({});

  const toggleArchetype = (key: string) => {
    setExpandedArchetypes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const archetypes = [
    { key: 'primary', ...mockArchetypesData.brand_archetypes.primary, rank: 'primary' },
    { key: 'secondary', ...mockArchetypesData.brand_archetypes.secondary, rank: 'secondary' },
    { key: 'tertiary', ...mockArchetypesData.brand_archetypes.tertiary, rank: 'tertiary' },
  ].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="bg-white overflow-hidden">
      {/* Card Header - Clickable */}
      <div 
        className={`px-4 py-3 cursor-pointer transition-colors relative ${
          isExpanded 
            ? 'bg-[#1A3A43] hover:bg-[#1a3a43dd]' 
            : 'bg-white hover:bg-[#F6F951]'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
      >
        <div>
          <h3 className={`text-xl font-normal ${isExpanded ? 'text-white' : 'text-[#04252b]'}`}>
            <span className="font-mono font-light">{isExpanded ? '[*]' : '[ ]'}</span> Brand Archetypes Mix
          </h3>
          <p className={`text-sm mt-1 ${isExpanded ? 'text-[#F6F951]' : 'text-[#717182]'}`}>
            Jung's 12 Archetypes Framework
          </p>
        </div>
        <span className={`absolute top-3 right-4 text-xs transition-all duration-200 ${cardHovered ? 'opacity-100' : 'opacity-0'} ${isExpanded ? 'text-[#F6F951] hover:text-white' : 'text-[#717182] hover:text-[#04252b]'}`}>
          {isExpanded ? "[-]" : "[+]"}
        </span>
      </div>

      {/* Archetypes Content - Collapsible */}
      {isExpanded && (
        <div className="p-4 space-y-8">
          {/* Spectrum Overview */}
          <SpectrumArchetypeVisualization />
        </div>
      )}
    </div>
  );
}

function BrandInsightsCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);
  const [expandedInsights, setExpandedInsights] = useState<Record<string, boolean>>({});
  const [sectionHoverStates, setSectionHoverStates] = useState<Record<string, boolean>>({});

  const toggleInsight = (key: string) => {
    setExpandedInsights(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSectionHover = (key: string, isHovered: boolean) => {
    setSectionHoverStates(prev => ({
      ...prev,
      [key]: isHovered
    }));
  };

  const formatTextWithQuotes = (text: string) => {
    // Split by sentences but keep the periods
    const sentences = text.split(/(\.)/).filter(part => part.trim() !== '');
    const result = [];
    
    for (let i = 0; i < sentences.length; i += 2) {
      const sentence = sentences[i];
      const period = sentences[i + 1];
      
      if (sentence && sentence.trim()) {
        // Highlight quoted text and specific phrases
        const highlightedSentence = sentence
          .replace(
            /'([^']+)'/g, 
            '<span class="bg-white px-1 rounded font-medium">\'$1\'</span>'
          )
          .replace(
            /FLAWLESS SELF TANNER/g,
            '<span class="bg-white px-1 rounded font-medium">FLAWLESS SELF TANNER</span>'
          )
          .replace(
            /hassle-free, streak-free color/g,
            '<span class="bg-white px-1 rounded font-medium">hassle-free, streak-free color</span>'
          )
          .replace(
            /#1 U\.S\. Dermatologist Recommended Sunless Tanner Brand/g,
            '<span class="bg-white px-1 rounded font-medium">#1 U.S. Dermatologist Recommended Sunless Tanner Brand</span>'
          )
          .replace(
            /Daily Moisturizer/g,
            '<span class="bg-white px-1 rounded font-medium">Daily Moisturizer</span>'
          )
          .replace(
            /Hydrating, Moisturizing, Smoothening, Nourishing/g,
            '<span class="bg-white px-1 rounded font-medium">Hydrating, Moisturizing, Smoothening, Nourishing</span>'
          )
          .replace(
            /Coconut oil: Known to hydrate and help skin retain moisture/g,
            '<span class="bg-white px-1 rounded font-medium">Coconut oil: Known to hydrate and help skin retain moisture</span>'
          )
          .replace(
            /Antioxidants: Known to help keep skin looking healthy and nourished/g,
            '<span class="bg-white px-1 rounded font-medium">Antioxidants: Known to help keep skin looking healthy and nourished</span>'
          );
        
        result.push(
          <span key={i}>
            <span dangerouslySetInnerHTML={{ __html: highlightedSentence }} />
            {period}
            {i < sentences.length - 2 && <><br /><br /></>}
          </span>
        );
      }
    }
    
    return result;
  };

  const insights = [
    {
      key: 'overall_perception',
      title: 'Overall Perception',
      content: mockArchetypesData.overall_perception
    },
    {
      key: 'communication_focus',
      title: 'Communication Focus',
      content: mockArchetypesData.communication_focus
    },
    {
      key: 'key_selling_points',
      title: 'Key Selling Points',
      content: null // Special case for selling points
    }
  ];

  return (
    <div className="bg-white overflow-hidden">
      {/* Card Header - Clickable */}
      <div 
        className={`px-4 py-3 cursor-pointer transition-colors relative ${
          isExpanded 
            ? 'bg-[#f1c7d6] hover:bg-[#f0c2d1]' 
            : 'bg-white hover:bg-[#F6F951]'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
      >
        <div>
          <h3 className="text-xl font-normal text-[#04252b]">
            <span className="font-mono font-light">{isExpanded ? '[*]' : '[ ]'}</span> Brand Insights
          </h3>
          <p className="text-sm text-[#717182] mt-1">
            Strategic Brand Analysis
          </p>
        </div>
        <span className={`absolute top-3 right-4 text-xs text-[#717182] hover:text-[#04252b] transition-all duration-200 ${cardHovered ? 'opacity-100' : 'opacity-0'}`}>
          {isExpanded ? "[-]" : "[+]"}
        </span>
      </div>

      {/* Brand Insights Content - Collapsible */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {insights.map((insight) => {
            if (insight.key === 'key_selling_points') {
              // Special case for key selling points
              return (
                <div key={insight.key} className="space-y-3">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onMouseEnter={() => handleSectionHover('key_selling_points', true)}
                    onMouseLeave={() => handleSectionHover('key_selling_points', false)}
                    onClick={() => toggleInsight(insight.key)}
                  >
                    <span className="text-base font-normal text-[#04252b]">
                      <span className="font-mono font-light">{expandedInsights[insight.key] ? '[*]' : '[ ]'}</span> {insight.title.toUpperCase()}
                    </span>

                    <div className="text-right">
                      <span
                        className={`text-xs transition-all duration-200 whitespace-nowrap px-2 py-1 rounded ${
                          sectionHoverStates['key_selling_points'] || expandedInsights[insight.key]
                            ? "text-[#717182] opacity-100 bg-[#F6F951]"
                            : "text-transparent opacity-0"
                        }`}
                      >
                        {expandedInsights[insight.key] ? "hide" : "details"}
                      </span>
                    </div>
                  </div>

                  {expandedInsights[insight.key] && (
                    <div className="bg-[#faf9f7] p-3 font-[JetBrains_Mono]">
                      <div className="text-xs text-[#717182] mb-3 font-[JetBrains_Mono]">
                        // KEY_SELLING_POINTS
                      </div>
                      <div className="space-y-3">
                        {mockArchetypesData.key_selling_points.map((point, index) => {
                          const colonIndex = point.indexOf(':');
                          const title = colonIndex !== -1 ? point.substring(0, colonIndex) : `Point ${index + 1}`;
                          const description = colonIndex !== -1 ? point.substring(colonIndex + 1).trim() : point;
                          
                          return (
                            <div key={index} className="flex items-start gap-3">
                              <span className="text-xs text-[#717182] w-8">—</span>
                              <div className="flex-1">
                                <span className="text-sm font-medium text-[#04252b] uppercase">{title}:</span>
                                <br />
                                <div className="text-sm text-[#2d5a5a] leading-relaxed">
                                  {formatTextWithQuotes(description)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            } else {
              return (
                <div key={insight.key} className="space-y-3">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onMouseEnter={() => handleSectionHover(insight.key, true)}
                    onMouseLeave={() => handleSectionHover(insight.key, false)}
                    onClick={() => toggleInsight(insight.key)}
                  >
                    <span className="text-base font-normal text-[#04252b]">
                      <span className="font-mono font-light">{expandedInsights[insight.key] ? '[*]' : '[ ]'}</span> {insight.title.toUpperCase()}
                    </span>

                    <div className="text-right">
                      <span
                        className={`text-xs transition-all duration-200 whitespace-nowrap px-2 py-1 rounded ${
                          sectionHoverStates[insight.key] || expandedInsights[insight.key]
                            ? "text-[#717182] opacity-100 bg-[#F6F951]"
                            : "text-transparent opacity-0"
                        }`}
                      >
                        {expandedInsights[insight.key] ? "hide" : "details"}
                      </span>
                    </div>
                  </div>

                  {expandedInsights[insight.key] && (
                    <div className="bg-[#faf9f7] p-3 font-[JetBrains_Mono]">
                      <div className="text-xs text-[#717182] mb-3 font-[JetBrains_Mono]">
                        // {insight.title.toUpperCase().replace(/ /g, '_')}
                      </div>
                      <p className="text-sm text-[#04252b] leading-relaxed">
                        {formatTextWithQuotes(insight.content)}
                      </p>
                    </div>
                  )}
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}

function VisualIdentityCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [sectionHoverStates, setSectionHoverStates] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSectionHover = (key: string, isHovered: boolean) => {
    setSectionHoverStates(prev => ({
      ...prev,
      [key]: isHovered
    }));
  };

  const formatTextWithQuotes = (text: string) => {
    // Split by sentences but keep the periods
    const sentences = text.split(/(\.)/).filter(part => part.trim() !== '');
    const result = [];
    
    for (let i = 0; i < sentences.length; i += 2) {
      const sentence = sentences[i];
      const period = sentences[i + 1];
      
      if (sentence && sentence.trim()) {
        // Highlight quoted text and specific phrases
        const highlightedSentence = sentence
          .replace(
            /'([^']+)'/g, 
            '<span class="bg-white px-1 rounded font-medium">\'$1\'</span>'
          )
          .replace(
            /Bright yellow palette/g,
            '<span class="bg-white px-1 rounded font-medium">Bright yellow palette</span>'
          )
          .replace(
            /sunshine/g,
            '<span class="bg-white px-1 rounded font-medium">sunshine</span>'
          )
          .replace(
            /natural warmth/g,
            '<span class="bg-white px-1 rounded font-medium">natural warmth</span>'
          )
          .replace(
            /clean, structured/g,
            '<span class="bg-white px-1 rounded font-medium">clean, structured</span>'
          )
          .replace(
            /natural beauty/g,
            '<span class="bg-white px-1 rounded font-medium">natural beauty</span>'
          )
          .replace(
            /effortless results/g,
            '<span class="bg-white px-1 rounded font-medium">effortless results</span>'
          )
          .replace(
            /warm yellows/g,
            '<span class="bg-white px-1 rounded font-medium">warm yellows</span>'
          )
          .replace(
            /beige, gold, and brown tones/g,
            '<span class="bg-white px-1 rounded font-medium">beige, gold, and brown tones</span>'
          )
          .replace(
            /pink accents/g,
            '<span class="bg-white px-1 rounded font-medium">pink accents</span>'
          );
        
        result.push(
          <span key={i}>
            <span dangerouslySetInnerHTML={{ __html: highlightedSentence }} />
            {period}
            {i < sentences.length - 2 && <><br /><br /></>}
          </span>
        );
      }
    }
    
    return result;
  };

  // Brand color palette based on description
  const brandColors = [
    { name: 'Warm Yellow', color: '#F6F951', hex: '#F6F951' },
    { name: 'Golden Yellow', color: '#FFD700', hex: '#FFD700' },
    { name: 'Light Beige', color: '#F5DEB3', hex: '#F5DEB3' },
    { name: 'Medium Beige', color: '#D2B48C', hex: '#D2B48C' },
    { name: 'Brown Tone', color: '#8B4513', hex: '#8B4513' },
    { name: 'Pink Accent', color: '#f1c7d6', hex: '#f1c7d6' },
  ];

  const sections = [
    {
      key: 'look_and_feel',
      title: 'LOOK & FEEL',
      content: mockVisualIdentityData.look_and_feel
    },
    {
      key: 'primary_palette',
      title: 'PRIMARY PALETTE', 
      content: mockVisualIdentityData.primary_palette,
      showColors: true
    },
    {
      key: 'distinctive_assets',
      title: 'DISTINCTIVE ASSETS',
      content: null // Special case for assets list
    }
  ];

  return (
    <div className="bg-white overflow-hidden">
      {/* Card Header - Clickable */}
      <div 
        className={`px-4 py-3 cursor-pointer transition-colors relative ${
          isExpanded 
            ? 'bg-[#f1c7d6] hover:bg-[#f0c2d1]' 
            : 'bg-white hover:bg-[#F6F951]'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
      >
        <div>
          <h3 className="text-xl font-normal text-[#04252b]">
            <span className="font-mono font-light">{isExpanded ? '[*]' : '[ ]'}</span> Visual Identity
          </h3>
          <p className="text-sm text-[#717182] mt-1">
            Brand Design & Aesthetic Analysis
          </p>
        </div>
        <span className={`absolute top-3 right-4 text-xs text-[#717182] hover:text-[#04252b] transition-all duration-200 ${cardHovered ? 'opacity-100' : 'opacity-0'}`}>
          {isExpanded ? "[-]" : "[+]"}
        </span>
      </div>

      {/* Visual Identity Content - Collapsible */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {sections.map((section) => {
            if (section.key === 'primary_palette') {
              // Special case for primary palette with colors
              return (
                <div key={section.key} className="space-y-3">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onMouseEnter={() => handleSectionHover('primary_palette', true)}
                    onMouseLeave={() => handleSectionHover('primary_palette', false)}
                    onClick={() => toggleSection(section.key)}
                  >
                    <span className="text-base font-normal text-[#04252b]">
                      <span className="font-mono font-light">{expandedSections[section.key] ? '[*]' : '[ ]'}</span> {section.title}
                    </span>

                    <div className="text-right">
                      <span
                        className={`text-xs transition-all duration-200 whitespace-nowrap px-2 py-1 rounded ${
                          sectionHoverStates['primary_palette'] || expandedSections[section.key]
                            ? "text-[#717182] opacity-100 bg-[#F6F951]"
                            : "text-transparent opacity-0"
                        }`}
                      >
                        {expandedSections[section.key] ? "hide" : "details"}
                      </span>
                    </div>
                  </div>

                  {expandedSections[section.key] && (
                    <div className="bg-[#faf9f7] p-3 font-[JetBrains_Mono]">
                      <div className="text-xs text-[#717182] mb-3 font-[JetBrains_Mono]">
                        // PRIMARY_PALETTE
                      </div>
                      
                      {/* Color Circles */}
                      <div className="flex flex-wrap gap-3 mb-4">
                        {brandColors.map((colorInfo, index) => (
                          <div key={index} className="flex flex-col items-center gap-1">
                            <div 
                              className="w-8 h-8 rounded-full border-2 border-[#e2ddd4] shadow-sm"
                              style={{ backgroundColor: colorInfo.color }}
                              title={`${colorInfo.name} - ${colorInfo.hex}`}
                            />
                            <span className="text-xs text-[#717182]">
                              {colorInfo.hex}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Color Description Text */}
                      <p className="text-sm text-[#04252b] leading-relaxed">
                        {formatTextWithQuotes(section.content)}
                      </p>
                    </div>
                  )}
                </div>
              );
            } else if (section.key === 'distinctive_assets') {
              // Special case for distinctive assets
              return (
                <div key={section.key} className="space-y-3">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onMouseEnter={() => handleSectionHover('distinctive_assets', true)}
                    onMouseLeave={() => handleSectionHover('distinctive_assets', false)}
                    onClick={() => toggleSection(section.key)}
                  >
                    <span className="text-base font-normal text-[#04252b]">
                      <span className="font-mono font-light">{expandedSections[section.key] ? '[*]' : '[ ]'}</span> {section.title}
                    </span>

                    <div className="text-right">
                      <span
                        className={`text-xs transition-all duration-200 whitespace-nowrap px-2 py-1 rounded ${
                          sectionHoverStates['distinctive_assets'] || expandedSections[section.key]
                            ? "text-[#717182] opacity-100 bg-[#F6F951]"
                            : "text-transparent opacity-0"
                        }`}
                      >
                        {expandedSections[section.key] ? "hide" : "details"}
                      </span>
                    </div>
                  </div>

                  {expandedSections[section.key] && (
                    <div className="bg-[#faf9f7] p-3 font-[JetBrains_Mono]">
                      <div className="text-xs text-[#717182] mb-3 font-[JetBrains_Mono]">
                        // DISTINCTIVE_ASSETS
                      </div>
                      <div className="space-y-2">
                        {mockVisualIdentityData.distinctive_assets.map((asset, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <span className="text-xs text-[#717182] w-8">—</span>
                            <div className="flex-1">
                              <div className="text-sm text-[#2d5a5a] leading-relaxed uppercase">
                                {asset}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            } else {
              // Standard section layout
              return (
                <div key={section.key} className="space-y-3">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onMouseEnter={() => handleSectionHover('look_and_feel', true)}
                    onMouseLeave={() => handleSectionHover('look_and_feel', false)}
                    onClick={() => toggleSection(section.key)}
                  >
                    <span className="text-base font-normal text-[#04252b]">
                      <span className="font-mono font-light">{expandedSections[section.key] ? '[*]' : '[ ]'}</span> {section.title}
                    </span>

                    <div className="text-right">
                      <span
                        className={`text-xs transition-all duration-200 whitespace-nowrap px-2 py-1 rounded ${
                          sectionHoverStates['look_and_feel'] || expandedSections[section.key]
                            ? "text-[#717182] opacity-100 bg-[#F6F951]"
                            : "text-transparent opacity-0"
                        }`}
                      >
                        {expandedSections[section.key] ? "hide" : "details"}
                      </span>
                    </div>
                  </div>

                  {expandedSections[section.key] && (
                    <div className="bg-[#faf9f7] p-3 font-[JetBrains_Mono]">
                      <div className="text-xs text-[#717182] mb-3 font-[JetBrains_Mono]">
                        // {section.title.replace(/ /g, '_')}
                      </div>
                      <p className="text-sm text-[#04252b] leading-relaxed">
                        {formatTextWithQuotes(section.content)}
                      </p>
                    </div>
                  )}
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}

export function BrandAnalysisCards() {
  const data = mockData;

  return (
    <div className="w-full max-w-[400px]">
      {/* Tone Analysis Card */}
      <div className="border-b border-dotted border-[#e2ddd4]">
        <ToneAnalysisCard data={data} />
      </div>

      {/* Brand Archetypes Mix */}
      <div className="border-b border-dotted border-[#e2ddd4]">
        <BrandArchetypesCard />
      </div>

      {/* Visual Identity */}
      <div className="border-b border-dotted border-[#e2ddd4]">
        <VisualIdentityCard />
      </div>

      {/* Brand Insights - Separate Section */}
      <BrandInsightsCard />
    </div>
  );
}