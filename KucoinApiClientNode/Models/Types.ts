type bids = string[];
type asks = string[];

export type marketSnapshotType = {
    code: string;
    data: {
        time: number;
        sequence: string;
        bids: bids[];
        asks: asks[];
    };
}

export type changesType = {
    type: string;
    topic: string;
    subject: string;
    data: {
        sequenceStart: number;
        symbol: string;
        changes: {
            asks: asks[] ;
            bids: bids[];
        };
        sequenceEnd: number;
    };
}