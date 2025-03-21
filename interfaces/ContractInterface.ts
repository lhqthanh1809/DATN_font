import { IRoom } from "./RoomInterface";

export interface ICreateContract {
  room_id: string;
  full_name: string;
  identity_card?: string;
  phone: string;
  gender?: boolean;
  date_of_birth?: string;
  address?: string;
  quantity: number | null;
  start_date: string;
  end_date?: string | null;
  lease_duration: number;
  deposit_amount: number;
  status: number | null;
}

export interface IListContract {
  lodging_id: string;
  room_id?: string;
  status?: number | null;
  limit?: number | null;
  offset?: number | null;
}

export interface IContract {
  id: string;
  code: string;
  user_id: string;
  room_id: string;
  start_date: Date | string;
  end_date: Date | null |string;
  remain_amount: number;
  deposit_amount: number;
  monthly_rent: number | null;
  status: number;
  lease_duration: number;
  quantity: number;
  full_name: string;
  phone: string;
  gender: boolean;
  address: string;
  identity_card: string;
  date_of_birth: string;
  relatives: number;
  total_due?: number;
  due_months?: number;
  room?: IRoom
}
