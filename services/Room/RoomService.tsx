import { IRoom } from "@/interfaces/RoomInterface";
import BaseService from "../BaseService";
import { IError } from "@/interfaces/ErrorInterface";
import { IResponse } from "@/interfaces/ResponseInterface";
import { apiRouter } from "@/assets/ApiRouter";
import { HttpStatusCode } from "axios";

export default class RoomService extends BaseService {
  private _lodgingId: string;

  public constructor(lodgingId: string) {
    super();
    this._lodgingId = lodgingId;
  }

  public async create(data: IRoom): Promise<IRoom | IError | null> {
    try {
      const res: IResponse = await this._service.https({
        url: apiRouter.createRoom,
        authentication_requested: true,
        method: "POST",
        body: { ...data, lodging_id: this._lodgingId },
      });

      if (!res || res.status >= HttpStatusCode.BadRequest) {
        return this.getErrorResponse(res);
      }
      return res.body?.data ?? null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async listByLodging(): Promise<IRoom[] | IError> {
    try {
      const res: IResponse = await this._service.https({
        url: apiRouter.listRoomByLodging.replace(":id", this._lodgingId),
      });

      if (!res || res.status >= HttpStatusCode.BadRequest) {
        return this.getErrorResponse(res);
      }
      return res.body?.data ?? [];
    } catch (error: any) {
      return this.returnError(error);
    }
  }
}
