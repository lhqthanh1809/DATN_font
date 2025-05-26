import {
  Href,
  router,
  SplashScreen,
  Stack,
  useRouter,
} from "expo-router";
import "../global.css";
import {
  AppState,
  AppStateStatus,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { env, getDeviceID } from "@/helper/helper";
import { LocalStorage } from "@/services/LocalStorageService";
import { GeneralProvider } from "@/providers/GeneralProvider";
import { useGeneral } from "@/hooks/useGeneral";
import UserService from "@/services/User/UserService";
import * as Notifications from "expo-notifications";
import { registerIndieID } from "native-notify";
import { UIProvider } from "@/providers/UIProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser } from "@/interfaces/UserInterface";
import { Image } from "react-native";
import NotificationService from "@/services/Notification/NotificationService";

export default function RootLayout() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const localStorage = new LocalStorage();
  const route = useRouter();
  const [page, setPage] = useState<Href | null>(null);

  // Load fonts
  const [fontsLoaded] = useFonts({
    BeVietnamProBold: require("../assets/fonts/BeVietnamPro-Bold.ttf"),
    BeVietnamProExtraBold: require("../assets/fonts/BeVietnamPro-ExtraBold.ttf"),
    BeVietnamProMedium: require("../assets/fonts/BeVietnamPro-Medium.ttf"),
    BeVietnamProRegular: require("../assets/fonts/BeVietnamPro-Regular.ttf"),
    BeVietnamProSemiBold: require("../assets/fonts/BeVietnamPro-SemiBold.ttf"),
  });

  const registerNotify = useCallback(async () => {
    try {
      const hasRequested = await AsyncStorage.getItem(
        "hasRequestedPermissionNotification"
      );

      if (!hasRequested) {
        const { status } = await Notifications.getPermissionsAsync();

        if (status !== "granted") {
          const { status: newStatus } =
            await Notifications.requestPermissionsAsync();
          const isGranted = newStatus === "granted";

          await AsyncStorage.setItem(
            "hasRequestedPermissionNotification",
            isGranted ? "true" : "false"
          );

          if (!isGranted) return;
        } else {
          await AsyncStorage.setItem(
            "hasRequestedPermissionNotification",
            "true"
          );
        }
      }

      const token = await getDeviceID();
      registerIndieID(
        token,
        parseInt(env("APP_NOTI_ID")),
        env("APP_NOTI_TOKEN")
      );
    } catch (error) {}
  }, []);

  const handlePushData = useCallback(
    async (response: Notifications.NotificationResponse) => {
      if (response.notification && response.notification.request.content.data) {
        const data = response.notification.request.content.data;
        new NotificationService().toggleRead(data.id as string);
        router.push(data.end_point as Href);
      }
    },
    []
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await localStorage.getItem(env("KEY_TOKEN"));
        if (!token) {
          setPage("/login");
          return;
        }
        setUser(null);
        const data = await new UserService().info();

        if (!data || data.hasOwnProperty("message")) {
          await localStorage.removeItem(env("KEY_TOKEN"));

          setPage("/login");
          return;
        }

        setUser(data as IUser);

        setPage(
          (data as IUser)?.is_completed ? "/" : "/user/update?required=true"
        );
      } catch (error) {
        setPage("/login");
      } finally {
        setLoading(false);
      }
    };

    SplashScreen.preventAutoHideAsync();
    fetchUserData();
    registerNotify();
  }, []);

  //Push notification
  useEffect(() => {
    const responseListener =
      Notifications.addNotificationResponseReceivedListener(handlePushData);

    return () => {
      responseListener.remove();
    };
  }, []);

  useEffect(() => {
    if (!loading && fontsLoaded && page) {
      route.replace(page);
      SplashScreen.hideAsync();
    }
  }, [loading, fontsLoaded, page]);

  // Hiển thị màn hình chờ khi chưa load xong
  if (!fontsLoaded || loading || !page) {
    return (
      <View className="flex-1 bg-white-50 items-center justify-center gap-4">
        <Image
          style={{ width: 180, height: 250 }}
          source={require("../assets/images/icon_text.png")}
        />
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-white-50"
      style={
        Platform.OS === "android" && {
          paddingTop: StatusBar.currentHeight,
        }
      }
    >
      <GeneralProvider user={user}>
        <UIProvider>
          <GestureHandlerRootView>
            <Container />
          </GestureHandlerRootView>
        </UIProvider>
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
      <View className="flex-1 bg-white-50 relative" ref={containerRef}>
        <StatusBar barStyle={"dark-content"} backgroundColor={"#FFF"} />
        <Stack
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
            freezeOnBlur: false,
          }}
        />
        {/* <View className="w-screen h-screen absolute bg-black"></View> */}
      </View>
    </TouchableWithoutFeedback>
  );
};
