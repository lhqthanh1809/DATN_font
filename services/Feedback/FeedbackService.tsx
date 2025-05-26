import {
  ICreateFeedback,
  IFeedback,
  IListFeedback,
  IUpdateFeedback,
} from "@/interfaces/FeedbackInterface";
import BaseService from "../BaseService";
import { IError } from "@/interfaces/ErrorInterface";
import { apiRouter } from "@/assets/apiRouter";
import { HttpStatusCode } from "axios";
import { reference } from "@/assets/reference";
import { IResponse } from "@/interfaces/ResponseInterface";
import { IListResponse } from "@/interfaces/GeneralInterface";

export default class FeedbackService extends BaseService {
  public async createFeedback(data: FormData): Promise<IFeedback | IError> {
    try {
      const res = await this.https({
        url: apiRouter.createFeedback,
        method: "POST",
        body: data,
        authentication_requested: true,
        formData_requested: true,
      });
      if ("message" in res) {
        return this.getErrorResponse(res);
      }
      return res.body?.data;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async list(
    data: IListFeedback,
    cancelToken: any
  ): Promise<IListResponse<IFeedback> | IError> {
    try {
      const res: IResponse | IError = await this.https({
        method: "POST",
        url: apiRouter.listFeedback,
        authentication_requested: true,
        body: data,
        cancelToken,
      });

      if ("message" in res) {
        return res as IError;
      }

      return res.body as IListResponse<IFeedback>;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async detail(id: string): Promise<IFeedback | IError> {
    try {
      const res: IResponse = await this.https({
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
      const res: IResponse = await this.https({
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

  public async delete(id: string): Promise<string | IError> {
    try {
      const res: IResponse = await this.https({
        url: apiRouter.deleteFeedback.replace(":id", id),
        method: "DELETE",
        authentication_requested: true,
      });

      if ("message" in res) {
        return res as IError;
      }

      return res.body?.data;
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
