// DOM Elements
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const outputSection = document.getElementById('outputSection');
const cleanSelectedBtn = document.getElementById('cleanSelectedBtn');
const cleanManualBtn = document.getElementById('cleanManualBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const replaceBtn = document.getElementById('replaceBtn');
const charCount = document.getElementById('charCount');
const statusMessage = document.getElementById('statusMessage');

// Checkbox elements
const removeHtml = document.getElementById('removeHtml');
const removeMarkdown = document.getElementById('removeMarkdown');
const removeCitations = document.getElementById('removeCitations');
const normalizeWhitespace = document.getElementById('normalizeWhitespace');
const convertTables = document.getElementById('convertTables');

// Load saved options
chrome.storage.sync.get({
    removeHtml: true,
    removeMarkdown: true,
    removeCitations: true,
    normalizeWhitespace: true,
    convertTables: true
}, (items) => {
    removeHtml.checked = items.removeHtml;
    removeMarkdown.checked = items.removeMarkdown;
    removeCitations.checked = items.removeCitations;
    normalizeWhitespace.checked = items.normalizeWhitespace;
    convertTables.checked = items.convertTables;
});

// Save options when changed
[removeHtml, removeMarkdown, removeCitations, normalizeWhitespace, convertTables].forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        chrome.storage.sync.set({
            removeHtml: removeHtml.checked,
            removeMarkdown: removeMarkdown.checked,
            removeCitations: removeCitations.checked,
            normalizeWhitespace: normalizeWhitespace.checked,
            convertTables: convertTables.checked
        });
    });
});

// Show status message
function showStatus(message, type = 'success', duration = 3000) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type} show`;
    setTimeout(() => {
        statusMessage.classList.remove('show');
    }, duration);
}

// Update character count
function updateCharCount() {
    const count = outputText.value.length;
    charCount.textContent = `${count} characters`;
}

// Clean HTML tags - ALWAYS preserve bold and lists
function cleanHtmlTags(text) {
    if (!removeHtml.checked) return text;

    // ALWAYS convert <b>, <strong> to **
    text = text.replace(/<(b|strong)>(.*?)<\/(b|strong)>/gi, '**$2**');

    // ALWAYS convert <li> to bullets
    text = text.replace(/<li>(.*?)<\/li>/gi, '• $1\n');
    text = text.replace(/<ul>|<\/ul>|<ol>|<\/ol>/gi, '');

    // Remove all other HTML tags
    text = text.replace(/<[^>]*>/g, '');

    // Decode HTML entities
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    text = textarea.value;

    return text;
}

// Clean Markdown formatting - ALWAYS preserve ** and bullets, keep ---
function cleanMarkdownFormat(text) {
    if (!removeMarkdown.checked) return text;

    // Remove headers (# symbols) but keep the text
    text = text.replace(/^#{1,6}\s+/gm, '');

    // ALWAYS normalize all bold variations to **text** format
    text = text.replace(/\*\*\*(.+?)\*\*\*/g, '**$1**'); // *** to **
    text = text.replace(/___(.+?)___/g, '**$1**'); // ___ to **
    text = text.replace(/__(.+?)__/g, '**$1**'); // __ to **
    // ** stays as **

    // Remove italic (single * or _) but preserve bold
    text = text.replace(/([^\*])\*([^\*]+?)\*([^\*])/g, '$1$2$3');
    text = text.replace(/([^_])_([^_]+?)_([^_])/g, '$1$2$3');

    // Remove links but keep text
    text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

    // Remove images
    text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1');

    // Remove code blocks and inline code
    text = text.replace(/```[\s\S]*?```/g, '');
    text = text.replace(/`([^`]+)`/g, '$1');

    // KEEP horizontal rules (--- separators) - DON'T remove them
    // text = text.replace(/^(-{3,}|_{3,}|\*{3,})$/gm, ''); // COMMENTED OUT

    // Remove blockquotes
    text = text.replace(/^>\s+/gm, '');

    // ALWAYS convert list markers to bullets
    text = text.replace(/^[\*\-\+]\s+/gm, '• ');
    text = text.replace(/^\d+\.\s+/gm, '• ');

    return text;
}

// Clean citations
function cleanCitationsFormat(text) {
    if (!removeCitations.checked) return text;

    // Remove citations in brackets
    text = text.replace(/\[\d+\]/g, '');
    text = text.replace(/\[[^\]]*citation[^\]]*\]/gi, '');

    // Remove superscript citations
    text = text.replace(/\^?\[\d+\]/g, '');

    // Remove parenthetical citations
    text = text.replace(/\(\d{4}\)/g, '');
    text = text.replace(/\([A-Z][a-z]+,?\s*\d{4}\)/g, '');

    // Remove numbered superscripts
    text = text.replace(/⁰|¹|²|³|⁴|⁵|⁶|⁷|⁸|⁹/g, '');

    return text;
}

// Normalize whitespace - SIMPLE AND SAFE
function cleanWhitespaceFormat(text) {
    if (!normalizeWhitespace.checked) return text;

    // Normalize line endings
    text = text.replace(/\r\n/g, '\n');
    text = text.replace(/\r/g, '\n');

    // Replace multiple spaces (but NOT line breaks) with single space
    text = text.replace(/ {2,}/g, ' ');

    // Replace excessive blank lines (3+ empty lines) with 2 empty lines
    text = text.replace(/\n{4,}/g, '\n\n\n');

    // Remove trailing spaces from each line
    text = text.split('\n').map(line => line.trimEnd()).join('\n');

    // Remove leading/trailing whitespace from entire text
    text = text.trim();

    return text;
}

