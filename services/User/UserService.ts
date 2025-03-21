import { IResponse } from "@/interfaces/ResponseInterface";
import { BaseHttpService } from "../BaseHttpService";
import { apiRouter } from "@/assets/ApiRouter";
import { HttpStatusCode } from "axios";
import { IError } from "@/interfaces/ErrorInterface";
import BaseService from "../BaseService";
import { IUnit } from "@/interfaces/UnitInterface";
import { IUser } from "@/interfaces/UserInterface";

export default class UserService extends BaseService {
  public async login(data: {
    phone: string;
    token: string | null;
    password: string;
  }): Promise<string | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.loginUser,
        method: "POST",
        body: data,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.access_token || null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async info(): Promise<IUser | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.infoUser,
        authentication_requested: true,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }

      return (res as IResponse).body?.data || null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async update(data: IUser): Promise<IUser | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.updateUser,
        method: "POST",
        body: data,
        authentication_requested: true,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data || null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }
}
