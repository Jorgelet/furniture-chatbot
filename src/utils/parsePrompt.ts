import fs from "node:fs";
import path from "node:path";
import process from "node:process";

function replacePromptWithInfo(prompt: any, history: string) {
  const filePath = path.join(process.cwd(), 'src', 'context', 'FAQ_BOT.txt')
  const context = fs.readFileSync(filePath, 'utf8');
  return prompt.replace('{history}', history).replace('{context}', context);
}

function replaceOnlyHistory(prompt: any, history: string) {
	return prompt.replace('{history}', history)
}

export { replacePromptWithInfo, replaceOnlyHistory}