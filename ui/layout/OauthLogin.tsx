import { Platform, Text, View } from "react-native";
import Button from "../Button";
import Icon from "../Icon";
import { Apple, Google } from "../icon/general";

function OAuthLogin() {
  return (
    <View className="flex gap-5">
      <Button className="bg-white-50 border-1.5 border-lime-500 py-4">
        <Icon icon={Google} />
        <Text className="text-mineShaft-950 text-18 font-BeVietnamMedium">
          Tiếp tục với Google
        </Text>
      </Button>
      {Platform.OS === "ios" && (
        <Button className="bg-white-50 border-1.5 border-lime-500 py-4">
          <Icon icon={Apple} />
          <Text className="text-mineShaft-950 text-18 font-BeVietnamMedium">
            Tiếp tục với Apple
          </Text>
        </Button>
      )}
    </View>
  );
}

export default OAuthLogin;
