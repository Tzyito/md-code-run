import { commands, type Disposable } from "vscode";
import { runCode } from "./runner";

function runCodeBlock(params: any) {
    runCode(params.code);
}

const handler: Record<string, (...args: any[]) => any> = {
    'extension.runCodeBlock': runCodeBlock
}
export const registerCommandFn = () => {
    const registers = [] as Disposable[]
    Object.entries(handler).forEach(item => {
        const [command, handler] = item;
        registers.push(commands.registerCommand(command, handler));
    })
    return registers
}