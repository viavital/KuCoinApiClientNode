import fetch from 'node-fetch';
import WebSocket, { Data } from 'ws';
import { SubscriptionMessageModel } from '../Models/SubscriptionMessModel.js';
import { WelcomeMessageModel } from '../Models/WelcomeMessageModel';
import { ChangesAcceptorService } from '../Services/ChangesAcceptorService.js';
import EventEmitter from 'events';
import { marketSnapshotType } from '../Models/Types.js';
import { resolve } from 'path';
 

export class SupportPriceService {
	tradeSymbol: string;
	marketSnapshot?: marketSnapshotType;
	bufferOfChanges: any[];
	isBufferFilled: boolean;
	events: EventEmitter;
	ws?: WebSocket;
	changesAcceptorService: ChangesAcceptorService;
	readonly preparationTcs: Promise<boolean>;
	private preparationTcsResult?: (data: boolean) => void;

	constructor(tradeSymbol: string) {
		this.tradeSymbol = tradeSymbol;
		this.isBufferFilled = false;
		this.bufferOfChanges = new Array<any>();
		this.events = new EventEmitter();
		this.changesAcceptorService = new ChangesAcceptorService();
		this.preparationTcs = new Promise<boolean>((resolve) => {this.preparationTcsResult = resolve});
	}

	public async supportPrice(): Promise<boolean> {

		const connectionStringToWebsocket: string = await this.getConnectionStringWebSocket();		
		this.ws = new WebSocket(connectionStringToWebsocket);
		this.ws.on('open', () => {
			console.log('connected to websocket');
		});
		this.ws.on('message', this.wsMessageHandler);
		this.ws.on('close', () =>{
			console.log("socket disconnected");
			if (this.preparationTcsResult != undefined){
				this.preparationTcsResult(true);
			}				
		})
		const isPrepared = await this.preparationTcs;
		return false;
	}

	private async getConnectionStringWebSocket(): Promise<string> {
		const responseKucoinTokenMessage = await fetch('https://api.kucoin.com/api/v1/bullet-public', {
			method: 'POST',
			body: '',
		});
		if (responseKucoinTokenMessage == undefined) {
			return 'bad request to KuCoin [GetConnectionStringWebSocket()]';
		}
		const data: any = await responseKucoinTokenMessage.json();
		const token: string = data.data.token;
		const instanceServers: string = data.data.instanceServers[0].endpoint;
		console.log('received token' + token);
		return instanceServers + '?token=' + token;
	}

	private wsMessageHandler = (data: Data): Promise<void> => { return new Promise<void>((resolve) => {	
			if (data !== null && data !== undefined && data.toString().includes('welcome')) {
			const welcomeMess: WelcomeMessageModel = JSON.parse(data.toString());
			console.log('received Welcome message from Websocket');
			const subscriptionMessage = new SubscriptionMessageModel(this.tradeSymbol);
			console.log('created and sent sunscription message');
			const subscriptionMessageJS = JSON.stringify(subscriptionMessage);
			console.log(subscriptionMessage);
			if (this.ws != undefined) {
				this.ws.send(subscriptionMessageJS);
			}
			else
			console.log('error - websocket is undefined')
			resolve();
		}			
		if (data !== null && data !== undefined && data.toString().includes('ack')) {
			this.makeSnapshot(this.tradeSymbol).then(
				(value) => {
					this.marketSnapshot  = value;
				},
				() => 'rejected fetch',
			);
			
		}
		if (data !== null && data !== undefined && data.toString().includes('trade.l2update')) {
			this.bufferOfChanges.push(JSON.parse(data.toString()));
			if(this.bufferOfChanges.length >=300){
				if (this.marketSnapshot != undefined) {
					this.marketSnapshot = this.changesAcceptorService.AcceptChanges(this.marketSnapshot, this.bufferOfChanges);
					this.bufferOfChanges = new Array<any>();
				}
			}		
		}
		resolve();
	})}

	private makeSnapshot = (tradeSymbol:string) : Promise<marketSnapshotType> => new Promise(async (resolve) => {
			const snapShotUri =	`https://api.kucoin.com/api/v1/market/orderbook/level2_20?symbol=` + tradeSymbol;
			const responseMarketSnapshot = await fetch(snapShotUri, { method: 'GET' });
			const responseMarketSnapshotJson = await responseMarketSnapshot.json();			
			resolve(responseMarketSnapshotJson as marketSnapshotType);
	});		
}

	 