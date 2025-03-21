import { IRoom } from "./RoomInterface";

export interface IRoomSetup {
  room_id: string;
  equipment_id: string;
  quantity: number;
  status: number;
  installation_date?: Date;
  last_serviced?: Date | null;
  created_at?: Date;
  updated_at?: Date;
  room?: IRoom
}
