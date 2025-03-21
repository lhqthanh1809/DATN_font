import { apiRouter } from "@/assets/ApiRouter";
import { BaseHttpService } from "../BaseHttpService";
import { HttpStatusCode } from "axios";
import { IResponse } from "@/interfaces/ResponseInterface";
import { IPermission } from "@/interfaces/Permission";
import { IError } from "@/interfaces/ErrorInterface";
import BaseService from "../BaseService";

export default class PermissionService extends BaseService {
  private _lodgingId: string | null;
  constructor(lodgingId: string | null = null) {
    super()
    this._lodgingId = lodgingId;
  }

  public async listByUser(): Promise<IPermission[] | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.listPermissionByUser,
        authentication_requested: true,
        body: {
          lodging_id: this._lodgingId,
        },
      });
      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data || [];
    } catch (error: any) {
      return this.returnError(error);
    }
  }
}
