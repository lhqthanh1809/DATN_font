import { constant } from "@/assets/constant";
import { encrypt, formatDateForRequest } from "@/helper/helper";
import { useGeneral } from "@/hooks/useGeneral";
import { IError } from "@/interfaces/ErrorInterface";
import { IUser } from "@/interfaces/UserInterface";
import BoxInfo from "@/pages/User/Update/BoxInfo";
import UserService from "@/services/User/UserService";
import useToastStore from "@/store/toast/useToastStore";
import useUserStore from "@/store/user/useUserStore";
import Box from "@/ui/Box";
import Button from "@/ui/Button";
import { Shield } from "@/ui/icon/security";
import Input from "@/ui/Input";
import HeaderBack from "@/ui/components/HeaderBack";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";

function ChangePassword() {
  const [password, setPassword] = useState("");
  const [rePass, setRePass] = useState("");
  const [loading, setLoading] = useState(false);
  const userService = new UserService();

  const handleChangePassword = useCallback(async () => {
    if (password != rePass) {
      useToastStore
        .getState()
        .addToast(
          constant.toast.type.error,
          "Mật khẩu không khớp, vui lòng kiểm tra lại"
        );
      return;
    }

    setLoading(true);

    try {
      const result = await userService.changePassword(encrypt(password));
      if (typeof result !== "string") {
        throw new Error(result.message);
      }

      useToastStore
      .getState()
      .addToast(
        constant.toast.type.success,
        "Thay đổi mật khẩu thành công"
      );
      router.back();
    } catch (err: any) {
      useToastStore
        .getState()
        .addToast(
          constant.toast.type.error,
          err.message || "An error occurred"
        );
    } finally {
      setLoading(false);
    }
  }, [password, rePass]);

  return (
    <View className="flex-1 bg-white-50">
      <HeaderBack title="Thay đổi mật khẩu" />
      <ScrollView className="flex-1 p-3">
        <Box title="Bảo mật" icon={Shield}>
          <Input
            label="Mật khẩu"
            placeHolder="Mật khẩu"
            value={password}
            onChange={(value) => setPassword(value)}
            type="password"
          />

          <Input
            label="Xác thực mật khẩu"
            placeHolder="Xác thực mật khẩu"
            value={rePass}
            onChange={(value) => setRePass(value)}
            type="password"
          />
        </Box>
      </ScrollView>
      <View className="p-3 flex bg-white-50">
        <View className="flex-row">
          <Button
            disabled={loading}
            loading={loading}
            onPress={handleChangePassword}
            className="flex-1 bg-lime-400 py-4"
          >
            <Text className="text-mineShaft-900 text-16 font-BeVietnamSemiBold">
              Đổi mật khẩu
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

export default ChangePassword;
