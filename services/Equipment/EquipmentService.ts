import { ICreateEquipment, IEquipment } from "@/interfaces/EquipmentInterface";
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
      const res: IResponse = await this._service.https({
        method: "POST",
        url: apiRouter.createEquipment,
        body: data,
        authentication_requested: true,
      });

      if (!res || res.status >= HttpStatusCode.BadRequest) {
        return this.getErrorResponse(res);
      }

      return res.body?.data || null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async listEquipment(): Promise<IEquipment[] | IError> {
    try {
      const res: IResponse = await this._service.https({
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
}
