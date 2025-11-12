// DOM Elements
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const outputSection = document.getElementById('outputSection');
const visualPreview = document.getElementById('visualPreview');
const cleanSelectedBtn = document.getElementById('cleanSelectedBtn');
const cleanManualBtn = document.getElementById('cleanManualBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const replaceBtn = document.getElementById('replaceBtn');
const charCount = document.getElementById('charCount');
const statusMessage = document.getElementById('statusMessage');

// No options needed anymore - we always convert markdown to HTML

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

// Convert text to HTML - keep HTML tags, convert markdown to HTML
function convertToHtml(text) {
    // First, escape any existing HTML to prevent injection
    // But check if text already contains HTML tags - if so, preserve them
    const hasHtmlTags = /<[^>]+>/.test(text);

    if (!hasHtmlTags) {
        // No HTML tags, so this is plain text or markdown - convert markdown to HTML
        text = convertMarkdownToHtml(text);
    }

    return text;
}

// Convert Markdown to HTML
function convertMarkdownToHtml(text) {
    // Split into lines for processing
    let lines = text.split('\n');
    let html = '';
    let inList = false;
    let inOrderedList = false;
    let inTable = false;
    let tableHeaders = [];
    let paragraphBuffer = []; // Buffer to accumulate paragraph lines
    let i = 0;

    // Helper function to flush paragraph buffer
    function flushParagraph() {
        if (paragraphBuffer.length > 0) {
            // Join lines with <br> tags to preserve line breaks within paragraph
            html += `<p>${paragraphBuffer.join('<br>\n')}</p>\n`;
            paragraphBuffer = [];
        }
    }

    while (i < lines.length) {
        let line = lines[i];
        let trimmedLine = line.trim();

        // Empty line - flush paragraph buffer and add spacing
        if (trimmedLine === '') {
            flushParagraph();
            if (inList) {
                html += '</ul>\n';
                inList = false;
            }
            if (inOrderedList) {
                html += '</ol>\n';
                inOrderedList = false;
            }
            html += '<p></p>\n'; // Empty paragraph for spacing
            i++;
            continue;
        }

        // Headers (# ## ### etc)
        const headerMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
        if (headerMatch) {
            flushParagraph(); // Flush any pending paragraph
            if (inList) {
                html += '</ul>\n';
                inList = false;
            }
            if (inOrderedList) {
                html += '</ol>\n';
                inOrderedList = false;
            }
            const level = headerMatch[1].length;
            const headerText = processInlineMarkdown(headerMatch[2]);
            html += `<h${level}>${headerText}</h${level}>\n`;
            i++;
            continue;
        }

        // Horizontal rule (---, ***, ___)
        if (/^([-*_]){3,}$/.test(trimmedLine)) {
            flushParagraph(); // Flush any pending paragraph
            if (inList) {
                html += '</ul>\n';
                inList = false;
            }
            if (inOrderedList) {
                html += '</ol>\n';
                inOrderedList = false;
            }
            html += '<hr>\n';
            i++;
            continue;
        }

        // Tables (| col1 | col2 |)
        if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
            if (!inTable && i + 1 < lines.length && lines[i + 1].includes('|') && lines[i + 1].includes('-')) {
                // This is a table header
                flushParagraph(); // Flush any pending paragraph
                inTable = true;
                tableHeaders = trimmedLine.split('|').map(h => h.trim()).filter(h => h);
                html += '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">\n';
                html += '<thead><tr>';
                tableHeaders.forEach(header => {
                    html += `<th style="background-color: #f0f0f0; padding: 8px; border: 1px solid #ddd;">${processInlineMarkdown(header)}</th>`;
                });
                html += '</tr></thead>\n<tbody>\n';
                i += 2; // Skip header and separator line
                continue;
            } else if (inTable) {
                // This is a table row
                const cells = trimmedLine.split('|').map(c => c.trim()).filter(c => c);
                html += '<tr>';
                cells.forEach(cell => {
                    html += `<td style="padding: 8px; border: 1px solid #ddd;">${processInlineMarkdown(cell)}</td>`;
                });
                html += '</tr>\n';
                i++;
                continue;
            }
        } else if (inTable) {
            // End of table
            html += '</tbody></table>\n';
            inTable = false;
        }

        // Unordered lists (-, *, +)
        const ulMatch = trimmedLine.match(/^[\-\*\+]\s+(.+)$/);
        if (ulMatch) {
            flushParagraph(); // Flush any pending paragraph
            if (inOrderedList) {
                html += '</ol>\n';
                inOrderedList = false;
            }
            if (!inList) {
                html += '<ul>\n';
                inList = true;
            }
            html += `<li>${processInlineMarkdown(ulMatch[1])}</li>\n`;
            i++;
            continue;
        }

        // Ordered lists (1. 2. 3.)
        const olMatch = trimmedLine.match(/^\d+\.\s+(.+)$/);
        if (olMatch) {
            flushParagraph(); // Flush any pending paragraph
            if (inList) {
                html += '</ul>\n';
                inList = false;
            }
            if (!inOrderedList) {
                html += '<ol>\n';
                inOrderedList = true;
            }
            html += `<li>${processInlineMarkdown(olMatch[1])}</li>\n`;
            i++;
            continue;
        }

        // Regular paragraph - add to buffer instead of creating immediately
        if (inList) {
            html += '</ul>\n';
            inList = false;
        }
        if (inOrderedList) {
            html += '</ol>\n';
            inOrderedList = false;
        }
        // Add line to paragraph buffer
        paragraphBuffer.push(processInlineMarkdown(trimmedLine));
        i++;
    }

    // Flush any remaining paragraph
    flushParagraph();

    // Close any open lists
    if (inList) html += '</ul>\n';
    if (inOrderedList) html += '</ol>\n';
    if (inTable) html += '</tbody></table>\n';

    return html;
}

