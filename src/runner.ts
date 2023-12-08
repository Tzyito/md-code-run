import type { ExtensionContext } from 'vscode'
import { ViewColumn, window } from 'vscode'

export function runCode(context: ExtensionContext, code: string) {
  try {
    // 创建 Webview 面板
    const new_panel = window.createWebviewPanel(
      'codeRunnerResult',
      'Code Runner Result',
      ViewColumn.Beside,
      { enableScripts: true },
    )
    // 在 Webview 中显示运行结果
    new_panel.webview.html = getWebviewContent(code)

    // 添加关闭按钮
    new_panel.webview.onDidReceiveMessage((message) => {
      if (message.command === 'close')
        new_panel.dispose()
    })
    // @TODO - Using cached pages here will result in a usage error

    // const panel = context.globalState.get("webview:panel") as WebviewPanel
    // console.log('panel', panel)
    // if (panel === 1 as any) {
    //     panel.webview.html = getWebviewContent(code);
    //     panel.reveal(ViewColumn.Beside)
    // } else {
    //     // 创建 Webview 面板
    //     const new_panel = window.createWebviewPanel(
    //         'codeRunnerResult',
    //         'Code Runner Result',
    //         ViewColumn.Beside,
    //         { enableScripts: true }
    //     );
    //     console.log('new_panel', new_panel)
    //     // 在 Webview 中显示运行结果
    //     new_panel.webview.html = getWebviewContent(code);

    //     // 添加关闭按钮
    //     new_panel.webview.onDidReceiveMessage((message) => {
    //         if (message.command === 'close') {
    //             new_panel.dispose();
    //         }
    //     });
    //     context.globalState.update("webview:panel", new_panel)
    // }
  }
  catch (e: any) {
    window.showErrorMessage(`Error writing to file: ${e.message}`)
  }
}

function getWebviewContent(initScript: string): string {
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
              function generateLogDom(container, message, elementType = 'p') {
                // const stackInfo = new Error().stack.split("/n")[2].trim();
                // const reg = /(?:at file:\\/\\/\\/[^/]+\\/)([^:]+):(\d+:\d+)/;
                // const reg_file = /\\/([^/]+)$/g;
                // const match = stackInfo.match(reg);
                // const filePath = match[1];
                // const fileLine = match[2];
                // const fileName = filePath.match(reg_file)[0];
                // let error = document.createElement('a');
                // error.innerText = fileName + '-' + fileLine;
                // error.href = filePath;

                let p = document.createElement(elementType);
                let text = document.createElement('span');
                text.innerText = message;
                p.appendChild(text);
                // p.appendChild(error);
                container.appendChild(p);
                p = null;
              }
              const resultBox = document.querySelector('#result');
              const errorBox = document.querySelector('#error');
              console.log = function(message) {
                generateLogDom(resultBox, message);
              }
              try {
                const result = (function() {
                    ${initScript}
                })();
                console.error('re: ',result);
                generateLogDom(resultBox, result);
              } catch (error) {
                vscode.postMessage({ command: 'error', message: error.message });
                generateLogDom(errorBox, error);
              }
          </script>
        </body>
        </html>
    `
}
