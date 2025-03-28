import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useFont } from "@shopify/react-native-skia";
import { Skeleton } from "moti/skeleton";
import { cn, convertToNumber, formatCurrencyVND } from "@/helper/helper";
import { constant } from "@/assets/constant";
import { IError } from "@/interfaces/ErrorInterface";
import {
  ILodgingStatistical,
  IOverviewRoom,
} from "@/interfaces/LodgingInterface";
import LodgingService from "@/services/Lodging/LodgingService";
import useToastStore from "@/store/toast/useToastStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import DonutChart from "@/ui/DonutChart";
import { Wallet } from "@/ui/icon/finance";
import { Cube } from "@/ui/icon/shapes";
import { Home2 } from "@/ui/icon/symbol";

interface OverviewItem {
  name: keyof IOverviewRoom;
  title: string;
  icon: React.ComponentType<any>;
  bg: string;
  text: string;
}

const StatisticalScreen: React.FC<{ lodgingId: string }> = React.memo(
  ({ lodgingId }) => {
    const { addToast } = useToastStore();
    const [statistical, setStatistical] = useState<ILodgingStatistical | null>(
      null
    );
    const [roomOverview, setRoomOverview] = useState<IOverviewRoom | null>(
      null
    );
    const [width, setWidth] = useState(0);
    const [loadingRoomOverview, setLoadingRoomOverview] = useState(false);
    const [loadingStatistical, setLoadingStatistical] = useState(false);

    const decimals = useSharedValue([0.25, 0.25, 0.25, 0.25]);
    const totalValue = useSharedValue("0 đ");
    const font = useFont(
      require("../../../../assets/fonts/BeVietnamPro-Bold.ttf"),
      26
    );
    const lodgingService = useMemo(() => new LodgingService(), []);

    const overviewRoomItems = useMemo<OverviewItem[]>(
      () => [
        {
          name: "total",
          title: "Tổng số phòng",
          icon: Cube,
          bg: "bg-blue-400",
          text: "text-blue-100",
        },
        {
          name: "empty",
          title: "Phòng còn trống",
          icon: Cube,
          bg: "bg-lime-400",
          text: "text-lime-100",
        },
        {
          name: "renting",
          title: "Phòng đang thuê",
          icon: Cube,
          bg: "bg-yellow-400",
          text: "text-yellow-100",
        },
        {
          name: "unpaid",
          title: "Phòng đang nợ",
          icon: Cube,
          bg: "bg-redPower-600",
          text: "text-redPower-100",
        },
      ],
      []
    );

    const fetchOverview = useCallback(async () => {
      try {
        const params = {
          lodging_id: lodgingId,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        };

        setLoadingStatistical(true);
        setLoadingRoomOverview(true);
        const [room, statistical] = await Promise.all([
          lodgingService.overview({ section: "room", ...params }),
          lodgingService.overview({ section: "statistical", ...params }),
        ]);

        if ("message" in room) {
          addToast(constant.toast.type.error, (room as IError).message);
          return;
        }
        if ("message" in statistical) {
          addToast(constant.toast.type.error, (statistical as IError).message);
          return;
        }

        setStatistical(statistical as ILodgingStatistical);
        setRoomOverview(room as IOverviewRoom);
      } catch (error) {
        console.error("Fetch overview error:", error);
      } finally {
        setLoadingStatistical(false);
        setLoadingRoomOverview(false);
      }
    }, [lodgingId, lodgingService, addToast]);

    useEffect(() => {
      fetchOverview();
    }, [fetchOverview]);

    useEffect(() => {
      if (!statistical) return;

      const parsePayment = (value?: string) => parseFloat(value ?? "0");
      const total = Object.values(statistical).reduce(
        (sum, obj) => sum + parsePayment(obj.total_payment),
        0
      );

      const roomUnpaid =
        parsePayment(statistical.room.total_payment) -
        parsePayment(statistical.room.total_paid);
      const serviceUnpaid =
        parsePayment(statistical.service.total_payment) -
        parsePayment(statistical.service.total_paid);
      const roomPaidDecimal =
        parsePayment(statistical.room.total_paid) / Math.max(total, 1);
      const servicePaidDecimal =
        parsePayment(statistical.service.total_paid) / Math.max(total, 1);

      decimals.value = [
        roomPaidDecimal,
        servicePaidDecimal,
        serviceUnpaid / Math.max(total, 1),
        roomUnpaid / Math.max(total, 1),
      ];
      totalValue.value = formatCurrencyVND(total);
    }, [statistical]);

    const renderRevenueSection = () => (
      <View className="w-full gap-3">
        <View className="px-6 pt-2 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Icon icon={Wallet} />
            <Text className="font-BeVietnamSemiBold text-16">
              Thống kê doanh thu
            </Text>
          </View>
          <View className="border-1 px-4 py-2 rounded-xl border-mineShaft-200">
            <Text className="font-BeVietnamMedium text-mineShaft-600 text-12">
              Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
            </Text>
          </View>
        </View>

        <View className="px-20">
          <View
            className="aspect-square w-full"
            onLayout={({ nativeEvent }) => setWidth(nativeEvent.layout.width)}
          >
            {font && (
              <DonutChart
                n={4}
                totalValue={totalValue}
                decimals={decimals}
                radius={width / 2}
                strokeWidth={44}
                outerStrokeWidth={44}
                font={font}
                colors={["#84cc16", "#bef264", "#f07a79", "#D0302F"]}
              />
            )}
          </View>
        </View>

        <View className="px-3 py-4 rounded-xl border-1 border-mineShaft-100 shadow-sm bg-white-50">
          {renderRevenueItem(
            "room",
            "Doanh thu phòng",
            "bg-lime-500",
            "bg-redPower-600"
          )}
          {renderRevenueItem(
            "service",
            "Doanh thu dịch vụ",
            "bg-lime-300",
            "bg-redPower-300"
          )}
        </View>
      </View>
    );

    const renderRevenueItem = (
      type: keyof ILodgingStatistical,
      title: string,
      paidColor: string,
      unpaidColor: string
    ) => {
      const data = statistical?.[type];
      const total = parseFloat(data?.total_payment ?? "0");
      const paid = parseFloat(data?.total_paid ?? "0");
      const unpaid = total - paid;

      return (
        <View className="border-1 border-lime-700 rounded-xl py-2 px-4 mb-2">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="flex-row">
                <View className={`w-4 h-4 ${unpaidColor} rounded-full`} />
                <View
                  className={`w-4 h-4 ${paidColor} rounded-full -translate-x-2`}
                />
              </View>
              <Text className="font-BeVietnamMedium">{title}</Text>
            </View>
            {loadingStatistical ? (
              <View className="w-20">
                <Skeleton colorMode="light" height={16} width={"100%"} />
              </View>
            ) : (
              <Text className="font-BeVietnamSemiBold">
                {convertToNumber(total.toString())} đ
              </Text>
            )}
          </View>
          <View className="flex-row justify-around px-2 mt-2">
            <View className="items-center">
              <View className="flex-row gap-2 items-center">
                <View className={`w-3 h-3 ${paidColor} rounded-full`} />
                <Text className="font-BeVietnamRegular text-12">
                  Đã thanh toán
                </Text>
              </View>
              {loadingStatistical ? (
                <View className="w-20">
                  <Skeleton colorMode="light" height={18} width={"100%"} />
                </View>
              ) : (
                <Text className="font-BeVietnamMedium">
                  {convertToNumber(paid.toString())} đ
                </Text>
              )}
            </View>
            <View className="items-center">
              <View className="flex-row gap-2 items-center">
                <View className={`w-3 h-3 ${unpaidColor} rounded-full`} />
                <Text className="font-BeVietnamRegular text-12">Còn thiếu</Text>
              </View>
              {loadingStatistical ? (
                <View className="w-20">
                  <Skeleton colorMode="light" height={18} width={"100%"} />
                </View>
              ) : (
                <Text className="font-BeVietnamMedium">
                  {convertToNumber(unpaid.toString())} đ
                </Text>
              )}
            </View>
          </View>
        </View>
      );
    };

    const renderRoomOverview = () => (
      <View className="w-full gap-2">
        <View className="px-6 pt-2 flex-row items-center gap-2">
          <Icon icon={Home2} />
          <Text className="font-BeVietnamSemiBold text-16">
            Tổng quan phòng
          </Text>
        </View>
        <View className="px-3 py-4 rounded-xl border-1 border-mineShaft-100 shadow-sm bg-white-50 flex-row flex-wrap gap-2">
          {overviewRoomItems.map((item) => (
            <View
              key={item.name}
              className="border-1 border-lime-700 rounded-xl py-2 px-4 flex-1 basis-1/3 m-1"
            >
              <View className="flex-row items-center gap-2">
                <View className={cn("p-2 rounded-full", item.bg)}>
                  <Icon icon={item.icon} className={item.text} />
                </View>
                <View
                  className={cn("flex-col", loadingRoomOverview && "gap-1")}
                >
                  <Text className="font-BeVietnamMedium text-12 text-mineShaft-500">
                    {item.title}
                  </Text>
                  {loadingRoomOverview ? (
                    <Skeleton colorMode="light" width={"60%"} height={20} />
                  ) : (
                    <Text className="font-BeVietnamSemiBold">
                      {roomOverview?.[item.name] ?? 0} phòng
                    </Text>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    );

    return (
      <Button className="flex-col items-start w-full">
        {renderRevenueSection()}
        {renderRoomOverview()}
      </Button>
    );
  }
);

export default StatisticalScreen;
