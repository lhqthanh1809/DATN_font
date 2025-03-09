import { IError } from "@/interfaces/ErrorInterface";
import BaseService from "../BaseService";
import { IResponse } from "@/interfaces/ResponseInterface";
import { apiRouter } from "@/assets/ApiRouter";
import { ILodgingService } from "@/interfaces/LodgingServiceInterface";
import { HttpStatusCode } from "axios";

export default class LodgingServiceManagerService extends BaseService {
  private _lodgingId: string | null;

  public constructor(lodgingId: string | null) {
    super();
    this._lodgingId = lodgingId;
  }

  public setLodgingId(lodgingId: string){
    this._lodgingId = lodgingId
  }

  public async create(
    data: ILodgingService
  ): Promise<ILodgingService | IError> {
    if(!this._lodgingId){
      return {
        message: 'Lỗi không xác định được nhà trọ',
      };
    }
    try {
      const res: IResponse = await this._service.https({
        url: apiRouter.createLodgingService,
        authentication_requested: true,
        method: "POST",
        body: { ...data, lodging_id: this._lodgingId },
      });

      if (!res || res.status >= HttpStatusCode.BadRequest) {
        return this.getErrorResponse(res);
      }
      return res.body?.data ?? null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async list(): Promise<ILodgingService[] | IError> {
    try {
      const res: IResponse = await this._service.https({
        url: apiRouter.listLodgingService.replace(":lodging_id", this._lodgingId),
        authentication_requested: true
      });

      if (!res || res.status >= HttpStatusCode.BadRequest) {
        return this.getErrorResponse(res);
      }
      return res.body?.data ?? [];
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async detail(id : string) : Promise<ILodgingService | IError>{
    try {
      const res: IResponse = await this._service.https({
        url: apiRouter.detailLodgingService.replace(":id", id),
      });

      if (!res || res.status >= HttpStatusCode.BadRequest) {
        return this.getErrorResponse(res);
      }
      return res.body?.data ?? null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async update(
    data: ILodgingService
  ): Promise<ILodgingService | IError> {
    if(!this._lodgingId){
      return {
        message: 'Lỗi không xác định được nhà trọ',
      };
    }
    try {
      const res: IResponse = await this._service.https({
        url: apiRouter.updateLodgingService,
        authentication_requested: true,
        method: "POST",
        body: { ...data, lodging_id: this._lodgingId },
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
