import path from "node:path";
import process from "node:process";
import { addKeyword, EVENTS } from "@builderbot/bot";
import { BaileysProvider } from "@builderbot/provider-baileys";

import { crumpJump } from "~/utils/crumpJump";
import { phoneNumbers } from "~/services/SheetService";
import { conversationFlow } from "./conversation";


const filePath = path.join(process.cwd(), 'src', 'database', 'images');
export const mediaFlow = addKeyword<BaileysProvider>(EVENTS.MEDIA)
.addAction(async(ctx, { provider, queue }) => { 
  queue.enqueue('processImage', async () => {
    const localPath = await provider.saveFile(ctx, { path: filePath });
    for (const number of phoneNumbers) {
      provider.sendImage(number.concat('@s.whatsapp.net'), localPath, 'El cliente quiere saber el precio de este mueble');
      crumpJump(filePath);
    }
    console.log('***LOCALPATH***', localPath);
  }, 'imageProcessingTask');
})
.addAnswer('En un momento vamos a revisar tu foto', 
  {delay: 800},
  null,
  [conversationFlow]
)