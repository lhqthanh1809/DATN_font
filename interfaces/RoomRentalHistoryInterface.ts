import { IRentPayment } from "./RentalPaymentInterface";
import { IRoom } from "./RoomInterface";

export interface IRoomRentalHistory{
      id: string;
      room_id: string;
      total_price: number;
      amount_paid: number;
      created_at?: Date;
      updated_at?: Date;
      finalized: boolean;
      month_billing: number;
      year_billing: number;
      room?: IRoom;
      rental_histories?: IRentPayment[]
}