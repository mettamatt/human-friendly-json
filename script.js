document.addEventListener('DOMContentLoaded', function () {
  // Header contains the title and intro paragraph
  // Main contains the input and output sections
  const errorMessage = document.getElementById('errorMessage');
  const copyMessage = document.getElementById('copyMessage');
  const formatButton = document.getElementById('formatButton');
  const copyButton = document.getElementById('copyButton');

  const INDENT_SIZE = 2;

  // Configuration for CodeMirror editors
  const cmConfig = {
    mode: 'application/json',
    lineNumbers: true,
    theme: 'idea',
    tabSize: 2,
    indentUnit: 2,
  };

  // Input editor
  const inputEditor = CodeMirror(document.getElementById('jsonEditor'), {
    ...cmConfig,
    value: '{ "key": "value" }',
  });

  // Output editor (read-only)
  const outputEditor = CodeMirror(document.getElementById('jsonOutputEditor'), {
    ...cmConfig,
    readOnly: true,
    value: '',
  });

  /**
   * Formats a JSON value into a more human-readable form.
   * Handles objects, arrays, booleans, numbers, strings, and nulls.
   * @param {any} value - The JSON value to format.
   * @param {number} indentLevel - Current indentation depth.
   * @returns {string} The human-friendly formatted string.
   */
  function humanFriendlyJSON(value, indentLevel = 0) {
    if (value === null) return 'null';
    const valueType = typeof value;
    if (valueType === 'boolean' || valueType === 'number') return String(value);
    if (valueType === 'string') return JSON.stringify(value);
    if (Array.isArray(value)) return formatArray(value, indentLevel);
    if (valueType === 'object') return formatObject(value, indentLevel);
    return JSON.stringify(value);
  }

  /**
   * Formats an object with keys and values on separate lines, properly indented.
   */
  function formatObject(object, indentLevel) {
    const keys = Object.keys(object);
    if (keys.length === 0) return '{}';

    const indent = getIndent(indentLevel);
    const innerIndent = getIndent(indentLevel + 1);
    return (
      '{\n' +
      keys
        .map((key, index) => {
          const valStr = humanFriendlyJSON(object[key], indentLevel + 1);
          return `${innerIndent}${JSON.stringify(key)}: ${valStr}${
            index < keys.length - 1 ? ',' : ''
          }`;
        })
        .join('\n') +
      '\n' +
      indent +
      '}'
    );
  }

  /**
   * Formats an array. If it's an array of objects, each object is placed on one line;
   * otherwise, it's formatted like a standard JSON array.
   */
  function formatArray(array, indentLevel) {
    if (array.length === 0) return '[]';

    const indent = getIndent(indentLevel);
    const innerIndent = getIndent(indentLevel + 1);

    if (array.every(el => el && typeof el === 'object' && !Array.isArray(el))) {
      return (
        '[\n' +
        array
          .map((obj, i) => {
            const keys = Object.keys(obj);
            const inlineParts = keys
              .map(k => `${JSON.stringify(k)}: ${humanFriendlyJSON(obj[k], 0)}`)
              .join(', ');
            return `${innerIndent}{ ${inlineParts} }${i < array.length - 1 ? ',' : ''}`;
          })
          .join('\n') +
        '\n' +
        indent +
        ']'
      );
    }

    return (
      '[\n' +
      array
        .map((val, i) => {
          const valStr = humanFriendlyJSON(val, indentLevel + 1);
          return `${innerIndent}${valStr}${i < array.length - 1 ? ',' : ''}`;
        })
        .join('\n') +
      '\n' +
      indent +
      ']'
    );
  }

  /**
   * Returns a string of spaces for indentation.
   */
  function getIndent(level) {
    return ' '.repeat(level * INDENT_SIZE);
  }

  /**
   * Display the successfully formatted JSON in the output editor.
   * @param {string} formattedJSON - The formatted JSON string.
   */
  function displayFormattedJSON(formattedJSON) {
    clearErrorHighlights();
    outputEditor.setValue(formattedJSON);
    copyButton.disabled = false;
    copyMessage.textContent = '';
  }

  /**
   * Display an error message above the "Format JSON" button.
   * Clear previous error highlights and disable the copy button.
   * @param {string} message - The error message to display.
   */
  function displayError(message) {
    errorMessage.textContent = message;
    outputEditor.setValue('');
    copyMessage.textContent = '';
    copyButton.disabled = true;
  }

  /**
   * Clears any previous error highlights in the input editor.
   */
  function clearErrorHighlights() {
    inputEditor.getDoc().eachLine(lineHandle => {
      inputEditor.getDoc().removeLineClass(lineHandle, 'background', 'error-line');
    });
  }

  /**
   * Highlights the error line in the input editor, based on the error message.
   * @param {string} errorMsg - The error message from JSON.parse.
   */
  function highlightErrorInEditor(errorMsg) {
    const match = errorMsg.match(/at position (\d+)/);
    if (!match) return;

    const pos = parseInt(match[1], 10);
    const doc = inputEditor.getDoc();
    const text = doc.getValue();

    let line = 0;
    let charCount = 0;

    for (const lineText of text.split('\n')) {
      const lineLength = lineText.length + 1; // +1 for newline
      if (charCount + lineLength > pos) {
        const ch = pos - charCount;
        doc.addLineClass(line, 'background', 'error-line');
        inputEditor.scrollIntoView({ line, ch }, 100);
        break;
      }
      charCount += lineLength;
      line++;
    }
  }

  // Format JSON when the button is clicked
  formatButton.addEventListener('click', function () {
    errorMessage.textContent = '';
    copyMessage.textContent = '';
    copyButton.disabled = true;

    const rawInput = inputEditor.getValue().trim();
    if (!rawInput) {
      displayError('Please provide JSON input.');
      clearErrorHighlights();
      return;
    }

    try {
      const parsed = JSON.parse(rawInput);
      const formattedJSON = humanFriendlyJSON(parsed, 0);
      displayFormattedJSON(formattedJSON);
    } catch (e) {
      displayError(`Invalid JSON: ${e.message}`);
      clearErrorHighlights();
      highlightErrorInEditor(e.message);
    }
  });

  // Copy JSON to clipboard
  copyButton.addEventListener('click', function () {
    const outputText = outputEditor.getValue();
    navigator.clipboard
      .writeText(outputText)
      .then(() => {
        copyMessage.textContent = 'JSON copied to clipboard!';
        setTimeout(() => {
          copyMessage.textContent = '';
        }, 2000);
      })
      .catch(err => {
        copyMessage.textContent = 'Failed to copy JSON.';
      });
  });
});
