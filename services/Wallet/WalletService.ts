import { IWallet } from "@/interfaces/WalletInterface";
import BaseService from "../BaseService";
import { IError } from "@/interfaces/ErrorInterface";
import { IResponse } from "@/interfaces/ResponseInterface";
import { apiRouter } from "@/assets/apiRouter";

export default class WalletService extends BaseService{
    public async detail(id : string) : Promise<IWallet | IError>{
          try {
            const res: IResponse | IError = await this.https({
              url: apiRouter.detailWallet.replace(":id", id),
              authentication_requested: true,
            });
      
            if (res.hasOwnProperty("message")) {
              return res as IError;
            }
            return (res as IResponse).body?.data || null;
          } catch (error: any) {
            return this.returnError(error);
          }  
    }
}