import path from "node:path";
import fs from "node:fs/promises";
import process from "node:process";
import { addKeyword, EVENTS } from "@builderbot/bot";
import { BaileysProvider } from "@builderbot/provider-baileys";
import { UrlToBase64 } from "@builderbot-plugins/url-to-base64";

import { PROMPT_IMAGE } from "./prompt";
import { cronJob } from "~/utils/cronJob";
import { debounce } from "~/utils/debounce";
import AIClass from "~/services/OpenAIService";
import { registerFlow } from "../order/register.flow";
import { phoneNumbers } from "~/services/SheetService";


const filePath = path.join(process.cwd(), 'src', 'database', 'images');
const localPaths = [];
let debouncedEndFlow:(...args: any[]) => void;
let debouncedGoToFlow:(...args: any[]) => void;

export const mediaFlow = addKeyword<BaileysProvider>(EVENTS.MEDIA)
.addAction(async(ctx, { provider, queue }) => { 
  await queue.enqueue('processImage', async () => {
    const localPath = await provider.saveFile(ctx, { path: filePath });
    localPaths.push(localPath);
  }, 'imageProcessingTask');

  await queue.processQueue('processImage');
  await queue.clearQueue('processImage');
  queue.clearAndDone('processImage', {fingerIdRef: 'imageProcessingTask'});
})
.addAction(async (_, { extensions, provider, gotoFlow, endFlow }) => {

  if(debouncedEndFlow === undefined || debouncedEndFlow === null){
    debouncedEndFlow = debounce(endFlow, 1500);
  }
  if (debouncedGoToFlow === undefined || debouncedGoToFlow === null) {
    debouncedGoToFlow = debounce(gotoFlow, 1500);
  }
  
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
      return debouncedEndFlow('Ups! Asegurate de enviar una foto correcta de un mueble');
    }   
  }

  for(const localPath of localPaths) {
    for(const number of phoneNumbers) {
      provider.sendImage(number.concat('@s.whatsapp.net'), localPath, 'El cliente quiere saber el precio de este mueble');
      cronJob(localPath);
    }
  }  
  
  localPaths.length = 0;
  return debouncedGoToFlow(registerFlow)
})