import { IBaseMessage } from "./BaseMessageModel"

class TokenDataObject{
    instanceServers?: object[];
    token?: string;
}

export class GetTokenMessageModel {
    code?: number;
    data?: TokenDataObject;
};