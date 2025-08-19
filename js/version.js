/**
 * POKPOK.AI Chrome Extension - Centralized Version Management
 * File: js/version.js
 * Purpose: Single source of truth for version number
 * 
 * This file contains the centralized version number that is used throughout
 * the extension to ensure consistency across all displays, metadata, and logs.
 * 
 * To update the extension version:
 * 1. Change the version number below
 * 2. Update manifest.json to match (Chrome requirement)
 * 3. All other references will automatically update
 */

// CENTRALIZED VERSION NUMBER - UPDATE THIS ONE PLACE ONLY
window.POKPOK_VERSION = "2.53.0";

// Make version available for console debugging
console.log(`🔧 POKPOK.AI Extension Version: ${window.POKPOK_VERSION}`);