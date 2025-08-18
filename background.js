// Chrome Extension Background Service Worker for POKPOK.AI
// MINIMAL VERSION - NO BROKEN FUNCTIONALITY

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