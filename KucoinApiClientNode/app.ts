import http, { STATUS_CODES } from 'http';
import { resolve } from 'path';
import { marketSnapshotType } from './Models/Types.js';
import { SupportPriceService } from './Services/SupportPriceService.js';

export class App {
	port: number;
	tradeSymbol: string;
	supportPriceService: SupportPriceService;

	constructor(tradeSymbol: string) {
		this.port = 8000;
		this.tradeSymbol = tradeSymbol;
		this.supportPriceService = new SupportPriceService(tradeSymbol);
	}

	public async Init(): Promise<void> {
		
		const IsDisconnected = this.supportPriceService.supportPrice(); // todo must work withoun awaiting this method
		http
			.createServer(async (request, response) => {
				response.setHeader('Content-Type', 'text/html');
				if (request.url === '/') {
					const snapshot = this.supportPriceService.marketSnapshot;
					if (snapshot != undefined) {
						if (snapshot.toString().includes('there was no responce from KuCoin server with token'))
						{
							response.write('there was no responce from KuCoin server with token');
						}
						if (this.CheckIsShitHappen(snapshot)){
							console.log("Occured mistake in Accepting changes");
						}

						const result = `Best bid price = ${snapshot.data.bids[0][0]} best ask price = ${snapshot.data.asks[0][0]}`;
						console.log(result);
						response.write(result);
					}
				} else {
					response.write('<h2>Page not found</h2>');
				}
				response.end();
			})
			.listen(this.port);
		console.log('Server started at http://localhost:8000');
	}

	CheckIsShitHappen(marketSnapshot: marketSnapshotType): boolean{
		if (Number(marketSnapshot.data.asks[0][0]) > Number(marketSnapshot.data.bids[0][0]) ) {
			return false;
		}
		return true;
	}
}
