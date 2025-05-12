import {
  IContract,
  ICreateContract,
  ICreateFinalBill,
  IEndContract,
  IListContract,
  IPayAmountByContract,
} from "@/interfaces/ContractInterface";
import BaseService from "../BaseService";
import { IResponse } from "@/interfaces/ResponseInterface";
import { apiRouter } from "@/assets/apiRouter";
import { HttpStatusCode } from "axios";
import { IError } from "@/interfaces/ErrorInterface";
import { reference } from "@/assets/reference";
import { IListResponse } from "@/interfaces/GeneralInterface";

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
    data: IListContract,
    cancelToken?: any
  ): Promise<IListResponse<IContract> | IError> {
    try {
      const res: IResponse | IError = await this.https({
        method: "POST",
        authentication_requested: true,
        body: data,
        url: apiRouter.listContract,
        cancelToken,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }

      return (res as IResponse).body as IListResponse<IContract>;
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

  public async debt(contractId: string): Promise<
    | {
        room: number;
        service: number;
      }
    | IError
  > {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.debtContract.replace(":id", contractId),
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
        url: apiRouter.updateContract,
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

  public async createFinalBill(
    data: ICreateFinalBill
  ): Promise<string | IError> {
    try {
      const res: IResponse | IError = await this.https({
        method: "POST",
        url: apiRouter.createFinalBill,
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

  public async endContract(data: IEndContract): Promise<string | IError> {
    try {
      const res: IResponse | IError = await this.https({
        method: "POST",
        url: apiRouter.endContract,
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

  public async payAmountByContract(
    data: IPayAmountByContract
  ): Promise<string | IError> {
    try {
      const res: IResponse | IError = await this.https({
        method: "POST",
        url: apiRouter.payAmountByContract,
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

  public async listContractByUser(data: {
    status?: number;
    limit?: number;
    offset?: number;
  }): Promise<IListResponse<IContract> | IError> {
    try {
      const res: IResponse | IError = await this.https({
        method: "POST",
        authentication_requested: true,
        body: data,
        url: apiRouter.listContractByUser,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }

      return ((res as IResponse).body as IListResponse<IContract>)|| null;
    } catch (err: any) {
      return this.returnError(err);
    }
  }
}
