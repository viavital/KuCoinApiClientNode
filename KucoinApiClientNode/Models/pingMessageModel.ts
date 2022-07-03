function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export class PingMessage{
    id: number;
    type: string;
    constructor(){
        this.id = getRandomIntInclusive(100000000, 999999999);
        this.type = "ping";
    }
}