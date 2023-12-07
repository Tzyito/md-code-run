import { window, commands, Range, StatusBarAlignment } from 'vscode'
import type { ExtensionContext, Position, TextDocument } from 'vscode'
import { runCode } from './runner';
import { registerCommandFn } from './commands';
import { ActiveMounted, MouseHovered, TextChange } from './disposable';

export function activate(context: ExtensionContext) {
  const commands = registerCommandFn()
  const disposables = [
    ActiveMounted(context),
    MouseHovered(context),
    TextChange()
  ]
  context.subscriptions.push(...[...disposables, ...commands]);
}

export function deactivate() {

}
