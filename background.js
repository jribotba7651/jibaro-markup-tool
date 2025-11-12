// Background service worker for Chrome extension
// Installation handler
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Jibaro Rich Text Converter installed successfully!');
        // Set default options
        chrome.storage.sync.set({
            removeHtml: true,
            removeMarkdown: true,
            removeCitations: true,
            normalizeWhitespace: true,
            convertTables: true
        });
    } else if (details.reason === 'update') {
        console.log('Jibaro Rich Text Converter updated!');
    }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getOptions') {
        chrome.storage.sync.get({
            removeHtml: true,
            removeMarkdown: true,
            removeCitations: true,
            normalizeWhitespace: true,
            convertTables: true
        }, (items) => {
            sendResponse(items);
        });
        return true; // Keep message channel open
    }
});