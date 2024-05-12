import process from 'node:process';
import { createBot } from '@builderbot/bot'

import { flow } from './flows';
import { database } from './database';
import { provider } from './provider';
import AIClass from './services/OpenAIService';

process.loadEnvFile();

const ai = new AIClass(process.env.OPENAI_API_KEY);
const PORT = process.env.PORT ?? 3000;

async function main() {
	const { httpServer, handleCtx } = await createBot(
		{
			provider,
			flow,
			database,
		},
		{
			queue: {
				timeout: 20000,
				concurrencyLimit: 50
			},
			extensions: {
				ai,
			},
		}
	);
	
	provider.server.post('/v1/messages', handleCtx(async (bot, req, res) => {
		const { number, message } = req.body;
		console.log(req.body)
		await bot.sendMessage(number, message)
		return res.end('sended');
	}));

	httpServer(+PORT);
}

main();