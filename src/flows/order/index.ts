import { EVENTS, addKeyword } from "@builderbot/bot";
import AIClass from "~/ai/ai.class";
import { replacePromptWithInfo } from "~/utils/parsePrompt";
import { PROMPT_ORDER } from "./prompt";
import { getHistoryParse, handleHistory } from "~/utils/handleHistory";
import { StructLayer } from "@elimeleth/builderbot-langchain";
import { z } from "zod";
import { conversationFlow } from "../conversation";


export const orderFlow = addKeyword(EVENTS.ACTION)
.addAction({ capture: true }, async (ctx, { state, flowDynamic, extensions, provider }) => {
  try {
    const ai = extensions.ai as AIClass;
    const history = getHistoryParse(state);
    console.log('historyORDER', history);
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
    
    const clientData = ctx.body;
    await state.update({ clientData}) 
  } catch (error) {
    return console.error('[ORDER_FLOW_ERROR]: ', error);
  }
})
.addAction({ capture: true }, new StructLayer(z.object({
  intention: z.enum(["CONVERSAR", "ORDENAR"])
}).describe('Te encargaras de seguir el hilo de la conversacion para saber que intencion quiere la persona, ese es tu objetivo')).createCallback(async (ctx, { gotoFlow, state }) => {
  const intention = ctx?.schema?.intention;
  console.log('***INTENTION***', intention);
  if (intention === 'CONVERSAR') {
    return gotoFlow(conversationFlow);
  }
  if (intention === 'ORDENAR') {
    return gotoFlow(orderFlow);
  }
}))