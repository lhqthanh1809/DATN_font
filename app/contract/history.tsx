import { constant } from "@/assets/constant";
import { reference } from "@/assets/reference";
import { convertToNumber, getTimezone } from "@/helper/helper";
import { IContract } from "@/interfaces/ContractInterface";
import ContractService from "@/services/Contract/ContractService";
import useToastStore from "@/store/toast/useToastStore";
import Button from "@/ui/Button";
import HeaderBack from "@/ui/components/HeaderBack";
import Divide from "@/ui/Divide";
import Icon from "@/ui/Icon";
import { ChevronRight, Document, Time, TimeSmall } from "@/ui/icon/symbol";
import EmptyScreen from "@/ui/layouts/EmptyScreen";
import LoadingAnimation from "@/ui/LoadingAnimation";
import { createScrollHandler } from "@/utils/scrollHandle";
import axios from "axios";
import { router } from "expo-router";
import moment from "moment";
import { Skeleton } from "moti/skeleton";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";

const ContractItem: React.FC<{
  contract: IContract;
}> = ({ contract }) => {
  const startDate = useMemo(() => {
    return moment(new Date(contract.start_date)).tz(getTimezone());
  }, [contract]);

  const endDate = useMemo(() => {
    if (contract.end_date) {
      return moment(new Date(contract.end_date)).tz(getTimezone());
    }
    return startDate.clone().add(contract.lease_duration ?? 0, "months");
  }, [contract, startDate]);

  return (
    <Button
      onPress={() => router.push(`/contract/detail/${contract.id}`)}
      className="border-1 p-4 border-white-100 shadow-soft-xs bg-white-50 flex-col items-stretch gap-3 rounded-xl"
    >
      {/* Mã hợp đồng */}
      <View className="flex-row w-full justify-between items-center">
        <View className="flex-1">
          <Text className="font-BeVietnamRegular text-white-800">
            #{contract.code}
          </Text>
        </View>
        <View className="bg-lime-200 px-3 py-1 rounded-md">
          <Text className="font-BeVietnamMedium text-12 text-lime-500">
            {contract.lease_duration} tháng
          </Text>
        </View>
      </View>

      {/* Thông tin nơi thuê */}
      <View className="gap-1">
        <Text className="font-BeVietnamSemiBold text-16 text-mineShaft-950">
          {contract.room?.lodging
            ? `${contract.room?.lodging?.type?.name} ${contract.room?.lodging?.name}`
            : reference.undefined.text}
        </Text>
        <Text className="font-BeVietnamRegular text-white-800">
          {contract.room
            ? `Phòng ${contract.room.room_code}`
            : reference.undefined.text}
        </Text>
      </View>

      {/* Thời gian thuê */}
      <View className="flex-row items-center gap-2">
        <Icon icon={TimeSmall} />
        <Text className="font-BeVietnamRegular text-white-800">
          {startDate.format("DD/MM/YYYY")} - {endDate.format("DD/MM/YYYY")}
        </Text>
      </View>

      {/* Footer */}

      <View className="gap-2">
        <Divide className="h-0.25 bg-white-100" />

        <View className="flex-row items-center">
          <View className="gap-1 flex-1">
            <Text className="font-BeVietnamRegular text-white-800">
              Tiền cọc
            </Text>
            <Text className="font-BeVietnamSemiBold text-16 text-mineShaft-950">
              {`${convertToNumber(contract.deposit_amount.toString())} đ`}
            </Text>
          </View>

          <View className="flex-row items-center gap-1">
            <Text className="font-BeVietnamRegular text-lime-500">
              Xem chi tiết
            </Text>
            <Icon icon={ChevronRight} className="text-lime-500" />
          </View>
        </View>
      </View>
    </Button>
  );
};

const ContractSkeleton = () => {
  return (
    <Button className=" p-4 bg-white-100 flex-col items-stretch gap-3 rounded-xl ">
      {/* Mã hợp đồng */}
      <View className="flex-row w-full justify-between items-center">
        <View className="flex-1">
          <Skeleton width={"30%"} height={20} colorMode="light" />
        </View>
        <Skeleton width={70} height={22} colorMode="light" />
      </View>

      {/* Thông tin nơi thuê */}
      <View className="gap-1">
        <Skeleton width={"50%"} height={24} colorMode="light" />
        <Skeleton width={"30%"} height={20} colorMode="light" />
      </View>

      {/* Thời gian thuê */}
      <Skeleton width={"70%"} height={20} colorMode="light" />

      {/* Footer */}

      <View className="gap-2">
        <Divide className="h-0.25 bg-white-100" />

        <View className="flex-row items-center">
          <View className="gap-1 flex-1">
            <Skeleton width={"30%"} height={20} colorMode="light" />
            <Skeleton width={"50%"} height={24} colorMode="light" />
          </View>

          <View className="flex-row items-center gap-1">
            <Skeleton width={100} height={20} colorMode="light" />
          </View>
        </View>
      </View>
    </Button>
  );
};

function ContractHistory() {
  const contractService = new ContractService();
  const { addToast } = useToastStore();

  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState<IContract[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const list = useCallback(
    async (loadMore: boolean = false) => {
      loadMore ? setLoadingMore(true) : setLoading(true);
      try {
        if (loadMore && !hasMore) return;
        let offsetNew = loadMore ? offset + limit : 0;
        const result = await contractService.listContractByUser(
          {
            status: constant.contract.status.finished,
            offset: offsetNew,
            limit,
          }
          //   cancelToken
        );

        if ("message" in result) {
          addToast(constant.toast.type.error, result.message);
          return;
        }

        setHasMore(result.total > offsetNew + result.data.length);
        setContracts((prev) =>
          loadMore ? [...prev, ...result.data] : result.data
        );
        setOffset(offsetNew);
      } catch (error) {
        if (!axios.isCancel(error)) {
          addToast(constant.toast.type.error, "Failed to fetch invoices");
        }
      } finally {
        loadMore ? setLoadingMore(false) : setLoading(false);
      }
    },
    [offset, hasMore, limit]
  );

  useEffect(() => {
    list();
  }, []);

  return (
    <View className="flex-1 bg-white-50">
      <HeaderBack title="Lịch sử hợp đồng" />
      {!loading && contracts.length <= 0 ? (
        <EmptyScreen
          icon={Document}
          description="Lịch sử hợp đồng sẽ hiển thị tại đây sau khi bạn tham gia hoặc kết thúc hợp đồng thuê trọ."
          title="Chưa có lịch sử hợp đồng"
        />
      ) : (
        <ScrollView className="flex-1 px-3" scrollEventThrottle={40} onScroll={createScrollHandler({
          callback: () => {
            !loading && list(true);
          },
          hasMore,
          loading: loadingMore,
          threshold: 20,
        })}>
          <View className="gap-3 py-3 flex-1">
            {loading ? (
              [...Array(4)].map((_, index) => <ContractSkeleton key={index} />)
            ) : (
              <Fragment>
                {contracts.map((contract) => (
                  <ContractItem contract={contract} key={contract.id} />
                ))}

                {loadingMore && (
                  <View>
                    <LoadingAnimation />
                  </View>
                )}
              </Fragment>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

export default ContractHistory;
