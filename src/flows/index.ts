import { createFlow } from "@builderbot/bot";
import { conversationFlow } from "./conversation";
import welcomeFlow from "./welcome.flow";
import { mediaFlow } from "./media.flow";
import { orderFlow } from "./order";
import { cancelFlow } from "./cancel";

export const flow = createFlow([
	welcomeFlow,
	conversationFlow,
	orderFlow,
	cancelFlow,
	mediaFlow
]);
