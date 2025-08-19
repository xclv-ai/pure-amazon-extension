// Color Extractor - Process CSS colors from webpage elements
// Simple frequency-based color selection and formatting

class ColorExtractor {
    constructor() {
        console.log('ColorExtractor initialized for CSS color processing');
    }

    // Convert hex color to RGB array  
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    }

    // Convert RGB to HEX
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    // Generate color description based on extracted palette
    generateColorDescription(hexColors) {
        const colorNames = [];
        const colorCategories = {
            warm: 0,
            cool: 0,
            neutral: 0,
            bright: 0,
            dark: 0
        };

        hexColors.forEach(hex => {
            const rgb = this.hexToRgb(hex);
            if (!rgb) return;
            
            const [r, g, b] = rgb;
            const brightness = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
            
            // Categorize colors
            if (brightness > 180) colorCategories.bright++;
            else if (brightness < 80) colorCategories.dark++;
            
            if (r > g && r > b) {
                if (g > 100) colorNames.push('orange');
                else colorNames.push('red');
                colorCategories.warm++;
            } else if (g > r && g > b) {
                colorNames.push('green');
                colorCategories.cool++;
            } else if (b > r && b > g) {
                colorNames.push('blue');
                colorCategories.cool++;
            } else if (Math.abs(r - g) < 30 && Math.abs(g - b) < 30) {
                if (brightness > 150) colorNames.push('light gray');
                else if (brightness < 80) colorNames.push('dark gray');
                else colorNames.push('gray');
                colorCategories.neutral++;
            }
        });

        // Generate description
        const uniqueNames = [...new Set(colorNames)];
        const dominantCategory = Object.keys(colorCategories).reduce((a, b) => 
            colorCategories[a] > colorCategories[b] ? a : b
        );

        let description = "Predominantly ";
        if (dominantCategory === 'warm') description += "warm tones including ";
        else if (dominantCategory === 'cool') description += "cool tones including ";
        else if (dominantCategory === 'bright') description += "bright colors including ";
        else if (dominantCategory === 'dark') description += "dark tones including ";
        else description += "neutral colors including ";

        description += uniqueNames.slice(0, 3).join(', ');
        description += ", creating a ";
        
        if (colorCategories.bright > colorCategories.dark) description += "vibrant and energetic";
        else if (colorCategories.dark > colorCategories.bright) description += "sophisticated and subtle";
        else description += "balanced and harmonious";
        
        description += " visual identity.";

        return description;
    }

    // Main extraction function - process CSS color strings
    async extractColorsFromCSS(cssColors) {
        console.log('Processing CSS colors:', cssColors);
        
        try {
            if (!cssColors || cssColors.length === 0) {
                console.warn('No CSS colors provided, using fallback colors');
                return this.getFallbackColors();
            }
            
            // Use only the unique colors we actually found (no padding to 6)
            const finalColors = [...new Set(cssColors)]; // Remove duplicates just in case
            
            // Generate result object
            const result = {
                colors: finalColors.map(hex => {
                    const rgb = this.hexToRgb(hex);
                    return {
                        rgb: rgb,
                        hex: hex
                    };
                }),
                description: this.generateColorDescription(finalColors),
                timestamp: new Date().toISOString()
            };
            
            console.log('CSS color processing completed:', result);
            return result;
            
        } catch (error) {
            console.error('Error processing CSS colors:', error);
            return this.getFallbackColors();
        }
    }

    // Fallback colors if extraction fails
    getFallbackColors() {
        return {
            colors: [
                { rgb: [70, 130, 180], hex: '#4682B4' },
                { rgb: [255, 140, 0], hex: '#FF8C00' },
                { rgb: [50, 205, 50], hex: '#32CD32' },
                { rgb: [220, 20, 60], hex: '#DC143C' },
                { rgb: [138, 43, 226], hex: '#8A2BE2' },
                { rgb: [255, 215, 0], hex: '#FFD700' }
            ],
            description: "Standard web colors providing good contrast and visual appeal for digital interfaces.",
            timestamp: new Date().toISOString()
        };
    }
}

// Make ColorExtractor globally available
window.ColorExtractor = ColorExtractor;