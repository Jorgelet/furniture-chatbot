import { createProvider } from "@builderbot/bot";
import { BaileysProvider } from "@builderbot/provider-baileys";

// Aqui se crea una instancia del proveedor de Baileys
export const provider = createProvider(BaileysProvider);