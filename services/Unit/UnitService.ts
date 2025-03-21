import { HttpStatusCode } from "axios";
import BaseService from "../BaseService";
import { apiRouter } from "@/assets/ApiRouter";
import { IError } from "@/interfaces/ErrorInterface";
import { IResponse } from "@/interfaces/ResponseInterface";
import { IUnit } from "@/interfaces/UnitInterface";
import { constant } from "@/assets/constant";
import { reference } from "@/assets/reference";

export default class UnitService extends BaseService {
  public async listUnit(): Promise<IUnit[] | IError> {
    try {
      const res: IResponse = await this.https({
        url: apiRouter.listUnit,
      });
      return res.body?.data || [];
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async listUnitsByService(
    serviceId: number
  ): Promise<IUnit[] | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.listUnitByService,
        body: {
          service_id: serviceId,
        },
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }

      return (res as IResponse).body?.data || [];
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public getReferenceUnit(data: any) {
    return data.name in reference.unit
      ? reference.unit[data.name as keyof typeof reference.unit].name
      : reference.undefined.name;
  }

  public getUnitSuffix(prefix: string, unit: IUnit) {
    const unitName =
      reference.unit[
        unit.name as keyof typeof reference.unit
      ]?.name.toLowerCase();
    const unitReference =
      reference.unit[unit.name as keyof typeof reference.unit];
    const unitLowerName =
      "lowerName" in unitReference ? unitReference.lowerName : undefined;

    if (unitName || unitLowerName) {
      return `${prefix}/${unitLowerName ? unitLowerName : unitName}`;
    }

    return reference.undefined.name;
  }
}
