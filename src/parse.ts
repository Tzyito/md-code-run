import MarkDown from 'markdown-it'
import { supportLanguage } from './utils'

const md = new MarkDown()

export interface MdCode {
  content: string
  language: string
  start: number
  end: number
}
export function parseAST(str: string) {
  const tokens = md.parse(str, {})
  const codes = [] as MdCode[]
  for (const token of tokens) {
    if (token.tag === 'code' && supportLanguage(token.info)) {
      codes.push({
        content: token.content.trim(),
        language: token.info,
        start: token.map![0],
        end: token.map![1],
      })
    }
  }
  return codes
}
