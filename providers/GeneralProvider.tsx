import { constant } from "@/assets/constant";
import { cn, getStatusBarHeight } from "@/helper/helper";
import {
  ComponentRef,
  GeneralContextValue,
  GeneralProviderProps,
} from "@/interfaces/GeneralInterface";
import { LocationUnit } from "@/interfaces/LocationInterface";
import { ILodging, LodgingType } from "@/interfaces/LodgingInterface";
import { IPermission } from "@/interfaces/Permission";
import useToastStore from "@/store/ToastStore";
import Button from "@/ui/button";
import Icon from "@/ui/icon";
import { CheckCircle, CrossSmall, Error } from "@/ui/icon/symbol";
import { AnimatePresence, MotiView } from "moti";
import React, {
  createContext,
  MutableRefObject,
  useCallback,
  useState,
} from "react";
import { Text, View } from "react-native";
import { Platform } from "react-native";

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
  const [permissions, setPermissions] = useState<Record<string, IPermission[]>>(
    {}
  );

  const { toasts, removeToast } = useToastStore();

  const setLocations = useCallback((data: Array<LocationUnit>): void => {
    setProvinces(data);
  }, []);

  const [lodgings, setLodgings] = useState<ILodging[]>([]);

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

  const setPermissionsForLodging = useCallback(
    (parentId: string, permission: IPermission[]) => {
      setPermissions((prev) => ({ ...prev, [parentId]: permission }));
    },
    [permissions]
  );

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

        lodgings,
        setLodgings,

        permissions,
        setPermissionsForLodging,
      }}
    >
      {children}
      <View
        className="absolute left-1/2 -translate-x-1/2 gap-1"
        style={{
          top: getStatusBarHeight() + 10,
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <MotiView
              className="bg-mineShaft-950 px-4 py-3 rounded-lg flex-row items-center justify-between gap-4"
              from={{ translateX: 300, opacity: 0 }}
              animate={{ translateX: 0, opacity: 1 }}
              exit={{ translateX: 300, opacity: 0 }}
              transition={{ type: "timing", duration: 500 }}
              key={toast.id}
            >
              <View className="flex-row items-center gap-3">
                <Icon
                  icon={
                    toast.type == constant.toast.type.success
                      ? CheckCircle
                      : Error
                  }
                  className={cn(
                    toast.type == constant.toast.type.success
                      ? "text-lime-500"
                      : "text-redPower-600"
                  )}
                />

                <Text
                  numberOfLines={1}
                  className=" truncate text-white-50 font-BeVietnamMedium text-12"
                >
                  {toast.message}
                </Text>
              </View>
              <Button className="p-2" onPress={() => removeToast(toast.id)}>
                <Icon icon={CrossSmall} />
              </Button>
            </MotiView>
          ))}
        </AnimatePresence>
      </View>
    </GeneralContext.Provider>
  );
};
