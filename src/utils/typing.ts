
// Esta funcion se encarga de enviar un evento de escritura a un chat para que salga el icono de escribiendo
export async function typing(ctx: any, provider: any) {
  if (provider && provider?.vendor && provider.vendor?.sendPresenceUpdate) {
    const id = ctx.key.remoteJid;
    await provider.vendor.sendPresenceUpdate('composing', id)
  }
}