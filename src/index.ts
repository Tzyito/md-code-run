import type { ExtensionContext } from 'vscode'
import { registerCommandFn } from './commands'
import { ActiveMounted, MouseHovered, TextChange } from './disposable'

export function activate(context: ExtensionContext) {
  const commands = registerCommandFn(context)
  const disposables = [
    ActiveMounted(context),
    MouseHovered(context),
    TextChange(context),
  ]
  context.subscriptions.push(...[...disposables, ...commands])
}

export function deactivate() {
  // @TODO - Whether to clear the cache？

  // for(let key of ctx.globalState.keys()) {
  //   console.log('key', key)
  //   if(key.startsWith('webview:')) {
  //     const webView = ctx.globalState.get(key) as WebviewPanel;
  //     webView.dispose()
  //   }
  //   ctx.globalState.update(key,undefined)
  // }
}
