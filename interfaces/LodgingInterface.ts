import { LocationUnit } from "./LocationInterface";
import { IRoom } from "./RoomInterface";

export interface LodgingType {
  id: number;
  name: string;
  description?: string;
}

export interface IOverviewLodging {
  section: "statistical" | "room";
  lodging_id: string;
  month?: number | null;
  year?: null | number;
}

export interface IOverviewRoom {
  total: number;
  unpaid: number;
  renting: number;
  empty: number;
}

export interface IOverviewStatistical {
    total_payment: string;
    total_paid: string;
}

export interface ILodgingStatistical {
  room: IOverviewStatistical,
  service: IOverviewStatistical
}

export interface ILodging {
  id?: string;
  name: string;
  address?: string | null;
  province_id?: number | null;
  district_id?: number | null;
  ward_id?: number | null;
  latitude?: string | null;
  longitude?: string | null;
  phone?: string | null;
  email?: string | null;
  type_id: number;
  payment_date: number;
  late_days: number;
  area_room_default?: number | null;
  price_room_default?: number | null;
  province?: LocationUnit;
  district?: LocationUnit;
  ward?: LocationUnit & {
    prefix: string;
  };
  rooms?: IRoom[];
  type?: {
    id: number;
    name: string;
  };
}
