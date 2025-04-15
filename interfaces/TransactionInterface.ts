import { constant } from "@/assets/constant";

export interface ITransaction {
  id: string;
  wallet_id: string;
  transaction_type: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface IListByWallet {
  wallet_id: string;
  from?: string;
  to?: string;
  offset?: number;
  limit?: number;
  type?:
    | (typeof constant.transaction.type)[keyof typeof constant.transaction.type]
    | null;
}
