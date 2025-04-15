import Button from "@/ui/Button";
import Input from "@/ui/Input";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import BackView from "@/ui/BackView";
import { useCallback, useState } from "react";
import { encrypt, env, getDeviceID } from "@/helper/helper";
import { BaseHttpService } from "@/services/BaseHttpService";
import { apiRouter } from "@/assets/apiRouter";
import { useRouter } from "expo-router";
import OAuthLogin from "@/ui/components/OauthLogin";
import AuthService from "@/services/Auth/AuthService";
import { useGeneral } from "@/hooks/useGeneral";
import { IError } from "@/interfaces/ErrorInterface";
import useToastStore from "@/store/toast/useToastStore";
import { constant } from "@/assets/constant";
import { LocalStorage } from "@/services/LocalStorageService";
import UserService from "@/services/User/UserService";
import { IUser } from "@/interfaces/UserInterface";
import * as Yup from "yup";

const schema = Yup.object().shape({
  email: Yup.string().email("Email không hợp lệ").required("Email là bắt buột"),
  phone: Yup.string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^0[0-9]{9}$/, "Số điện thoại không hợp lệ"),
  password: Yup.string().required("Mật khẩu là bắt buộc"),
});

function RegisterScreen() {
  const { addToast } = useToastStore();
  const service = new AuthService();
  const { changeUser } = useGeneral();
  const route = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const userServer = new UserService();

  const handleInputEmail = useCallback((text: string) => setEmail(text), []);
  const handleInputPhone = useCallback((text: string) => setPhone(text), []);
  const handleInputPassword = useCallback(
    (text: string) => setPassword(text),
    []
  );
  const handleInputConfirmPass = useCallback(
    (text: string) => setConfirmPass(text),
    []
  );

  const handleRegister = useCallback(async () => {
    setLoading(true);

    try {
      await schema.validate(
        {
          phone,
          email,
          password,
        },
        { abortEarly: false }
      );
      const result: IError | string = await new AuthService().register({
        email,
        password: encrypt(password),
        phone,
        token: await getDeviceID(),
      });

      if (result.hasOwnProperty("message") || !result) {
        addToast(constant.toast.type.error, "Đăng ký thất bại.");
        return;
      }

      const token = result as string;
      await new LocalStorage().setItem(env("KEY_TOKEN"), token);
      if (token) {
        const dataUser = await userServer.info();
        if (!dataUser) {
          await new LocalStorage().removeItem(env("KEY_TOKEN"));
          return;
        }

        changeUser(dataUser as IUser);
        addToast(constant.toast.type.success, "Đăng ký thành công!");
        if ((dataUser as IUser)?.is_completed) {
          route.push("/");
        } else {
          route.push("/user/update?required=true");
        }
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
  }, [password, email, phone, confirmPass]);

  return (
    <BackView>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="pt-8"
          contentContainerStyle={{ paddingBottom: 26 }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            className="px-8 gap-11"
          >
            <View className="px-4 w-full">
              <View className="py-4 bg-white-50 w-full flex items-center justify-center rounded-2xl border-1.5 border-mineShaft-200">
                <Text className="font-BeVietnamBold text-30 text-mineShaft-950">
                  Đăng ký
                </Text>
              </View>
            </View>
            <View className="w-full flex gap-3">
              <View className="flex gap-5 mb-4">
                <Input
                  value={phone}
                  onChange={handleInputPhone}
                  label="Số điện thoại"
                  type="phone"
                />
                <Input
                  value={email}
                  onChange={handleInputEmail}
                  label="Email"
                />
                <Input
                  value={password}
                  onChange={handleInputPassword}
                  label="Mật khẩu"
                  type="password"
                />
                <Input
                  value={confirmPass}
                  onChange={handleInputConfirmPass}
                  label="Xác thực mật khẩu"
                  type="password"
                />
              </View>
              <Button
                loading={loading}
                disabled={loading}
                onPress={handleRegister}
                className="w-full min-h-16 bg-lime-400"
              >
                <Text className="text-mineShaft-900 text-20 font-BeVietnamSemiBold">
                  Đăng ký
                </Text>
              </Button>

              <View className="flex items-center">
                <Text className="text-14 font-BeVietnamRegular text-mineShaft-500">
                  Đã có tài khoản?{" "}
                  <Text
                    className="font-BeVietnamSemiBold text-mineShaft-950"
                    onPress={() => route.push("/login")}
                  >
                    Đăng nhập
                  </Text>
                </Text>
              </View>
              <View className=" mx-4 flex-row items-center justify-center gap-3">
                <View className="h-[1] flex-1 bg-mineShaft-500" />
                <Text className="font-BeVietnamBold text-16 text-mineShaft-950">
                  Hoặc
                </Text>
                <View className="h-[1] flex-1 bg-mineShaft-500" />
              </View>
              <OAuthLogin />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </BackView>
  );
}

export default RegisterScreen;
