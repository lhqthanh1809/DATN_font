import { IWallet } from "./WalletInterface";

export interface IUser {
  id?: string;
  full_name: string | null;
  email: string | null;
  gender: boolean | null;
  phone: string;
  identity_card: string | null;
  is_public?: boolean | null;
  date_of_birth: string;
  relatives?: IRelative[] | null;
  address: string | null;
  is_active?: boolean;
  is_completed: boolean;
  wallet?: IWallet
}

export interface IRelative {
  full_name: string;
  phone: string;
  relationship: string;
}