// Convert Markdown tables to formatted text tables
function convertMarkdownTables(text) {
    // Find all markdown tables
    const tableRegex = /\|.+\|[\r\n]+\|[-:\s|]+\|[\r\n]+((?:\|.+\|[\r\n]*)+)/g;

    return text.replace(tableRegex, (match) => {
        const lines = match.trim().split(/[\r\n]+/).filter(line => line.trim());

        if (lines.length < 3) return match; // Not a valid table

        // Parse header
        const headers = lines[0].split('|').map(h => h.trim()).filter(h => h);

        // Skip separator line (line 1)

        // Parse data rows
        const rows = [];
        for (let i = 2; i < lines.length; i++) {
            const cells = lines[i].split('|').map(c => c.trim()).filter(c => c);
            if (cells.length > 0) {
                rows.push(cells);
            }
        }

        // Calculate column widths
        const colWidths = headers.map((h, i) => {
            let maxWidth = h.length;
            rows.forEach(row => {
                if (row[i] && row[i].length > maxWidth) {
                    maxWidth = row[i].length;
                }
            });
            return Math.min(maxWidth + 2, 50); // Max 50 chars per column
        });

        // Build formatted table
        let result = '\n';

        // Top border
        result += '┌' + colWidths.map(w => '─'.repeat(w)).join('┬') + '┐\n';

        // Header row
        result += '│' + headers.map((h, i) => h.padEnd(colWidths[i])).join('│') + '│\n';

        // Header separator
        result += '├' + colWidths.map(w => '─'.repeat(w)).join('┼') + '┤\n';

        // Data rows with gridlines between each row
        rows.forEach((row, rowIndex) => {
            result += '│';
            for (let i = 0; i < headers.length; i++) {
                const cell = row[i] || '';
                result += cell.padEnd(colWidths[i]) + '│';
            }
            result += '\n';

            // Add gridline between rows (except after last row)
            if (rowIndex < rows.length - 1) {
                result += '├' + colWidths.map(w => '─'.repeat(w)).join('┼') + '┤\n';
            }
        });

        // Bottom border
        result += '└' + colWidths.map(w => '─'.repeat(w)).join('┴') + '┘\n';

        return result;
    });
}

// Main cleaning function
function cleanText(text) {
    text = cleanHtmlTags(text);
    text = cleanMarkdownFormat(text);
    text = cleanCitationsFormat(text);

    // Convert tables only if option is checked
    if (convertTables.checked) {
        text = convertMarkdownTables(text);
    }

    text = cleanWhitespaceFormat(text);
    return text;
}

// Clean selected text from page
cleanSelectedBtn.addEventListener('click', async () => {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.tabs.sendMessage(tab.id, { action: 'getSelectedText' }, (response) => {
            if (chrome.runtime.lastError) {
                showStatus('Error: Could not access page content', 'error');
                return;
            }

            if (response && response.selectedText) {
                const cleaned = cleanText(response.selectedText);
                outputText.value = cleaned;
                outputSection.style.display = 'block';
                updateCharCount();
                showStatus('Selected text cleaned successfully!', 'success');
            } else {
                showStatus('No text selected on page', 'info');
            }
        });
    } catch (error) {
        showStatus('Error accessing page', 'error');
    }
});

// Clean manual input
cleanManualBtn.addEventListener('click', () => {
    const text = inputText.value.trim();

    if (!text) {
        showStatus('Please enter some text to clean', 'info');
        return;
    }

    const cleaned = cleanText(text);
    outputText.value = cleaned;
    outputSection.style.display = 'block';
    updateCharCount();
    showStatus('Text cleaned successfully!', 'success');
});

// Clear all
clearBtn.addEventListener('click', () => {
    inputText.value = '';
    outputText.value = '';
    outputSection.style.display = 'none';
    showStatus('Cleared', 'info', 1500);
});

// Copy to clipboard
copyBtn.addEventListener('click', async () => {
    if (!outputText.value) {
        showStatus('No text to copy', 'info');
        return;
    }

    try {
        await navigator.clipboard.writeText(outputText.value);
        showStatus('Copied to clipboard!', 'success', 2000);
    } catch (error) {
        // Fallback
        outputText.select();
        document.execCommand('copy');
        showStatus('Copied to clipboard!', 'success', 2000);
    }
});

// Replace text on page
replaceBtn.addEventListener('click', async () => {
    if (!outputText.value) {
        showStatus('No text to replace with', 'info');
        return;
    }

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.tabs.sendMessage(tab.id, {
            action: 'replaceSelectedText',
            text: outputText.value
        }, (response) => {
            if (chrome.runtime.lastError) {
                showStatus('Error: Could not replace text', 'error');
                return;
            }

            if (response && response.success) {
                showStatus('Text replaced on page!', 'success');
            } else {
                showStatus('Could not replace text', 'error');
            }
        });
    } catch (error) {
        showStatus('Error replacing text', 'error');
    }
});

// About link
document.getElementById('aboutLink').addEventListener('click', (e) => {
    e.preventDefault();
    const aboutText = `Jibaro Markup Cleaner v1.0.0

A powerful tool to remove HTML, Markdown, citations, and other markup from text.

Created by jibaroenlaluna

Features:
• Clean selected text from any webpage
• Remove HTML tags and entities
• Remove Markdown formatting
• Remove citations and references
• Normalize whitespace while preserving structure
• Copy cleaned text to clipboard
• Replace text directly on page

Puerto Rico 🇵🇷`;

    alert(aboutText);
});

// Keyboard shortcuts
inputText.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        cleanManualBtn.click();
    }
});
