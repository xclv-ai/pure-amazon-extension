import React, { useState } from 'react';
import exampleImage from 'figma:asset/6c06d1677a70f4b727d0aefdbd579feabb18b272.png';

interface ArchetypeData {
  archetype: string;
  definition: string;
  percentage: number;
  justification: string;
  rank: string;
}

const mockArchetypes = [
  {
    archetype: "The Innocent",
    definition: "Seeking happiness and simplicity",
    percentage: 70,
    rank: 'primary'
  },
  {
    archetype: "The Caregiver", 
    definition: "Compassion and service to others",
    percentage: 15,
    rank: 'secondary'
  },
  {
    archetype: "The Sage",
    definition: "Driven by knowledge and truth", 
    percentage: 15,
    rank: 'tertiary'
  }
];

// 1. IMPROVED TECHNICAL GRID VISUALIZATION  
function TechnicalGridVisualization() {
  const [hoveredArchetype, setHoveredArchetype] = useState<string | null>(null);
  
  return (
    <div className="bg-[#faf9f7] rounded-lg p-6">
      <div className="text-xs text-[#717182] mb-6 font-mono">
        // ARCHETYPE_MATRIX_ANALYSIS
      </div>
      
      {/* Grid Layout */}
      <div className="space-y-4">
        {mockArchetypes.map((archetype, index) => {
          const isHovered = hoveredArchetype === archetype.archetype;
          
          return (
            <div
              key={archetype.archetype}
              className={`border-2 rounded-lg p-4 transition-all duration-300 cursor-pointer ${
                isHovered ? 'border-[#F6F951] bg-white scale-[1.02]' : 'border-[#e2ddd4] bg-white/50'
              }`}
              onMouseEnter={() => setHoveredArchetype(archetype.archetype)}
              onMouseLeave={() => setHoveredArchetype(null)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded border-2 flex items-center justify-center font-mono text-xs font-bold ${
                    archetype.rank === 'primary' ? 'bg-[#F6F951] border-[#F6F951] text-[#04252b]' :
                    archetype.rank === 'secondary' ? 'bg-[#2d5a5a] border-[#2d5a5a] text-white' : 
                    'bg-[#717182] border-[#717182] text-white'
                  }`}>
                    {archetype.percentage}%
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#04252b]">
                      {archetype.archetype}
                    </div>
                    <div className="text-xs text-[#717182] uppercase">
                      {archetype.rank} • {archetype.definition}
                    </div>
                  </div>
                </div>
                
                {/* Technical indicator */}
                <div className="text-xs font-mono text-[#717182]">
                  [{String(index + 1).padStart(2, '0')}]
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="relative h-2 bg-[#e2ddd4] rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    archetype.rank === 'primary' ? 'bg-[#F6F951]' :
                    archetype.rank === 'secondary' ? 'bg-[#2d5a5a]' : 'bg-[#717182]'
                  }`}
                  style={{ width: `${archetype.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 2. BRAND SPECTRUM VISUALIZATION  
function SpectrumVisualization() {
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);
  
  // Calculate cumulative percentages for positioning
  const sections = mockArchetypes.map((archetype, index) => {
    const startPercentage = mockArchetypes.slice(0, index).reduce((sum, a) => sum + a.percentage, 0);
    return {
      ...archetype,
      startPercentage,
      endPercentage: startPercentage + archetype.percentage
    };
  });
  
  return (
    <div className="bg-[#faf9f7] rounded-lg p-6">
      <div className="text-xs text-[#717182] mb-6 font-mono">
        // ARCHETYPE_SPECTRUM_ANALYSIS
      </div>
      
      {/* Main spectrum bar */}
      <div className="relative h-12 bg-[#e2ddd4] rounded-full overflow-hidden mb-6">
        {sections.map((section, index) => {
          const isHovered = hoveredSection === index;
          return (
            <div
              key={section.archetype}
              className={`absolute top-0 h-full transition-all duration-500 cursor-pointer ${
                section.rank === 'primary' ? 'bg-[#F6F951]' :
                section.rank === 'secondary' ? 'bg-[#2d5a5a]' : 'bg-[#717182]'
              } ${isHovered ? 'brightness-110 z-10' : ''}`}
              style={{
                left: `${section.startPercentage}%`,
                width: `${section.percentage}%`
              }}
              onMouseEnter={() => setHoveredSection(index)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              {/* Percentage label inside bar */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-[#04252b]">
                  {section.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Archetype details below */}
      <div className="space-y-3">
        {sections.map((section, index) => {
          const isHovered = hoveredSection === index;
          return (
            <div 
              key={section.archetype}
              className={`flex items-center gap-3 p-2 rounded transition-all duration-200 cursor-pointer ${
                isHovered ? 'bg-white' : 'hover:bg-white/50'
              }`}
              onMouseEnter={() => setHoveredSection(index)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <div className={`w-3 h-3 rounded-full ${
                section.rank === 'primary' ? 'bg-[#F6F951]' :
                section.rank === 'secondary' ? 'bg-[#2d5a5a]' : 'bg-[#717182]'
              }`}></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-[#04252b]">
                  {section.archetype}
                </div>
                <div className="text-xs text-[#717182]">
                  {section.definition}
                </div>
              </div>
              <div className="text-xs text-[#717182] uppercase">
                {section.rank}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 3. BRAND FORMULA VISUALIZATION
function FormulaVisualization() {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  
  return (
    <div className="bg-[#faf9f7] rounded-lg p-6">
      <div className="text-xs text-[#717182] mb-6 font-mono">
        // BRAND_CHEMICAL_COMPOSITION
      </div>
      
      {/* Chemical formula style */}
      <div className="flex items-center justify-center mb-8 font-mono">
        <div className="text-lg text-[#04252b]">BRAND =</div>
        
        {mockArchetypes.map((archetype, index) => {
          const isHovered = hoveredElement === archetype.archetype;
          const symbol = archetype.archetype.split(' ')[1]?.substring(0, 2).toUpperCase() || 
                        archetype.archetype.substring(0, 2).toUpperCase();
          
          return (
            <React.Fragment key={archetype.archetype}>
              <div 
                className={`mx-2 transition-all duration-300 cursor-pointer ${
                  isHovered ? 'scale-110' : ''
                }`}
                onMouseEnter={() => setHoveredElement(archetype.archetype)}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <div className={`relative px-3 py-2 rounded border-2 ${
                  archetype.rank === 'primary' ? 'bg-[#F6F951] border-[#F6F951]' :
                  archetype.rank === 'secondary' ? 'bg-[#2d5a5a] border-[#2d5a5a] text-white' : 
                  'bg-[#717182] border-[#717182] text-white'
                }`}>
                  <div className="text-lg font-bold">{symbol}</div>
                  <div className="absolute -bottom-1 -right-1 text-xs bg-white rounded-full w-5 h-5 flex items-center justify-center text-[#04252b] border">
                    {archetype.percentage}
                  </div>
                </div>
              </div>
              {index < mockArchetypes.length - 1 && (
                <div className="text-lg text-[#717182]">+</div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="space-y-2">
        {mockArchetypes.map((archetype) => {
          const isHovered = hoveredElement === archetype.archetype;
          const symbol = archetype.archetype.split(' ')[1]?.substring(0, 2).toUpperCase() || 
                        archetype.archetype.substring(0, 2).toUpperCase();
          
          return (
            <div 
              key={archetype.archetype}
              className={`flex items-center gap-3 p-2 rounded transition-all duration-200 cursor-pointer ${
                isHovered ? 'bg-white' : 'hover:bg-white/50'
              }`}
              onMouseEnter={() => setHoveredElement(archetype.archetype)}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <div className={`w-8 h-8 rounded border-2 flex items-center justify-center text-xs font-bold ${
                archetype.rank === 'primary' ? 'bg-[#F6F951] border-[#F6F951] text-[#04252b]' :
                archetype.rank === 'secondary' ? 'bg-[#2d5a5a] border-[#2d5a5a] text-white' : 
                'bg-[#717182] border-[#717182] text-white'
              }`}>
                {symbol}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-[#04252b]">
                  {archetype.archetype} ({archetype.percentage}%)
                </div>
                <div className="text-xs text-[#717182]">
                  {archetype.definition}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 4. LAYERED PYRAMID VISUALIZATION
function PyramidVisualization() {
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);
  
  // Sort by percentage for pyramid effect
  const sortedArchetypes = [...mockArchetypes].sort((a, b) => b.percentage - a.percentage);
  
  return (
    <div className="bg-[#faf9f7] rounded-lg p-6">
      <div className="text-xs text-[#717182] mb-6 font-mono">
        // ARCHETYPE_HIERARCHY_STRUCTURE
      </div>
      
      <div className="flex flex-col items-center space-y-2">
        {sortedArchetypes.map((archetype, index) => {
          const isHovered = hoveredLayer === archetype.archetype;
          const width = 100 - (index * 25); // Decreasing width for pyramid effect
          
          return (
            <div
              key={archetype.archetype}
              className={`relative transition-all duration-300 cursor-pointer ${
                isHovered ? 'scale-105 z-10' : ''
              }`}
              style={{ width: `${width}%` }}
              onMouseEnter={() => setHoveredLayer(archetype.archetype)}
              onMouseLeave={() => setHoveredLayer(null)}
            >
              <div className={`h-16 rounded-lg flex items-center justify-between px-4 shadow-sm border-2 ${
                archetype.rank === 'primary' ? 'bg-[#F6F951] border-[#F6F951]' :
                archetype.rank === 'secondary' ? 'bg-[#2d5a5a] border-[#2d5a5a] text-white' : 
                'bg-[#717182] border-[#717182] text-white'
              } ${isHovered ? 'shadow-lg' : ''}`}>
                <div>
                  <div className="text-sm font-medium">
                    {archetype.archetype}
                  </div>
                  <div className={`text-xs ${
                    archetype.rank === 'primary' ? 'text-[#717182]' : 'text-gray-300'
                  }`}>
                    {archetype.definition}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">
                    {archetype.percentage}%
                  </div>
                  <div className={`text-xs uppercase ${
                    archetype.rank === 'primary' ? 'text-[#717182]' : 'text-gray-300'
                  }`}>
                    {archetype.rank}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Foundation label */}
      <div className="text-center mt-4">
        <div className="text-xs text-[#717182] font-mono">
          // FOUNDATION_TO_ACCENT_HIERARCHY
        </div>
      </div>
    </div>
  );
}

// CURRENT BASIC CIRCLES (for comparison)
function CurrentVisualization() {
  return (
    <div className="bg-[#faf9f7] rounded-lg p-6">
      <div className="text-xs text-[#717182] mb-6 font-mono">
        // CURRENT_BASIC_IMPLEMENTATION
      </div>
      <img 
        src={exampleImage} 
        alt="Current circular visualization" 
        className="w-full h-auto rounded border"
      />
      <div className="text-xs text-[#717182] mt-2 text-center">
        Basic circles with percentages - lacks sophistication
      </div>
    </div>
  );
}

export function ArchetypeVisualizationShowcase() {
  const [selectedViz, setSelectedViz] = useState<string>('current');
  
  const visualizations = [
    { key: 'current', label: 'Current Basic', component: CurrentVisualization },
    { key: 'grid', label: 'Technical Grid', component: TechnicalGridVisualization },
    { key: 'spectrum', label: 'Brand Spectrum', component: SpectrumVisualization },
    { key: 'formula', label: 'Chemical Formula', component: FormulaVisualization },
    { key: 'pyramid', label: 'Layered Pyramid', component: PyramidVisualization },
  ];
  
  const SelectedComponent = visualizations.find(v => v.key === selectedViz)?.component || CurrentVisualization;
  
  return (
    <div className="space-y-4">
      {/* Visualization Selector */}
      <div className="flex gap-2 flex-wrap">
        {visualizations.map((viz) => (
          <button
            key={viz.key}
            onClick={() => setSelectedViz(viz.key)}
            className={`text-xs px-3 py-2 rounded border transition-all duration-200 font-mono ${
              selectedViz === viz.key
                ? 'bg-[#F6F951] border-[#F6F951] text-[#04252b]'
                : 'bg-white border-[#e2ddd4] text-[#717182] hover:border-[#F6F951]'
            }`}
          >
            {viz.label}
          </button>
        ))}
      </div>
      
      {/* Selected Visualization */}
      <SelectedComponent />
      
      {/* Recommendation */}
      {selectedViz !== 'current' && (
        <div className="bg-white border border-[#e2ddd4] rounded-lg p-4">
          <div className="text-xs text-[#717182] mb-2 font-mono">
            // RECOMMENDATION
          </div>
          <div className="text-sm text-[#04252b]">
            {selectedViz === 'grid' && "Technical Grid: Clean, structured layout perfect for developer tools. Shows all data clearly with progress indicators."}
            {selectedViz === 'spectrum' && "Brand Spectrum: Excellent for showing proportional blend. Interactive and intuitive."}
            {selectedViz === 'formula' && "Chemical Formula: Perfect for developer aesthetic. Shows brand as calculated composition."}
            {selectedViz === 'pyramid' && "Layered Pyramid: Clear hierarchy visualization. Shows foundation vs accent archetypes."}
          </div>
        </div>
      )}
    </div>
  );
}