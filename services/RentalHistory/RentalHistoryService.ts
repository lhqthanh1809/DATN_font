import { IListRental, IRentalHistory } from "@/interfaces/RentalInterface";
import BaseService from "../BaseService";
import { IError } from "@/interfaces/ErrorInterface";
import { apiRouter } from "@/assets/ApiRouter";
import { IResponse } from "@/interfaces/ResponseInterface";

export default class RentalHistory extends BaseService {
  public async list(data: IListRental, cancelToken?: any): Promise<IRentalHistory[] | IError> {
    try {
      const res: IResponse | IError = await this.https({
        body: data,
        authentication_requested: true,
        method: "POST",
        url: apiRouter.listRentalHistory,
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
}
