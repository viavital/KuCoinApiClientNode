import { App } from './app.js';

async function bootstrap() {
	const app = new App('BTC-USDT');
	await app.Init();
}

bootstrap();
