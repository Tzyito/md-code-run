import type { ExtensionContext } from 'vscode'
import { ViewColumn, window } from 'vscode'
import { html } from './template/javascript.tsx'

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
    new_panel.webview.html = html(code);

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