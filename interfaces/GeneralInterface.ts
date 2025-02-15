import { MutableRefObject, ReactNode } from "react";
import { LocationUnit } from "./LocationInterface";
import { ILodging, LodgingType } from "./LodgingInterface";
import { IPermission } from "./Permission";

export interface GeneralContextValue {
  clickRef: (ref: MutableRefObject<any>, callback: () => void) => void;
  user: Record<any, any> | null;
  changeUser: (user: JSON) => void;

  provinces: Array<LocationUnit>;
  districts: Record<number, LocationUnit[]>;
  wards: Record<number, LocationUnit[]>;
  setLocations: (data: Array<LocationUnit>) => void;
  setLocationsWithParent: (
    type: "district" | "ward",
    data: Array<LocationUnit>,
    parentId: number
  ) => void;

  lodgingTypes: LodgingType[];
  setLodgingTypes: (types: LodgingType[]) => void;

  lodging: ILodging | null;
  setLodging: (lodging: ILodging | null) => void;

  permissions: IPermission[];
  setPermissions: (permission: IPermission[]) => void;
}

export interface ComponentRef {
  ref: MutableRefObject<any>;
  onClickOutside: () => void;
}

export interface GeneralProviderProps {
  user?: Record<any, any> | null;
  children: ReactNode;
}
