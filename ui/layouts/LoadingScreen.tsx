import { BlurView } from "expo-blur";
import { View } from "react-native";
import LoadingAnimation from "../LoadingAnimation";

function LoadingScreen() {
  return (
    <View className="absolute inset-0 z-10 items-center justify-center">
      {/* Tạo nền mờ */}
      <BlurView className="absolute w-full h-full" intensity={30} tint="dark" />

      {/* Animation Loading */}
      <LoadingAnimation className="text-white-50" />
    </View>
  );
}

export default LoadingScreen;
