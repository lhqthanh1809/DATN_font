import { reference } from "@/assets/reference";
import BaseService from "../BaseService";
import { apiRouter } from "@/assets/apiRouter";
import { IError } from "@/interfaces/ErrorInterface";
import { IListResponse } from "@/interfaces/GeneralInterface";
import { IListByWallet, ITransaction } from "@/interfaces/TransactionInterface";
import { IResponse } from "@/interfaces/ResponseInterface";

export default class TransactionService extends BaseService {
  public async listByWallet(data: IListByWallet, cancelToken?: any): Promise<IListResponse<ITransaction> | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.listTransactionByWallet,
        method: "POST",
        body: data,
        authentication_requested: true,
        ...(cancelToken && cancelToken)
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return ((res as IResponse).body as IListResponse<ITransaction>);
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public getReferenceType(type: string) {
    return type in reference.transaction.type
      ? reference.transaction.type[
          type as keyof typeof reference.transaction.type
        ]
      : reference.other;
  }
}
