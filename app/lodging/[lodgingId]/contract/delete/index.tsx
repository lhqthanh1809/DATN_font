import { constant } from "@/assets/constant";
import { cn, convertToNumber } from "@/helper/helper";
import { IContract, IListContract } from "@/interfaces/ContractInterface";
import ListContract from "@/pages/Contract/ListContract";
import ContractService from "@/services/Contract/ContractService";
import useToastStore from "@/store/toast/useToastStore";
import Button from "@/ui/Button";
import Divide from "@/ui/Divide";
import Icon from "@/ui/Icon";
import { Money } from "@/ui/icon/finance";
import { CheckCircle, Document, Error, Warning } from "@/ui/icon/symbol";
import HeaderBack from "@/ui/components/HeaderBack";
import {
  Href,
  router,
  useFocusEffect,
  useLocalSearchParams,
  usePathname,
} from "expo-router";
import { isArray, set } from "lodash";
import moment from "moment";
import { Skeleton } from "moti/skeleton";
import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import EmptyScreen from "@/ui/layouts/EmptyScreen";

function Delete() {
  const { lodgingId } = useLocalSearchParams();
  const { addToast } = useToastStore();
  const [contracts, setContracts] = useState<IContract[]>([]);
  const [search, setSearch] = useState("");
  const [statusActive, setStatusActive] = useState<null | number>(null);
  const [loading, setLoading] = useState(false);
  const contractService = new ContractService();

  const fetchContract = useCallback(async () => {
    const data: IListContract = {
      lodging_id: lodgingId as string,
      status: constant.contract.status.active,
    };

    setLoading(true);

    const result = await contractService.listContract(data);

    if ("message" in result) {
      addToast(constant.toast.type.error, result.message);
      return;
    }

    setContracts(result.data as IContract[]);

    setLoading(false);
  }, [lodgingId]);

  useFocusEffect(
    useCallback(() => {
      fetchContract();
    }, [])
  );

  return (
    <View className="flex-1 bg-white-50">
      <HeaderBack title={`Thanh lý/Kết thúc hợp đồng`} />
      <View className="flex-1 gap-2">
        {!loading && contracts.length <= 0 ? (
          <EmptyScreen
            icon={Document}
            title="Không có hợp đồng còn hiệu lực"
            description="Tất cả các hợp đồng đã kết thúc hoặc chưa bắt đầu. Vui lòng kiểm tra lại sau."
          />
        ) : (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            className="px-3 flex-grow flex-1"
            contentContainerStyle={{
              paddingBottom: 12,
            }}
          >
            <View className="gap-3 items-center flex-1 py-3">
              {loading
                ? Array(3)
                    .fill("")
                    .map((_, index) => (
                      <Button
                        key={index}
                        className={
                          "w-full bg-white-100 rounded-xl p-4 gap-2 flex-col items-start"
                        }
                      >
                        <Skeleton.Group show={true}>
                          <View className="flex-row justify-between items-start w-full">
                            <View className="gap-1">
                              <Skeleton
                                colorMode="light"
                                height={44}
                                width={160}
                              />
                            </View>
                            <Skeleton
                              colorMode="light"
                              height={30}
                              width={100}
                              radius={"round"}
                            />
                          </View>

                          <View className="gap-2 w-full">
                            <Skeleton
                              colorMode="light"
                              height={66}
                              width={"100%"}
                            />
                          </View>

                          <View className="w-full">
                            <Skeleton
                              colorMode="light"
                              height={36}
                              width={"100%"}
                            />
                          </View>
                        </Skeleton.Group>
                      </Button>
                    ))
                : contracts.map((contract) => (
                    <ContractItem key={contract.id} contract={contract} />
                  ))}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const ContractItem: React.FC<{
  contract: IContract;
}> = ({ contract }) => {
  const pathName = usePathname();
  const contractService = new ContractService();
  const startDate = moment(contract.start_date);
  const endDate = contract.end_date
    ? moment(contract.end_date)
    : startDate.clone().add(contract.lease_duration, "months");

  const formattedStartDate = startDate.format("DD/MM/YYYY");
  const formattedEndDate = endDate.format("DD/MM/YYYY");

  const status = contractService.getReferenceToStatus(contract.status);

  const statusSub = useCallback(() => {
    if (contract.status == constant.contract.status.pending) {
      const daysDiff = moment(startDate).diff(moment(), "days");
      const diffInHours = moment(startDate).diff(moment(), "hours");
      return `Sắp chuyển vào (${daysDiff} ngày)`;
    }

    if (contract.status == constant.contract.status.finished) {
      return "Hợp đồng đã kết thúc";
    }

    if (contract.status == constant.contract.status.cancel) {
      return "Đã huỷ giữ chỗ";
    }

    if (contract.due_months) {
      if (contract.due_months == 1) {
        return `Còn nợ ${convertToNumber(
          (contract.total_due ?? 0).toString()
        )} đ`;
      }

      return `Nợ ${contract.due_months} tháng (${convertToNumber(
        (contract.total_due ?? 0).toString()
      )} đ)`;
    }

    return "Đã thanh toán tháng này";
  }, [contract, startDate]);

  return (
    <Button
      key={contract.id}
      onPress={() => {
        router.push(
          `${pathName}/${contract.id}?room_code=${contract.room?.room_code}&code=${contract.code}` as Href
        );
      }}
      className={cn(
        "w-full bg-white-50 rounded-xl p-4 gap-2 border-1 shadow-soft-md flex-col items-start",
        contract.due_months && contract.due_months > 1
          ? "border-redPower-600"
          : "border-white-100"
      )}
    >
      {/* Header */}
      <View className="flex-row justify-between items-start w-full">
        {/* Header HD */}
        <View>
          <Text className="font-BeVietnamBold text-16">
            #{contract.code}{" "}
            <Text className="font-BeVietnamMedium text-14">
              - Phòng {contract.room?.room_code}
            </Text>
          </Text>
          <Text className="font-BeVietnamRegular text-14">
            {contract.full_name}
          </Text>
        </View>

        {/* Status */}
        <View className={cn("rounded-full items-center px-4 py-2", status.bg)}>
          <Text className={cn("font-BeVietnamMedium", status.text)}>
            {status.name}
          </Text>
        </View>
      </View>

      <View className="w-full px-11">
        <Divide className="h-0.25" />
      </View>

      {/* Body */}
      <View className="gap-2 w-full">
        <Text className="font-BeVietnamSemiBold text-lime-800 text-center">
          {formattedStartDate} - {formattedEndDate}
        </Text>

        <View className="flex-row items-center gap-2">
          <Icon icon={Money} className="text-yellow-400" />
          <Text className="font-BeVietnamMedium">
            {convertToNumber(
              (contract.monthly_rent ?? contract.room?.price)?.toString() ?? "0"
            )}{" "}
            đ/tháng
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <Icon
            icon={
              contract.due_months
                ? contract.due_months <= 1
                  ? Warning
                  : Error
                : CheckCircle
            }
            className={cn(
              contract.due_months
                ? contract.due_months <= 1
                  ? "text-happyOrange-600"
                  : "text-redPower-600"
                : "text-lime-500"
            )}
          />
          <Text className="font-BeVietnamRegular">{statusSub()}</Text>
        </View>
      </View>
    </Button>
  );
};

export default Delete;
