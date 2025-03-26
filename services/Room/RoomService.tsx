import { IRoom, IRoomFilter } from "@/interfaces/RoomInterface";
import BaseService from "../BaseService";
import { IError } from "@/interfaces/ErrorInterface";
import { IResponse } from "@/interfaces/ResponseInterface";
import { apiRouter } from "@/assets/ApiRouter";
import { HttpStatusCode } from "axios";

export default class RoomService extends BaseService {
  private _lodgingId: string | null;

  public constructor(lodgingId: string | null = null) {
    super();
    this._lodgingId = lodgingId;
  }

  public get lodgingId(): string | null {
    return this._lodgingId;
  }

  public set lodgingId(value: string | null) {
    this._lodgingId = value;
  }

  public async create(data: IRoom): Promise<IRoom | IError | null> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.createRoom,
        authentication_requested: true,
        method: "POST",
        body: { ...data, lodging_id: this._lodgingId },
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data ?? null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async detail(id: string): Promise<IRoom | IError | null> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.detailRoom.replace(":id", id),
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data ?? null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async update(data: IRoom, id: string): Promise<IRoom | IError | null> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.updateRoom,
        authentication_requested: true,
        method: "POST",
        body: { ...data, lodging_id: this._lodgingId, id: id },
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data ?? null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async delete(
    id: string,
  ): Promise<any | IError> {
    if (!this._lodgingId) {
      return {
        message: "Lỗi không xác định được nhà trọ",
      };
    }
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.deleteRoom,
        authentication_requested: true,
        method: "DELETE",
        body: { room_id: id, lodging_id: this._lodgingId },
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body ?? null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async listByLodging(
    body?: Record<any, any>
  ): Promise<IRoom[] | IError> {
    if (!this._lodgingId) {
      return {
        message: "Lỗi không xác định được nhà trọ",
      };
    }
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.listRoomByLodging.replace(
          ":lodging_id",
          this._lodgingId
        ),
        body: body,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data ?? [];
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async filter(data: IRoomFilter): Promise<IRoom[] | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.filterRoom,
        method: "POST",
        body: data,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data ?? [];
    } catch (error: any) {
      return this.returnError(error);
    }
  }
}
