import fs from "node:fs";
import path from "node:path";
import url from "node:url";

export const replacePromptWithInfo = (prompt: any, history: string) => {
  const __filename = url.fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.resolve(__dirname, '../context/FAQ_BOT.txt');
  const context = fs.readFileSync(filePath, 'utf8');
  return prompt.replace('{history}', history).replace('{context}', context);
}

export const replaceOnlyHistory = (prompt: any, history: string) => {
	return prompt.replace('{history}', history)
}