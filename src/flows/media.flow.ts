import path from "node:path";
import process from "node:process";
import { addKeyword, EVENTS } from "@builderbot/bot";
import { BaileysProvider } from "@builderbot/provider-baileys";

import { crumpJump } from "~/utils/crumpJump";
import { phoneNumbers } from "~/services/SheetService";


const filePath = path.join(process.cwd(), 'src', 'database', 'images');
export const mediaFlow = addKeyword<BaileysProvider>(EVENTS.MEDIA)
.addAnswer('¡Gracias por compartir la foto del mueble que te interesa! Estoy verificando nuestra disponibilidad actual para este artículo', null, async(ctx, { provider }) => {
  const localPath = await provider.saveFile(ctx, { path: filePath })
  console.log('***CTXMEDIA***', ctx.body)
  for (const number of phoneNumbers) {
    provider.sendImage(number.concat('@s.whatsapp.net'), localPath, 'El cliente quiere saber el precio de este mueble')
    crumpJump(filePath)
  }
})
.addAnswer('Un miembro de nuestro equipo se comunicará contigo lo antes posible para proporcionarte más detalles', 
  { capture: true }, 
  async (ctx, { endFlow }) => {
    return endFlow('¡Gracias por tu paciencia y interés en nuestros muebles!');
  }
)
