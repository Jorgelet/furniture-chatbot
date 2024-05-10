import { MemoryDB, addKeyword } from "@builderbot/bot";
import { BaileysProvider } from "@builderbot/provider-baileys";

import { addClient, phoneNumbers } from "~/services/SheetService";

export const registerFlow = addKeyword<BaileysProvider, MemoryDB>(['Comprar'])
.addAnswer('Claro para proceder con la compra y coordinar la entrega necesitaria confirmar tus datos')
.addAnswer('¿Cuál mueble le interesaba?', { capture: true }, async(ctx, { state } ) => {
  await state.update({ product: ctx.body });
})
.addAnswer('¿Cuál es su nombre y apellido?', { capture: true }, async(ctx, { state }) => {
  await state.update({ name: ctx.body });
})
.addAnswer('¿Cuál es su número de teléfono?', { capture: true }, async(ctx, { state }) => {
  await state.update({ phone: ctx.body });
})
.addAnswer('¿Cuál es su dirección?', { capture: true }, async(ctx, { state }) => {
  await state.update({ address: ctx.body });
})
.addAction(async(ctx, { provider, state }) => {
  const product = state.get('product');
  const name = state.get('name');
  const phone = state.get('phone');
  const address = state.get('address');  

  const text = `El cliente ${name} esta interesado en ${product} y desea comprarlo, sus datos son: 
  Nombre: ${name} 
  Telefono: ${phone} 
  Direccion: ${address} 
  Por favor contactar con el cliente lo antes posible para coordinar la entrega.`
  
  await addClient(name, phone, address, product);

  for(const number of phoneNumbers){
    provider.sendText(number.concat('@s.whatsapp.net'), text)
    provider.sendMessage(number.concat('@s.whatsapp.net'), text, {})
  }
})