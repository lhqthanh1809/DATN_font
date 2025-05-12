import { Text } from "react-native";
import Button from "../Button";
import Icon from "../Icon";
import { Logout } from "../icon/active";
import LoadingAnimation from "../LoadingAnimation";
import { useCallback, useState } from "react";
import { LocalStorage } from "@/services/LocalStorageService";
import { env, getDeviceID } from "@/helper/helper";
import AuthService from "@/services/Auth/AuthService";
import { router } from "expo-router";
import useToastStore from "@/store/toast/useToastStore";
import { constant } from "@/assets/constant";

function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const localStorage = new LocalStorage();

  const logout = useCallback(async () => {
    setLoading(true);
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
      setLoading(false);
    }
  }, []);
  return (
    <Button
      onPress={logout}
      disabled={loading}
      className="border-1 border-redPower-600 bg-white-50 items-center gap-3 py-3"
    >
      {loading ? (
        <LoadingAnimation size={24} strokeWidth={3} color="#D0302F" />
      ) : (
        <Icon icon={Logout} className="text-redPower-600" />
      )}
      <Text className="font-BeVietnamMedium text-redPower-600">Đăng xuất</Text>
    </Button>
  );
}

export default LogoutButton;
