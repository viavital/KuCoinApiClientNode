type ms = {
	time: number;
	sequence: string;
	bids: string[][];
	asks: string[][];
};

type ch = {
	sequenceStart: number;
	symbol: string;
	changes: {
		asks: string[][];
		bids: string[][];
	};
	sequenceEnd: number;
};

export class ChangesAcceptorService {
	AcceptChanges(marketSnapshot: any, bufferOfChanges: any[]) {
		const typedMarketSnapshot: ms = JSON.parse(JSON.stringify(marketSnapshot));

		for (const item of bufferOfChanges) {
			if (item.sequenceStart >= typedMarketSnapshot.sequence) {
				if (item.changes.bids.length > 0 && item.changes.bids[0][0] !== '0') {
					const changingBids: string[] | undefined = typedMarketSnapshot.bids.find(
						(i) => i[0] === item.changes.bids[0][0],
					);
					if (changingBids != undefined) {
						changingBids[1] = item.changes.bids[0][1];
						console.log('changed Bids');
					}
				}
				if (item.changes.asks.length > 0 && item.changes.asks[0][0] !== '0') {
					const changingAsks: string[] | undefined = typedMarketSnapshot.asks.find(
						(i) => i[0] === item.changes.asks[0][0],
					);
					if (changingAsks != undefined) {
						changingAsks[1] = item.changes.asks[0][1];
						console.log('changed asks');
					}
				}
			}
		}
		console.log(typedMarketSnapshot);
		return typedMarketSnapshot;
	}
}
