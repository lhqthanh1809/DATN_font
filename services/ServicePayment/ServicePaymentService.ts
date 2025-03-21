import { IListServicePayment, IServicePayment } from "@/interfaces/ServicePaymentInterface";
import BaseService from "../BaseService";
import { IError } from "@/interfaces/ErrorInterface";
import { IResponse } from "@/interfaces/ResponseInterface";
import { apiRouter } from "@/assets/ApiRouter";

export default class ServicePaymentService extends BaseService{
      public async list(data: IListServicePayment, cancelToken?: any): Promise<IServicePayment[] | IError> {
        try {
          const res: IResponse | IError = await this.https({
            body: data,
            authentication_requested: true,
            method: "POST",
            url: apiRouter.listServicePayment,
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