import {  BotStateStandAlone } from "@builderbot/bot/dist/types";

type History = { 
  role: "user" | "assistant"; 
  content: string 
};

function getHistoryParse (_state: BotStateStandAlone, k = 13): string {
  const history = _state.get<History[]>('history') ?? [];
  const limitHistory = history.slice(-k);
  return limitHistory.reduce((prev, current) => {
    const msg = current.role === 'user' ? `\nCliente: "${current.content}"` : `\nVendedor: "${current.content}"`
    prev += msg
    console.log('***HISTORY-PREV***',prev)
    return prev
  }, ``)
} 

async function handleHistory  (inside: History, _state: BotStateStandAlone) {
  const history = _state.get<History[]>('history') ?? [];
  history.push(inside);
  await _state.update({history})
}

async function clearHistory (_state: BotStateStandAlone) {
  _state.clear()
}

export { History, getHistoryParse, handleHistory, clearHistory}