// Process inline markdown (bold, italic, links, etc.)
function processInlineMarkdown(text) {
    // Bold and italic combined (***text*** or ___text___)
    text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    text = text.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');

    // Bold (**text** or __text__)
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic (*text* or _text_)
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    text = text.replace(/_(.+?)_/g, '<em>$1</em>');

    // Links [text](url)
    text = text.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>');

    // Inline code `code`
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    return text;
}

// Main conversion function - convert to HTML
let convertedHtml = ''; // Store the HTML version globally for clipboard

function convertText(text) {
    // Normalize line endings
    text = text.replace(/\r\n/g, '\n');
    text = text.replace(/\r/g, '\n');

    // Convert to HTML
    convertedHtml = convertToHtml(text);

    // Update visual preview with rendered HTML
    visualPreview.innerHTML = convertedHtml;

    // Return HTML code for textarea
    return convertedHtml;
}

// Convert selected text from page
cleanSelectedBtn.addEventListener('click', async () => {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Inject script to get selected text
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => window.getSelection().toString()
        });

        if (results && results[0] && results[0].result) {
            const selectedText = results[0].result;
            const converted = convertText(selectedText);
            outputText.value = converted;
            outputSection.style.display = 'block';
            updateCharCount();
            showStatus('✅ Converted! Preview below.', 'success');
        } else {
            showStatus('No text selected on page', 'info');
        }
    } catch (error) {
        console.error('Error:', error);
        showStatus('Error accessing page', 'error');
    }
});

// Convert manual input
cleanManualBtn.addEventListener('click', () => {
    const text = inputText.value.trim();

    if (!text) {
        showStatus('Please enter some text to convert', 'info');
        return;
    }

    const converted = convertText(text);
    outputText.value = converted;
    outputSection.style.display = 'block';
    updateCharCount();
    showStatus('✅ Converted! Preview below.', 'success');
});

// Clear all
clearBtn.addEventListener('click', () => {
    inputText.value = '';
    outputText.value = '';
    visualPreview.innerHTML = '';
    outputSection.style.display = 'none';
    showStatus('Cleared', 'info', 1500);
});

