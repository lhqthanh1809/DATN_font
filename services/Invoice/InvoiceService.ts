import { IListResponse } from "@/interfaces/GeneralInterface";
import BaseService from "../BaseService";
import { IRoomRentalHistory } from "@/interfaces/RoomRentalHistoryInterface";
import { IRoomServiceInvoice } from "@/interfaces/RoomServiceInvoiceInterface";
import { IError } from "@/interfaces/ErrorInterface";
import { IResponse } from "@/interfaces/ResponseInterface";
import { apiRouter } from "@/assets/apiRouter";
import { IDetailInvoice, IListInvoice } from "@/interfaces/InvoiceInterface";

export default class InvoiceService extends BaseService{
      public async list(
        data: IListInvoice, cancelToken: any
      ): Promise<IListResponse<IRoomRentalHistory | IRoomServiceInvoice> | IError> {
        try {
          const res: IResponse | IError = await this.https({
            method: "POST",
            authentication_requested: true,
            body: data,
            url: apiRouter.listInvoice,
            cancelToken
          });
    
          if (res.hasOwnProperty("message")) {
            return res as IError;
          }
    
          return ((res as IResponse).body as IListResponse<IRoomRentalHistory | IRoomServiceInvoice>) || null;
        } catch (err: any) {
          return this.returnError(err);
        }
      }


      public async detail(
        data: IDetailInvoice
      ): Promise<IRoomRentalHistory | IRoomServiceInvoice | IError> {
        try {
          const res: IResponse | IError = await this.https({
            method: "POST",
            authentication_requested: true,
            body: data,
            url: apiRouter.detailInvoice,
          });
    
          if (res.hasOwnProperty("message")) {
            return res as IError;
          }
    
          return (res as IResponse).body?.data || null;
        } catch (err: any) {
          return this.returnError(err);
        }
      }
}