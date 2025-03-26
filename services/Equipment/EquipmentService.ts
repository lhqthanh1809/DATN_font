import {
  ICreateEquipment,
  IEquipment,
  IUpdateEquipment,
} from "@/interfaces/EquipmentInterface";
import BaseService from "../BaseService";
import { apiRouter } from "@/assets/ApiRouter";
import { IResponse } from "@/interfaces/ResponseInterface";
import { HttpStatusCode } from "axios";
import { IError } from "@/interfaces/ErrorInterface";

export class EquipmentService extends BaseService {
  private _lodgingId: string | null;
  public constructor(lodgingId: string | null = null) {
    super();
    this._lodgingId = lodgingId;
  }

  get lodgingId(): string | null {
    return this._lodgingId;
  }

  set lodgingId(value: string) {
    this._lodgingId = value;
  }

  public async createEquipment(
    data: ICreateEquipment
  ): Promise<IEquipment | IError> {
    try {
      const res: IResponse | IError = await this.https({
        method: "POST",
        url: apiRouter.createEquipment,
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

  public async listEquipment(): Promise<IEquipment[] | IError> {
    try {
      const res: IResponse = await this.https({
        url: apiRouter.listEquipment,
        body: {
          lodging_id: this._lodgingId,
        },
      });

      return res.body?.data || [];
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async detailEquipment(
    equipmentId: string
  ): Promise<IEquipment | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.detailEquipment.replace(":id", equipmentId),
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }

      return (res as IResponse).body?.data || null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async delete(id: string): Promise<any | IError> {
    if (!this._lodgingId) {
      return {
        message: "Lỗi không xác định được nhà trọ",
      };
    }
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.deleteEquipment,
        authentication_requested: true,
        method: "DELETE",
        body: { equipment_id: id, lodging_id: this._lodgingId },
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body ?? null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async updateEquipment(data: FormData): Promise<IEquipment | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.updateEquipment,
        method: "POST",
        authentication_requested: true,
        formData_requested: true,
        body: data,
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
