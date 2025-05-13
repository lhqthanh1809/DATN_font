import { constant } from "@/assets/constant";
import { IUser } from "./UserInterface";
import { ILodging } from "./LodgingInterface";

export interface IChatHistory {
  id: string;
  channel_id: string;
  sender_id: string;
  sender_type: string;
  status: number;
  content: {
    text: string;
  };
  sender?: IUser | ILodging;
  created_at: string;
  is_read?: boolean;
}

export interface ICreateChat {
  channel_id: string;
  message: string;
  member_id: string;
  member_type: (typeof constant.object.type)[keyof typeof constant.object.type];
}

export interface IUpdateStatusChat {
  chat_id: string;
  status: (typeof constant.chat.status)[keyof typeof constant.chat.status];
  member_id: string;
  member_type: (typeof constant.object.type)[keyof typeof constant.object.type];
}

export interface IListChat {
  channel_id: string;
  member_id: string;
  member_type: (typeof constant.object.type)[keyof typeof constant.object.type];
  offset?: number;
  limit?: number;
}
