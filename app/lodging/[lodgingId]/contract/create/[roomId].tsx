import { constant } from "@/assets/constant";
import { env, formatDateForRequest, formatNumber } from "@/helper/helper";
import { ICreateContract } from "@/interfaces/ContractInterface";
import BoxInfo from "@/pages/Contract/BoxInfo";
import BoxPrice from "@/pages/Contract/Create/BoxPrice";
import ContractService from "@/services/Contract/ContractService";
import useToastStore from "@/store/toast/useToastStore";
import useUserStore from "@/store/user/useUserStore";
import Button from "@/ui/Button";
import Layout from "@/ui/layouts/Layout";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import * as Yup from "yup";

const schema = Yup.object().shape({
  address: Yup.string().required("Vui lòng nhập địa chỉ"),
  phone: Yup.string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^0[0-9]{9}$/, "Số điện thoại không hợp lệ"),
  date_of_birth: Yup.date().required("Vui lòng chọn ngày sinh khách đứng tên"),
  full_name: Yup.string().required("Vui lòng nhập họ tên"),
  deposit_amount: Yup.number().required("Vui lòng nhập số tiền đặt cọc"),
  gender: Yup.string().required("Vui lòng chọn giới tính"),
  identity_card: Yup.string()
    .required("Vui lòng nhập số CMND/CCCD")
    .length(12, "Số CMND/CCCD phải có 12 chữ số"),
  lease_duration: Yup.number(),
  quantity: Yup.number().required("Vui lòng nhập số lượng người thuê"),
  room_id: Yup.string().required("Vui lòng chọn phòng"),
  start_date: Yup.date().required("Vui lòng chọn ngày bắt đầu"),
});

function CreateContract() {
  const { roomId, name, price, filter } = useLocalSearchParams();
  const { genders } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [nameCustom, setNameCustom] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [time, setTime] = useState(1);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [birthDay, setBirthDay] = useState<Date>(new Date());
  const [address, setAddress] = useState("");
  const [identityCard, setIdentityCard] = useState("");
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [depositAmount, setDepositAmount] = useState<string>(price as string);
  const [gender, setGender] = useState(genders[0]);

  const { addToast } = useToastStore();

  const handleCreateContract = useCallback(async () => {
    setLoading(true);

    try {
      const data: ICreateContract = {
        address,
        phone,
        date_of_birth: formatDateForRequest(birthDay),
        end_date: formatDateForRequest(endDate),
        full_name: nameCustom,
        deposit_amount: formatNumber(depositAmount, "float") || 0,
        gender: gender.value,
        identity_card: identityCard,
        lease_duration: time,
        quantity,
        room_id: roomId as string,
        start_date: formatDateForRequest(startDate),
        status: constant.contract.status.active,
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
  }, [
    roomId,
    nameCustom,
    phone,
    address,
    quantity,
    time,
    startDate,
    birthDay,
    identityCard,
    endDate,
    depositAmount,
    gender,
  ]);

  useEffect(() => {
    if (!filter) return;

    const base64 = (filter as string).replace(/-/g, "+").replace(/_/g, "/");
    const data = JSON.parse(atob(base64));
    setTime(data.lease_duration);
    setQuantity(data.quantity);
  }, [filter]);

  return (
    <View className="flex-1">
      <Layout title={`Lập hợp đồng thuê phòng ${name && `- ${name}`} `}>
        <ScrollView className="px-3 flex-grow bg-white-50">
          <View className="gap-3 items-center py-3 flex-1">
            <BoxInfo
              {...{
                address,
                birthDay,
                endDate,
                gender,
                identityCard,
                phone,
                quantity,
                setAddress,
                setBirthDay,
                setEndDate,
                setGender,
                setIdentityCard,
                setPhone,
                setQuantity,
                setStartDate,
                setTime,
                time,
                startDate,
                name: nameCustom,
                setName: setNameCustom,
                required: [
                  "name",
                  "phone",
                  "quantity",
                  "time",
                  "start_date",
                  "birthday",
                  "id_card",
                  "end_date",
                  "address",
                ],
              }}
            />
            <BoxPrice
              priceRoom={price as string}
              {...{ depositAmount, setDepositAmount }}
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

export default CreateContract;
