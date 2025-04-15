import { constant } from "@/assets/constant";
import { reference } from "@/assets/reference";
import { cn, convertToNumber } from "@/helper/helper";
import { useUI } from "@/hooks/useUI";
import { IContract, IListContract } from "@/interfaces/ContractInterface";
import ContractService from "@/services/Contract/ContractService";
import usePaymentStore from "@/store/payment/usePaymentStore";
import useToastStore from "@/store/toast/useToastStore";
import Button from "@/ui/Button";
import Divide from "@/ui/Divide";
import Icon from "@/ui/Icon";
import { Money } from "@/ui/icon/finance";
import { CheckCircle, Error, Warning } from "@/ui/icon/symbol";
import SearchAndSegmentedControl from "@/ui/components/SearchAndSearchAndSegmentedControl";
import { router } from "expo-router";
import { isArray } from "lodash";
import moment from "moment";
import { Skeleton } from "moti/skeleton";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

const ListContract: React.FC<{
  lodgingId: string;
  roomId?: string;
}> = ({ lodgingId, roomId }) => {
  const { addToast } = useToastStore();
  const [contracts, setContracts] = useState<IContract[]>([]);
  const [search, setSearch] = useState("");
  const [statusActive, setStatusActive] = useState<null | number>(null);
  const [loading, setLoading] = useState(false);
  const contractService = new ContractService();

  const fetchContract = useCallback(async () => {
    const data: IListContract = {
      lodging_id: lodgingId as string,
      status: statusActive,
      ...(roomId && { room_id: roomId }),
    };

    setLoading(true);

    const result = await contractService.listContract(data);

    if (isArray(result)) {
      setContracts(result);
    } else {
      addToast(constant.toast.type.error, result.message);
    }

    setLoading(false);
  }, [lodgingId, roomId, statusActive]);

  useEffect(() => {
    fetchContract();
  }, [statusActive]);
  return (
    <View className="flex-1 pt-3 gap-2">
      <SearchAndSegmentedControl
        dataObject={reference.contract.status}
        onChangeSearch={(search) => setSearch(search)}
        onChangeStatus={(status) => setStatusActive(status)}
        placeHolder="Tìm kiếm theo mã hợp đồng..."
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        className="px-3 flex-grow flex-1"
        contentContainerStyle={{
          paddingBottom: 12,
        }}
      >
        <View className="gap-3 items-center flex-1 py-3">
          {loading
            ? Array(4)
                .fill("")
                .map((_, index) => (
                  <Button
                    key={index}
                    className={cn(
                      "w-full bg-white-100 rounded-xl p-4 gap-2 flex-col items-start"
                    )}
                  >
                    {/* Header */}
                    <View className="flex-row justify-between items-start w-full">
                      {/* Header HD */}
                      <View className="gap-1">
                        <Skeleton colorMode="light" height={24} width={80} />
                        <Skeleton colorMode="light" height={20} width={160} />
                      </View>

                      {/* Status */}
                      <Skeleton
                        colorMode="light"
                        height={30}
                        width={100}
                        radius={"round"}
                      />
                    </View>

                    <View className="w-full px-11">
                      <Divide className="h-0.25" />
                    </View>

                    {/* Body */}
                    <View className="gap-2 w-full">
                      <View className="items-center">
                        <Skeleton colorMode="light" height={22} width={"50%"} />
                      </View>

                      <View className="flex-row items-center gap-2">
                        <Skeleton colorMode="light" height={22} width={"70%"} />
                      </View>

                      <View className="flex-row items-center gap-2">
                        <Skeleton colorMode="light" height={22} width={"60%"} />
                      </View>
                    </View>

                    <View className="w-full px-11">
                      <Divide className="h-0.25" />
                    </View>

                    {/* Footer */}
                    <View className="w-full flex-row gap-2">
                      <View className="flex-1">
                        <Skeleton
                          colorMode="light"
                          height={36}
                          width={"100%"}
                        />
                      </View>
                      <View className="flex-1">
                        <Skeleton
                          colorMode="light"
                          height={36}
                          width={"100%"}
                        />
                      </View>
                    </View>
                  </Button>
                ))
            : contracts.map((contract) => (
                <ContractItem
                  key={contract.id}
                  contract={contract}
                  roomId={roomId as string}
                  lodgingId={lodgingId as string}
                />
              ))}
        </View>
      </ScrollView>
    </View>
  );
};

