import { Href, SplashScreen, Stack, useRouter } from "expo-router";
import "../global.css";
import {
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useEffect, useRef, useState, useContext } from "react";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { constant } from "@/helper/helper";
import { BaseHttpService } from "@/services/BaseHttpService";
import { ResponseInterface } from "@/interfaces/ResponseInterface";
import { apiRouter } from "@/assets/ApiRouter";
import { LocalStorage } from "@/services/LocalStorageService";
import { GeneralProvider, GeneralContext } from "@/providers/GeneralProvider";
import { useGeneral } from "@/hooks/useGeneral";

export default function RootLayout() {
  const [user, setUser] = useState<Record<any, any> | null>(null);
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

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await localStorage.getItem(constant("KEY_TOKEN"));
        if (!token) {
          setPage("/login");
          setLoading(false);
          return;
        }

        const data: ResponseInterface = await new BaseHttpService().https({
          method: "GET",
          url: apiRouter.infoUser,
          authentication_requested: true,
        });

        if (!data || !data.body?.data) {
          await localStorage.removeItem(constant("KEY_TOKEN"));
          setUser(null);
          setPage("/login");
          return;
        }

        setUser(data.body?.data);
        setPage(data.body?.data.is_completed ? "/" : "/user/update");
      } catch (error) {
        setPage("/login");
      } finally {
        setLoading(false);
      }
    };

    SplashScreen.preventAutoHideAsync();
    fetchUserData();
  }, []);

  // Khi `page` thay đổi, điều hướng đến trang tương ứng
  useEffect(() => {
    if (page) {
      route.replace(page);
    }
  }, [page]);

  // Hide SplashScreen khi đã load xong
  useEffect(() => {
    if (fontsLoaded && !loading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, loading]);

  if (!fontsLoaded || loading) {
    return null;
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
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </TouchableWithoutFeedback>
  );
};
