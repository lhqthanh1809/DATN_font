import { Pressable, Text, View } from "react-native";
import Icon from "../icon";
import { ChevronLeft } from "../icon/symbol";
import { useRouter } from "expo-router";

const HeaderBack: React.FC<{
  title: string;
}> = ({ title }) => {
  const route = useRouter();
  return (
    <View className="px-6 bg-white-50 py-4 flex-row items-center gap-3 border-b-1 border-mineShaft-100">
      <Pressable
        onPress={() => {
          route.back();
        }}
        className="flex items-center justify-center absolute left-6 z-10 p-1 rounded-full"
      >
        <Icon icon={ChevronLeft} className="text-mineShaft-950" />
      </Pressable>
      <Text className="font-BeVietnamBold text-16 text-mineShaft-950 w-full text-center">
        {title}
      </Text>
    </View>
  );
};

export default HeaderBack;
