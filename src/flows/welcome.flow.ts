import { EVENTS, addKeyword } from "@builderbot/bot";

import mainLayer from "~/layers/main.layer";
import conversationalLayer from "~/layers/conversational.layer";

export default addKeyword(EVENTS.WELCOME)
.addAction(conversationalLayer)
.addAction(mainLayer);
