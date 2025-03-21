import { MutableRefObject, ReactNode } from "react";
import { LocationUnit } from "./LocationInterface";
import { ILodging, LodgingType } from "./LodgingInterface";
import { IPermission } from "./Permission";
import { IUnit } from "./UnitInterface";
import { IService } from "./ServiceInterface";
import { IUser } from "./UserInterface";

export interface GeneralContextValue {
  clickRef: (ref: MutableRefObject<any>, callback: () => void) => void;
  user: IUser | null;
  changeUser: (user: IUser) => void;
}

export interface ComponentRef {
  ref: MutableRefObject<any>;
  onClickOutside: () => void;
}

export interface GeneralProviderProps {
  user?: IUser | null;
  children: ReactNode;
}

export interface PaymentDate {
  payment_date?: number;
  late_days?: number;
}

export interface IDataRealtime<T> {
  data: T;
}
