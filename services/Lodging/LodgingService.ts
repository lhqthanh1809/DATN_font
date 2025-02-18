import { IError } from "@/interfaces/ErrorInterface";
import { ILodging } from "@/interfaces/LodgingInterface";
import { BaseHttpService } from "../BaseHttpService";
import { IResponse } from "@/interfaces/ResponseInterface";
import { apiRouter } from "@/assets/ApiRouter";
import { HttpStatusCode } from "axios";
import BaseService from "../BaseService";

export default class LodgingService extends BaseService {
  private _userId: string;

  public constructor(userId?: string) {
    super();
    this._userId = userId ?? "";
  }

  public async listByUser(): Promise<ILodging[] | IError> {
    try {
      const res: IResponse = await this._service.https({
        url: apiRouter.listLodgingByUser,
        authentication_requested: true,
      });

      return res.body?.data ?? [];
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async create(data: ILodging): Promise<any | IError> {
    try {
      const res: IResponse = await this._service.https({
        method: "POST",
        url: apiRouter.createLodging,
        body: data,
        authentication_requested: true,
      });

      if (!res || res.status >= HttpStatusCode.BadRequest) {
        return this.getErrorResponse(res);
      }
      return res.body?.data ?? null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }
}
