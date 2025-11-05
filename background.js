// Background service worker for Chrome extension

// Installation handler
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Jibaro Markup Cleaner installed successfully!');

        // Set default options
        chrome.storage.sync.set({
            removeHtml: true,
            removeMarkdown: true,
            removeCitations: true,
            normalizeWhitespace: true,
            convertTables: true
        });
    } else if (details.reason === 'update') {
        console.log('Jibaro Markup Cleaner updated!');
    }

    // Create context menu
    try {
        chrome.contextMenus.create({
            id: 'cleanSelectedText',
            title: 'Clean markup from "%s"',
            contexts: ['selection']
        });
    } catch (e) {
        // Context menu already exists, ignore error
    }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'cleanSelectedText') {
        // Send message to content script to get and clean selected text
        chrome.tabs.sendMessage(tab.id, {
            action: 'cleanAndReplace',
            selectedText: info.selectionText
        });
    }
});

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getOptions') {
        chrome.storage.sync.get({
            removeHtml: true,
            removeMarkdown: true,
            removeCitations: true,
            normalizeWhitespace: true
        }, (items) => {
            sendResponse(items);
        });
        return true; // Keep message channel open
    }
});

// Keyboard shortcut listener (if defined in manifest)
chrome.commands.onCommand.addListener((command) => {
    if (command === 'clean-selected') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'cleanSelected' });
        });
    }
});
