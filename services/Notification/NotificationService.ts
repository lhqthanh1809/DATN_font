import {
  INotification,
  IRequestListNotification,
} from "@/interfaces/NotificationInterface";
import BaseService from "../BaseService";
import { IError } from "@/interfaces/ErrorInterface";
import { apiRouter } from "@/assets/apiRouter";
import { HttpStatusCode } from "axios";
import { IResponse } from "@/interfaces/ResponseInterface";

export default class NotificationService extends BaseService {
  public async list(
    data: IRequestListNotification
  ): Promise<INotification | IError> {
    try {
      const res : IResponse | IError = await this.https({
        method: "POST",
        url: apiRouter.listNotification,
        authentication_requested: true,
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
