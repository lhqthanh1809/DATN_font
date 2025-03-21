import { HttpStatusCode } from "axios";
import BaseService from "../BaseService";
import { apiRouter } from "@/assets/ApiRouter";
import { IError } from "@/interfaces/ErrorInterface";
import { IResponse } from "@/interfaces/ResponseInterface";
import { IService } from "@/interfaces/ServiceInterface";
import { constant } from "@/assets/constant";
import { reference } from "@/assets/reference";

export default class ServiceManagerService extends BaseService {
  public async listService(): Promise<IService[] | IError> {
    try {
      const res: IResponse = await this.https({
        url: apiRouter.listService,
      });
      return res.body?.data || [];
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public getReferenceService(data: any) {
    return data.name in reference.service
      ? reference.service[data.name as keyof typeof reference.service]
      : reference.other;
  }
}
