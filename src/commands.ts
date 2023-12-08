import { commands } from 'vscode'
import type { Disposable, ExtensionContext } from 'vscode'
import { runCode } from './runner'

function runCodeBlock(context: ExtensionContext, params: { code: string }) {
  runCode(context, params.code)
}

const handler: Record<string, (...args: any[]) => any> = {
  'extension.runCodeBlock': runCodeBlock,
}
export function registerCommandFn(context: ExtensionContext) {
  const registers = [] as Disposable[]
  Object.entries(handler).forEach((item) => {
    const [command, handler] = item
    registers.push(commands.registerCommand(command, (...args: any) => handler(context, ...args)))
  })
  return registers
}
