import { useUI } from "@/hooks/useUI";
import useLodgingStore from "@/store/lodging/user/useLodgingStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import { ChevronRight, ClockRefresh, Home2, Trash } from "@/ui/icon/symbol";
import BoxDevInfo from "@/ui/components/BoxDevInfor";
import { Href, router } from "expo-router";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { ILodging } from "@/interfaces/LodgingInterface";
import useLodgingsStore from "@/store/lodging/useLodgingsStore";
import CardBalanceWallet from "@/ui/components/CardBalanceWallet";
import Divide from "@/ui/Divide";
import { useGeneral } from "@/hooks/useGeneral";
import { formatPhone } from "@/helper/helper";
import { reference } from "@/assets/reference";
import { Key } from "@/ui/icon/security";
import { Setting } from "@/ui/icon/active";
import LogoutButton from "@/ui/components/LogoutButton";

const SettingScreen: React.FC<{
  lodgingId: string;
}> = ({ lodgingId }) => {
  const { user } = useGeneral();
  const { showModal } = useUI();
  const { lodgings } = useLodgingsStore();
  const [lodging, setLodging] = useState<ILodging | null>(null);
  const { deleteLodging } = useLodgingStore();

  const functions = useMemo(() => {
    return [
      {
        name: "Thông tin nhà cho thuê",
        icon: Home2,
        router: `lodging/${lodgingId}/edit`,
      },
      ...(lodging && lodging.wallet
        ? [
            {
              name: "Lịch sử giao dịch",
              icon: ClockRefresh,
              router: `wallet/${lodging.wallet.id}/transaction`,
            },
          ]
        : []),

      {
        name: "Đổi mật khẩu",
        icon: Key,
        router: `/user/change_password`,
      },
      {
        name: "Cấu hình",
        icon: Setting,
        router: `/lodging/${lodgingId}/config`,
      },
    ];
  }, [lodging]);

  useEffect(() => {
    setLodging(lodgings.find((item) => item.id == lodgingId) ?? null);
  }, [lodgingId]);
  return (
    <View className="flex-1">
      <Text className="font-BeVietnamBold text-20 text-mineShaft-950 px-3 pb-5 pt-3">
        Cài đặt
      </Text>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 76,
        }}
        className="flex-1 p-3"
      >
        <View className="gap-2">
          <Button className="shadow-soft-xs border-1 border-white-100 bg-white-50 p-4 items-start">
            <View className="flex-1 flex-row items-center gap-4">
              <Image
                source={{
                  uri: `https://ui-avatars.com/api/?name=${user?.full_name}&background=random&color=random`,
                }}
                width={46}
                height={46}
                className="rounded-full object-contain"
              />

              <View className="gap-1 items-start">
                <Text className="font-BeVietnamSemiBold">
                  {user?.full_name}
                </Text>
                <Text className="font-BeVietnamRegular text-12 text-white-700">
                  {user?.phone
                    ? formatPhone(user?.phone)
                    : reference.undefined.name}
                </Text>
                <Text className="font-BeVietnamRegular text-white-700 text-12">
                  {user?.email || reference.undefined.name}
                </Text>

                <View className="bg-lime-400 py-1 px-3  rounded-full">
                  <Text className="font-BeVietnamMedium text-lime-100 text-12">
                    Chủ nhà
                  </Text>
                </View>
              </View>
            </View>

            <Button
              onPress={() => {
                router.push("/user/update");
              }}
            >
              <Text className="font-BeVietnamRegular text-lime-600">
                Chỉnh sửa
              </Text>
            </Button>
          </Button>

          {lodging && lodging.wallet && (
            <CardBalanceWallet balance={lodging.wallet.balance} />
          )}

          <View className="gap-2 border-1 border-white-100 bg-white-50 py-3 rounded-lg shadow-soft-md">
            {functions.map((item, index) => (
              <Fragment key={index}>
                <Button
                  onPress={() => {
                    router.push(item.router as Href);
                  }}
                  key={index}
                  className="px-4 py-2 flex-1 basis-1/3 justify-center gap-3"
                >
                  <View className="flex-row items-center flex-1 gap-3">
                    <Icon icon={item.icon} className="text-lime-500" />
                    <Text className="font-BeVietnamMedium">{item.name}</Text>
                  </View>

                  <Icon icon={ChevronRight} />
                </Button>

                {index < functions.length - 1 && (
                  <Divide className="h-0.25 bg-lime-400" />
                )}
              </Fragment>
            ))}
          </View>

          <Button
            onPress={() => {
              deleteLodging(lodgingId, showModal);
            }}
            className="border-1 border-redPower-600 bg-redPower-600 items-center gap-3 py-3"
          >
            <Icon icon={Trash} className="text-redPower-100" />
            <Text className="font-BeVietnamMedium text-redPower-100">
              Xoá nhà cho thuê
            </Text>
          </Button>

          <LogoutButton/>

          <BoxDevInfo />
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingScreen;
