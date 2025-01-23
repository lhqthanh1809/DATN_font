import { SplashScreen, Stack } from "expo-router";
import "../global.css";
import { SafeAreaView, StatusBar } from "react-native";
import { FontSource, useFonts } from "expo-font";
import { useEffect } from "react";
import { LoginScreen } from "@/pages/pages";

export default function RootLayout() {

  const [loaded] = useFonts({
    BeVietnamProBlack: require("../assets/fonts/BeVietnamPro-Black.ttf"),
    BeVietnamProBold: require("../assets/fonts/BeVietnamPro-Bold.ttf"),
    BeVietnamProExtraBold: require("../assets/fonts/BeVietnamPro-ExtraBold.ttf"),
    BeVietnamProExtraLight: require("../assets/fonts/BeVietnamPro-ExtraLight.ttf"),
    BeVietnamProLight: require("../assets/fonts/BeVietnamPro-Light.ttf"),
    BeVietnamProMedium: require("../assets/fonts/BeVietnamPro-Medium.ttf"),
    BeVietnamProRegular: require("../assets/fonts/BeVietnamPro-Regular.ttf"),
    BeVietnamProThin: require("../assets/fonts/BeVietnamPro-Thin.ttf"),
    BeVietnamProSemiBold: require("../assets/fonts/BeVietnamPro-SemiBold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-white-50">
      <StatusBar translucent backgroundColor="transparent" />
      <Stack screenOptions={{
        headerShown : false
      }}>
        <Stack.Screen name="index"/>
      </Stack>
    </SafeAreaView>
  );
}
