import { EVENTS, addKeyword } from "@builderbot/bot";
import { StructLayer } from "@elimeleth/builderbot-langchain";
import z from "zod";

import AIClass from "../../ai/ai.class";
import { PROMPT_CONVERSATION } from "./prompt";
import { getHistoryParse, handleHistory } from "~/utils/handleHistory";
import { replacePromptWithInfo } from "~/utils/parsePrompt";
import { orderFlow } from "../order";

const conversationFlow = addKeyword(EVENTS.ACTION).addAction(async (_, {state, flowDynamic, extensions}) => {
  try {
    const ai = extensions.ai as AIClass
    const history = getHistoryParse(state)
    console.log('history', history)
    const prompt = replacePromptWithInfo(PROMPT_CONVERSATION, history)
    const text = await ai.createChat([
      {
        role: 'system',
        content: prompt
      }
    ]);

    await handleHistory(
      {
        role: 'assistant',
        content: text
      }, 
      state
    );

    const chunks = text.split(/(?<!\d)\.\s+/g);
    for (const chunk of chunks) {
      await flowDynamic([{ body: chunk.trim()}]);
    }
  } catch (error) {
    return console.error('[ERROR]: ', error)
  }
})
// .addAction({capture: true},
//   new StructLayer(z.object({
//     intention: z.enum(["CONVERSAR", "ORDENAR"])
//   }).describe('te encargaras de seguir el hilo para saber que intencion quiere la persona, de entender que quiere ordenar, dilo, ese es tu objetivo')).createCallback(async (ctx, { gotoFlow, fallBack, state }) => {
//     const intention = ctx?.schema?.intention;

//     console.log('***INTENTION1***', intention)
//     if (intention === 'CONVERSAR') {
//       return gotoFlow(conversationFlow)
//     } else if (intention === 'ORDENAR') {
//       return gotoFlow(orderFlow)
//     } 
//   })
// )

export { conversationFlow }