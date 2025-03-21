import { IRoomUsage } from "./RoomUsageInterface";

export interface IServicePayment {
  id: string;
  contract_id: string;
  room_service_usage_id: string;
  payment_amount: number;
  amount_paid: number;
  payment_date: string;
  last_payment_date: string;
  due_date: string;
  payment_method: string | null;
  room_service_usage?: IRoomUsage;
}

export interface IListServicePayment{
    lodging_id?: string,
    contract_id: string,
    offset?: number | null,
    limit?: number | null
}