import { Platform, Text, View } from "react-native";
import Button from "../Button";
import Icon from "../Icon";
import { Apple, Google } from "../icon/general";
import * as WebBrowser from "expo-web-browser";
import * as GoogleAuth from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

function OAuthLogin() {
  const [request, response, promptAsync] = GoogleAuth.useAuthRequest({
    androidClientId:
      "267231850666-fjeimq8bmugl4j03p6u7pr82rrj3kepf.apps.googleusercontent.com",
    iosClientId:
      "267231850666-uq13oqnnfo08m2msjle975tagvclbvqq.apps.googleusercontent.com",

    webClientId:
      "267231850666-tl04drsb4aaqjel2bg8sid8g6d4d0f26.apps.googleusercontent.com",
      redirectUri: 'https://auth.expo.io/@thanh18092003/DoAnTotNghiep',
    scopes: ["profile", "email"],
  });

  return (
    <View className="flex gap-5">
      <Button
        onPress={() => promptAsync()}
        className="bg-white-50 border-1.5 border-lime-500 py-4"
      >
        <Icon icon={Google} />
        <Text className="text-mineShaft-950 text-18 font-BeVietnamMedium">
          Tiếp tục với Google
        </Text>
      </Button>
      {/* {Platform.OS === "ios" && (
        <Button className="bg-white-50 border-1.5 border-lime-500 py-4">
          <Icon icon={Apple} />
          <Text className="text-mineShaft-950 text-18 font-BeVietnamMedium">
            Tiếp tục với Apple
          </Text>
        </Button>
      )} */}
    </View>
  );
}

export default OAuthLogin;
