import { PaymentDate } from "./GeneralInterface";

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
}
