import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Slider } from "./ui/slider";

interface NielsenToneValues {
  humor: number;
  formality: number;
  respect: number;
  enthusiasm: number;
}

function TechnicalSliderControl({
  label,
  value,
  leftLabel,
  rightLabel,
  onChange,
  id
}: {
  label: string;
  value: number;
  leftLabel: string;
  rightLabel: string;
  onChange: (value: number[]) => void;
  id: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-brand-text-tertiary w-6">[{id}]</span>
          <span className="text-xs font-jetbrains-medium text-brand-text-secondary w-20">{label}</span>
        </div>
        <span className="text-xs text-brand-text-secondary w-8 text-right">{value}</span>
      </div>
      
      <div className="ml-8">
        <Slider
          value={[value]}
          onValueChange={onChange}
          max={100}
          step={1}
          className="w-full"
        />
        <div className="flex items-center justify-between text-xs text-brand-text-secondary mt-1">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      </div>
    </div>
  );
}

export function ToneOfVoiceSliders() {
  const [isOpen, setIsOpen] = useState(false);
  const [toneValues, setToneValues] = useState<NielsenToneValues>({
    humor: 30,
    formality: 60,
    respect: 80,
    enthusiasm: 50
  });

  const handleSliderChange = (key: keyof NielsenToneValues, value: number[]) => {
    setToneValues(prev => ({
      ...prev,
      [key]: value[0]
    }));
  };

  const resetToDefaults = () => {
    setToneValues({
      humor: 30,
      formality: 60,
      respect: 80,
      enthusiasm: 50
    });
  };

  const nielsenSliderConfig = [
    {
      key: 'formality' as keyof NielsenToneValues,
      label: 'FORMALITY',
      leftLabel: 'Casual',
      rightLabel: 'Formal',
      value: toneValues.formality
    },
    {
      key: 'humor' as keyof NielsenToneValues,
      label: 'HUMOR',
      leftLabel: 'Serious',
      rightLabel: 'Funny',
      value: toneValues.humor
    },
    {
      key: 'respect' as keyof NielsenToneValues,
      label: 'RESPECT',
      leftLabel: 'Irreverent',
      rightLabel: 'Respectful',
      value: toneValues.respect
    },
    {
      key: 'enthusiasm' as keyof NielsenToneValues,
      label: 'ENTHUSIASM',
      leftLabel: 'Matter-of-fact',
      rightLabel: 'Enthusiastic',
      value: toneValues.enthusiasm
    }
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button 
          className="text-xs font-jetbrains-normal text-brand-text-secondary hover:text-brand-text-primary transition-colors cursor-pointer"
        >
          v2.0
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="center" side="top" sideOffset={10}>
        <div className="bg-brand-bg-card border border-brand-border-light">
          {/* Header */}
          <div className="border-b border-brand-border-light px-4 py-3">
            <div className="text-xs font-jetbrains-medium text-brand-text-primary">
              [ ] TONETOOLS.CONTROL
            </div>
            <div className="text-xs text-brand-text-secondary mt-1">
              /NIELSEN/4DIMENSIONS
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 space-y-4">
            <div className="text-xs font-jetbrains-medium text-brand-text-primary mb-3">
              /PARAMETERS
            </div>
            
            {nielsenSliderConfig.map((config, index) => (
              <TechnicalSliderControl
                key={config.key}
                id={index + 1}
                label={config.label}
                value={config.value}
                leftLabel={config.leftLabel}
                rightLabel={config.rightLabel}
                onChange={(value) => handleSliderChange(config.key, value)}
              />
            ))}
          </div>

          {/* Current Values */}
          <div className="border-t border-brand-border-light p-4">
            <div className="text-xs font-jetbrains-medium text-brand-text-primary mb-2">
              /CURRENT
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {nielsenSliderConfig.map((config, index) => (
                <div key={config.key} className="flex justify-between">
                  <span className="text-brand-text-secondary">[{index + 1}] {config.label}:</span>
                  <span className="text-brand-text-primary">{config.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-brand-border-light p-4 flex justify-between items-center">
            <button
              onClick={resetToDefaults}
              className="text-xs text-brand-text-secondary hover:text-brand-text-primary transition-colors"
            >
              [R] Reset
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs px-3 py-1 border border-brand-border-light hover:bg-brand-bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs px-3 py-1 bg-brand-text-primary text-brand-bg-card hover:bg-gray-800 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}