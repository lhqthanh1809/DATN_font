import { IError } from "@/interfaces/ErrorInterface";
import { LocationUnit } from "@/interfaces/LocationInterface";
import { IResponse } from "@/interfaces/ResponseInterface";
import { BaseHttpService } from "./BaseHttpService";
import { apiRouter } from "@/assets/ApiRouter";
import { HttpStatusCode } from "axios";

export default class GeneralService {
  private _service = new BaseHttpService();

  public async listProvince(): Promise<LocationUnit[] | IError> {
    try {
      const res: IResponse = await this._service.https({
        url: apiRouter.listProvince,
      });
      return res.body?.data || [];
    } catch (error: any) {
      return {
        message: `Lỗi khi tải dữ liệu: ${error?.message || "Không xác định"}`,
        code: error?.code || HttpStatusCode.InternalServerError,
        details: error?.response || null,
      };
    }
  }

  public async listDistrict(
    provinceId: number
  ): Promise<LocationUnit[] | IError> {
    try {
      const res: IResponse = await this._service.https({
        url: apiRouter.listDistrict,
        body: { province_id: provinceId },
      });
      return res.body?.data || [];
    } catch (error: any) {
      return {
        message: `Lỗi khi tải dữ liệu: ${error?.message || "Không xác định"}`,
        code: error?.code || HttpStatusCode.InternalServerError,
        details: error?.response || null,
      };
    }
  }

  public async listWard(
    districtId: number
  ): Promise<LocationUnit[] | IError> {
    try {
      const res: IResponse = await this._service.https({
        url: apiRouter.listWard,
        body: { district_id: districtId },
      });
      return res.body?.data || [];
    } catch (error: any) {
      return {
        message: `Lỗi khi tải dữ liệu: ${error?.message || "Không xác định"}`,
        code: error?.code || HttpStatusCode.InternalServerError,
        details: error?.response || null,
      };
    }
  }
}
