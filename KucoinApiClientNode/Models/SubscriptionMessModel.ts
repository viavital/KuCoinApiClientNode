export class SubscriptionMessageModel {
     id: string;                          //The id should be an unique value
     type: string;          // subscribe
     topic: string;                       //"/market/ticker:BTC-USDT,ETH-USDT"  Some topics support to divisional subscribe the informations of multiple trading pairs through ",".
     privateChannel: boolean;     //Adopted the private channel or not. Set as false by default.
     response: boolean;  

    constructor(topic : string){
       this.id =String(this.getRandomInt(10000000, 99999999));
       this.type = "subscribe";     
       this.topic= "/market/level2:"+ topic;
       this.privateChannel = false; 
       this.response = true; 
    }

     getRandomInt(min:number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;}
      
}

