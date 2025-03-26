import { PaymentDate } from "./GeneralInterface";
import { IRoomService } from "./RoomServiceInterface";
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
  late_days?: number;
  payment_date?: number;
  service?: IService | null;
  room_services?: IRoomService[];
  room_ids?: string[];
  rooms?: {
    id: string;
    room_code: string;
    is_usage_service: boolean;
    is_enabled_service?: boolean;
  }[];
}
