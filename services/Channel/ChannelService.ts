import { IError } from "@/interfaces/ErrorInterface";
import BaseService from "../BaseService";
import { IChannel, ILeaveChannel, IListChannel } from "@/interfaces/ChannelInterface";
import { IResponse } from "@/interfaces/ResponseInterface";
import { apiRouter } from "@/assets/apiRouter";
import { IListResponse } from "@/interfaces/GeneralInterface";

export default class ChannelService extends BaseService {
  public async listChannel(
    data: IListChannel
  ): Promise<IListResponse<IChannel> | IError | null> {
    try {
      const res: IResponse | IError = await this.https({
        method: "POST",
        authentication_requested: true,
        body: data,
        url: apiRouter.listChannel,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }

      return ((res as IResponse).body as IListResponse<IChannel>) || null;
    } catch (err: any) {
      return this.returnError(err);
    }
  }

  public async leaveChannel(
    data: ILeaveChannel
  ): Promise<string | IError> {
    try {
      const res: IResponse | IError = await this.https({
        method: "POST",
        authentication_requested: true,
        body: data,
        url: apiRouter.leaveChannel,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }

      return (res as IResponse).body?.data;
    } catch (err: any) {
      return this.returnError(err);
    }
  }
}
