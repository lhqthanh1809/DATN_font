import { constant } from "@/assets/constant";
import {
  env,
  formatDateForRequest,
  formatNumber,
  getTimezone,
} from "@/helper/helper";
import BoxInfo from "@/pages/Contract/Holding/BoxInfo";
import BoxPriceHolding from "@/pages/Contract/Holding/BoxPriceHolding";
import ContractService from "@/services/Contract/ContractService";
import useToastStore from "@/store/toast/useToastStore";
import Button from "@/ui/Button";
import DetailItem from "@/ui/components/DetailItem";
import HeaderBack from "@/ui/components/HeaderBack";
import Layout from "@/ui/layouts/Layout";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import * as Yup from "yup";
const schema = Yup.object().shape({
  phone: Yup.string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^0[0-9]{9}$/, "Số điện thoại không hợp lệ"),
  full_name: Yup.string().required("Vui lòng nhập họ tên"),
  deposit_amount: Yup.number().required("Vui lòng nhập số tiền đặt cọc"),
  lease_duration: Yup.number(),
  quantity: Yup.number().required("Vui lòng nhập số lượng người thuê"),
  room_id: Yup.string().required("Vui lòng chọn phòng"),
  start_date: Yup.date().required("Vui lòng chọn ngày bắt đầu"),
});

function CreateHolding() {
  const { roomId, name, price, lodgingId, filter } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [nameCustom, setNameCustom] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [time, setTime] = useState(1);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [depositAmount, setDepositAmount] = useState<string>(price as string);

  const { addToast } = useToastStore();

  const handleCreateContract = useCallback(async () => {
    setLoading(true);
    try {
      const data = {
        phone,
        full_name: nameCustom,
        deposit_amount: formatNumber(depositAmount, "float") || 0,
        lease_duration: time,
        quantity,
        room_id: roomId as string,
        start_date: formatDateForRequest(startDate),
        status: constant.contract.status.pending,
      };

      await schema.validate(data, { abortEarly: false });
      const result = await new ContractService().createContract(data);

      if (!result || "message" in result) {
        throw new Error(
          result.message || "Tạo hợp đồng không thành công, vui lòng thử lại"
        );
      }

      router.back();
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        error.errors.forEach((err) => {
          addToast(constant.toast.type.error, err);
        });
      } else {
        addToast(
          constant.toast.type.error,
          (error as Error).message || "Đã có lỗi xảy ra, vui lòng thử lại"
        );
      }
    } finally {
      setLoading(false);
    }
  }, [roomId, nameCustom, phone, quantity, time, startDate, depositAmount]);

  useEffect(() => {
    if (!filter) return;

    const base64 = (filter as string).replace(/-/g, "+").replace(/_/g, "/");
    const data = JSON.parse(atob(base64));
    setTime(data.lease_duration);
    setQuantity(data.quantity);

    setStartDate(new Date(data.start_date));
  }, [filter]);

  return (
    <View className="flex-1">
      <Layout title={`Đặt cọc giữ chỗ ${name && `- ${name}`} `}>
        <ScrollView className="px-3 flex-grow bg-white-50">
          <View className="gap-3 items-center py-3 flex-1">
            <BoxInfo
              {...{
                phone,
                quantity,
                setPhone,
                setQuantity,
                setStartDate,
                setTime,
                time,
                startDate,
                name: nameCustom,
                setName: setNameCustom,
              }}
            />
            <BoxPriceHolding
              priceRoom={price as string}
              depositAmount={depositAmount}
              setDepositAmount={setDepositAmount}
            />
          </View>
        </ScrollView>
        <View className="p-3 flex bg-white-50">
          <View className="flex-row">
            <Button
              disabled={loading}
              loading={loading}
              onPress={handleCreateContract}
              className="flex-1 bg-lime-400 py-4"
            >
              <Text className="text-mineShaft-900 text-16 font-BeVietnamSemiBold">
                Hoàn thành
              </Text>
            </Button>
          </View>
        </View>
      </Layout>
    </View>
  );
}

export default CreateHolding;
