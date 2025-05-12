import { IError } from "@/interfaces/ErrorInterface";
import { IPaymentContract, IPaymentUser } from "@/interfaces/PaymentInterface";
import BaseService from "../BaseService";
import { IResponse } from "@/interfaces/ResponseInterface";
import { apiRouter } from "@/assets/apiRouter";
import { reference } from "@/assets/reference";

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

  public async paymentByUser(data: IPaymentUser): Promise<string | IError> {
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

  static getReferenceStatusPayment(status: number) {
    return status in reference.payment.status
      ? reference.payment.status[
          status as keyof typeof reference.payment.status
        ]
      : reference.undefined;
  }

  static getReferencePaymentMethod(method: string) {
    return method in reference.payment.method
      ? reference.payment.method[
          method as keyof typeof reference.payment.method
        ]
      : reference.other;
  }
}
