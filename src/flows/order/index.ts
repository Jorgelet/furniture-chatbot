import { EVENTS, addKeyword } from "@builderbot/bot";
import AIClass from "~/ai/ai.class";
import { replacePromptWithInfo } from "~/utils/parsePrompt";
import { PROMPT_ORDER } from "./prompt";
import { getHistoryParse, handleHistory } from "~/utils/handleHistory";
import { StructLayer } from "@elimeleth/builderbot-langchain";
import { z } from "zod";
import { conversationFlow } from "../conversation";
import mainLayer from "~/layers/main.layer";
import { cancelFlow } from "../cancel";
import { registerFlow } from "./register.flow";



export const orderFlow = addKeyword(EVENTS.ACTION)
.addAction(async (ctx, { state, flowDynamic, extensions, globalState }) => {
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
}), [registerFlow]) 