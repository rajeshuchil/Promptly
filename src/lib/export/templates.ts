/**
 * Helper to build the default README.md file included in ZIP exports
 */
export function buildReadmeTemplate(projectName: string, prompt: string): string {
  return `# ${projectName}

This website was generated dynamically by **FastApp AI Website Builder**.

## Package Structure
\`\`\`
export/
├── index.html   - The main standalone website file containing structure and styling.
├── assets/       - Assets folder for images/icons (currently empty).
└── README.md    - This documentation file.
\`\`\`

## Original Prompt
> "${prompt}"

## Local Execution
To view this website locally:
1. Double-click the \`index.html\` file to open it directly in any modern browser.
2. Alternatively, run a local static file server:
   \`\`\`bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Using Node.js (npx)
   npx serve .
   \`\`\`

## Features
- Fully standalone HTML file.
- Responsive design optimized for Mobile, Tablet, and Desktop displays.
- Embedded modern typography and style definitions.
`;
}
