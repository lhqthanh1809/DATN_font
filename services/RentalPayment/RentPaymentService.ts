import { IListRental, IRentPayment } from "@/interfaces/RentalPaymentInterface";
import BaseService from "../BaseService";
import { IError } from "@/interfaces/ErrorInterface";
import { apiRouter } from "@/assets/apiRouter";
import { IResponse } from "@/interfaces/ResponseInterface";

export default class RentPaymentService extends BaseService {
  public async list(data: IListRental, cancelToken?: any): Promise<IRentPayment[] | IError> {
    try {
      const res: IResponse | IError = await this.https({
        body: data,
        authentication_requested: true,
        method: "POST",
        url: apiRouter.listRentalPayment,
        cancelToken
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data || [];
    } catch (err: any) {
      return this.returnError(err);
    }
  }

  public async detail(id: string): Promise<IRentPayment | IError> {
    try {
      const res: IResponse | IError = await this.https({
        authentication_requested: true,
        url: apiRouter.detailRentalPayment.replace(":id", id),
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data || [];
    } catch (err: any) {
      return this.returnError(err);
    }
  }
}
