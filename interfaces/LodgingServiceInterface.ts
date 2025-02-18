import { PaymentDate } from "./GeneralInterface";
import { IService } from "./ServiceInterface";
import { IUnit } from "./UnitInterface";

export interface ILodgingService extends PaymentDate {
  id?: string;
  service_id: number | null;
  name: string | null;
  lodging_id?: string;
  price_per_unit: number;
  unit_id: number;
  unit?: IUnit | null;
  service?: IService | null;
}
