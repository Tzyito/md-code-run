import { window, commands, Range, StatusBarAlignment, languages, MarkdownString, Hover, ViewColumn } from 'vscode'
import type { ExtensionContext, Position, TextDocument, TextEditor } from 'vscode'

export function activate(context: ExtensionContext) {
  let disposable = window.onDidChangeActiveTextEditor((editor: TextEditor | undefined) => {
    if (editor && editor.document.languageId === 'markdown') {
      provideRunButton(editor.document, context);
      window.showInformationMessage("Hellow World")
      // console.log('document', editor.document)
    }
  });
  let disposable_hover = languages.registerHoverProvider({ scheme: 'file', language: 'markdown' }, {
    provideHover(document: TextDocument, position: Position) {
      const range = document.getWordRangeAtPosition(position, /```(?:.|\n)*?```/g);
      console.log('Range', range)
      if (range) {
        const code = document.getText(range);
        const hoverText = new MarkdownString('**Run Code**');
        hoverText.appendCodeblock(code, 'javascript');

        return new Hover(hoverText);
      }

      return undefined;
    }
  });

  // context.subscriptions.push(...[disposable, disposable_hover]);
  context.subscriptions.push(disposable_hover);
}
function provideRunButton(document: TextDocument, context: ExtensionContext) {
  const editor = window.activeTextEditor;

  if (!editor || editor.document !== document) {
    return;
  }

  const regex = /```javascript([\s\S]+?)```/g;
  let match;
  let codeBlocks: Range[] = [];
  while ((match = regex.exec(document.getText()))) {
    const start = document.positionAt(match.index + "```javascript".length);
    const end = document.positionAt(match.index + match[0].length - 3);
    codeBlocks.push(new Range(start, end));
  }

  codeBlocks.forEach((range, index) => {

    const runButton = window.createStatusBarItem(StatusBarAlignment.Right);
    runButton.text = "$(triangle-right) Run" + index;
    runButton.command = 'extension.runCodeBlock';
    runButton.tooltip = 'Run code block';
    runButton.show();
    context.subscriptions.push(
      commands.registerCommand('extension.runCodeBlock', () => {
        const code = document.getText(range);
        runCode(code);
        console.log('code', code)
        // window.showInformationMessage(code)
      })
    );
  });
}
function runCode(code: string) {
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

  }catch(e: any) {
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


export function deactivate() {

}
