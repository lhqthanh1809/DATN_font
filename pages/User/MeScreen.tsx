import { constant } from "@/assets/constant";
import { convertToNumber, env, getDeviceID } from "@/helper/helper";
import { useUI } from "@/hooks/useUI";
import AuthService from "@/services/Auth/AuthService";
import { LocalStorage } from "@/services/LocalStorageService";
import useLodgingStore from "@/store/lodging/user/useLodgingStore";
import useToastStore from "@/store/toast/useToastStore";
import useUserScreenStore from "@/store/user/useUserScreenStore";
import Button from "@/ui/Button";
import Divide from "@/ui/Divide";
import Icon from "@/ui/Icon";
import { Logout } from "@/ui/icon/active";
import {
  ChevronRight,
  ClockRefresh,
  Home2,
  Notification,
  Trash,
  User,
} from "@/ui/icon/symbol";
import BoxDevInfor from "@/ui/components/BoxDevInfor";
import LoadingAnimation from "@/ui/LoadingAnimation";
import { Href, router } from "expo-router";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGeneral } from "@/hooks/useGeneral";
import { Wallet } from "@/ui/icon/finance";
import { Key } from "@/ui/icon/security";
import CardBalanceWallet from "@/ui/components/CardBalanceWallet";

const MeScreen: React.FC<{}> = ({}) => {
  const { user } = useGeneral();
  const [loadingLogout, setLoadingLogout] = useState(false);
  const { tabs, setTab } = useUserScreenStore();
  const localStorage = new LocalStorage();
  const functions = useMemo(() => {
    return [
      {
        name: "Thông tin cá nhân",
        icon: User,
        router: `user/detail`,
      },
      ...(user && user.wallet
        ? [
            {
              name: "Lịch sử giao dịch",
              icon: ClockRefresh,
              router: `wallet/${user.wallet.id}/transaction`,
            },
          ]
        : []),
      {
        name: "Đổi mật khẩu",
        icon: Key,
        router: `/user/change_password`,
      },
      {
        name: "Phản hồi",
        icon: Notification,
        router: `feedback`,
      },
    ];
  }, [user]);

  const logout = useCallback(async () => {
    setLoadingLogout(true);
    try {
      const token = await getDeviceID();
      const result = await new AuthService().logout(token);
      if (typeof result !== "string") {
        throw new Error(result.message);
      }

      await localStorage.removeItem(env("KEY_TOKEN"));
      if (router.canDismiss()) {
        router.dismissAll();
      }

      setTab(tabs[0]);

      router.replace("/login");
    } catch (err: any) {
      useToastStore
        .getState()
        .addToast(
          constant.toast.type.error,
          err.message || "An error occurred"
        );
    } finally {
      setLoadingLogout(false);
    }
  }, [tabs]);

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 76,
      }}
      className="flex-1 p-3"
    >
      <View className="gap-2">
        {user && user.wallet && (
          <CardBalanceWallet balance={user.wallet.balance} />
        )}

        <View className="bg-white-50 py-3 rounded-lg flex-row flex-wrap gap-1 items-start">
          {functions.map((item, index) => (
            <Fragment key={index}>
              <Button
                onPress={() => {
                  router.push(item.router as Href);
                }}
                key={index}
                className="py-3 flex-1 gap-3 rounded-none basis-1/5 "
              >
                <View className="w-full items-center gap-2">
                  <View className="bg-white-50 shadow-soft-xs border-1 border-white-100 p-4 rounded-2xl">
                    <Icon icon={item.icon} className="text-lime-500" />
                  </View>
                  <Text className="font-BeVietnamMedium text-12 text-center">
                    {item.name}
                  </Text>
                </View>
              </Button>
            </Fragment>
          ))}
        </View>

        <Button
          onPress={logout}
          disabled={loadingLogout}
          className="border-1 border-redPower-600 bg-white-50 items-center gap-3 py-3"
        >
          {loadingLogout ? (
            <LoadingAnimation />
          ) : (
            <Icon icon={Logout} className="text-redPower-600" />
          )}
          <Text className="font-BeVietnamMedium text-redPower-600">
            Đăng xuất
          </Text>
        </Button>

        <BoxDevInfor />
      </View>
    </ScrollView>
  );
};

export default MeScreen;
