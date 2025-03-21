import { apiRouter } from "@/assets/ApiRouter";
import { IError } from "@/interfaces/ErrorInterface";
import { ILodging } from "@/interfaces/LodgingInterface";
import { IResponse } from "@/interfaces/ResponseInterface";
import BaseService from "../BaseService";

export default class ClientService extends BaseService {
  public async listLodgingAndRoomFromContractByUser(
    data?: any
  ): Promise<ILodging[] | IError> {
    try {
      const res: IResponse = await this.https({
        url: apiRouter.listLodgingAndRoomByUser,
        authentication_requested: true,
        body: data,
      });

      return res.body?.data ?? [];
    } catch (error: any) {
      return this.returnError(error);
    }
  }
}
