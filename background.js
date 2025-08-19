/**
 * POKPOK.AI Chrome Extension v2.25.0
 * File: background.js
 * Purpose: Chrome extension background service worker (Manifest V3)
 * 
 * Key Features:
 * - Side panel activation and management
 * - Extension lifecycle management
 * - Background task coordination
 * - Minimal and stable implementation
 * 
 * Chrome APIs Used:
 * - chrome.runtime.onInstalled: Extension installation handling
 * - chrome.sidePanel.setPanelBehavior: Side panel configuration
 * - chrome.action.onClicked: Extension icon click handling
 * - chrome.sidePanel.open: Side panel opening
 * 
 * Service Worker Pattern:
 * - Event-driven architecture (no persistent background)
 * - Lightweight and efficient resource usage
 * - Manifest V3 compliant implementation
 * 
 * Integration Points:
 * - analysis-simple.html: Main extension interface
 * - Content scripts: Page interaction capabilities
 * - Storage API: Settings persistence
 * 
 * Last Updated: August 2024
 */

// Enable side panel on extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('POKPOK.AI extension installed');
  
  // Enable side panel for all tabs
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  // Open the side panel
  try {
    await chrome.sidePanel.open({ tabId: tab.id });
    console.log('Side panel opened for tab:', tab.id);
  } catch (error) {
    console.error('Failed to open side panel:', error);
  }
});

// Handle tab updates to ensure side panel stays available
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Ensure side panel is available for the tab
    try {
      await chrome.sidePanel.setOptions({
        tabId: tabId,
        path: 'analysis-simple.html',
        enabled: true
      });
    } catch (error) {
      console.error('Failed to update side panel options:', error);
    }
  }
});

// Keep service worker alive
chrome.runtime.onStartup.addListener(() => {
  console.log('POKPOK.AI service worker started');
});

// Handle extension updates
chrome.runtime.onUpdateAvailable.addListener(() => {
  console.log('POKPOK.AI extension update available');
});