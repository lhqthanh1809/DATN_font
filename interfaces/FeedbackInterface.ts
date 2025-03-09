import { ILodging } from "./LodgingInterface";
import { IRoom } from "./RoomInterface";

export interface ICreateFeedback {
  content: string;
  title: string;
  lodging_id: string;
  room_id: string;
  images?: string[];
}

export interface IListFeedback {
  lodging_id?: string,
  room_id?: string,
  status?: number | null
}

export interface IUpdateFeedback {
  lodging_id : string,
  feedback_id: string,
  status: number
}

export interface IFeedback {
  id: string;
  title: string;
  body: {
    content: string;
    images?: string[];
  };
  status: number,
  user_id: string;
  room_id: string;
  lodging_id: string;
  created_at?: string;
  updated_at?: string;
  lodging?: ILodging;
  room?: IRoom;
}
