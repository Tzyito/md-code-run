import { ViewColumn, commands, window } from "vscode";

export const runCode = (
    code: string
) => {
    try {

        // 创建 Webview 面板
        const panel = window.createWebviewPanel(
            'codeRunnerResult',
            'Code Runner Result',
            ViewColumn.Beside,
            { enableScripts: true }
        );
        // 初始化脚本，自动执行代码
        const initScript = `
  try {
      ${code}
  } catch (error) {
      vscode.postMessage({ command: 'error', message: error.message });
  }
  `;
        // 在 Webview 中显示运行结果
        panel.webview.html = getWebviewContent(initScript);

        // 添加关闭按钮
        panel.webview.onDidReceiveMessage((message) => {
            if (message.command === 'close') {
                panel.dispose();
            }
        });
        commands.executeCommand('workbench.action.webview.openDeveloperTools');
    } catch (e: any) {
        window.showErrorMessage(`Error writing to file: ${e.message}`)
    }
}

const getWebviewContent = (
    initScript: string
): string => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    padding: 20px;
                }
            </style>
        </head>
        <body>
          <pre id="result"></pre>
          <pre id="error" style="color: red;"></pre>
          <button onclick="closePanel()">Close</button>
          <script>
              function closePanel() {
                  vscode.postMessage({ command: 'close' });
              }
              ${initScript}
          </script>
        </body>
        </html>
    `;
}