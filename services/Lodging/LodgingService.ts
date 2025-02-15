import { IError } from "@/interfaces/ErrorInterface";
import { ILodging } from "@/interfaces/LodgingInterface";
import { BaseHttpService } from "../BaseHttpService";
import { IResponse } from "@/interfaces/ResponseInterface";
import { apiRouter } from "@/assets/ApiRouter";
import { HttpStatusCode } from "axios";

export default class LodgingService {
  private _server = new BaseHttpService();
  private _userId: string;

  public constructor(userId?: string) {
    this._userId = userId ?? "";
  }

  public async listByUser(): Promise<ILodging[] | IError> {
    try {
      const res: IResponse = await this._server.https({
        url: apiRouter.listLodgingByUser,
        authentication_requested: true,
      });

      return res.body?.data ?? [];
    } catch (error: any) {
      return {
        message: `Lỗi khi tải dữ liệu: ${error?.message || "Không xác định"}`,
        code: error?.code || HttpStatusCode.InternalServerError,
        details: error?.response || null,
      };
    }
  }

  public async create(data: ILodging): Promise<any | IError> {
    try {
      const res: IResponse = await this._server.https({
        method: "POST",
        url: apiRouter.createLodging,
        body: data,
        authentication_requested: true,
      });

      if (!res || res.status >= HttpStatusCode.BadRequest) {
        return {
          message: res.error?.[0].message,
          code: res.status,
        };
      }
      return res.body?.data ?? null;
    } catch (error: any) {
      return {
        message: `Lỗi khi tải dữ liệu: ${error?.message || "Không xác định"}`,
        code: error?.code || HttpStatusCode.InternalServerError,
        details: error?.response || null,
      };
    }
  }
}
