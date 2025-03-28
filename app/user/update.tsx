import { constant } from "@/assets/constant";
import { formatDateForRequest } from "@/helper/helper";
import { useGeneral } from "@/hooks/useGeneral";
import { IError } from "@/interfaces/ErrorInterface";
import { IUser } from "@/interfaces/UserInterface";
import BoxInfo from "@/pages/User/Update/BoxInfo";
import UserService from "@/services/User/UserService";
import useToastStore from "@/store/toast/useToastStore";
import Button from "@/ui/Button";
import HeaderBack from "@/ui/layout/HeaderBack";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import * as Yup from "yup";

const genders = [
  {
    name: "Nam",
    value: false,
  },
  {
    name: "Nữ",
    value: true,
  },
];

function UpdateUser() {
  const { user, changeUser } = useGeneral();
  const { addToast } = useToastStore();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState(genders[0]);
  const [birthDay, setBirthDay] = useState<Date>(new Date());
  const [address, setAddress] = useState("");
  const [identityCard, setIdentityCard] = useState("");
  const userService = new UserService();

  const schema = Yup.object().shape({
    full_name: Yup.string().required("Họ tên là bắt buộc"),
    email: Yup.string().email("Email không hợp lệ"),
    identity_card: Yup.string().required("Căn cước công dân là bắt buộc"),
    phone: Yup.string()
      .required("Số điện thoại là bắt buộc")
      .matches(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ"),
  });

  const handleUpdateUser = useCallback(async () => {
    setLoading(true);

    try {
      if (!user) {
        addToast(constant.toast.type.error, "Người dùng không toàn tại");
      }
      await schema.validate(
        {
          full_name: name,
          phone,
          email,
          identity_card: identityCard,
        },
        { abortEarly: false }
      );

      const data: IUser = {
        ...user,
        full_name: name,
        phone,
        email,
        identity_card: identityCard,
        gender: gender.value,
        address,
        is_completed: true,
        date_of_birth: formatDateForRequest(birthDay),
      };

      const result: IUser | IError = await userService.update(data);

      if (!result || result.hasOwnProperty("message")) {
        addToast(
          constant.toast.type.error,
          result
            ? (result as IError).message
            : "Đã có lỗi xảy ra, vui lòng thử lại"
        );
        return;
      }

      addToast(
        constant.toast.type.success,
        "Cập nhật thông tin người dùng thành công!"
      );
      changeUser(result as IUser);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((e) => {
          addToast(constant.toast.type.error, e.message);
        });
      } else {
        addToast(
          constant.toast.type.error,
          "Đã có lỗi xảy ra, vui lòng thử lại"
        );
      }
    } finally {
      setLoading(false);
    }
  }, [
    name,
    phone,
    birthDay,
    address,
    identityCard,
    genders,
    gender,
    email,
    user,
  ]);

  useEffect(() => {
    if (!user) return;

    setName(user.full_name ?? name);
    setPhone(user.phone);
    setAddress(user.address ?? address);
    setEmail(user.email ?? email);
    setBirthDay(user.date_of_birth ? new Date(user.date_of_birth) : birthDay);
    setGender(genders.find((item) => item.value == user.gender) ?? gender);
    setIdentityCard(user.identity_card ?? identityCard);
  }, [user]);

  return (
    <View className="flex-1 bg-white-50">
      <HeaderBack title="Cập nhật thông tin người dùng" />
      <ScrollView className="flex-1 p-3">
        <BoxInfo
          {...{
            name,
            phone,
            birthDay,
            address,
            identityCard,
            genders,
            gender,
            email,
            setName,
            setPhone,
            setBirthDay,
            setAddress,
            setIdentityCard,
            setGender,
            setEmail,
          }}
        />
      </ScrollView>
      <View className="p-3 flex bg-white-50">
        <View className="flex-row">
          <Button
            disabled={loading}
            loading={loading}
            onPress={handleUpdateUser}
            className="flex-1 bg-lime-400 py-4"
          >
            <Text className="text-mineShaft-900 text-16 font-BeVietnamSemiBold">
              Cập nhật
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

export default UpdateUser;
