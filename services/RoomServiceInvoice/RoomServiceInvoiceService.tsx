import { apiRouter } from "@/assets/apiRouter";
import BaseService from "../BaseService";
import { IResponse } from "@/interfaces/ResponseInterface";
import { IError } from "@/interfaces/ErrorInterface";
import { IRoomService } from "@/interfaces/RoomServiceInterface";
import { ICloseRoomUsage, IRoomServiceInvoice } from "@/interfaces/RoomServiceInvoiceInterface";

export default class RoomServiceInvoiceService extends BaseService {

  public async listRoomServiceNeedClose(
    lodgingId: string
  ): Promise<IRoomServiceInvoice[] | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.listRoomServiceNeedClose,
        authentication_requested: true,
        body: {
          lodging_id: lodgingId,
        },
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data ?? [];
    } catch (error) {
      return this.returnError(error);
    }
  }

  public async finalizedRoomService(data: ICloseRoomUsage) : Promise<IRoomService | IError>{
    try {
        const res: IResponse | IError = await this.https({
          url: apiRouter.closeRoomService,
          authentication_requested: true,
          method: "POST",
          body: data,
        });
  
        if (res.hasOwnProperty("message")) {
          return res as IError;
        }
        return (res as IResponse).body?.data ?? null;
      } catch (error) {
        return this.returnError(error);
      }
  }
}

