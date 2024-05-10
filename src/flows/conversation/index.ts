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
.addAction({capture: true},
  new StructLayer(z.object({
    intention: z.enum(["CONVERSAR", "ORDENAR", "CANCELAR"])
  })).createCallback(async (ctx, { gotoFlow, state }) => {
    const intention = ctx?.schema?.intention;

    await handleHistory({ role: 'user', content: ctx.body }, state)
    
    console.log('***INTENTION_CONVERSATION***', intention)

    if (intention === 'CONVERSAR' || intention == undefined) {
      return gotoFlow(conversationFlow)
    } else if (intention === 'ORDENAR') {
      return gotoFlow(orderFlow)
    } else {
      return gotoFlow(conversationFlow)
    }
  })
)

export { conversationFlow }