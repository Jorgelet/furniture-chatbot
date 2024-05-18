import z from "zod";
import { EVENTS, addKeyword } from "@builderbot/bot";
import { StructLayer } from "@elimeleth/builderbot-langchain";

import { orderFlow } from "../order";
import AIClass from "~/services/OpenAIService";
import { PROMPT_CONVERSATION } from "./prompt";
import { replacePromptWithInfo } from "~/utils/parsePrompt";
import { getHistoryParse, handleHistory } from "~/utils/handleHistory";
import { cancelFlow } from "../cancel";

// Este flow se encarga de manejar la conversación con el usuario
const conversationFlow = addKeyword(EVENTS.ACTION).addAction(async (_, { state, flowDynamic, extensions }) => {
  try {
    const ai = extensions.ai as AIClass;
    const history = getHistoryParse(state);
    const prompt = replacePromptWithInfo(PROMPT_CONVERSATION, history);
    const text = await ai.createChat([{
      role: 'system',
      content: prompt
    }]);

    await handleHistory({
      role: 'assistant',
      content: text
    }, state);

    const chunks = text.split(/(?<!\d)\.\s+/g);
    for (const chunk of chunks) {
      await flowDynamic([{ body: chunk.trim()}]);
    }
  } catch (error) {
    return console.error('[ERROR]: ', error)
  }
})
.addAction({capture: true},
  new StructLayer(z.object({
    intention: z.enum(["CONVERSAR", "ORDENAR", "CANCELAR"])
  })).createCallback(async (ctx, { gotoFlow, state }) => {

    const intention = ctx?.schema?.intention;
    await handleHistory({ 
      role: 'user', 
      content: ctx.body 
    }, state);
    
    console.log('***INTENTION_CONVERSATION***', intention)

    if (intention === 'ORDENAR') { return gotoFlow(orderFlow) }
    else if (intention === 'CANCELAR') { return gotoFlow(cancelFlow) }
    else { return gotoFlow(conversationFlow) }  
  })
)

export { conversationFlow }