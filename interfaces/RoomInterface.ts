import { IContract } from "./ContractInterface";
import { PaymentDate } from "./GeneralInterface";
import { ILodging } from "./LodgingInterface";
import { ILodgingService } from "./LodgingServiceInterface";
import { constant } from "@/assets/constant";

export interface IRoomFilter {
  lodging_id: string;
  status?: (typeof constant.room.status)[keyof typeof constant.room.status];
  start_date?: string;
  quantity?: number;
  lease_duration?: number;
}

export interface IRoom extends PaymentDate {
  id?: string;
  room_code: string;
  lodging_id?: string;
  price?: number | null;
  area?: number | null;
  current_tenants?: number;
  max_tenants: number;
  status?: number;
  priority?: Record<any, any>[];
  room_services?: {
    id: string;
    room_id: string;
    lodging_service_id: string;
    last_recorded_value: number | null;
    is_enabled: boolean;
    lodging_service: ILodgingService;
  }[];
  contracts?: IContract[]
  lodging?: ILodging
}
