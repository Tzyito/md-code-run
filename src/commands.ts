import { commands } from 'vscode'
import type { Disposable, ExtensionContext } from 'vscode'
import { runCode } from './runner'
import { aiTemp, script } from './template/index'
import type { MdCode } from './parse'

function runCodeBlock(context: ExtensionContext, params: { languages: string, index: number }) {
  const all_codes = context.globalState.get('all_codes') as MdCode[]
  const code = all_codes[params.index].content

  if (params.languages === 'javascript')
    runCode(context, script(code))
  else
    runCode(context, aiTemp(code), true)
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
