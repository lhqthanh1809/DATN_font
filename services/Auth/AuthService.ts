import { IResponse } from "@/interfaces/ResponseInterface";
import { BaseHttpService } from "../BaseHttpService";
import { apiRouter } from "@/assets/apiRouter";
import { IError } from "@/interfaces/ErrorInterface";
import BaseService from "../BaseService";

export default class AuthService extends BaseService {
  public async login(data: {
    phone: string;
    token: string | null;
    password: string;
    rule: string
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

  public async register(data: {
    email?: string;
    phone: string;
    token: string | null;
    password: string;
  }): Promise<string | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.registerUser,
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

  public async refreshToken() {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.refreshToken,
        authentication_requested: true,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.access_token || null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async logout(token: string | null): Promise<string | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.logoutUser,
        body: { token },
        method: "POST",
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

  public async requestOTP({phone, token} : {phone: string, token?: string}): Promise<string | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.requestOtp,
        method: "POST",
        body: { phone, token },
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data || null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async verifyOTP(phone: string, otp: string): Promise<string | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.verifyOtp,
        method: "POST",
        body: { phone, otp },
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data || null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async resetPassword(
    phone: string,
    token: string,
    password: string
  ): Promise<string | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.resetPassword,
        method: "POST",
        body: { phone, token, password },
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
