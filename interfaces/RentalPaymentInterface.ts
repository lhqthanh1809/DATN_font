import { IContract } from "./ContractInterface"
import { IRoomServiceInvoice } from "./RoomServiceInvoiceInterface"

export interface IRentPayment{
    id: string,
    contract_id: string,
    payment_amount: number,
    amount_paid: number,
    status: number,
    payment_date: string,
    last_payment_date: string,
    payment_method?: string | null,
    due_date: string,
    contract?: IContract
    room_rent_invoice?: IRoomServiceInvoice
}

export interface IListRental{
    lodging_id?: string,
    contract_id: string,
    status?: number | null,
    offset?: number | null,
    limit?: number | null
}