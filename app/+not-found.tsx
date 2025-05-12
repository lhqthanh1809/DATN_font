import Button from "@/ui/Button";
import { router } from "expo-router";
import { Image, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white-50 flex-col gap-8">
      <View className="w-full items-center h-72 justify-center">
        <Image
          source={require("@/assets/images/404.png")}
          className="w-full"
          style={{
            resizeMode: "contain",
          }}
        />
      </View>

      <View className="items-center gap-4">
        <Text className="text-5xl font-BeVietnamBold text-lime-500">404</Text>

        <View className="items-center gap-3 px-6">
          <Text className="font-BeVietnamSemiBold text-2xl text-mineShaft-950">
            Không tìm thấy trang
          </Text>
          <Text className="font-BeVietnamRegular text-mineShaft-700 text-center">
          Rất tiếc! Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển
          </Text>
        </View>
      </View>

      <Button onPress={() => router.back()} className="bg-lime-400 py-4 w-2/3">
        <Text className="text-16 font-BeVietnamSemiBold text-mineShaft-950">
          Quay lại
        </Text>
      </Button>
    </View>
  );
}
