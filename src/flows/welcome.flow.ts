import { EVENTS, addKeyword } from "@builderbot/bot";
import mainLayer from "~/layers/main.layer";

export default addKeyword(EVENTS.WELCOME)
	.addAction(mainLayer);
