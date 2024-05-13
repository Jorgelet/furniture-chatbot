import path from "node:path";
import fs from "node:fs/promises";
import process from "node:process";
import { addKeyword, EVENTS } from "@builderbot/bot";
import { BaileysProvider } from "@builderbot/provider-baileys";
import { UrlToBase64 } from "@builderbot-plugins/url-to-base64";

import { PROMPT_IMAGE } from "./prompt";
import { crumpJump } from "~/utils/crumpJump";
import AIClass from "~/services/OpenAIService";
import { phoneNumbers } from "~/services/SheetService";
import { registerFlow } from "../order/register.flow";


const filePath = path.join(process.cwd(), 'src', 'database', 'images');
const localPaths = [];

export const mediaFlow = addKeyword<BaileysProvider>(EVENTS.MEDIA)
.addAction(async(ctx, { provider, queue }) => { 

  await queue.enqueue('processImage', async () => {
    const localPath = await provider.saveFile(ctx, { path: filePath });
    localPaths.push(localPath);
  }, 'imageProcessingTask');

  console.log('LocalPaths', localPaths);
  await queue.processQueue('processImage');
  await queue.clearQueue('processImage');
  queue.clearAndDone('processImage', {fingerIdRef: 'imageProcessingTask'});
})
.addAction(async (_, { extensions, provider, flowDynamic, gotoFlow, fallBack, endFlow }) => {

  const ai = extensions.ai as AIClass;
  
  for(const path of localPaths) {
    const { data, mimetype } = UrlToBase64.fromFilePath(path);    
    const aiResponse = await ai.readImage(data, PROMPT_IMAGE, mimetype);

    if(aiResponse.includes('NOT_FURNITURE')) {
      console.log('AI RESPONSE', aiResponse);
      for(const filePath of localPaths) {
        await fs.unlink(filePath);
      }
      localPaths.length = 0;
      return endFlow('Ups! Asegurate de enviar una foto correcta de un mueble');
    }   
  }

  for(const localPath of localPaths) {
    for(const number of phoneNumbers) {
      provider.sendImage(number.concat('@s.whatsapp.net'), localPath, 'El cliente quiere saber el precio de este mueble');
      crumpJump(localPath);
    }
  }
  
  await flowDynamic('Perfecto ahora vamos a necesitar que nos proporciones algunos datos para continuar con el proceso de cotizacion')
  localPaths.length = 0;
  console.log('FINALLL')
  return gotoFlow(registerFlow)
})