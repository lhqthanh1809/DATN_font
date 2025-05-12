import { IContract } from "./ContractInterface";
import { IRoomServiceInvoice } from "./RoomServiceInvoiceInterface";

export interface IServicePayment {
  id: string;
  contract_id: string;
  room_service_invoice_id: string;
  payment_amount: number;
  amount_paid: number;
  payment_date: string;
  last_payment_date: string;
  due_date: string;
  payment_method: string | null;
  room_service_usage?: IRoomServiceInvoice;
  contract?: IContract
}

export interface IListServicePayment{
    lodging_id?: string,
    contract_id: string,
    offset?: number | null,
    limit?: number | null
}