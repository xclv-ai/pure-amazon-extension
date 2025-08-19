// WhiteLabelSettings.js - White label brand management
// Handles brand switching between PokPok and DR
// 
// v2.39.0 FIX: Brand selection now persists correctly across extension reloads
// The persistence issue was resolved by fixing SettingsManager.js validation logic

window.WhiteLabelSettings = (function() {
    'use strict';

    // State
    let currentBrand = 'pokpok'; // Default brand
    let brandToggle = null;
    let initialized = false;

    // Brand configurations
    const brands = {
        pokpok: {
            name: 'POKPOK.AI',
            displayName: 'PokPok',
            logo: 'animated',
            logoHtml: '<span>[—</span><span class="logo-symbol" id="logoSymbol">*</span><span>—]</span>',
            text: 'POKPOK.AI',
            primaryColor: '#f6f951', // Yellow
            description: 'Original POKPOK.AI branding with yellow accent'
        },
        dr: {
            name: 'Dragon Rouge',
            displayName: 'DR',
            logo: 'logos/dr.svg',
            logoHtml: '<img src="logos/dr.svg" class="dr-logo" alt="DR">',
            text: 'Dragon Rouge',
            primaryColor: '#2d5a5a', // Teal
            description: 'Dragon Rouge professional branding with teal accent'
        }
    };

    // Initialize white label settings
    function initialize() {
        if (initialized) return;
        
        console.log('🎨 WhiteLabelSettings initializing...');
        
        // Create white label UI
        createWhiteLabelUI();
        
        // Set up event listeners first
        setupEventListeners();
        
        // Load saved brand preference (this will be called again when settings load)
        loadBrandPreference();
        
        initialized = true;
        console.log('🎨 WhiteLabelSettings module initialized');
    }

    // Create white label UI
    function createWhiteLabelUI() {
        const container = document.querySelector('.white-label-content');
        if (!container) return;
        
        container.innerHTML = `
            <div class="settings-section">
                <div class="section-label">
                    <span class="bracket">[ ]</span> BRAND SELECTION
                </div>
                
                <div class="brand-toggle-container">
                    <span class="brand-toggle-label">PokPok</span>
                    <div class="brand-toggle-switch" id="brandToggle">
                        <div class="brand-toggle-handle"></div>
                    </div>
                    <span class="brand-toggle-label">DR</span>
                </div>
                
                <div class="white-label-info">
                    <h4>Current Brand Settings</h4>
                    <p id="brandDescription">Original POKPOK.AI branding with yellow accent</p>
                </div>
                
                <div class="form-group" style="margin-top: 20px;">
                    <button type="button" class="btn btn-primary" id="applyBrandBtn" style="width: 100%;">
                        Apply Brand Changes
                    </button>
                </div>
                
                <div class="security-notice" style="margin-top: 20px;">
                    <div class="notice-icon">ℹ️</div>
                    <div class="notice-text">
                        <strong>Note:</strong> Brand changes will update the extension's appearance throughout the interface. 
                        The selected brand will be saved and persist across sessions.
                    </div>
                </div>
            </div>
        `;
        
        // Get toggle element
        brandToggle = document.getElementById('brandToggle');
    }

    // Set up event listeners
    function setupEventListeners() {
        // Brand toggle click
        const toggle = document.getElementById('brandToggle');
        if (toggle) {
            toggle.addEventListener('click', handleToggleClick);
        }
        
        // Apply button click
        const applyBtn = document.getElementById('applyBrandBtn');
        if (applyBtn) {
            console.log('🎨 Apply button found, attaching event listener');
            applyBtn.addEventListener('click', handleApplyBrand);
        } else {
            console.error('🎨 Apply button not found! ID: applyBrandBtn');
        }
        
        // Listen for settings loaded event
        document.addEventListener('settingsLoaded', (event) => {
            console.log('🎨 settingsLoaded event received:', event.detail);
            if (event.detail && event.detail.settings) {
                loadBrandFromSettings(event.detail.settings);
            }
        });
        
        // Also check if settings are already loaded (in case event was missed)
        setTimeout(() => {
            if (window.pokpokSettings) {
                console.log('🎨 Settings found in timeout check, loading brand...');
                loadBrandFromSettings(window.pokpokSettings);
            }
        }, 1000);
    }

    // Handle toggle click
    function handleToggleClick() {
        const oldBrand = currentBrand;
        // Toggle brand
        currentBrand = currentBrand === 'pokpok' ? 'dr' : 'pokpok';
        console.log('🎨 Brand toggle clicked:', oldBrand, '→', currentBrand);
        
        // Update UI
        updateToggleUI();
        updateBrandInfo();
    }

    // Update toggle UI
    function updateToggleUI() {
        const toggle = document.getElementById('brandToggle');
        
        if (toggle) {
            if (currentBrand === 'dr') {
                toggle.classList.add('active');
            } else {
                toggle.classList.remove('active');
            }
        }
    }

    // Update brand information display
    function updateBrandInfo() {
        const description = document.getElementById('brandDescription');
        if (description) {
            description.textContent = brands[currentBrand].description;
        }
    }

    // Handle apply brand
    async function handleApplyBrand() {
        console.log('🎨 Apply Brand Changes button clicked!');
        console.log('🎨 Current brand to save:', currentBrand);
        
        try {
            // Save brand preference
            console.log('🎨 About to call saveBrandPreference...');
            await saveBrandPreference();
            console.log('🎨 saveBrandPreference completed');
            
            // Apply brand changes to UI
            console.log('🎨 Applying brand to UI...');
            applyBrandToUI();
            
            // Show success notification
            showNotification('Brand changes applied successfully!', 'success');
            
            // Dispatch brand change event
            const brandChangeEvent = new CustomEvent('brandChange', {
                detail: { brand: currentBrand }
            });
            document.dispatchEvent(brandChangeEvent);
            console.log('🎨 Brand change process completed successfully');
            
        } catch (error) {
            console.error('🎨 Failed to apply brand:', error);
            showNotification('Failed to apply brand changes', 'error');
        }
    }

    // Apply brand to UI elements
    function applyBrandToUI() {
        const brand = brands[currentBrand];
        
        // Update logo text in header
        const logoContainer = document.querySelector('.logo-text');
        if (logoContainer) {
            if (currentBrand === 'pokpok') {
                logoContainer.innerHTML = brand.logoHtml + '<span> ' + brand.text + '</span>';
                logoContainer.className = 'logo-text';
                // Restore logo animation functionality for PokPok
                const logoSymbol = document.getElementById('logoSymbol');
                if (logoSymbol) {
                    // Logo animation is triggered by clicking, no need to start automatically
                    console.log('PokPok logo restored with animation capability');
                }
            } else {
                logoContainer.innerHTML = brand.logoHtml + '<span class="dr-text"> ' + brand.text + '</span>';
                logoContainer.className = 'logo-text dr-brand';
            }
        }
        
        // Update settings title
        const settingsTitle = document.querySelector('.settings-title');
        if (settingsTitle) {
            settingsTitle.innerHTML = `<span class="bracket">[*]</span> SETTINGS - ${brand.displayName}`;
        }
        
        // Update version text
        const versionText = document.getElementById('versionText');
        if (versionText) {
            versionText.textContent = `${brand.name} v${window.POKPOK_VERSION || "2.50.0"}`;
        }
        
        // Update extension title
        const extensionTitle = document.querySelector('title');
        if (extensionTitle) {
            extensionTitle.textContent = `${brand.name} - Tone Analysis`;
        }
        
        // Apply color scheme
        document.documentElement.style.setProperty('--brand-accent-primary', brand.primaryColor);
    }

    // Load saved brand preference
    async function loadBrandPreference() {
        try {
            console.log('🎨 Loading brand preference...');
            
            // First check if global settings are already available
            if (window.pokpokSettings) {
                console.log('🎨 Using global settings:', window.pokpokSettings);
                loadBrandFromSettings(window.pokpokSettings);
                return;
            }
            
            // Otherwise try direct storage access
            if (window.POKPOK && window.POKPOK.storage) {
                console.log('🎨 Loading from Chrome storage...');
                const settings = await window.POKPOK.storage.loadSettings();
                if (settings) {
                    console.log('🎨 Loaded settings from storage:', settings);
                    loadBrandFromSettings(settings);
                } else {
                    console.log('🎨 No settings found in storage');
                }
            } else {
                console.warn('🎨 Chrome storage not available');
            }
        } catch (error) {
            console.warn('🎨 Failed to load brand preference:', error);
        }
    }
    
    // Load brand from settings object
    function loadBrandFromSettings(settings) {
        console.log('🎨 loadBrandFromSettings called with:', settings);
        console.log('🎨 Settings keys:', settings ? Object.keys(settings) : 'null');
        console.log('🎨 whiteLabelBrand value:', settings?.whiteLabelBrand);
        
        if (settings && settings.whiteLabelBrand) {
            currentBrand = settings.whiteLabelBrand;
            console.log('🎨 Brand loaded from settings:', currentBrand);
            updateToggleUI();
            updateBrandInfo();
            applyBrandToUI();
            console.log('🎨 Brand applied to UI successfully');
        } else {
            console.log('🎨 No whiteLabelBrand in settings, using default:', currentBrand);
            // Still update UI with default brand
            updateToggleUI();
            updateBrandInfo();
            applyBrandToUI();
        }
    }

    // Save brand preference
    async function saveBrandPreference() {
        try {
            console.log('🎨 Saving brand preference:', currentBrand);
            
            if (window.POKPOK && window.POKPOK.storage) {
                const settings = await window.POKPOK.storage.loadSettings() || {};
                console.log('🎨 Current settings before save:', settings);
                console.log('🎨 Settings keys before save:', Object.keys(settings));
                
                settings.whiteLabelBrand = currentBrand;
                console.log('🎨 Settings after adding whiteLabelBrand:', settings);
                console.log('🎨 Settings keys after adding whiteLabelBrand:', Object.keys(settings));
                console.log('🎨 Confirming whiteLabelBrand value:', settings.whiteLabelBrand);
                
                await window.POKPOK.storage.saveSettings(settings);
                console.log('🎨 Brand preference saved successfully');
                
                // Verify it was saved - check Chrome storage directly
                const directVerify = await chrome.storage.local.get(['pokpokSettings']);
                console.log('🎨 Direct Chrome storage verification:', directVerify);
                
                // Also verify through our API
                const verifySettings = await window.POKPOK.storage.loadSettings();
                console.log('🎨 Verification - settings after save:', verifySettings);
                console.log('🎨 Verification - whiteLabelBrand preserved:', verifySettings?.whiteLabelBrand);
            } else {
                console.error('🎨 Cannot save: POKPOK storage not available');
            }
        } catch (error) {
            console.error('🎨 Error saving brand preference:', error);
        }
    }

    // Show notification
    function showNotification(message, type = 'info') {
        // Reuse notification system from Settings module
        if (window.Settings && typeof window.Settings.showNotification === 'function') {
            window.Settings.showNotification(message, type);
        } else {
            // Fallback to simple notification
            const notification = document.createElement('div');
            notification.className = `settings-notification settings-notification-${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 16px;
                border-radius: 4px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
                z-index: 10000;
                background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
                color: ${type === 'success' ? '#155724' : '#721c24'};
                border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 3000);
        }
    }

    // Get current brand
    function getCurrentBrand() {
        return currentBrand;
    }

    // Get brand configuration
    function getBrandConfig(brandName) {
        return brands[brandName] || brands.pokpok;
    }

    // Public API
    return {
        initialize: initialize,
        getCurrentBrand: getCurrentBrand,
        getBrandConfig: getBrandConfig,
        applyBrandToUI: applyBrandToUI
    };
})();