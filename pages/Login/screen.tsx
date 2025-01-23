import Button from "@/ui/button";
import Icon from "@/ui/icon";
import { Apple, Google } from "../../ui/icon/general";
import Input from "@/ui/input";
import { Platform, Text, View } from "react-native";
import { useScreenRouter } from "@/hooks/useScreenRouter";

function LoginScreen() {
  const { navigate } = useScreenRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      className="px-8 gap-11"
    >
      <View className="px-4 w-full">
        <View className="py-4 bg-white-50 w-full flex items-center justify-center rounded-2xl border-1.5 border-woodSmoke-200">
          <Text className="font-BeVietnamBold text-30 text-mineShaft-950">
            Đăng nhập
          </Text>
        </View>
      </View>
      <View className="w-full flex gap-3">
        <View className="flex gap-5">
          <Input label="Số điện thoại" />
          <Input label="Mật khẩu" type="password"/>
        </View>
        <View className="flex items-end pr-5 mb-4">
          <Text className="font-BeVietnamRegular text-14 text-mineShaft-950">
            Quên mật khẩu?
          </Text>
        </View>
        <Button
          title="Đăng nhập"
          className="w-full bg-woodSmoke-950"
          titleClassName="text-white-50 text-20 font-BeVietnamSemiBold"
        />

        <View className="flex items-center">
          <Text className="text-14 font-BeVietnamRegular text-doveGray-500">
            Không có tài khoản?{" "}
            <Text className="font-BeVietnamSemiBold text-mineShaft-950" onPress={() => navigate('Register')}>
              Đăng ký
            </Text>
          </Text>
        </View>
        <View className=" mx-4 flex-row items-center justify-center gap-3">
          <View className="h-[1] flex-1 bg-doveGray-500" />
          <Text className="font-BeVietnamBold text-16 text-mineShaft-950">
            Hoặc
          </Text>
          <View className="h-[1] flex-1 bg-doveGray-500" />
        </View>

        <View className="flex gap-5">
          <Button
            icon={<Icon icon={Google} />}
            title="Tiếp tục với Google"
            className="bg-white-50 border-1.5 border-woodSmoke-200 "
            titleClassName="text-mineShaft-950 text-18 font-BeVietnamMedium"
          />
          {Platform.OS === "ios" && (
            <Button
              icon={<Icon icon={Apple} />}
              title="Tiếp tục với Apple"
              className="bg-white-50 border-1.5 border-woodSmoke-200 "
              titleClassName="text-mineShaft-950 text-18 font-BeVietnamMedium"
            />
          )}
        </View>
      </View>
    </View>
  );
}

export default LoginScreen;
