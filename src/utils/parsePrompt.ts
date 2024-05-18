import fs from "node:fs";
import path from "node:path";
import process from "node:process";

// Esta funcion se encarga de reemplazar el prompt con el historial de conversacion y el bot_context 
function replacePromptWithInfo(prompt: any, history: string) {
  const filePath = path.join(process.cwd(), 'src', 'context', 'FAQ_BOT.txt')
  const context = fs.readFileSync(filePath, 'utf8');
  return prompt.replace('{history}', history).replace('{context}', context);
}

// Esta funcion se encarga de reemplazar el prompt solo con el historial de conversacion
function replaceOnlyHistory(prompt: any, history: string) {
	return prompt.replace('{history}', history)
}

export { replacePromptWithInfo, replaceOnlyHistory}