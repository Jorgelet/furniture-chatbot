import z from "zod";
import { StructLayer } from "@elimeleth/builderbot-langchain";

import { typing } from "~/utils/typing";
import { orderFlow } from "~/flows/order";
import { cancelFlow } from "~/flows/cancel";
import { INTENTION_PROMPT } from "./prompt";
import { conversationFlow } from "~/flows/conversation";
import { getHistoryParse } from "~/utils/handleHistory";
import { replaceOnlyHistory } from "~/utils/parsePrompt";

export default new StructLayer(z.object({
  intention: z.enum(["CONVERSAR", "ORDENAR", "CANCELAR"])
}).describe('analizaras la intencion del usuario'), 
{ 
  modelName: "openai", 
  args: {
    modelName: "openai", 
    apikey: process.env.OPENAI_API_KEY
  } 
}).createCallback(async (ctx, { provider, gotoFlow, state }) => {
    const history = getHistoryParse(state);
    const prompt = replaceOnlyHistory(INTENTION_PROMPT, history)
    const intention = ctx?.schema?.intention

    console.log('INTENTION_MAIN_LAYER: ', intention)
    await typing(ctx, provider)
    try {
      if (intention === 'ORDENAR') {
        console.log('Nos fuimos a ORDENAR')
        return gotoFlow(orderFlow)
      } else if (intention === 'CANCELAR') {
        console.log('Nos fuimos a CANCELAR')
        return gotoFlow(cancelFlow)
      } else {
        console.log('Nos fuimoss a conversarr')
        return gotoFlow(conversationFlow)
      }
    } catch (err) {
      console.error('[ERROR]: ', err)
    }
})