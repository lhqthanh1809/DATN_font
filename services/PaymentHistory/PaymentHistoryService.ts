import { IListResponse } from "@/interfaces/GeneralInterface";
import BaseService from "../BaseService";
import {
  IListPaymentHistory,
  IPaymentHistory,
} from "@/interfaces/PaymentHistoryInterface";
import { IError } from "@/interfaces/ErrorInterface";
import { apiRouter } from "@/assets/apiRouter";
import { IResponse } from "@/interfaces/ResponseInterface";

export default class PaymentHistoryService extends BaseService {
  public async list(
    data: IListPaymentHistory
  ): Promise<IListResponse<IPaymentHistory> | IError> {
    try {
      const res: IResponse | IError = await this.https({
        authentication_requested: true,
         body: data,
         method: "POST",
        url: apiRouter.listPaymentHistory,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return ((res as IResponse).body as IListResponse<IPaymentHistory>);
    } catch (err: any) {
      return this.returnError(err);
    }
  }
}
