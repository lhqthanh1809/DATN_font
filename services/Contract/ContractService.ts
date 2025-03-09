import { IContract, ICreateContract } from "@/interfaces/ContractInterface";
import BaseService from "../BaseService";
import { IResponse } from "@/interfaces/ResponseInterface";
import { apiRouter } from "@/assets/ApiRouter";
import { HttpStatusCode } from "axios";
import { IError } from "@/interfaces/ErrorInterface";

export default class ContractService extends BaseService {
  public async createContract(data: ICreateContract): Promise<IContract | IError> {
    try {
      const res: IResponse = await this._service.https({
        method: "POST",
        url: apiRouter.createContract,
        body: data,
        authentication_requested: true,
      });

      if (!res || res.status >= HttpStatusCode.BadRequest) {
        return this.getErrorResponse(res);
      }
      return res.body?.data ?? null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }
}
