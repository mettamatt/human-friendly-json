# Human-Friendly JSON Formatter

**Human-Friendly JSON Formatter** is a lightweight, client-side web tool designed to transform raw JSON into a more human-readable and structured format. It features a clean interface, robust validation, syntax highlighting, and user-friendly feedback to simplify working with JSON data.

## Features

- **Human-Friendly Formatting**:  
  - Objects and arrays are indented for better readability.  
  - Arrays of objects are displayed in a compact inline format, making it easier to scan and understand the data structure at a glance.

- **Error Highlighting and Feedback**:  
  - Invalid JSON? No problem! The tool highlights the exact line in your input and provides a descriptive error message to help you debug quickly.

- **Live Syntax Highlighting**:  
  - Both the input and formatted output are displayed in clean, syntax-highlighted editors powered by CodeMirror for a consistent experience.

- **Clipboard Support**:  
  - Quickly copy the formatted JSON to your clipboard with a single click for easy sharing or use in other tools.

- **No Server Required**:  
  - Runs entirely in your browser, ensuring privacy and blazing-fast performance. No data is sent to any server.

## Getting Started

### Online Access
Check out the tool here: [Human-Friendly JSON Formatter](#)

### Local Setup
1. Clone this repository:
   ```bash
   git clone https://github.com/mettamatt/human-friendly-json.git
   ```
2. Open the `index.html` file in your browser.  
   No additional dependencies or setup required!

## Usage Tips

- **Interactive Editing**:  
  You can edit your JSON in the input editor and reformat it as needed by clicking the "Format JSON" button.

- **Error Debugging**:  
  If your JSON is invalid, the tool highlights the line containing the error and provides a helpful error message above the "Format JSON" button.

- **Large JSON Files**:  
  While the tool can handle large JSON inputs, extreme cases might take longer to process. For exceptionally large files, consider using a dedicated JSON viewer.

## Contributing

Contributions are welcome! If you have ideas for new features or improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute it as you see fit.