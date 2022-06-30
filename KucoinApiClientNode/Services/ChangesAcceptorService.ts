import { changesType, marketSnapshotType } from "../Models/Types";

export class ChangesAcceptorService {

	public AcceptChanges(marketSnapshot: marketSnapshotType, bufferOfChanges: changesType[]): marketSnapshotType {
	
		for (const notation of bufferOfChanges) {
			if (notation.data.sequenceEnd >= Number(marketSnapshot.data.sequence)) {
				if (notation.data.changes.bids.length > 0){
					this.UpdatePrice(notation.data.changes.bids, marketSnapshot.data.bids);
				}

				if (notation.data.changes.asks.length > 0){
					this.UpdatePrice(notation.data.changes.asks, marketSnapshot.data.asks);
				}
				marketSnapshot.data.sequence = notation.data.sequenceEnd.toString();
			}
		}
		marketSnapshot.data.asks = this.FormatSnapshot(marketSnapshot.data.asks, "asks");
		marketSnapshot.data.bids = this.FormatSnapshot(marketSnapshot.data.bids, "bids");
		return marketSnapshot;
	}

	private UpdatePrice(PriceArray: string[][], SnapshotPricesArr : string[][]) {
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
	private FormatSnapshot(PriceArray: string[][], sortingPrices: string): string[][] {
		if (sortingPrices === "asks") {
			return PriceArray.filter( u => u[1] != "0").sort(function (a,b) {return Number(a[0]) - Number(b[0])}).slice(0,20);
		}
		else if(sortingPrices === "bids"){
			return PriceArray.filter( u => u[1] != "0").sort(function (a,b) {return Number(b[0]) - Number(a[0])}).slice(0,20);
		}
		else
		console.log("error in FormatSnapshot function [ChangesAcceptorService.FormatSnapshot()...]");
		return PriceArray;
	}
}



