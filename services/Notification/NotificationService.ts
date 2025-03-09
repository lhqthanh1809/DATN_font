import {
  INotification,
  IRequestListNotification,
} from "@/interfaces/NotificationInterface";
import BaseService from "../BaseService";
import { IError } from "@/interfaces/ErrorInterface";
import { apiRouter } from "@/assets/ApiRouter";
import { HttpStatusCode } from "axios";

export default class NotificationService extends BaseService {
  public async list(
    data: IRequestListNotification
  ): Promise<INotification | IError> {
    try {
      const res = await this._service.https({
        method: "POST",
        url: apiRouter.listNotification,
        authentication_requested: true,
        body: data,
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
