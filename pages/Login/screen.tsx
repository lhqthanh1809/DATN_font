import Button from "@/ui/button";
import Icon from "@/ui/icon";
import { Apple, Google } from "../../ui/icon/general";
import Input from "@/ui/input";
import { Platform, Text, View } from "react-native";
import BackView from "@/ui/back_view";
import { useCallback, useEffect, useState } from "react";
import { env, encrypt } from "@/helper/helper";
import { BaseHttpService } from "@/services/BaseHttpService";
import { apiRouter } from "@/assets/ApiRouter";
import { IResponse } from "@/interfaces/ResponseInterface";
import { LocalStorage } from "@/services/LocalStorageService";
import { HttpStatusCode } from "axios";
import { useRouter } from "expo-router";
import { useGeneral } from "@/hooks/useGeneral";
import UserService from "@/services/User/UserService";
import OAuthLogin from "@/ui/layout/oauth_login";

function LoginScreen() {
  const httpService = new BaseHttpService();
  const route = useRouter();
  const { changeUser } = useGeneral();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [activeLogin, setActiveLogin] = useState<Boolean>(false);
  const [loading, setLoading] = useState(false);

  const handleInputPhone = useCallback((text: string) => setPhone(text), []);
  const handleInputPassword = useCallback(
    (text: string) => setPassword(text),
    []
  );

  const handleLogin = useCallback(async () => {
    const fields = {
      phone,
      password: encrypt(password),
    };
    setLoading(true);
    setActiveLogin(false);
    try {
      const dataLogin: IResponse = await httpService.https({
        method: "POST",
        url: apiRouter.loginUser,
        body: fields,
      });

      if (dataLogin && dataLogin.status === HttpStatusCode.Ok) {
        const token = dataLogin.body?.token || "";
        await new LocalStorage().setItem(env("KEY_TOKEN"), token);
        if (token) {
          const dataUser = await new UserService().info();
          if (!dataUser) {
            await new LocalStorage().removeItem(env("KEY_TOKEN"));
            return;
          }

          changeUser(dataUser);
          if (dataUser?.is_completed) {
            route.push("/");
          } else {
            route.push("/user/update");
          }
        }
      }
    } catch (err) {
    } finally {
      setLoading(false);
      setActiveLogin(true);
    }
  }, [password, phone]);

  useEffect(() => {
    setActiveLogin(Boolean(phone && password));
  }, [phone, password]);

  return (
    <BackView>
      <View className="px-8 gap-11 flex-1 justify-center items-center">
        <View className="px-4 w-full">
          <View className="py-4 bg-white-50 w-full flex items-center justify-center rounded-2xl border-1.5 border-mineShaft-200">
            <Text className="font-BeVietnamBold text-30 text-mineShaft-950">
              Đăng nhập
            </Text>
          </View>
        </View>
        <View className="w-full flex gap-3">
          <View className="flex gap-5">
            <Input
              value={phone}
              onChange={handleInputPhone}
              label="Số điện thoại"
              type="number"
            />
            <Input
              value={password}
              onChange={handleInputPassword}
              label="Mật khẩu"
              type="password"
            />
          </View>
          <View className="flex items-end pr-5 mb-4">
            <Text className="font-BeVietnamRegular text-14 text-mineShaft-950">
              Quên mật khẩu?
            </Text>
          </View>
          <Button
            disabled={!activeLogin}
            onPress={handleLogin}
            loading={loading}
            className="w-full min-h-16 bg-lime-400"
          >
            <Text className="text-mineShaft-900 text-20 font-BeVietnamSemiBold">
              Đăng nhập
            </Text>
          </Button>

          <View className="flex items-center">
            <Text className="text-14 font-BeVietnamRegular text-mineShaft-500">
              Không có tài khoản?{" "}
              <Text
                className="font-BeVietnamSemiBold text-mineShaft-950"
                onPress={() => route.push("/register")}
              >
                Đăng ký
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
    </BackView>
  );
}

export default LoginScreen;
