var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import http from "http";
export class App {
    constructor() {
        this.port = 8000;
    }
    Init() {
        return __awaiter(this, void 0, void 0, function* () {
            http.createServer(function (request, response) {
                response.setHeader("Content-Type", "application/json");
                if (request.url === "/") {
                    response.write("<h2>HomePage</h2>");
                }
                else {
                    response.write("<h2>Not found</h2>");
                }
                response.end();
            }).listen(this.port);
        });
    }
}