// Copy to clipboard with rich HTML formatting (like MassiveMark)
copyBtn.addEventListener('click', async () => {
    if (!outputText.value || !convertedHtml) {
        showStatus('No text to copy', 'info');
        return;
    }

    try {
        // Create styled HTML that Word/Outlook will render properly
        const styledHtml = `
<html>
<head>
<meta charset="utf-8">
<style>
    body {
        font-family: Calibri, Arial, sans-serif;
        font-size: 11pt;
        color: #000000;
        line-height: 1.5;
    }
    table {
        border-collapse: collapse;
        width: 100%;
        margin: 10px 0;
        border: 1px solid #000000;
    }
    th {
        background-color: #4472C4;
        color: #FFFFFF;
        font-weight: bold;
        padding: 8px;
        border: 1px solid #000000;
        text-align: left;
    }
    td {
        padding: 8px;
        border: 1px solid #000000;
    }
    h1 { font-size: 18pt; font-weight: bold; margin: 12pt 0 6pt 0; }
    h2 { font-size: 16pt; font-weight: bold; margin: 10pt 0 6pt 0; }
    h3 { font-size: 14pt; font-weight: bold; margin: 10pt 0 6pt 0; }
    h4 { font-size: 12pt; font-weight: bold; margin: 8pt 0 4pt 0; }
    h5 { font-size: 11pt; font-weight: bold; margin: 8pt 0 4pt 0; }
    h6 { font-size: 11pt; font-weight: bold; margin: 8pt 0 4pt 0; }
    p {
        margin: 0 0 6pt 0;
        line-height: 1.15;
    }
    p:empty {
        margin: 6pt 0;
        height: 6pt;
    }
    br {
        display: block;
        content: "";
        margin: 0;
    }
    ul { margin: 10px 0; padding-left: 24px; list-style-type: disc; }
    ol { margin: 10px 0; padding-left: 24px; }
    li { margin: 3px 0; }
    hr { border: none; border-top: 1px solid #000000; margin: 12pt 0; }
    strong, b { font-weight: bold; }
    em, i { font-style: italic; }
    code {
        background-color: #F2F2F2;
        padding: 2px 4px;
        font-family: 'Consolas', 'Courier New', monospace;
        border: 1px solid #D0D0D0;
        border-radius: 3px;
    }
</style>
</head>
<body>
${convertedHtml}
</body>
</html>`;

        // Copy both HTML and plain text to clipboard
        const htmlBlob = new Blob([styledHtml], { type: 'text/html' });
        const textBlob = new Blob([outputText.value], { type: 'text/plain' });

        const clipboardItem = new ClipboardItem({
            'text/html': htmlBlob,
            'text/plain': textBlob
        });

        await navigator.clipboard.write([clipboardItem]);
        showStatus('✅ Copied! Now paste into Word/Outlook.', 'success', 3000);
    } catch (error) {
        console.error('Clipboard error:', error);
        // Fallback to plain text
        try {
            await navigator.clipboard.writeText(outputText.value);
            showStatus('⚠️ Copied as plain text (HTML copy failed)', 'info', 3000);
        } catch (fallbackError) {
            showStatus('❌ Could not copy to clipboard', 'error');
        }
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
        const textToReplace = outputText.value;

        // Inject script to replace selected text
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (newText) => {
                try {
                    const selection = window.getSelection();
                    if (!selection.rangeCount) return false;

                    const range = selection.getRangeAt(0);
                    const activeElement = document.activeElement;
                    const isEditable = activeElement && (
                        activeElement.isContentEditable ||
                        activeElement.tagName === 'TEXTAREA' ||
                        activeElement.tagName === 'INPUT'
                    );

                    if (isEditable) {
                        if (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT') {
                            const start = activeElement.selectionStart;
                            const end = activeElement.selectionEnd;
                            const text = activeElement.value;
                            activeElement.value = text.substring(0, start) + newText + text.substring(end);
                            activeElement.selectionStart = activeElement.selectionEnd = start + newText.length;
                            activeElement.dispatchEvent(new Event('input', { bubbles: true }));
                        } else if (activeElement.isContentEditable) {
                            range.deleteContents();
                            const lines = newText.split('\n');
                            const fragment = document.createDocumentFragment();
                            lines.forEach((line, index) => {
                                fragment.appendChild(document.createTextNode(line));
                                if (index < lines.length - 1) {
                                    fragment.appendChild(document.createElement('br'));
                                }
                            });
                            range.insertNode(fragment);
                            range.collapse(false);
                            selection.removeAllRanges();
                            selection.addRange(range);
                        }
                        return true;
                    } else {
                        navigator.clipboard.writeText(newText);
                        return true;
                    }
                } catch (error) {
                    console.error('Error replacing text:', error);
                    return false;
                }
            },
            args: [textToReplace]
        });

        if (results && results[0] && results[0].result) {
            showStatus('Text replaced on page!', 'success');
        } else {
            showStatus('Could not replace text', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showStatus('Error replacing text', 'error');
    }
});

// About link
document.getElementById('aboutLink').addEventListener('click', (e) => {
    e.preventDefault();
    const aboutText = `Jibaro Rich Text Converter v3.0.0

Convert Markdown to rich HTML for Word/Outlook with beautiful formatting.

Created by jibaroenlaluna

Features:
• Convert Markdown to Rich HTML
• Visual preview before copying
• Copy with formatting to Word/Outlook
• Support for bold, italic, headers, lists, tables
• Professional table styling with blue headers
• Perfect for Claude, ChatGPT, Gemini outputs
• All processing done locally (private & secure)

Made with ❤️ in Puerto Rico 🇵🇷

GitHub: github.com/yourusername/jibaro-rich-text-converter`;

    alert(aboutText);
});

// Keyboard shortcuts
inputText.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        cleanManualBtn.click();
    }
});