const ContractItem: React.FC<{
  contract: IContract;
  roomId: string;
  lodgingId: string;
}> = ({ contract: initial, roomId, lodgingId }) => {
  const contractService = new ContractService();
  const { showModal } = useUI();
  const { openPaymentModal, setAmountToBePaid } = usePaymentStore();
  const [contract, setContract] = useState<IContract>(initial);
  const startDate = moment(contract.start_date);
  const endDate = contract.end_date
    ? moment(contract.end_date)
    : startDate.clone().add(contract.lease_duration, "months");

  const formattedStartDate = startDate.format("DD/MM/YYYY");
  const formattedEndDate = endDate.format("DD/MM/YYYY");

  const status = contractService.getReferenceToStatus(contract.status);

  const handleWhenPaymentSuccess = useCallback(
    (amount: number) => {
      const totalDue = Math.max((contract?.total_due ?? 0) - amount, 0);

      setContract({
        ...contract,
        total_due: totalDue,
        due_months: totalDue > 0 ? contract.due_months : 0,
      })

    },
    [contract]
  );

  const handleOpenPayment = useCallback(() => {
    setAmountToBePaid(contract.total_due ?? 0);
    openPaymentModal("", contract.id, "rent", showModal, handleWhenPaymentSuccess, "full");
  }, [showModal, openPaymentModal, contract, handleWhenPaymentSuccess]);

  const statusSub = useCallback(() => {
    switch (contract.status) {
      case constant.contract.status.pending: {
        const daysDiff = moment(startDate).diff(moment(), "days");
        return `Sắp chuyển vào (${daysDiff} ngày)`;
      }
      case constant.contract.status.finished:
        return "Hợp đồng đã kết thúc";
      case constant.contract.status.cancel:
        return "Đã huỷ giữ chỗ";
      default: {
        if (contract.due_months) {
          const totalDue = convertToNumber(
            (contract.total_due ?? 0).toString()
          );
          return contract.due_months === 1
            ? `Còn nợ ${totalDue} đ`
            : `Nợ ${contract.due_months} tháng (${totalDue} đ)`;
        }
        return "Đã thanh toán tháng này";
      }
    }
  }, [contract, startDate]);

  return (
    <Button
      key={contract.id}
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
            {!roomId && (
              <Text className="font-BeVietnamMedium text-14">
                - Phòng {contract.room?.room_code}
              </Text>
            )}
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

      <View className="w-full px-11">
        <Divide className="h-0.25" />
      </View>

      {/* Footer */}
      <View className="w-full flex-row gap-2">
        <Button
          className=" flex-1 border-1 border-lime-500 px-4 py-2"
          onPress={() => {
            router.push(`/lodging/${lodgingId}/contract/detail/${contract.id}`);
          }}
        >
          <Text className="font-BeVietnamMedium text-mineShaft-950">
            Xem chi tiết
          </Text>
        </Button>
        {contract.status === constant.contract.status.pending ? (
          <ButtonCancelContract />
        ) : contract.status === constant.contract.status.cancel ||
          contract.status === constant.contract.status.finished ? null : (
          !!contract.due_months && <ButtonPayment onPress={handleOpenPayment}/>
        )}
      </View>
    </Button>
  );
};

const ButtonPayment:React.FC<{
  onPress?: () => void;
}> = ({ onPress }) =>  {
  return (
    <Button onPress={() => onPress && onPress()} className="flex-1 bg-lime-300 px-4 py-2">
      <Text className="font-BeVietnamMedium text-mineShaft-950">
        Thanh toán
      </Text>
    </Button>
  );
};

const ButtonCancelContract = () => {
  return (
    <Button className="flex-1 bg-lime-300 px-4 py-2">
      <Text className="font-BeVietnamMedium text-mineShaft-950">
        Huỷ giữ chỗ
      </Text>
    </Button>
  );
};

export default ListContract;
