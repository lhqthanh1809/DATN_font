import {
  IContract,
  ICreateContract,
  IListContract,
} from "@/interfaces/ContractInterface";
import BaseService from "../BaseService";
import { IResponse } from "@/interfaces/ResponseInterface";
import { apiRouter } from "@/assets/ApiRouter";
import { HttpStatusCode } from "axios";
import { IError } from "@/interfaces/ErrorInterface";
import { reference } from "@/assets/reference";

export default class ContractService extends BaseService {
  public async createContract(
    data: ICreateContract
  ): Promise<IContract | IError> {
    try {
      const res: IResponse | IError = await this.https({
        method: "POST",
        url: apiRouter.createContract,
        body: data,
        authentication_requested: true,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data ?? null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async listContract(
    data: IListContract
  ): Promise<IContract[] | IError> {
    try {
      const res: IResponse | IError = await this.https({
        method: "POST",
        authentication_requested: true,
        body: data,
        url: apiRouter.listContract,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }

      return (res as IResponse).body?.data || [];
    } catch (err: any) {
      return this.returnError(err);
    }
  }

  public async detail(contractId: string): Promise<IContract | IError> {
    try {
      const res: IResponse | IError = await this.https({
        authentication_requested: true,
        url: apiRouter.detailContract.replace(":id", contractId),
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }

      return (res as IResponse).body?.data || null;
    } catch (err: any) {
      return this.returnError(err);
    }
  }

  public async update(
    data: IContract & {
      lodging_id: string;
      contract_id: string;
    }
  ): Promise<IContract | IError> {
    try {
      const res: IResponse | IError = await this.https({
        authentication_requested: true,
        method: "POST",
        url: apiRouter.update,
        body: data,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }

      return (res as IResponse).body?.data || null;
    } catch (err: any) {
      return this.returnError(err);
    }
  }

  public getReferenceToStatus(status: number) {
    return status in reference.contract.status
      ? reference.contract.status[
          status as keyof typeof reference.contract.status
        ]
      : reference.undefined;
  }
}
