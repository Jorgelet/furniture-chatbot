import process from 'node:process';
import { createBot } from '@builderbot/bot'

import { flow } from './flows';
import { database } from './database';
import { provider } from './provider';
import AIClass from './services/OpenAIService';

process.loadEnvFile();

const ai = new AIClass(process.env.OPENAI_API_KEY); // Aqui se crea una instancia del servicio de OpenAI
const PORT = process.env.PORT ?? 3000; // Aqui se indica el puerto en el que se ejecutará el servidor HTTP

async function main() {
	const { httpServer, handleCtx } = await createBot(
		{
			provider, // Aqui te conectas con el proveedor que puede ser Meta, Twilio, Baileys, etc.
			flow, // Aqui se definen todos los flujos de conversación que tendrá tu bot
			database, // Aqui se define la base de datos que usará tu bot que puede ser Mongo, Memory, etc.
		},
		{
			queue: { 
				timeout: 20000,
				concurrencyLimit: 50
			},
			extensions: { // Aqui usas las extensiones que necesites en este caso el servicio de OpenAI
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

	httpServer(+PORT); // Aqui se inicia el servidor HTTP
}

main();