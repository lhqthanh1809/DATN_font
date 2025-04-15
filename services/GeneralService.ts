import { IError } from "@/interfaces/ErrorInterface";
import { LocationUnit } from "@/interfaces/LocationInterface";
import { IResponse } from "@/interfaces/ResponseInterface";
import { apiRouter } from "@/assets/apiRouter";
import BaseService from "./BaseService";

export default class GeneralService extends BaseService {
  public async listProvince(): Promise<LocationUnit[] | IError> {
    try {
      const res: IResponse = await this.https({
        url: apiRouter.listProvince,
      });
      return res.body?.data || [];
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async listDistrict(
    provinceId: number
  ): Promise<LocationUnit[] | IError> {
    try {
      const res: IResponse = await this.https({
        url: apiRouter.listDistrict,
        body: { province_id: provinceId },
      });
      return res.body?.data || [];
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async listWard(districtId: number): Promise<LocationUnit[] | IError> {
    try {
      const res: IResponse = await this.https({
        url: apiRouter.listWard,
        body: { district_id: districtId },
      });
      return res.body?.data || [];
    } catch (error: any) {
      return this.returnError(error);
    }
  }
}
