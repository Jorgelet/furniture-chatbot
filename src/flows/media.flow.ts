import path from "node:path";
import process from "node:process";
import { addKeyword, EVENTS } from "@builderbot/bot";
import { BaileysProvider } from "@builderbot/provider-baileys";
import { UrlToBase64 } from "@builderbot-plugins/url-to-base64";

import { orderFlow } from "./order";
import { crumpJump } from "~/utils/crumpJump";
import AIClass from "~/services/OpenAIService";
import { phoneNumbers } from "~/services/SheetService";


const filePath = path.join(process.cwd(), 'src', 'database', 'images');
const localPaths = [];
const AiResponses = [];
let isFurnitures: boolean;
const PROMPT_IMAGE = `
Como un experto en la fabricación de muebles personalizados con años de experiencia, 
tu tarea es analizar la imagen proporcionada determinar si es un mueble o no. 

Si la imagen proporcionada no es un mueble o es cualquier otra imagen diferente a un mueble responder con 'NOT_FURNITURE'. 
Si es un mueble o enseres movibles que sirven para los usos necesarios o para decorar casas, oficinas y todo género de locales responder con 'FURNITURE'. 

Siempre responder con una de estas dos opciones: 'FURNITURE' o 'NOT_FURNITURE'

### RESPUESTA IDEAL (FURNITURE|NOT_FURNITURE)
`;
let messageSent = false;

export const mediaFlow = addKeyword<BaileysProvider>(EVENTS.MEDIA)
.addAction(async(ctx, { provider, queue }) => { 

  await queue.enqueue('processImage', async () => {
    const localPath = await provider.saveFile(ctx, { path: filePath });
    localPaths.push(localPath);
    for (const number of phoneNumbers) {
      provider.sendImage(number.concat('@s.whatsapp.net'), localPath, 'El cliente quiere saber el precio de este mueble');
      crumpJump(filePath);
    }
  }, 'imageProcessingTask');

  await queue.processQueue('processImage');
  await queue.clearQueue('processImage');
})
.addAction({delay: 5000}, async (_, { extensions, flowDynamic, gotoFlow, queue }) => {
  const ai = extensions.ai as AIClass;

  await queue.enqueue('aiResponse', async () => {
    for(const path of localPaths) {
      const { data, mimetype } = UrlToBase64.fromFilePath(path)
      const aiResponse = await ai.readImage(data, PROMPT_IMAGE, mimetype);
      AiResponses.push(aiResponse)
    }
    console.log('AI RESPONSES', AiResponses)
    isFurnitures = null
    const isFurniture = AiResponses.every(response => !response.includes('NOT_FURNITURE'));
    isFurnitures = isFurniture
    console.log('IS FURNITURES', isFurnitures)
  }, 'aiResponseTask');

  await queue.enqueue('aiMessage', async () => {
    if(!isFurnitures && !messageSent) {
      messageSent = true;
      return await flowDynamic('Ups! Asegurate de enviar una foto correcta de un mueble')
    }  
    else if (isFurnitures && !messageSent) {
      await flowDynamic('Perfecto ahora vamos a necesitar que nos proporciones algunos datos para continuar con el proceso de cotizacion')
      return gotoFlow(orderFlow)
    } 
  }, 'aiMessageTask')
  
  await queue.processQueue('aiResponse');
  await queue.clearQueue('aiResponse');

  await queue.processQueue('aiMessage');
  await queue.clearQueue('aiMessage');

  queue.clearAndDone('aiResponse', {fingerIdRef: 'aiResponseTask'})
  queue.clearAndDone('aiMessage', {fingerIdRef: 'aiMessageTask'})

  messageSent = false;
  localPaths.length = 0;
  AiResponses.length = 0;
  isFurnitures = null;
})