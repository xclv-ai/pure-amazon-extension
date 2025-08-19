// Visual Identity Updater - Dynamically update color palette in Visual Identity section
// Preserves existing HTML structure while updating colors and descriptions

class VisualIdentityUpdater {
    constructor() {
        this.colorItems = null;
        this.descriptionElement = null;
        this.sectionToggle = null;
        this.initializeElements();
    }

    initializeElements() {
        // Find the color palette elements
        const colorPalette = document.querySelector('.color-palette');
        if (colorPalette) {
            this.colorItems = colorPalette.querySelectorAll('.color-item');
        }
        
        // Find the description element
        this.descriptionElement = document.querySelector('.color-description');
        
        // Find the section toggle to mark as updated
        const primaryPaletteSection = document.querySelector('.section-title').closest('.section-header');
        if (primaryPaletteSection) {
            this.sectionToggle = primaryPaletteSection.querySelector('.section-toggle');
        }
        
        console.log(`Visual Identity Updater initialized with ${this.colorItems ? this.colorItems.length : 0} color items`);
    }

    // Update a single color circle and hex value
    updateColorItem(index, colorData) {
        if (!this.colorItems || index >= this.colorItems.length) {
            console.warn(`Cannot update color item ${index}: not found`);
            return false;
        }

        const colorItem = this.colorItems[index];
        const colorCircle = colorItem.querySelector('.color-circle');
        const hexLabel = colorItem.querySelector('.color-hex');

        if (!colorCircle || !hexLabel) {
            console.warn(`Color item ${index} missing circle or hex elements`);
            return false;
        }

        try {
            // Update the color circle background
            colorCircle.style.backgroundColor = colorData.hex;
            
            // Update the hex label
            hexLabel.textContent = colorData.hex;
            
            // Add a subtle animation to indicate the change
            colorCircle.style.transition = 'background-color 0.5s ease-in-out, transform 0.2s ease-in-out';
            colorCircle.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                colorCircle.style.transform = 'scale(1)';
            }, 200);

            console.log(`Updated color item ${index} with ${colorData.hex}`);
            return true;

        } catch (error) {
            console.error(`Error updating color item ${index}:`, error);
            return false;
        }
    }

    // Update the color description text
    updateDescription(newDescription) {
        if (!this.descriptionElement) {
            console.warn('Description element not found');
            return false;
        }

        try {
            // Add fade transition
            this.descriptionElement.style.transition = 'opacity 0.3s ease-in-out';
            this.descriptionElement.style.opacity = '0.5';
            
            setTimeout(() => {
                this.descriptionElement.textContent = newDescription;
                this.descriptionElement.style.opacity = '1';
            }, 150);

            console.log('Updated color description');
            return true;

        } catch (error) {
            console.error('Error updating description:', error);
            return false;
        }
    }

    // Mark the section as analyzed/updated
    markSectionAsAnalyzed() {
        if (this.sectionToggle) {
            // Temporarily change the toggle to show analysis completion
            const originalText = this.sectionToggle.textContent;
            this.sectionToggle.textContent = 'analyzed';
            this.sectionToggle.style.color = 'var(--brand-success)';
            
            setTimeout(() => {
                this.sectionToggle.textContent = originalText;
                this.sectionToggle.style.color = '';
            }, 2000);
        }

        // Also update the bracket to show it's been analyzed
        const bracketElement = document.querySelector('.section-title .bracket');
        if (bracketElement && bracketElement.textContent === '[ ]') {
            bracketElement.textContent = '[*]';
            
            // Expand the section if it's collapsed
            const sectionContent = bracketElement.closest('.section-header').parentNode.querySelector('.section-content');
            const cardHeader = bracketElement.closest('.card-header');
            if (sectionContent && sectionContent.classList.contains('hidden')) {
                sectionContent.classList.remove('hidden');
                if (cardHeader) {
                    cardHeader.classList.remove('collapsed');
                    cardHeader.classList.add('pink');
                }
                this.sectionToggle.textContent = 'hide';
            }
        }
    }

    // Main function to update the entire Visual Identity section
    updateVisualIdentity(extractedColors) {
        console.log('Updating Visual Identity section with extracted colors:', extractedColors);

        let updateCount = 0;
        let errors = [];

        try {
            const totalColors = extractedColors.colors.length;
            const availableSlots = this.colorItems ? this.colorItems.length : 6;
            
            // Update each color circle (only up to available slots)
            extractedColors.colors.forEach((colorData, index) => {
                if (index < availableSlots) {
                    if (this.updateColorItem(index, colorData)) {
                        updateCount++;
                    } else {
                        errors.push(`Failed to update color ${index}`);
                    }
                } else {
                    console.log(`Skipping color ${index} - no available slot`);
                }
            });
            
            // Hide unused color slots if we have fewer colors than slots
            if (this.colorItems && totalColors < availableSlots) {
                for (let i = totalColors; i < availableSlots; i++) {
                    const colorItem = this.colorItems[i];
                    if (colorItem) {
                        colorItem.style.display = 'none';
                    }
                }
            }

            // Update the description
            if (extractedColors.description) {
                if (!this.updateDescription(extractedColors.description)) {
                    errors.push('Failed to update description');
                }
            }

            // Mark section as analyzed
            this.markSectionAsAnalyzed();

            // Log results
            console.log(`Visual Identity update completed: ${updateCount}/${totalColors} colors updated`);
            if (errors.length > 0) {
                console.warn('Update errors:', errors);
            }

            // Store the extracted data for potential future use
            this.lastExtractedColors = extractedColors;

            return {
                success: true,
                colorsUpdated: updateCount,
                errors: errors,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('Critical error updating Visual Identity:', error);
            return {
                success: false,
                colorsUpdated: updateCount,
                errors: [error.message],
                timestamp: new Date().toISOString()
            };
        }
    }

    // Reset to original/default colors
    resetToDefault() {
        const defaultColors = [
            { hex: '#F6F951' },
            { hex: '#FFD700' },
            { hex: '#F5DEB3' },
            { hex: '#D2B48C' },
            { hex: '#8B4513' },
            { hex: '#f1c7d6' }
        ];

        const defaultDescription = "Predominantly warm yellows, beige, gold, and brown tones, often with pink accents for promotional text or specific claims.";

        defaultColors.forEach((colorData, index) => {
            this.updateColorItem(index, colorData);
        });

        this.updateDescription(defaultDescription);
        
        console.log('Visual Identity reset to default colors');
    }

    // Get current color state for debugging
    getCurrentColors() {
        if (!this.colorItems) return null;

        const currentColors = [];
        this.colorItems.forEach((item, index) => {
            const circle = item.querySelector('.color-circle');
            const hex = item.querySelector('.color-hex');
            
            currentColors.push({
                index: index,
                backgroundColor: circle ? circle.style.backgroundColor : 'unknown',
                hexText: hex ? hex.textContent : 'unknown'
            });
        });

        return {
            colors: currentColors,
            description: this.descriptionElement ? this.descriptionElement.textContent : 'unknown',
            lastUpdate: this.lastExtractedColors ? this.lastExtractedColors.timestamp : null
        };
    }
}

// Initialize and make globally available
window.VisualIdentityUpdater = VisualIdentityUpdater;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.visualIdentityUpdater = new VisualIdentityUpdater();
        console.log('Visual Identity Updater initialized');
    });
} else {
    window.visualIdentityUpdater = new VisualIdentityUpdater();
    console.log('Visual Identity Updater initialized');
}