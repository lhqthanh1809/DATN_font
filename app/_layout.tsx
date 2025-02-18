import { Href, SplashScreen, Stack, usePathname, useRouter } from "expo-router";
import "../global.css";
import {
  SafeAreaView,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { env } from "@/helper/helper";
import { LocalStorage } from "@/services/LocalStorageService";
import { GeneralProvider } from "@/providers/GeneralProvider";
import { useGeneral } from "@/hooks/useGeneral";
import UserService from "@/services/User/UserService";
import FCMService from "@/services/FCMService";

import registerNNPushToken from "native-notify";

export default function RootLayout() {
  registerNNPushToken(27513, "QLJhpcwxfBIPqKDS9rC8sd");
  const [user, setUser] = useState<Record<any, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const localStorage = new LocalStorage();
  const route = useRouter();
  const [page, setPage] = useState<Href | null>(null);
  const pathName = usePathname();

  // Load fonts
  const [fontsLoaded] = useFonts({
    BeVietnamProBold: require("../assets/fonts/BeVietnamPro-Bold.ttf"),
    BeVietnamProExtraBold: require("../assets/fonts/BeVietnamPro-ExtraBold.ttf"),
    BeVietnamProMedium: require("../assets/fonts/BeVietnamPro-Medium.ttf"),
    BeVietnamProRegular: require("../assets/fonts/BeVietnamPro-Regular.ttf"),
    BeVietnamProSemiBold: require("../assets/fonts/BeVietnamPro-SemiBold.ttf"),
  });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      // const token = await new FCMService().getToken();
      // console.log(token);
      try {
        const token = await localStorage.getItem(env("KEY_TOKEN"));
        if (!token) {
          setPage("/login");
          setLoading(false);
          return;
        }

        const data = await new UserService().info();

        if (!data) {
          await localStorage.removeItem(env("KEY_TOKEN"));
          setUser(null);
          setPage("/login");
          return;
        }

        setUser(data);

        setPage(data?.is_completed ? "/" : "/user/update");
      } catch (error) {
        setPage("/login");
      } finally {
        setLoading(false);
      }
    };

    SplashScreen.preventAutoHideAsync();
    fetchUserData();

    // console.log(new NotificationService().getToken())
  }, []);

  useEffect(() => {
    if (!loading && fontsLoaded && page) {
      SplashScreen.hideAsync();
      route.replace(page);
    }
  }, [loading, fontsLoaded, page]);

  // Hiển thị màn hình chờ khi chưa load xong
  if (!fontsLoaded || loading) {
    return (
      <View className="flex-1 bg-lime-300 items-center justify-center">
        {/* <Text className="font-BeVietnamMedium text-16 text-mineShaft-900">Get ready...</Text> */}
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white-50">
      <GeneralProvider user={user}>
        <GestureHandlerRootView>
          <Container />
        </GestureHandlerRootView>
      </GeneralProvider>
    </SafeAreaView>
  );
}

const Container = () => {
  const containerRef = useRef(null);
  const { clickRef } = useGeneral();
  return (
    <TouchableWithoutFeedback
      className="flex-1 bg-white-50"
      onPress={() => {
        clickRef(containerRef, () => {});
      }}
    >
      <View className="flex-1 bg-white-50" ref={containerRef}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FDFDFD"
          translucent
        />
        <Stack screenOptions={{ headerShown: false, gestureEnabled: false }} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const CustomSafeView: React.FC<{
  children: ReactNode;
  useSafeArea?: boolean;
}> = ({ children, useSafeArea = true }) => {
  return useSafeArea ? (
    <SafeAreaView className="flex-1 bg-white-50">{children}</SafeAreaView>
  ) : (
    <View className="flex-1 bg-white-50">{children}</View>
  );
};
