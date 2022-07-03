import { changesType, marketSnapshotType } from "../Models/Types";

export class ChangesAcceptorService {

	public acceptChanges(marketSnapshot: marketSnapshotType, bufferOfChanges: Map<number, changesType>): marketSnapshotType | undefined {
	
		for (const notation of bufferOfChanges.values()) {
			if (notation.data.sequenceEnd >= Number(marketSnapshot.data.sequence)) {
				if ((notation.data.sequenceStart - Number(marketSnapshot.data.sequence)) > 1) {
					return undefined;
				}
				if (notation.data.changes.bids.length > 0){
					this.updatePrice(notation.data.changes.bids, marketSnapshot.data.bids);
				}

				if (notation.data.changes.asks.length > 0){
					this.updatePrice(notation.data.changes.asks, marketSnapshot.data.asks);
				}
				marketSnapshot.data.sequence = notation.data.sequenceEnd.toString();
			}
		}
		marketSnapshot.data.asks = this.formatSnapshot(marketSnapshot.data.asks, "asks");
		marketSnapshot.data.bids = this.formatSnapshot(marketSnapshot.data.bids, "bids");
		return marketSnapshot;
	}

	private updatePrice(PriceArray: string[][], SnapshotPricesArr : string[][]) {
		for (const change of PriceArray) {
			if (change[0] !== '0') {
				const changingPrice: string[] | undefined = SnapshotPricesArr.find(
					(i) => i[0] === change[0],
				);
				if (changingPrice != undefined) {
					changingPrice[1] = change[1];
				}
				else{
					const newPrice = [change[0], change[1]];
					SnapshotPricesArr.push(newPrice);
				}
			}
		}
	}
	private formatSnapshot(PriceArray: string[][], sortingPrices: string): string[][] {
		if (sortingPrices === "asks") {
			return PriceArray.filter( u => u[1] != "0").sort(function (a,b) {return Number(a[0]) - Number(b[0])}).slice(0,20);
		}
		else if(sortingPrices === "bids"){
			return PriceArray.filter( u => u[1] != "0").sort(function (a,b) {return Number(b[0]) - Number(a[0])}).slice(0,20);
		}
		else
		console.log("error in formatSnapshot function [ChangesAcceptorService.formatSnapshot()...]");
		return PriceArray;
	}
}



