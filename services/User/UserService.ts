import { IResponse } from "@/interfaces/ResponseInterface";
import { BaseHttpService } from "../BaseHttpService";
import { apiRouter } from "@/assets/ApiRouter";
import { HttpStatusCode } from "axios";
import { IError } from "@/interfaces/ErrorInterface";
import BaseService from "../BaseService";

export default class UserService extends BaseService {
  public async info(): Promise<any | IError> {
    try {
      const res: IResponse = await this._service.https({
        url: apiRouter.infoUser,
        authentication_requested: true,
      });
      return res.body?.data || null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }
}
