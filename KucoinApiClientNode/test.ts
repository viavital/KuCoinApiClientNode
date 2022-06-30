import { resolve } from "path";
import { changesType, marketSnapshotType } from "./Models/Types"
import { ChangesAcceptorService } from "./Services/ChangesAcceptorService.js";

const MS: marketSnapshotType = {
    "code": "200000",
    "data": {
        "time": 1656241650561,
        "sequence": "1632304311974",
        "bids": [
            [
                "21416.9",
                "0.00087538"
            ],
            [
                "21415.8",
                "0.34"
            ],
            [
                "21415.3",
                "0.00005814"
            ],
            [
                "21414.7",
                "0.46693897"
            ],
            [
                "21414",
                "0.35"
            ],
            [
                "21413.6",
                "0.58339246"
            ],
            [
                "21413.3",
                "1.12513388"
            ],
            [
                "21413.2",
                "0.31407227"
            ],
            [
                "21413.1",
                "1.23007772"
            ],
            [
                "21412.8",
                "0.2804"
            ],
            [
                "21412.6",
                "0.00301904"
            ],
            [
                "21412",
                "0.0014279"
            ],
            [
                "21411.8",
                "0.36211268"
            ],
            [
                "21411.7",
                "0.01168361"
            ],
            [
                "21411.6",
                "0.02336611"
            ],
            [
                "21410.6",
                "0.12"
            ],
            [
                "21410.5",
                "0.16217"
            ],
            [
                "21410.4",
                "0.32"
            ],
            [
                "21410.3",
                "0.03504806"
            ],
            [
                "21410",
                "0.00050752"
            ]
        ],
        "asks": [
            [
                "21417",
                "5.39389943"
            ],
            [
                "21417.1",
                "1.39026678"
            ],
            [
                "21417.7",
                "0.01"
            ],
            [
                "21417.8",
                "1.4230809"
            ],
            [
                "21417.9",
                "0.29168"
            ],
            [
                "21418",
                "0.16"
            ],
            [
                "21418.4",
                "0.13361087"
            ],
            [
                "21418.7",
                "0.33919559"
            ],
            [
                "21418.8",
                "0.08084907"
            ],
            [
                "21419",
                "0.14143101"
            ],
            [
                "21419.5",
                "0.01082195"
            ],
            [
                "21419.6",
                "2.68356414"
            ],
            [
                "21419.9",
                "0.68326"
            ],
            [
                "21420.9",
                "1.09188419"
            ],
            [
                "21421.1",
                "1.31638374"
            ],
            [
                "21421.2",
                "1.43665001"
            ],
            [
                "21421.3",
                "0.0044"
            ],
            [
                "21422.6",
                "0.09928"
            ],
            [
                "21423",
                "0.00002677"
            ],
            [
                "21423.2",
                "0.02102884"
            ]
        ]
    }
}
const buffer: changesType[] = [
	{"type":"message","topic":"/market/level2:BTC-USDT","subject":"trade.l2update","data":{"sequenceStart":1632304313874,"symbol":"BTC-USDT","changes":{"asks":[["21423","0","1632304313874"]],"bids":[]},"sequenceEnd":1632304313874}},
	{"type":"message","topic":"/market/level2:BTC-USDT","subject":"trade.l2update","data":{"sequenceStart":1632304313892,"symbol":"BTC-USDT","changes":{"asks":[],"bids":[["21415.8","0.11","1632304313892"]]},"sequenceEnd":1632304313892}},
	{"type":"message","topic":"/market/level2:BTC-USDT","subject":"trade.l2update","data":{"sequenceStart":1632304313897,"symbol":"BTC-USDT","changes":{"asks":[["21417.2","20","1632304313897"]],"bids":[]},"sequenceEnd":1632304313897}},
	{"type":"message","topic":"/market/level2:BTC-USDT","subject":"trade.l2update","data":{"sequenceStart":1632304313904,"symbol":"BTC-USDT","changes":{"asks":[],"bids":[["21414","0","1632304313904"]]},"sequenceEnd":1632304313904}}
];

const AccService = new ChangesAcceptorService();
const result = AccService.AcceptChanges(MS, buffer);
console.log(result.data.asks);
console.log(result.data.bids);

