import http, { STATUS_CODES } from 'http';
import { RootRouteHandler } from './Routes/RootRouteHandler.js';

export class App {
	port: number;
	tradeSymbol: string;
	rootRouteHandler: RootRouteHandler;

	constructor(tradeSymbol: string) {
		this.port = 8000;
		this.tradeSymbol = tradeSymbol;
		this.rootRouteHandler = new RootRouteHandler(tradeSymbol);
	}

	public async Init(): Promise<void> {
		const rootRouteHandler = this.rootRouteHandler;
		http
			.createServer(async (request, response) => {
				response.setHeader('Content-Type', 'text/html');
				if (request.url === '/') {
					const snapshot: any = await rootRouteHandler.HandleRootRoute();
					if (snapshot.toString().includes('there was no responce from KuCoin server with token')) {
						response.write('there was no responce from KuCoin server with token');
					}
					const result = `Best bid price = ${snapshot.bids[0][0]} best ask price = ${snapshot.asks[0][0]}`;
					console.log(result);
					response.write(result);
					this.rootRouteHandler = new RootRouteHandler(this.tradeSymbol);
				} else {
					response.write('<h2>Not found</h2> ');
				}
				response.end();
			})
			.listen(this.port);
		console.log('Server started at http://localhost:8000');
	}
}
