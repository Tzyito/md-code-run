export * from './javascript.tsx'
export * from './ai.tsx'

export function html(initScript: string) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <style>
          body {
              padding: 20px;
          }
          p {
              display: flex;
              justify-content: space-between;
          }
      </style>
  </head>
  <body>
    <div id="result"></div>
    <div id="error" style="color: red;"></div>
    <button onclick="closePanel()">Close</button>
    <script>
        const vscode = acquireVsCodeApi();
        function closePanel() {
            vscode.postMessage({ command: 'close' });
        }
        ${initScript}
    </script>
  </body>
  </html>
  `
}
