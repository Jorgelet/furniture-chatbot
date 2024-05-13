import { createFlow } from "@builderbot/bot";

import { mediaFlow } from "./media";
import { orderFlow } from "./order";
import { cancelFlow } from "./cancel";
import welcomeFlow from "./welcome.flow";
import { conversationFlow } from "./conversation";
import { registerFlow } from "./order/register.flow";

export const flow = createFlow([
	welcomeFlow,
	conversationFlow,
	orderFlow,
	cancelFlow,
	registerFlow,
	mediaFlow
]);