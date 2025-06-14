import Button from "@/ui/Button";
import Input from "@/ui/Input";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import BackView from "@/ui/BackView";
import { useCallback, useEffect, useState } from "react";
import { env, encrypt, getDeviceID } from "@/helper/helper";
import { LocalStorage } from "@/services/LocalStorageService";
import { useRouter } from "expo-router";
import { useGeneral } from "@/hooks/useGeneral";
import UserService from "@/services/User/UserService";
import OAuthLogin from "@/ui/components/OauthLogin";
import { IUser } from "@/interfaces/UserInterface";
import { IError } from "@/interfaces/ErrorInterface";
import useToastStore from "@/store/toast/useToastStore";
import { constant } from "@/assets/constant";
import AuthService from "@/services/Auth/AuthService";
import TabsBlock from "@/ui/components/TabsBlock";

const tabs = [
  {
    rule: "user",
    name: "Người dùng",
  },
  {
    rule: "manager",
    name: "Quản lý",
  },
];

function LoginScreen() {
  const { addToast } = useToastStore();
  const route = useRouter();
  const { changeUser } = useGeneral();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [activeLogin, setActiveLogin] = useState<Boolean>(false);
  const [loading, setLoading] = useState(false);
  const userServer = new UserService();
  const [tab, setTab] = useState(tabs[0]);

  const handleInputPhone = useCallback((text: string) => setPhone(text), []);
  const handleInputPassword = useCallback(
    (text: string) => setPassword(text),
    [password]
  );

  const handleLogin = useCallback(async () => {
    const token = await getDeviceID();
    const fields = {
      phone,
      token,
      password: encrypt(password),
      rule: tab.rule,
    };
    setLoading(true);
    setActiveLogin(false);
    try {
      const dataLogin: IError | string = await new AuthService().login(fields);

      if (typeof dataLogin != "string") {
        addToast(constant.toast.type.error, dataLogin.message);
        return;
      }

      const token = dataLogin as string;
      await new LocalStorage().setItem(env("KEY_TOKEN"), token);
      if (token) {
        const dataUser = await userServer.info();
        if (!dataUser) {
          await new LocalStorage().removeItem(env("KEY_TOKEN"));
          return;
        }

        changeUser(dataUser as IUser);
        addToast(constant.toast.type.success, "Đăng nhập thành công!");
        if ((dataUser as IUser)?.is_completed) {
          route.push("/");
        } else {
          route.push("/user/update?required=true");
        }
      }
    } catch (err) {
    } finally {
      setLoading(false);
      setActiveLogin(true);
    }
  }, [password, phone, tab]);

  useEffect(() => {
    setActiveLogin(Boolean(phone && password));
  }, [phone, password]);

  return (
    <BackView>
      <Pressable
        onPress={() => {
          Keyboard.dismiss();
        }}
        className="px-8 gap-9 flex-1 justify-center items-center"
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View className="px-4 w-full ">
          <View className="py-4 bg-white-50 w-full flex items-center justify-center rounded-2xl border-1.5 border-mineShaft-200">
            <Text className="font-BeVietnamBold text-30 text-mineShaft-950">
              Đăng nhập
            </Text>
          </View>
        </View>
        <View className="w-full flex gap-3">
          <TabsBlock
            renderKey="name"
            tabs={tabs}
            onChange={(tab) => {
              setTab(tab);
            }}
            className="bg-gray-100 border-1 border-white-100 mb-4"
          />
          <View className="gap-5">
            <Input
              className=""
              value={phone}
              onChange={handleInputPhone}
              label="Số điện thoại"
              type="phone"
            />
            <Input
              value={password}
              onChange={handleInputPassword}
              label="Mật khẩu"
              type="password"
            />
          </View>
          <View className="flex items-end pr-5 mb-4">
            <Button
              onPress={() => {
                route.push("/auth/request_otp");
              }}
            >
              <Text className="font-BeVietnamRegular text-14 text-mineShaft-950">
                Quên mật khẩu?
              </Text>
            </Button>
          </View>
          <Button
            disabled={!activeLogin}
            onPress={handleLogin}
            loading={!!loading}
            className="w-full min-h-16 bg-lime-400"
          >
            <Text className="text-mineShaft-950 text-18 font-BeVietnamMedium">
              Đăng nhập như {tab.name.toLocaleLowerCase()}
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
      </Pressable>
    </BackView>
  );
}

export default LoginScreen;
