import { Skeleton } from "moti/skeleton";
import { Pressable, Text, View } from "react-native";

function LoadPermission() {
  return (
    <Pressable className="p-2 gap-2">
      <Skeleton height={30} width={"46%"} colorMode="light" />
      <View className="flex-row gap-2 flex-wrap">
        {Array(6)
          .fill("")
          .map((_, index) => {
            return (
              <View
                className="bg-white-100 flex-1 flex-col items-start px-4 py-6 gap-4 basis-1/4 rounded-lg"
                key={index}
              >
                <Skeleton
                  width={40}
                  height={40}
                  colorMode="light"
                />
                <View className="gap-1 w-full">
                  <Skeleton height={25} width={"100%"} colorMode="light" />
                </View>
              </View>
            );
          })}
      </View>
    </Pressable>
  );
}

export default LoadPermission;
