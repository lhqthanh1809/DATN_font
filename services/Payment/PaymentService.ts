import { IError } from "@/interfaces/ErrorInterface";
import { IPaymentContract, IPaymentUser } from "@/interfaces/PaymentInterface";
import BaseService from "../BaseService";
import { IResponse } from "@/interfaces/ResponseInterface";
import { apiRouter } from "@/assets/apiRouter";

export class PaymentService extends BaseService {
  public async paymentByContract(
    data: IPaymentContract
  ): Promise<string | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.paymentByContract,
        method: "POST",
        authentication_requested: true,
        body: data,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data ?? null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async paymentByUser(
    data: IPaymentUser
  ): Promise<string | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.paymentByUser,
        method: "POST",
        authentication_requested: true,
        body: data,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data ?? null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }
}
