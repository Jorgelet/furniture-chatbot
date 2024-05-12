import z from "zod";
import { EVENTS, addKeyword } from "@builderbot/bot";
import { StructLayer } from "@elimeleth/builderbot-langchain";

import { cancelFlow } from "../cancel";
import { PROMPT_ORDER } from "./prompt";
import AIClass from "~/services/OpenAIService";
import { registerFlow } from "./register.flow";
import { replacePromptWithInfo } from "~/utils/parsePrompt";
import { getHistoryParse, handleHistory } from "~/utils/handleHistory";


export const orderFlow = addKeyword(EVENTS.ACTION)
.addAction(async (_, { state, flowDynamic, extensions }) => {
  try {
    const ai = extensions.ai as AIClass;
    const history = getHistoryParse(state);
    const prompt = replacePromptWithInfo(PROMPT_ORDER, history);
    const text = await ai.createChat([
      {
        role: 'system',
        content: prompt
      }
    ]);

    await handleHistory({
      role: 'assistant',
      content: text
    }, state);

    const chunks = text.split(/(?<!\d)\.\s+/g);
    for (const chunk of chunks) {
      await flowDynamic([{ body: chunk.trim() }]);
    }
  } catch (error) {
    return console.error('[ORDER_FLOW_ERROR]: ', error);
  }
})
.addAction({ capture: true }, new StructLayer(z.object({
  intention: z.enum(["CONVERSAR", "ORDENAR", "CANCELAR"])
})).createCallback(async (ctx, { gotoFlow }) => {
  
  const intention = ctx?.schema?.intention;
  if(intention === 'CANCELAR') return gotoFlow(cancelFlow)
    
  return gotoFlow(registerFlow)
}), [registerFlow]) 