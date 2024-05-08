import {  BotStateStandAlone } from "@builderbot/bot/dist/types";

export type History = { 
  role: "user" | "assistant"; 
  content: string 
};

export function getHistoryParse (_state: BotStateStandAlone, k = 20): string {
  const history = _state.get<History[]>('history') ?? [];
  const limitHistory = history.slice(-k);
  return limitHistory.reduce((prev, current) => {
    const msg = current.role === 'user' ? `\nCliente: "${current.content}"` : `\nVendedor: "${current.content}"`
    prev += msg
    console.log(prev)
    return prev
  }, ``)
} 

export async function handleHistory  (inside: History, _state: BotStateStandAlone) {
  const history = _state.get<History[]>('history') ?? [];
  history.push(inside);

  await _state.update({history})
}