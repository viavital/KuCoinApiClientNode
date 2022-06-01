import { Http2ServerRequest } from "http2";

import http from "http";
import { PassThrough } from "stream";

export class App {
	port: number;

	constructor() {
		this.port = 8000;
	}
	
	public async Init(){http.createServer(function(request, response){
     
		response.setHeader("Content-Type", "application/json");
		
		if(request.url === "/"){
			response.write("<h2>HomePage</h2>");
		}
		else{
			response.write("<h2>Not found</h2>");
		}
		response.end();
	}).listen(this.port);}
}
