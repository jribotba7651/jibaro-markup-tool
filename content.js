// Content script to interact with web pages

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSelectedText') {
        const selectedText = window.getSelection().toString();
        sendResponse({ selectedText: selectedText });
    }
    else if (request.action === 'replaceSelectedText') {
        const success = replaceSelectedText(request.text);
        sendResponse({ success: success });
    }

    return true; // Keep message channel open for async response
});

// Replace selected text with cleaned version
function replaceSelectedText(newText) {
    try {
        const selection = window.getSelection();

        if (!selection.rangeCount) {
            return false;
        }

        const range = selection.getRangeAt(0);

        // Check if selection is in an editable element
        const activeElement = document.activeElement;
        const isEditable = activeElement && (
            activeElement.isContentEditable ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.tagName === 'INPUT'
        );

        if (isEditable) {
            // Handle input/textarea
            if (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT') {
                const start = activeElement.selectionStart;
                const end = activeElement.selectionEnd;
                const text = activeElement.value;

                activeElement.value = text.substring(0, start) + newText + text.substring(end);

                // Set cursor position after inserted text
                activeElement.selectionStart = activeElement.selectionEnd = start + newText.length;

                // Trigger input event for frameworks that listen to it
                activeElement.dispatchEvent(new Event('input', { bubbles: true }));
            }
            // Handle contentEditable
            else if (activeElement.isContentEditable) {
                range.deleteContents();

                // Preserve line breaks in contentEditable
                const lines = newText.split('\n');
                const fragment = document.createDocumentFragment();

                lines.forEach((line, index) => {
                    fragment.appendChild(document.createTextNode(line));
                    if (index < lines.length - 1) {
                        fragment.appendChild(document.createElement('br'));
                    }
                });

                range.insertNode(fragment);

                // Move cursor to end of inserted text
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }

            return true;
        } else {
            // For non-editable content, try to copy to clipboard as fallback
            navigator.clipboard.writeText(newText);
            return true;
        }
    } catch (error) {
        console.error('Error replacing text:', error);
        return false;
    }
}

// Context menu support (optional enhancement)
document.addEventListener('mouseup', () => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
        // Could add context menu here in the future
    }
});
