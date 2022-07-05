import http, { STATUS_CODES } from 'http';
import { marketSnapshotType } from './Models/Types.js';
import { SupportPriceService } from './Services/SupportPriceService.js';
import winston, { level } from 'winston';
import { getDateTimeNow } from './Models/dateTimeModel.js';
import fs from 'fs'


export class App {
	port: number;
	tradeSymbol: string;
	supportPriceService: SupportPriceService;
	logger: winston.Logger;

	constructor(tradeSymbol: string) {
		this.clearLogger();
		this.port = 8000;
		this.tradeSymbol = tradeSymbol;
		this.logger = winston.createLogger({
			transports: [
			  new winston.transports.Console(),
			  new winston.transports.File({ filename: './loggerStorage/error.log', level: 'error'}),
			  new winston.transports.File({ filename: './loggerStorage/app.loggerInfo.log' }),
			  new winston.transports.File({ filename: './loggerStorage/app.loggerdebug.log', level: 'debug' }),
			  
			]
		  });
		this.supportPriceService = new SupportPriceService(tradeSymbol, this.logger);		
	};

	public async Init(): Promise<void> {	
		const IsDisconnected = this.supportPriceService.supportPrice(); 
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
							this.logger.error(getDateTimeNow() + "shit happen in counting snapshot - check your function \'acceptChanges\'");							
						}

						const result = `Best bid price = ${snapshot.data.bids[0][0]} best ask price = ${snapshot.data.asks[0][0]}`;
						this.logger.info(getDateTimeNow() + result);
						response.write(result);
					}
				} else {
					response.write('<h2>Page not found</h2>');
				}
				response.end();
			})
			.listen(this.port);
		this.logger.info(getDateTimeNow()  + " Server started at http://localhost:8000");		
	};

	private CheckIsShitHappen(marketSnapshot: marketSnapshotType): boolean{
		if (Number(marketSnapshot.data.asks[0][0]) > Number(marketSnapshot.data.bids[0][0]) ) {
			return false;
		}
		return true;
	};

	private clearLogger() {
		fs.unlink('./loggerStorage/app.loggerInfo.log', (err) => {
         	if (err) console.log(err);
		});
		fs.unlink('./loggerStorage/error.log', (err) => {
			if (err) console.log(err);			
	    });
	    fs.unlink('./loggerStorage/app.loggerdebug.log', (err) => {
		if (err) console.log(err)
		else console.log('logger.log is clear');
  		}		
	)};
}


