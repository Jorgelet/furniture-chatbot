import { TFlow } from "@builderbot/bot/dist/types";

type DebounceFunction<P = any> = 
((message?: string) => void) | 
((flow: TFlow<P>, step?: number) => Promise<void>) 

export function debounce(func: DebounceFunction, ms: number) {
  let timeout:NodeJS.Timeout;
  return function(...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), ms)
  }
}