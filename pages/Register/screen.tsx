import Button from "@/ui/button";
import Icon from "@/ui/icon";
import { Apple, Google } from "../../ui/icon/general";
import Input from "@/ui/input";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import BackView from "@/ui/back_view";
import { useCallback, useState } from "react";
import { encrypt } from "@/helper/helper";
import { BaseHttpService } from "@/services/BaseHttpService";
import { apiRouter } from "@/assets/ApiRouter";
import { useRouter } from "expo-router";

function RegisterScreen() {
  const httpService = new BaseHttpService();
  const route = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

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
    const fields = {
      email,
      phone,
      password: encrypt(password),
    };
    console.log(fields);
    const data = await httpService.https({
      method: "POST",
      url: apiRouter.registerUser,
      body: fields,
    });
  }, [password, email, phone, confirmPass]);

  return (
    <BackView>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView className="pt-8">
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
                  type="number"
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
                onPress={handleRegister}
                className="w-full bg-mineShaft-950"
              >
                <Text className="text-white-50 text-20 font-BeVietnamSemiBold">
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

              <View className="flex gap-5">
                <Button className="bg-white-50 border-1 border-mineShaft-200 ">
                  <Icon icon={Google} />
                  <Text className="text-mineShaft-950 text-18 font-BeVietnamMedium">
                    Tiếp tục với Google
                  </Text>
                </Button>
                {Platform.OS === "ios" && (
                  <Button className="bg-white-50 border-1 border-mineShaft-200 ">
                    <Icon icon={Apple} />
                    <Text className="text-mineShaft-950 text-18 font-BeVietnamMedium">
                      Tiếp tục với Apple
                    </Text>
                  </Button>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </BackView>
  );
}

export default RegisterScreen;
