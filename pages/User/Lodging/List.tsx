import { cn, convertToNumber, getTimezone } from "@/helper/helper";
import { IContract } from "@/interfaces/ContractInterface";
import { useEffect, useCallback, useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import Button from "@/ui/Button";
import Divide from "@/ui/Divide";
import Icon from "@/ui/Icon";
import { Search } from "@/ui/icon/active";
import { PinSmall } from "@/ui/icon/travel";
import Input from "@/ui/Input";
import moment from "moment";
import { Skeleton } from "moti/skeleton";
import useLodgingStore from "@/store/lodging/user/useLodgingStore";
import TabsLine from "@/ui/layout/TabsLine";

function ListLodging() {
  const { lodgings, loading, fetchLodgings, toggleShowContracts, search } =
    useLodgingStore();
  const statusContractDefault = useMemo(
    () => ({
      active: { text: "Còn hạn", bg: "bg-lime-400", color: "text-lime-100" },
      expiring_soon: {
        text: "Sắp hết hạn",
        bg: "bg-happyOrange-600",
        color: "text-happyOrange-100",
      },
      expired: {
        text: "Hết hạn",
        bg: "bg-redPower-600",
        color: "text-redPower-100",
      },
    }),
    []
  );

  useEffect(() => {
    fetchLodgings();
  }, []);

  const calculateStatusContract = useCallback((contract: IContract) => {
    const endDate = moment(
      contract.end_date
        ? new Date(contract.end_date)
        : moment(contract.start_date)
            .add(contract.lease_duration, "months")
            .toDate()
    ).tz(getTimezone());

    const today = moment();
    const daysRemaining = endDate.diff(today, "days");
    const statusContract: "active" | "expiring_soon" | "expired" =
      daysRemaining > 15
        ? "active"
        : daysRemaining >= 0
        ? "expiring_soon"
        : "expired";

    return { endDate, daysRemaining, statusContract };
  }, []);


  return (
    <View className="px-3 gap-2 flex-1">

      <View className="gap-2">
        <View className="flex-row gap-2">
          <View className="flex-1">
            <Input
              value={search.value}
              onChange={(text) => search.onChange(text)}
              placeHolder="Tìm kiếm nơi thuê..."
              suffix={<Icon icon={Search} />}
            />
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 76 }}>
        <View className="gap-2">
          {loading
            ? Array(5)
                .fill(null)
                .map((_, index) => (
                  <Button
                    key={index}
                    className="p-3 rounded-lg flex-col items-start gap-2 bg-white-100"
                  >
                    <Skeleton colorMode="light" width={"55%"} height={26} />
                    <Skeleton colorMode="light" width={"75%"} height={26} />
                    <Skeleton colorMode="light" width={"40%"} height={20} />
                  </Button>
                ))
            : lodgings.map((lodging) => {
                const contractCount =
                  lodging.rooms?.reduce(
                    (total, room) => total + (room.contracts?.length || 0),
                    0
                  ) || 0;

                return (
                  <Button
                    key={lodging.id}
                    className="p-3 border-1 rounded-lg border-white-200 flex-col items-start gap-2"
                  >
                    <Text className="font-BeVietnamMedium text-mineShaft-950">
                      {lodging.type?.name ?? ""} {lodging.name}
                    </Text>
                    <View className="flex-row items-center gap-1">
                      <Icon icon={PinSmall} className="text-mineShaft-500" />
                      <Text
                        numberOfLines={1}
                        className="font-BeVietnamRegular text-mineShaft-500 truncate w-3/4"
                      >
                        {[
                          lodging.address,
                          lodging.ward?.prefix
                            ? `${lodging.ward.prefix} ${lodging.ward.name}`
                            : lodging.ward?.name,
                          lodging.district?.name,
                          lodging.province?.name,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </Text>
                    </View>
                    <Button
                      onPress={() =>
                        lodging.id && toggleShowContracts(lodging.id)
                      }
                    >
                      <Text className="font-BeVietnamRegular text-12 text-lime-500">
                        Bạn có {contractCount} hợp đồng tại đây
                      </Text>
                    </Button>
                    {lodging.showContracts && (
                      <View className="w-full gap-2">
                        {lodging.rooms?.map((room) =>
                          room.contracts?.map((contract, index) => {
                            const { daysRemaining, endDate, statusContract } =
                              calculateStatusContract(contract);
                            return (
                              <View
                                key={index}
                                className="flex-row justify-between items-start bg-lime-100 p-3 rounded-lg"
                              >
                                <View className="gap-2">
                                  <Text className="font-BeVietnamMedium text-14 text-mineShaft-900">
                                     #{contract.code} - Phòng {room.room_code}
                                  </Text>
                                  <Text className="font-BeVietnamRegular text-12 text-mineShaft-900">
                                    Giá:{" "}
                                    {convertToNumber(
                                      (
                                        contract.monthly_rent ||
                                        room.price ||
                                        lodging.price_room_default ||
                                        0
                                      ).toString()
                                    )}{" "}
                                    đ/tháng
                                  </Text>
                                  <Text className="font-BeVietnamRegular text-12 text-mineShaft-900">
                                    Hết hạn: {endDate.format("DD/MM/YYYY")}
                                  </Text>
                                </View>
                                <View
                                  className={cn(
                                    "rounded-full py-2 px-4",
                                    statusContractDefault[statusContract].bg
                                  )}
                                >
                                  <Text
                                    className={cn(
                                      "font-BeVietnamMedium",
                                      statusContractDefault[statusContract]
                                        .color
                                    )}
                                    style={{ fontSize: 12 }}
                                  >
                                    {statusContractDefault[statusContract].text}{" "}
                                    {statusContract === "expiring_soon" &&
                                      `(${daysRemaining} ngày)`}
                                  </Text>
                                </View>
                              </View>
                            );
                          })
                        )}
                      </View>
                    )}
                  </Button>
                );
              })}
        </View>
      </ScrollView>
    </View>
  );
}

export default ListLodging;
