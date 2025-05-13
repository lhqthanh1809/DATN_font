import {
  IChatHistory,
  ICreateChat,
  IListChat,
  IUpdateStatusChat,
} from "@/interfaces/ChatInterface";
import BaseService from "../BaseService";
import { IListResponse } from "@/interfaces/GeneralInterface";
import { IError } from "@/interfaces/ErrorInterface";
import { IResponse } from "@/interfaces/ResponseInterface";
import { apiRouter } from "@/assets/apiRouter";
import { constant } from "@/assets/constant";
import { IUser } from "@/interfaces/UserInterface";

export default class ChatService extends BaseService {
  public async listChatHistory(
    data: IListChat
  ): Promise<IListResponse<IChatHistory> | IError | null> {
    try {
      const res: IResponse | IError = await this.https({
        method: "POST",
        authentication_requested: true,
        body: data,
        url: apiRouter.listChat,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }

      return ((res as IResponse).body as IListResponse<IChatHistory>) || null;
    } catch (err: any) {
      return this.returnError(err);
    }
  }

  public async createChat(
    data: ICreateChat
  ): Promise<IChatHistory | IError | null> {
    try {
      const res: IResponse | IError = await this.https({
        method: "POST",
        authentication_requested: true,
        body: data,
        url: apiRouter.createChat,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }

      return (res as IResponse).body?.data || null;
    } catch (err: any) {
      return this.returnError(err);
    }
  }

  public async updateStatusChat(
    data: IUpdateStatusChat
  ): Promise<IChatHistory | IError> {
    try {
      const res: IResponse | IError = await this.https({
        method: "POST",
        authentication_requested: true,
        body: data,
        url: apiRouter.updateStatusChat,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }

      return (res as IResponse).body?.data;
    } catch (err: any) {
      return this.returnError(err);
    }
  }

  static getNameSender(message: IChatHistory, isLastName = false): string {
    if (message.sender_type === constant.object.type.user) {
      const fullName = (message.sender as IUser).full_name ?? "";
      const name = isLastName ? fullName.split(" ").pop() : fullName;
      return name ?? "";
    }

    if (message.sender_type === constant.object.type.lodging) {
      return "Chủ nhà";
    }

    return "Không xác định";
  }
}
