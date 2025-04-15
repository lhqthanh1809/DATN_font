import { useUI } from "@/hooks/useUI";
import useLodgingStore from "@/store/lodging/user/useLodgingStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import { ChevronRight, ClockRefresh, Home2, Trash } from "@/ui/icon/symbol";
import BoxDevInfor from "@/ui/components/BoxDevInfor";
import { Href, router } from "expo-router";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { ILodging } from "@/interfaces/LodgingInterface";
import useLodgingsStore from "@/store/lodging/useLodgingsStore";
import CardBalanceWallet from "@/ui/components/CardBalanceWallet";
import Divide from "@/ui/Divide";

const SettingScreen: React.FC<{
  lodgingId: string;
}> = ({ lodgingId }) => {
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

          <BoxDevInfor />
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingScreen;
