export function script(initScript: string) {
  return `
function generateLogDom(container, message, elementType = 'p') {
  // const stackInfo = new Error().stack.split("/n")[2].trim();
  // const reg = /(?:at file:\\/\\/\\/[^/]+\\/)([^:]+):(\d+:\d+)/;
  // const reg_file = /\\/([^/]+)$/g;
  // const match = stackInfo.match(reg);
  // const filePath = match[1];
  // const fileLine = match[2];
  // const fileName = filePath.match(reg_file)[0];
  // let error = document.createElement('a');
  // error.innerText = fileName + '-' + fileLine;
  // error.href = filePath;

  let p = document.createElement(elementType);
  let text = document.createElement('span');
  text.innerText = message;
  p.appendChild(text);
  // p.appendChild(error);
  container.appendChild(p);
  p = null;
}
const resultBox = document.querySelector('#result');
const errorBox = document.querySelector('#error');
console.log = function(message) {
  generateLogDom(resultBox, message);
}
try {
  const result = (function() {
      ${initScript}
  })();
  console.error('re: ',result);
  generateLogDom(resultBox, result);
} catch (error) {
  vscode.postMessage({ command: 'error', message: error.message });
  generateLogDom(errorBox, error);
}
`
}
