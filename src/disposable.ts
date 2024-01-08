import type { ExtensionContext, Position, TextDocument, TextEditor } from 'vscode'
import { Hover, MarkdownString, Uri, languages, window, workspace } from 'vscode'
import { type MdCode, parseAST } from './parse'
import { isInRangeBinarySearch } from './utils'

export function ActiveMounted(context: ExtensionContext) {
  const disposable = window.onDidChangeActiveTextEditor((editor: TextEditor | undefined) => {
    if (editor && editor.document.languageId === 'markdown') {
      let all_codes = context.globalState.get('all_codes') as MdCode[] || []
      all_codes = parseAST(editor.document.getText())
      context.globalState.update('all_codes', all_codes)
    }
  })
  return disposable
}
export function MouseHovered(context: ExtensionContext) {
  const disposable_hover = languages.registerHoverProvider({ scheme: 'file', language: 'markdown' }, {
    async provideHover(_: TextDocument, position: Position) {
      const all_codes = context.globalState.get('all_codes') as MdCode[]
      const index = isInRangeBinarySearch(position.line, all_codes)
      if (index === -1)
        return undefined

      const hoverText = new MarkdownString('**Run Code**')
      const command = Uri.parse(`command:extension.runCodeBlock?${JSON.stringify({ languages: all_codes[index].language, index })}`)
      hoverText.appendCodeblock(all_codes[index].content, all_codes[index].language)
      hoverText.appendMarkdown(`[🤖 Run it](${command})`)
      hoverText.isTrusted = true
      return new Hover(hoverText)
    },
  })
  return disposable_hover
}

export function TextChange(context: ExtensionContext) {
  return workspace.onDidChangeTextDocument(() => {
    let newCodes = []
    const editor = window.activeTextEditor
    if (editor && editor.document) {
      newCodes = parseAST(editor.document.getText())
      context.globalState.update('all_codes', newCodes)
    }
  })
}
