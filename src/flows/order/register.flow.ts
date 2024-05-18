import { BaileysProvider } from "@builderbot/provider-baileys";
import { EVENTS, MemoryDB, addKeyword } from "@builderbot/bot";

import { clearHistory } from "~/utils/handleHistory";
import { addClient, phoneNumbers } from "~/services/SheetService";


// Este flow se encarga de registrar un nuevo cliente
export const registerFlow = addKeyword<BaileysProvider, MemoryDB>(EVENTS.ACTION)
.addAnswer('Perfecto! Ahora vamos a comenzar con la toma de datos ✍️')
.addAnswer('¿Cuál es su nombre y apellido?', { capture: true }, async(ctx, { state }) => {
  await state.update({ name: ctx.body });
})
.addAnswer('¿Cuál es su dirección?', { capture: true }, async(ctx, { state }) => {
  await state.update({ address: ctx.body });
})
.addAnswer('¿Cuál es su email?', { capture: true }, async(ctx, { state }) => {
  await state.update({ email: ctx.body });
})
.addAnswer('¿Cuál es su cedula?', { capture: true }, async(ctx, { state }) => {
  await state.update({ dni: ctx.body });
})
.addAnswer('Gracias, pronto un miembro de nuestro equipo se contactara con usted para aclarar cualquier duda que tenga 🤗', 
null, 
async(_, { provider, state }) => {
  const name = state.get('name');
  const address = state.get('address');
  const email = state.get('email');
  const dni = state.get('dni');
  
  const text = `Nuevo cliente:
  Nombre: ${name}
  Dirección: ${address}
  Email: ${email}
  Cedula: ${dni}
  `;

  await addClient(name, address, email, dni);

  for(const number of phoneNumbers){
    provider.sendText(number.concat('@s.whatsapp.net'), text)
  }

  clearHistory(state)
})