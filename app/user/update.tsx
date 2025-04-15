import { constant } from "@/assets/constant";
import { env, formatDateForRequest, getDeviceID } from "@/helper/helper";
import { useGeneral } from "@/hooks/useGeneral";
import { IError } from "@/interfaces/ErrorInterface";
import { IUser } from "@/interfaces/UserInterface";
import BoxInfo from "@/pages/User/Update/BoxInfo";
import AuthService from "@/services/Auth/AuthService";
import { LocalStorage } from "@/services/LocalStorageService";
import UserService from "@/services/User/UserService";
import useToastStore from "@/store/toast/useToastStore";
import useUserStore from "@/store/user/useUserStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import { Logout } from "@/ui/icon/active";
import HeaderBack from "@/ui/components/HeaderBack";
import LoadingAnimation from "@/ui/LoadingAnimation";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import * as Yup from "yup";

function UpdateUser() {
  const { user, changeUser } = useGeneral();
  const { required } = useLocalSearchParams();
  const { addToast } = useToastStore();
  const { genders } = useUserStore();
  const localStorage = new LocalStorage();
  const [loadingLogout, setLoadingLogout] = useState(false);

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

  const isRequired = useMemo(() => {
    return required === "true";
  }, [required]);

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

      if (isRequired) {
        router.replace("/");
      }
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
    isRequired,
  ]);

  const logout = useCallback(async () => {
    setLoadingLogout(true);
    try {
      const token = await getDeviceID();
      const result = await new AuthService().logout(token);
      if (typeof result !== "string") {
        throw new Error(result.message);
      }

      await localStorage.removeItem(env("KEY_TOKEN"));
      if (router.canDismiss()) {
        router.dismissAll();
      }
      router.replace("/login");
    } catch (err: any) {
      useToastStore
        .getState()
        .addToast(
          constant.toast.type.error,
          err.message || "An error occurred"
        );
    } finally {
      setLoadingLogout(false);
    }
  }, []);

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
      <HeaderBack title="Cập nhật thông tin người dùng" hasBack={!isRequired} />
      <ScrollView className="flex-1 p-3">
        <BoxInfo
          {...{
            name,
            phone,
            birthDay,
            address,
            identityCard,
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
        <View className="flex-row gap-2">
          {isRequired && (
            <Button
              disabled={loading || loadingLogout}
              onPress={logout}
              className="border-1 border-redPower-600 bg-redPower-600 items-center gap-3 p-3"
            >
              {loadingLogout ? (
                <LoadingAnimation />
              ) : (
                <Icon icon={Logout} className="text-redPower-100" />
              )}
            </Button>
          )}

          <Button
            disabled={loading || loadingLogout}
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
