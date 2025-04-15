import { constant } from "@/assets/constant";
import { encrypt } from "@/helper/helper";
import AuthService from "@/services/Auth/AuthService";
import useToastStore from "@/store/toast/useToastStore";
import { useOTPStore } from "@/store/useOTPStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import { ChevronLeft } from "@/ui/icon/symbol";
import Input from "@/ui/Input";
import HeaderBack from "@/ui/components/HeaderBack";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SvgUri } from "react-native-svg";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [rePass, setRePass] = useState("");
  const [loading, setLoading] = useState(false);
  const { phone, setPhone, requestOtp, token, setToken } = useOTPStore();

  const handleResetPass = useCallback(async () => {
    setLoading(true);
    try {
      if (password != rePass) {
        useToastStore
          .getState()
          .addToast(
            constant.toast.type.error,
            "Mật khẩu không khớp, vui lòng kiểm tra lại"
          );
        return;
      }
      const result = await new AuthService().resetPassword(
        phone,
        token,
        encrypt(password)
      );

      if (typeof result !== "string") {
        throw new Error(result.message);
      }

      setPhone("");
      setToken("");
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
      setLoading(false);
    }
  }, [phone, token, password, rePass]);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
    >
      <View className="flex-1 bg-white-50">
        <View className="px-6 bg-white-50 py-4 flex-row items-center gap-3">
          <Pressable
            onPress={() => {
              router.back();
            }}
            className="flex items-center justify-center absolute left-6 z-10 p-1 rounded-full"
          >
            <Icon icon={ChevronLeft} className="text-mineShaft-950" />
          </Pressable>
          {/* <Text className="font-BeVietnamBold text-2xl text-mineShaft-950 w-full text-center">
            Đặt lại mật khẩu
          </Text> */}
        </View>

        <ScrollView className="flex-1">
          <View className="flex-1 justify-center gap-16 py-3">
            <SvgUri
              width={"100%"}
              uri={
                "https://qqmdkbculairrumaowaj.supabase.co/storage/v1/object/public/lodging_management/asset/my_password.svg"
              }
            />

            <View className="px-6 gap-4">
              <View className="gap-2">
                <Text className="font-BeVietnamBold text-20 text-center text-mineShaft-950">
                  Đặt lại mật khẩu
                </Text>

                <View className="px-9">
                  <Text className="text-center font-BeVietnamRegular text-mineShaft-800">
                    Mẹo nhỏ: Hãy kết hợp giữa chữ số, chữ hoa, chữ thường và ký
                    tự đặc biệt để tạo mật khẩu an toàn hơn.
                  </Text>
                </View>
              </View>

              <View className="pb-2 gap-3">
                <Input
                  value={password}
                  onChange={(value) => setPassword(value)}
                  placeHolder="Nhập mật khẩu mới"
                  label="Mật khẩu"
                  type="password"
                />
                <Input
                  value={rePass}
                  onChange={(value) => setRePass(value)}
                  placeHolder="Nhập lại mật khẩu mới"
                  label="Xác nhận mật khẩu"
                  type="password"
                />
              </View>

              <Button
                disabled={loading}
                loading={loading}
                onPress={handleResetPass}
                className="w-full py-4 bg-lime-400"
              >
                <Text className="text-mineShaft-950 text-16 font-BeVietnamSemiBold">
                  Đặt lại mật khẩu
                </Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

export default ResetPassword;
