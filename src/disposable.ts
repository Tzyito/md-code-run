import { ExtensionContext, Hover, MarkdownString, Position, Range, StatusBarAlignment, TextDocument, TextEditor, Uri, commands, languages, window, workspace } from "vscode";
import { MdCode, parseAST } from "./parse";
import { isInRangeBinarySearch } from "./utils";


function getRangeOfEnclosingCodeBlock(document: TextDocument, position: Position): Range | undefined {
  const lineText = document.lineAt(position.line).text;
  const codeBlockRegex = /```(?:.|\n)*?```/g;
  let match;
  console.log('lineText', lineText)
  // Check if the cursor is within a code block
  while ((match = codeBlockRegex.exec(lineText))) {
    console.log(match.index, match[0]);  // 调试输出
    const start = document.positionAt(match.index);
    const end = document.positionAt(match.index + match[0].length);

    if (position.isAfterOrEqual(start) && position.isBeforeOrEqual(end)) {
      return new Range(start, end);
    }
  }

  return undefined;
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
        // runCode(code);
      })
    );
  });
}

export const ActiveMounted = (
  context: ExtensionContext
) => {
  let all_codes = [] as MdCode[]
  const disposable = window.onDidChangeActiveTextEditor((editor: TextEditor | undefined) => {
    if (editor && editor.document.languageId === 'markdown') {
      // provideRunButton(editor.document, context);
      window.showInformationMessage("Hellow World")
      all_codes = parseAST(editor.document.getText())
      context.globalState.update('all_codes', all_codes)
      console.log('all_codes', all_codes)
    }
  });
  return disposable
}
export const MouseHovered = (
  context: ExtensionContext
) => {
  const all_codes = context.globalState.get("all_codes") as MdCode[]
  const disposable_hover = languages.registerHoverProvider({ scheme: 'file', language: 'markdown' }, {
    provideHover(_: TextDocument, position: Position) {
      console.log('position.line', all_codes, position.line)
      // const codeInfo = all_codes.find(item => item.start < position.line)!
      const index = isInRangeBinarySearch(position.line, all_codes)
      console.log('index', index)
      if (index === -1) {
        return undefined
      }
      console.log('codeInfo.content', all_codes[index].content)
      const hoverText = new MarkdownString('**Run Code**');
      const command = Uri.parse(`command:extension.runCodeBlock?${JSON.stringify({ code: all_codes[index].content })}`)
      hoverText.appendCodeblock(all_codes[index].content, 'javascript');
      hoverText.appendMarkdown(`[🤖 Run it](${command})`)
      hoverText.isTrusted = true
      return new Hover(hoverText)
    }
  });
  return disposable_hover
}

export const TextChange = () => {
  return workspace.onDidChangeTextDocument(editor => {
    let all_codes = []
    all_codes = parseAST(editor.document.getText())
    console.log('change codes', all_codes)
    // context.globalState.update('all_codes', all_codes)

  })
}