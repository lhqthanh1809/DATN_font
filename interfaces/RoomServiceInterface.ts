import { IRoom } from "./RoomInterface"

export interface IRoomService {
    id?: string, 
    room_id?: string,
    lodging_service_id: string,
    last_recorded_value?: number
    room?: IRoom
}