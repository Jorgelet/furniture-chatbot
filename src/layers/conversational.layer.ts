import { BotContext, BotMethods } from "@builderbot/bot/dist/types";

import { typing } from "~/utils/typing";
import { handleHistory } from "~/utils/handleHistory";

// Este layer se encarga de manejar la conversacion con el usuario
export default async function ( ctx: BotContext, { state, provider }: BotMethods ) {
  await handleHistory({ 
    content: ctx.body, 
    role: 'user' 
  }, state);
  await typing(ctx, provider)
}