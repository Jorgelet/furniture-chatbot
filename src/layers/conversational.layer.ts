import { BotContext, BotMethods } from "@builderbot/bot/dist/types";
import { handleHistory } from "~/utils/handleHistory";
import { typing } from "~/utils/typing";


export default async ( ctx: BotContext, { state, provider }: BotMethods ) => {
  await handleHistory({ content: ctx.body, role: 'user' }, state)
  await typing(ctx, provider)
}