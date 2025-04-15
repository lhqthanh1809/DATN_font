import { constant } from "@/assets/constant";
import { cn, convertToNumber, formatNumber } from "@/helper/helper";
import { useUI } from "@/hooks/useUI";
import { IPayAmountByContract } from "@/interfaces/ContractInterface";
import { IError } from "@/interfaces/ErrorInterface";
import ContractService from "@/services/Contract/ContractService";
import useContractStore from "@/store/contract/useContractStore";
import usePaymentStore from "@/store/payment/usePaymentStore";
import useToastStore from "@/store/toast/useToastStore";
import Box from "@/ui/Box";
import Button from "@/ui/Button";
import Divide from "@/ui/Divide";
import Icon from "@/ui/Icon";
import { Bank, Wallet } from "@/ui/icon/finance";
import { CheckCircle, CrossMedium, Error } from "@/ui/icon/symbol";
import Input from "@/ui/Input";
import ModalPayment from "@/ui/components/ModalPayment";
import { Href, router } from "expo-router";
import { set } from "lodash";
import { MotiView } from "moti";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";

const ModalPaymentSettlement: React.FC<{
  settlementAmount: number;
  actionWhenPaymentSuccess?: (amount: number) => void;
  handlePayment: (
    type: "refund" | "payment_more",
    amount?: number
  ) => Promise<boolean>;
}> = ({ settlementAmount, actionWhenPaymentSuccess, handlePayment }) => {
  const { hideModal } = useUI();
  const { contract } = useContractStore();
  const { addToast } = useToastStore();
  const { paymentMethods } = usePaymentStore();
  const [amount, setAmount] = useState(settlementAmount.toString());
  const [methodPayment, setMethodPayment] = useState(paymentMethods[0]);

  const [loading, setLoading] = useState(false);

  const handlePaymentProcess = useCallback(async () => {
    setLoading(true);
    try {
      const result = await handlePayment(
        "payment_more",
        formatNumber(amount, "float") ?? 0
      );
      if (result) {
        addToast(constant.toast.type.success, "Thanh toán thành công");
        actionWhenPaymentSuccess &&
          actionWhenPaymentSuccess(formatNumber(amount, "float") ?? 0);
        hideModal();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [handlePayment, methodPayment, amount]);

  return (
    <Button
      onPress={() => {
        !loading && hideModal();
      }}
      className="h-full w-full justify-end"
    >
      <MotiView
        from={{ opacity: 0, translateY: 100 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 200 }}
        className="absolute bottom-0 w-full"
      >
        {/* Container */}
        <Button
          className="bg-white-50 flex-col px-4 py-6 rounded-b-none"
          onPress={() => {}}
        >
          {/* Header */}
          <View className="flex-row justify-between w-full items-center">
            <Text className="font-BeVietnamBold text-18 text-mineShaft-950">
              Thanh toán
            </Text>

            {/* Button Cross */}
            <Button
              disabled={loading}
              onPress={() => {
                hideModal();
              }}
              className=""
            >
              <Icon icon={CrossMedium} />
            </Button>
          </View>

          <View className="w-full gap-2">
            <Input
              value={amount}
              disabled={loading}
              className="w-full"
              type="number"
              onChange={(text) => {
                setAmount(text || "0");
              }}
              placeHolder="Nhập số tiền"
              label="Số tiền"
              suffix={<Text className="font-BeVietnamSemiBold">VND</Text>}
            />

            <Text className="font-BeVietnamRegular text-12 text-mineShaft-500 pl-3">
              Số tiền cần thanh toán:{" "}
              {convertToNumber(settlementAmount.toString())} đ
            </Text>
          </View>

          <View className="w-full gap-2">
            <Text className="font-BeVietnamRegular text-14 text-mineShaft-950 ml-2">
              Phương thức thanh toán
            </Text>

            <View className="gap-2">
              {paymentMethods.map((item, index) => (
                <Button
                  key={index}
                  disabled={loading}
                  onPress={() => setMethodPayment(item)}
                  className="rounded-lg border-1 border-mineShaft-100 p-4 justify-between items-start"
                >
                  <View className="flex-row items-center gap-3">
                    <Icon icon={item.icon} />
                    <Text className="font-BeVietnamMedium">{item.label}</Text>
                  </View>

                  <View className="h-5 w-5 rounded-full border-1 border-mineShaft-950 p-1">
                    <View
                      className={cn(
                        "w-full h-full rounded-full",
                        methodPayment == item && "bg-lime-400"
                      )}
                    />
                  </View>
                </Button>
              ))}
            </View>
          </View>

          <View className="w-full gap-2">
            <Button
              disabled={loading}
              loading={loading}
              onPress={() => {
                handlePaymentProcess();
              }}
              className="bg-lime-400 py-3"
            >
              <Text className="text-mineShaft-950 font-BeVietnamMedium">
                Xác nhận thanh toán
              </Text>
            </Button>
          </View>
        </Button>
      </MotiView>
    </Button>
  );
};

const BoxWorkToDo: React.FC<{
  lodgingId: string;
  skip?: ("payment" | "bill")[];
  setSkip?: React.Dispatch<React.SetStateAction<("payment" | "bill")[]>>;
}> = ({ lodgingId, skip, setSkip }) => {
  const { showModal } = useUI();
  const { contract, fetchContract } = useContractStore();
  const { addToast } = useToastStore();
  const { setAmountToBePaid, openPaymentModal } = usePaymentStore();

  const [loadingDebt, setLoadingDebt] = useState(false);
  const [loadingProcess, setLoadingProcess] = useState(false);
  const [debt, setDebt] = useState<number>(0);
  const service = new ContractService();

  const settlementAmount = useMemo(() => {
    return debt - (contract ? contract.remain_amount : 0);
  }, [contract, debt]);

  const handleWhenPaymentSuccess = useCallback(
    (amount: number) => {
      const totalDue = Math.max((contract?.total_due ?? 0) - amount, 0);
    },
    [contract]
  );

  const handlePaymentAmountByContract = useCallback(
    async (type: "refund" | "payment_more", amount: number = 0) => {
      if (!contract) {
        addToast(constant.toast.type.error, "Không tìm thấy hợp đồng");
        return false;
      }
      const data: IPayAmountByContract = {
        type,
        contract_id: contract.id,
        amount: type == "refund" ? 0 : amount,
      };

      setLoadingDebt(true);
      try {
        const result: string | IError = await service.payAmountByContract(data);

        if (typeof result != "string") {
          addToast(
            constant.toast.type.error,
            result.message || "Có lỗi xảy ra"
          );
          return false;
        }

        addToast(constant.toast.type.success, "Thanh toán thành công");
        Promise.all([fetchContract(contract.id), getDebtOfContract()]);
        return true;
      } catch (err: any) {
        addToast(constant.toast.type.error, err.message || "Có lỗi xảy ra");
        return false;
      } finally {
        setLoadingDebt(false);
      }
    },
    [contract, settlementAmount]
  );

  // Hàm xử lý khi nhấn nút thanh toán/ hoàn trả
  const handleOpenPayment = useCallback(() => {
    if (settlementAmount <= 0) {
      handlePaymentAmountByContract("refund");
    } else {
      showModal(
        <ModalPaymentSettlement
          settlementAmount={settlementAmount}
          actionWhenPaymentSuccess={handleWhenPaymentSuccess}
          handlePayment={handlePaymentAmountByContract}
        />
      );
    }
  }, [
    handlePaymentAmountByContract,
    settlementAmount,
    contract,
    handleWhenPaymentSuccess,
  ]);

  const goToFinalBill = useCallback(() => {
    router.push(`lodging/${lodgingId}/contract/final-bill` as Href);
  }, [lodgingId]);

  const handleSkip = useCallback(
    (type: "payment" | "bill") => {
      if (setSkip) {
        setSkip((prev) => Array.from(new Set([...prev, type])));
      }
    },
    [skip, setSkip]
  );

  const getDebtOfContract = useCallback(async () => {
    if (!contract) return;

    const result = await service.debt(contract.id);

    if (!("message" in result)) {
      setDebt(result.room + result.service);
    }
  }, [contract]);

  useEffect(() => {
    getDebtOfContract();
  }, [contract]);

  return (
    <Box
      title="Việc cần làm trước khi kết thúc hợp đồng"
      description="Hoàn thành một số công việc bên dưới trước khi kết thúc hợp đồng"
    >
      <View className="border-1 border-mineShaft-100 rounded-xl p-3 gap-3 bg-white-50">
        <View className="flex-row gap-2 items-center">
          <Icon
            icon={
              contract?.has_been_billed || skip?.find((item) => item == "bill")
                ? CheckCircle
                : Error
            }
            className={cn(
              contract?.has_been_billed || skip?.find((item) => item == "bill")
                ? "text-lime-500"
                : "text-redPower-600"
            )}
          />
          <View className="flex-1">
            <Text className="font-BeVietnamMedium text-balance">
              Tính toán chi phí chưa thanh toán trước khi kết thúc hợp đồng
            </Text>
          </View>
        </View>
        <Text className="font-BeVietnamRegular text-mineShaft-600">
          Xác định các khoản cần thanh toán và hoàn trả trước khi kết thúc hợp
          đồng.
        </Text>
        {!contract?.has_been_billed &&
          !skip?.find((item) => item == "bill") && (
            <View className="flex-row gap-2">
              <Button
                onPress={() => {
                  handleSkip("bill");
                }}
                className="bg-mineShaft-400 py-3 px-11"
              >
                <Text className="font-BeVietnamMedium text-white-50">
                  Bỏ qua
                </Text>
              </Button>
              <Button
                onPress={goToFinalBill}
                className="bg-lime-400 p-3 flex-1"
              >
                <Text className="font-BeVietnamMedium">Tính toán</Text>
              </Button>
            </View>
          )}
      </View>

      {/* Thanh toán nợ */}

      {Number(contract?.remain_amount) || Number(debt) ? (
        <View className="border-1 border-mineShaft-100 rounded-xl p-3 gap-3 bg-white-50">
          <View className="gap-2">
            <View className="flex-row gap-2 items-center">
              <Icon icon={CheckCircle} className="text-lime-500" />
              <Text className="font-BeVietnamMedium">
                Thanh toán hết khoản phí còn lại
              </Text>
            </View>
            <Text className="font-BeVietnamRegular text-mineShaft-600 ">
              Thực hiện thanh toán hết khoản phí còn lại trước khi kết thúc hợp
              đồng
            </Text>
          </View>

          <View className="border-1 border-mineShaft-200 rounded-lg">
            <View className="flex-row justify-between py-2 px-4">
              <Text className="font-BeVietnamRegular">Số tiền cần thu:</Text>
              <Text className="font-BeVietnamRegular">
                {convertToNumber(debt.toString())} đ
              </Text>
            </View>

            <Divide className="bg-mineShaft-200 h-0.25" />
            <View className="flex-row justify-between py-2 px-4">
              <Text className="font-BeVietnamRegular">Khoản dư hợp đồng:</Text>
              <Text className="font-BeVietnamRegular">
                {convertToNumber(
                  (contract ? contract.remain_amount : 0).toString()
                )}{" "}
                đ
              </Text>
            </View>

            <Divide className="bg-mineShaft-200 h-0.25" />
            <View className="flex-row justify-between py-2 px-4">
              <Text className="font-BeVietnamRegular">Số tiền quyết toán:</Text>
              <Text className="font-BeVietnamRegular">
                {convertToNumber(settlementAmount.toString())} đ
              </Text>
            </View>
          </View>

          {!skip?.find((item) => item == "payment") && (
            <View className="flex-row gap-2">
              <Button
                disabled={loadingProcess}
                onPress={() => {
                  handleSkip("payment");
                }}
                className="bg-mineShaft-400 py-3 px-11"
              >
                <Text className="font-BeVietnamMedium text-white-50">
                  Bỏ qua
                </Text>
              </Button>
              <Button
                disabled={loadingProcess}
                loading={loadingProcess}
                onPress={handleOpenPayment}
                className="bg-lime-400 p-3 flex-1"
              >
                <Text className="font-BeVietnamMedium">
                  {settlementAmount > 0 ? "Thanh toán" : "Hoàn trả"}
                </Text>
              </Button>
            </View>
          )}
        </View>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default BoxWorkToDo;
