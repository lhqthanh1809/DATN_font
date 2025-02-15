import {
  ComponentRef,
  GeneralContextValue,
  GeneralProviderProps,
} from "@/interfaces/GeneralInterface";
import { LocationUnit } from "@/interfaces/LocationInterface";
import { ILodging, LodgingType } from "@/interfaces/LodgingInterface";
import { IPermission } from "@/interfaces/Permission";
import React, {
  createContext,
  MutableRefObject,
  useCallback,
  useState,
} from "react";
import { Text } from "react-native";

export const GeneralContext = createContext<GeneralContextValue | undefined>(
  undefined
);

export const GeneralProvider: React.FC<GeneralProviderProps> = ({
  user: initialUser = null,
  children,
}) => {
  const [refCurrent, setRefCurrent] = useState<ComponentRef | null>(null);
  const [user, setUser] = useState<Record<any, any> | null>(initialUser);
  const [lodgingTypes, setLodgingTypes] = useState<LodgingType[]>([]);
  const [provinces, setProvinces] = useState<Array<LocationUnit>>([]);
  const [districts, setDistricts] = useState<Record<number, LocationUnit[]>>(
    {}
  );
  const [wards, setWards] = useState<Record<number, LocationUnit[]>>({});
  const [permissions, setPermissions] = useState<IPermission[]>([]);

  const setLocations = useCallback((data: Array<LocationUnit>): void => {
    setProvinces(data);
  }, []);

  const [lodging, setLodging] = useState<ILodging | null>(null);

  const setLocationsWithParent = useCallback(
    (
      type: "district" | "ward",
      data: Array<LocationUnit>,
      parentId: number
    ): void => {
      const setData = type === "district" ? setDistricts : setWards;
      setData((prev) => ({ ...prev, [parentId]: data }));
    },
    []
  );

  const clickRef = useCallback(
    (ref: MutableRefObject<any>, callback: () => void) => {
      if (refCurrent && refCurrent.ref !== ref) {
        refCurrent.onClickOutside();
      }
      setRefCurrent({ ref, onClickOutside: callback });
    },
    [refCurrent]
  );

  const changeUser = useCallback((user: JSON) => {
    setUser(user);
  }, []);

  return (
    <GeneralContext.Provider
      value={{
        clickRef,
        user,
        changeUser,

        provinces,
        districts,
        wards,
        setLocations,
        setLocationsWithParent,

        lodgingTypes,
        setLodgingTypes,

        lodging,
        setLodging,

        permissions,
        setPermissions,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};
