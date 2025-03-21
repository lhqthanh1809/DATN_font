import { constant } from "@/assets/constant";
import { reference } from "@/assets/reference";
import { cn, convertToDate, convertToNumber, env } from "@/helper/helper";
import { IRentalHistory } from "@/interfaces/RentalInterface";
import RentalHistory from "@/services/RentalHistory/RentalHistoryService";
import { useRentalHistoryStore } from "@/store/rental_history/RentalHistoryStore";
import useToastStore from "@/store/useToastStore";
import Button from "@/ui/Button";
import Divide from "@/ui/Divide";
import Icon from "@/ui/Icon";
import { CheckCircle, Error, Warning } from "@/ui/icon/symbol";
import SearchAndStatus from "@/ui/layout/SearchAndStatus";
import axios from "axios";
import { isArray } from "lodash";
import moment from "moment";
import { Skeleton } from "moti/skeleton";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

const ListRentalHistory: React.FC<{
  lodgingId?: string;
  contractId: string;
}> = ({ lodgingId, contractId }) => {
  const [rentals, setRentals] = useState<IRentalHistory[]>([]);
  const { addToast } = useToastStore();
  const [isLoading, setIsLoading] = useState(true);
  const [statusActive, setStatusActive] = useState<number | null>(null);

  const fetchRental = useCallback(
    async (cancelToken: any) => {
      setIsLoading(true);
      const res = await new RentalHistory().list(
        {
          lodging_id: lodgingId,
          contract_id: contractId,
          status: statusActive,
        },
        cancelToken
      );

      if (isArray(res)) {
        setRentals(res);
      }
      if (!cancelToken.reason) setIsLoading(false);
    },
    [statusActive, lodgingId, contractId]
  );

  useEffect(() => {
    const source = axios.CancelToken.source();
    fetchRental(source.token);

    return () => {
      source.cancel("Hủy request do mất focus hoặc dữ liệu thay đổi");
    };
  }, [statusActive, lodgingId, contractId]);

  return (
    <View className="flex-1 gap-2 pt-3">
      <SearchAndStatus
        onChangeStatus={(status) => setStatusActive(status)}
        hasSearch={false}
        dataObject={reference.payment.status}
      />
      <ScrollView className="px-3 flex-1">
        <View className="flex-1 gap-4 pb-3">
          {isLoading
            ? Array(4)
                .fill("")
                .map((_, index) => (
                  <Button
                    className="w-full bg-white-100 rounded-xl p-4 flex-col items-start gap-2"
                    key={index}
                  >
                    <View className="flex-row gap-4 w-full items-center">
                      <View className="w-1/4">
                        <Skeleton
                          colorMode="light"
                          width={"100%"}
                          height={120}
                        />
                      </View>
                      <View className="gap-3 flex-1">
                        <View className="gap-2">
                          <Skeleton
                            colorMode="light"
                            width={"80%"}
                            height={20}
                          />
                          <Skeleton
                            colorMode="light"
                            width={"74%"}
                            height={20}
                          />
                        </View>

                        <Skeleton colorMode="light" width={"44%"} height={20} />

                        <View className="w-full flex-row gap-2">
                          <View className=" flex-1">
                            <Skeleton
                              colorMode="light"
                              width={"100%"}
                              height={32}
                            />
                          </View>
                          <View className=" flex-1">
                            <Skeleton
                              colorMode="light"
                              width={"100%"}
                              height={32}
                            />
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Số tiền */}
                    <View className="flex-row items-center justify-between w-full px-2">
                      <View className="items-center w-1/4">
                        <Skeleton
                          colorMode="light"
                          width={"100%"}
                          height={34}
                        />
                      </View>

                      <View className="items-center w-1/4">
                        <Skeleton
                          colorMode="light"
                          width={"100%"}
                          height={34}
                        />
                      </View>
                      <View className="items-center w-1/4">
                        <Skeleton
                          colorMode="light"
                          width={"100%"}
                          height={34}
                        />
                      </View>
                    </View>
                  </Button>
                ))
            : rentals.map((rental) => {
                const paymentDate = moment.tz(
                  rental.payment_date,
                  "YYYY-MM-DD HH:mm:ss",
                  env("TIMEZONE")
                );

                const diffAmount = rental.payment_amount - rental.amount_paid;

                return (
                  <Button
                    key={rental.id}
                    className="w-full bg-white-50 rounded-xl p-4 border-1 shadow-soft-md flex-col items-start border-white-100 gap-2"
                  >
                    <View className="flex-row gap-4 w-full items-center">
                      <View className="border-1 items-stretch px-6 py-3 rounded-md border-white-200 gap-2">
                        <View>
                          <Text className="font-BeVietnamMedium text-mineShaft-600 text-center">
                            Tháng
                          </Text>
                          <Text
                            className={cn(
                              "font-BeVietnamBold text-3xl  text-center",
                              diffAmount <= 0
                                ? "text-lime-600"
                                : rental.amount_paid == 0
                                ? "text-redPower-600"
                                : "text-happyOrange-600"
                            )}
                          >
                            {paymentDate.month() + 1}
                          </Text>
                        </View>
                        <View className="">
                          <Divide className="h-1 w-full bg-lime-800" />
                        </View>
                        <Text className="font-BeVietnamMedium text-center text-mineShaft-950">
                          {paymentDate.year()}
                        </Text>
                      </View>
                      <View className="gap-2 flex-1">
                        <View className="gap-1">
                          <Text className="font-BeVietnamMedium text-mineShaft-800">
                            Ngày thanh toán:{" "}
                            {convertToDate(rental.payment_date)}
                          </Text>
                          {diffAmount <= 0 ? (
                            <Text className="font-BeVietnamMedium text-mineShaft-800">
                              Thanh toán lần cuối:{" "}
                              {convertToDate(rental.last_payment_date)}
                            </Text>
                          ) : (
                            <Text className="font-BeVietnamMedium text-mineShaft-800">
                              Hạn thanh toán: {convertToDate(rental.due_date)}
                            </Text>
                          )}
                        </View>

                        <View className="flex-row items-center gap-2">
                          <Icon
                            icon={
                              diffAmount <= 0
                                ? CheckCircle
                                : rental.amount_paid == 0
                                ? Error
                                : Warning
                            }
                            className={cn(
                              diffAmount <= 0
                                ? "text-lime-500"
                                : rental.amount_paid == 0
                                ? "text-redPower-600"
                                : "text-happyOrange-600"
                            )}
                          />
                          <Text
                            numberOfLines={1}
                            className="font-BeVietnamRegular truncate"
                          >
                            {diffAmount <= 0
                              ? `Đã thanh toán`
                              : rental.amount_paid == 0
                              ? "Chưa thanh toán"
                              : `Trả một phần, ${convertToDate(
                                  rental.last_payment_date
                                )}`}
                          </Text>
                        </View>

                        <View className="w-full flex-row gap-2">
                          <Button
                            className=" flex-1 border-1 border-lime-500 px-4 py-2"
                            onPress={() => {
                              // router.push(
                              //   `/lodging/${lodgingId}/contract/detail/${contract.id}`
                              // );
                            }}
                          >
                            <Text className="font-BeVietnamMedium text-mineShaft-950">
                              Xem chi tiết
                            </Text>
                          </Button>
                          {diffAmount > 0 && (
                            <Button className="flex-1 bg-lime-300 px-4 py-2">
                              <Text className="font-BeVietnamMedium text-mineShaft-950">
                                Thanh toán
                              </Text>
                            </Button>
                          )}
                        </View>
                      </View>
                    </View>

                    {/* Số tiền */}
                    <View className="flex-row items-center justify-between w-full px-2">
                      <View className="items-center">
                        <Text className="font-BeVietnamRegular text-12 text-mineShaft-700">
                          Tổng tiền
                        </Text>
                        <Text className="font-BeVietnamMedium">
                          {convertToNumber(rental.payment_amount.toString())} đ
                        </Text>
                      </View>
                      <View className="items-center">
                        <Text className="font-BeVietnamRegular text-12 text-mineShaft-700">
                          Đã trả
                        </Text>
                        <Text className="font-BeVietnamMedium text-lime-600">
                          {convertToNumber(rental.amount_paid.toString())} đ
                        </Text>
                      </View>
                      <View className="items-center">
                        <Text className="font-BeVietnamRegular text-12 text-mineShaft-700">
                          Còn thiếu
                        </Text>
                        <Text className="font-BeVietnamMedium text-redPower-600">
                          {convertToNumber(diffAmount.toString())} đ
                        </Text>
                      </View>
                    </View>
                  </Button>
                );
              })}
        </View>
      </ScrollView>
    </View>
  );
};

export default ListRentalHistory;
