import { IChatHistory } from "./ChatInterface";
import { IRoom } from "./RoomInterface";
import { constant } from "@/assets/constant";

export interface IChannel{
    id: string,
    room_id: string,
    latest_message: IChatHistory | null,
    room?: IRoom,
    created_at: string,
    joined_at: string,
} 

export interface IListChannel{
    member_id: string,
    member_type: (typeof constant.object.type)[keyof typeof constant.object.type],
    offset?: number,
    limit?: number
}