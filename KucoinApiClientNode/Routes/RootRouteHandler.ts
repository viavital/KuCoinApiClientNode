import express, { Response } from 'express';
import fetch from 'node-fetch';
import { buffer } from 'node:stream/consumers';
import { resolve } from 'path';
import WebSocket, { Data } from 'ws';
import { SubscriptionMessageModel } from '../Models/SubscriptionMessModel.js';
import { WelcomeMessageModel } from '../Models/WelcomeMessageModel';
import { ChangesAcceptorService } from '../Services/ChangesAcceptorService.js';

export class RootRouteHandler {
	buffer: string[];
	tradeSymbol: string;
	isBufferFilled: boolean;
	readonly preparationTcs: Promise<boolean>;
	private preparationTcsResult?: (data: boolean) => void;

	constructor(tradeSymbol: string) {
		this.tradeSymbol = tradeSymbol;
		this.buffer = [];
		this.preparationTcs = new Promise<boolean>((resolve) => {
			this.preparationTcsResult = resolve;
		});
		this.isBufferFilled = false;
	}

	public async HandleRootRoute(): Promise<any> {
		console.log('Server received request ');
		let marketSnapshot: any;
		let bufferOfChanges: any[] = [];
		// eslint-disable-next-line no-async-promise-executor
		const makeSnapshot: Promise<any> = new Promise(async (resolve, reject) => {
			const responseMarketSnapshot = await fetch(
				'https://api.kucoin.com/api/v1/market/orderbook/level2_20?symbol=' + this.tradeSymbol,
				{ method: 'GET' },
			);
			const responseMarketSnapshotJson: any = await responseMarketSnapshot.json();
			resolve(responseMarketSnapshotJson.data);
		});

		const responseKucoinTokenMessage = await fetch('https://api.kucoin.com/api/v1/bullet-public', {
			method: 'POST',
			body: '',
		});
		if (responseKucoinTokenMessage == undefined) {
			return { response: 'there was no responce from KuCoin server with token' };
		}
		const data: any = await responseKucoinTokenMessage.json();
		const token: string = data.data.token;
		const instanceServers: string = data.data.instanceServers[0].endpoint;
		console.log('received token' + token);
		const ws: WebSocket = new WebSocket(instanceServers + '?token=' + token);
		ws.on('open', async function open(): Promise<void> {
			console.log('connected to websocket');
		});
		ws.on('message', (data: Data): void => {
			if (data !== null && data !== undefined && data.toString().includes('welcome')) {
				const welcomeMess: WelcomeMessageModel = JSON.parse(data.toString());
				console.log('received Welcome message from Websocket');
				const subscriptionMessage = new SubscriptionMessageModel(this.tradeSymbol);
				console.log('created and sent sunscription message');
				const subscriptionMessageJS = JSON.stringify(subscriptionMessage);
				console.log(subscriptionMessage);
				ws.send(subscriptionMessageJS);
				return;
			}
			if (data !== null && data !== undefined && data.toString().includes('trade.l2update')) {
				if (!this.isBufferFilled) {
					if (bufferOfChanges.length === 1000) {
						console.log('Buffer has been filled');
						this.isBufferFilled = true;
						if (this.preparationTcsResult != undefined) {
							this.preparationTcsResult(true);
						}
						return;
					}
					bufferOfChanges.push(JSON.parse(data.toString()).data);
				}
			}
		});
		// eslint-disable-next-line prefer-const
		marketSnapshot = await makeSnapshot.then(
			(value) => value,
			() => 'rejected fetch',
		);
		console.log(marketSnapshot, typeof makeSnapshot, 'waiting for buffer');
		await this.preparationTcs;
		const changesAcceptorService = new ChangesAcceptorService();
		marketSnapshot = changesAcceptorService.AcceptChanges(marketSnapshot, bufferOfChanges);
		bufferOfChanges = [];
		return marketSnapshot;
	}
}
