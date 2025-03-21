import { apiRouter } from "@/assets/ApiRouter";
import BaseService from "../BaseService";
import { IResponse } from "@/interfaces/ResponseInterface";
import { IError } from "@/interfaces/ErrorInterface";
import { IRoomService } from "@/interfaces/RoomServiceInterface";
import { ICloseRoomUsage, IRoomUsage } from "@/interfaces/RoomUsageInterface";

export default class RoomUsageService extends BaseService {

  public async listRoomUsageNeedClose(
    lodgingId: string
  ): Promise<IRoomUsage[] | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.listRoomUsageNeedClose,
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

  public async finalizedRoomUsage(data: ICloseRoomUsage) : Promise<IRoomService | IError>{
    try {
        const res: IResponse | IError = await this.https({
          url: apiRouter.closeRoomUsage,
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

