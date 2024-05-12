import { createFlow } from "@builderbot/bot";

import { orderFlow } from "./order";
import { cancelFlow } from "./cancel";
import { mediaFlow } from "./media.flow";
import welcomeFlow from "./welcome.flow";
import { conversationFlow } from "./conversation";

export const flow = createFlow([
	welcomeFlow,
	conversationFlow,
	orderFlow,
	cancelFlow,
	mediaFlow
]);
