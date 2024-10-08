import { EVENTS, addKeyword } from "@builderbot/bot";

import { conversationFlow } from "../conversation";

// Este flow se encarga de cancelar la conversación
export const cancelFlow = addKeyword(EVENTS.ACTION)
.addAnswer("Disculpa por la confusión")
.addAnswer("¿Hay algo más en lo que pueda ayudarle?")
.addAction(async (_, { gotoFlow }) => {
  return gotoFlow(conversationFlow)
})