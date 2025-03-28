import { constant } from "@/assets/constant";
import { cn, getDimensionsDevice, getStatusBarHeight } from "@/helper/helper";
import {
  ComponentRef,
  GeneralContextValue,
  GeneralProviderProps,
} from "@/interfaces/GeneralInterface";
import { LocationUnit } from "@/interfaces/LocationInterface";
import { ILodging, LodgingType } from "@/interfaces/LodgingInterface";
import { IPermission } from "@/interfaces/Permission";
import { IUser } from "@/interfaces/UserInterface";
import useToastStore from "@/store/toast/useToastStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
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
  const [user, setUser] = useState<IUser | null>(initialUser);
  const { toasts, removeToast } = useToastStore();

  const clickRef = useCallback(
    (ref: MutableRefObject<any>, callback: () => void) => {
      if (refCurrent && refCurrent.ref !== ref) {
        refCurrent.onClickOutside();
      }
      setRefCurrent({ ref, onClickOutside: callback });
    },
    [refCurrent]
  );

  const changeUser = useCallback((user: IUser) => {
    setUser(user);
  }, []);


  return (
    <GeneralContext.Provider
      value={{
        clickRef,
        user,
        changeUser,
      }}
    >
      {children}
      <View
        className="absolute left-1/2 -translate-x-1/2 gap-1 items-center px-3 z-50"
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
              style={{
                maxWidth: getDimensionsDevice().width,
              }}
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

                <Text className="text-white-50 font-BeVietnamMedium text-12 max-w-64">
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
