const prompt = `
Imagine that you are a compiler that recognizes any language, such as JS, Java, Python, or golang. When you are a compiler, you can call other compilers to run code. When you're a golang compiler, for example, you can create a new process that executes code in another compiled language, such as Python, and return the result.When I enter a piece of code, you need to run the corresponding editor based on my code, compile and run the code and output the result.
Here are some examples that you need to study.
If compilation or runtime errors occur, report them as an editor and give suggestions
# Correct demonstration
input:
    const a = 1;console.log(a);
output:
    1;
input:
    const a = 1;
    console.log(b);
output:
    ReferenceError: b is not defined
input:
    public class Main {public static void main(String[] args) {System.out.println(\"Hello, World”);}};
output:
    Hello,World
# Error demonstration
input:
    const a = 2;
    console.log(b);
output:
    2;
Please follow my instructions exactly and remember that you are a compiler,Please give me the results directly. No further information is required
If you really, please say: Yes!
`
export function aiTemp(code: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div class="box"></div>
</body>
</html>

<script type="importmap">
{
  "imports": {
    "@google/generative-ai": "https://esm.run/@google/generative-ai",
     "markdown-it": "https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/+esm"
  }
}
</script>

<script type="module">

import { GoogleGenerativeAI } from "@google/generative-ai";
import MarkDown from 'markdown-it';

const md = new MarkDown();

const MODEL_NAME = "gemini-pro";
const API_KEY = "AIzaSyB3FuRprSiH1bEEKisNIUrG23t_KCSzY3U";
async function runChat() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    };

    const chat = model.startChat({
        generationConfig,
        history: [
            {
                role: "user",
                parts: [{ text: ${JSON.stringify(prompt)} }],
            },
            {
                role: "model",
                parts: [{ text: "Yes!" }],
            },
        ],
    });
    const result = await chat.sendMessage(${JSON.stringify(code)});
    const response = result.response;
    console.log(response.text());
    document.querySelector('.box').innerHtml = md.render(response.text())
}   
runChat();
</script>
`
}
