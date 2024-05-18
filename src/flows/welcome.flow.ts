import { EVENTS, addKeyword } from "@builderbot/bot";

import mainLayer from "~/layers/main.layer";
import conversationalLayer from "~/layers/conversational.layer";

// Este flow se encarga de dar la bienvenida al usuario
export default addKeyword(EVENTS.WELCOME)
.addAction(conversationalLayer)
.addAction(mainLayer);
