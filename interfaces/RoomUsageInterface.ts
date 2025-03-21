import { ILodgingService } from "./LodgingServiceInterface";
import { IRoom } from "./RoomInterface";
import { IService } from "./ServiceInterface";
import { IUnit } from "./UnitInterface";

export interface IRoomUsage {
  id: string;
  room_id: string;
  lodging_service_id: string;
  total_price: number;
  amount_paid: number;
  created_at?: Date;
  updated_at?: Date;
  value: number;
  finalized: boolean;
  month_billing: number;
  year_billing: number;
  is_need_close: boolean;
  initial_index: number;
  final_index: number | null;
  service_id: number | null;
  service_name: number | null;
  unit_id: number;
  service?: IService | null;
  unit?: IUnit | null;
  room?: IRoom;
  lodging_service?: ILodgingService;
}

export interface ICloseRoomUsage {
  lodging_id: string;
  room_usage_id: string;
  final_index: number;
}
