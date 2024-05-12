import { BotContext, BotMethods } from "@builderbot/bot/dist/types";

import { typing } from "~/utils/typing";
import { handleHistory } from "~/utils/handleHistory";

export default async function ( ctx: BotContext, { state, provider }: BotMethods ) {
  await handleHistory({ 
    content: ctx.body, 
    role: 'user' 
  }, state);
  await typing(ctx, provider)
}