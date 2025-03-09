import {
  ICreateFeedback,
  IFeedback,
  IListFeedback,
  IUpdateFeedback,
} from "@/interfaces/FeedbackInterface";
import BaseService from "../BaseService";
import { IError } from "@/interfaces/ErrorInterface";
import { apiRouter } from "@/assets/ApiRouter";
import { HttpStatusCode } from "axios";
import { reference } from "@/assets/reference";
import { IResponse } from "@/interfaces/ResponseInterface";

export default class FeedbackService extends BaseService {
  public async createFeedback(
    data: ICreateFeedback
  ): Promise<IFeedback | IError> {
    try {
      const res = await this._service.https({
        url: apiRouter.createFeedback,
        method: "POST",
        body: data,
        authentication_requested: true,
      });
      if (!res || res.status >= HttpStatusCode.BadRequest) {
        return this.getErrorResponse(res);
      }
      return res.body?.data;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async listFeedbackByUser(
    cancelToken: any,
    data?: IListFeedback
  ): Promise<IFeedback[] | IError> {
    try {
      const res = await this._service.https({
        url: apiRouter.listFeedbackByUser,
        authentication_requested: true,
        cancelToken,
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

  public async list(
    data: IListFeedback,
    cancelToken: any
  ): Promise<IFeedback[] | IError> {
    try {
      const res: IResponse = await this._service.https({
        method: "POST",
        url: apiRouter.listFeedback,
        body: data,
        cancelToken,
      });

      return res.body?.data ?? [];
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async detail(id: string): Promise<IFeedback | IError> {
    try {
      const res: IResponse = await this._service.https({
        url: apiRouter.detailFeedback.replace(":id", id),
      });

      return res.body?.data ?? null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async updateStatus(
    data: IUpdateFeedback
  ): Promise<IFeedback | IError> {
    try {
      const res: IResponse = await this._service.https({
        url: apiRouter.updateStatusFeedback,
        method: "POST",
        authentication_requested: true,
        body: data,
      });

      if (!res || res.status >= HttpStatusCode.BadRequest) {
        return this.getErrorResponse(res);
      }

      return res.body?.data ?? null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public getReferenceToStatus(status: number) {
    return status in reference.feedback.status
      ? reference.feedback.status[
          status as keyof typeof reference.feedback.status
        ]
      : reference.undefined;
  }
}
