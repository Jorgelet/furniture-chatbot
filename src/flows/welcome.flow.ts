import { EVENTS, addKeyword } from "@builderbot/bot";
import conversationalLayer from "~/layers/conversational.layer";
import mainLayer from "~/layers/main.layer";

export default addKeyword(EVENTS.WELCOME)
.addAction(conversationalLayer)
.addAction(mainLayer);
