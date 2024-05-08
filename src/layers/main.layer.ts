import z from "zod";
import { StructLayer } from "@elimeleth/builderbot-langchain";
import { typing } from "~/utils/typing";
import { INTENTION_PROMPT } from "./prompt";
import { conversationFlow } from "~/flows/conversation";
import { getHistoryParse, handleHistory } from "~/utils/handleHistory";
import { replaceOnlyHistory } from "~/utils/parsePrompt";
import { orderFlow } from "~/flows/order";

export default new StructLayer(z.object({
  intention: z.enum(["ORDENAR", "CONVERSAR"])
}).describe('analizaras la intencion del usuario'), 
{ 
  modelName: "openai", 
  args: {
    modelName: "openai", 
    apikey: "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"
  } 
}).createCallback(async (ctx, { provider, gotoFlow, state }) => {
    const history = getHistoryParse(state);
    await handleHistory({ role: 'user', content: ctx.body }, state)
    const prompt = replaceOnlyHistory(INTENTION_PROMPT, history)
    const intention = ctx?.schema?.intention
    console.log('**intentionMAINLAYER***',{ intention })
    await typing(ctx, provider)
    try {
      if (intention === 'CONVERSAR' || intention == undefined) {
        console.log('Nos fuimos a conversarrr')
        return gotoFlow(conversationFlow)
      }
      if (intention === 'ORDENAR') {
        console.log('Nos fuimos a ordenarr')
        return gotoFlow(orderFlow)
      }
    } catch (err) {
      console.error('[ERROR]: ', err)
    }
})

