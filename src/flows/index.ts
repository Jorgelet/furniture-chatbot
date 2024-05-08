import { createFlow } from "@builderbot/bot";
import { conversationFlow } from "./conversation";
import welcomeFlow from "./welcome.flow";
import { mediaFlow } from "./media.flow";

export const flow = createFlow([
	welcomeFlow,
	conversationFlow,
	mediaFlow
]);
