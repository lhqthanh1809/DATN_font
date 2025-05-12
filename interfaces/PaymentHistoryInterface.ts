export interface IPaymentHistory {
  id: string;
  object_id: string;
  object_type: string;
  room_id?: string;
  lodging_id?: string;
  contract_id?: string;
  amount: number;
  payment_method: string;
  paid_at: string | null;
  note: string | null;
  created_at: string;
}

export interface IListPaymentHistory{
    object_id: string;
    object_type: "rent" | "service"
    from?: string;
    to?: string;
    offset?: number;
    limit?: number;
}