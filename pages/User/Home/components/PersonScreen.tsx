import { cn } from "@/helper/helper";
import Button from "@/ui/button";
import { MotiView, View } from "moti";
import { useEffect, useState } from "react";
import { Text, ScrollView } from "react-native";

const _gap = 16;

const PersonScreen = () => {
  const [widthFuncs, setWidthFuncs] = useState<Array<number>>([]);
  const [funcIndex, setFuncIndex] = useState(0);

  const functions = [
    "Trò chuyện",
    "Phản hồi",
    "Hợp đồng",
    "Nơi thuê",
    "Lịch sử thuê",
  ];

  return (
    <View className="flex-1">
      <View className="px-5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View
            className="flex-row relative"
            style={{
              gap: _gap,
            }}
          >
            {functions.map((func, index) => {
              return (
                <Button
                  className="py-4"
                  key={index}
                  onPress={() => {
                    setFuncIndex(index);
                  }}
                  onLayout={(event) => {
                    const { width } = event.nativeEvent.layout;
                    setWidthFuncs((prev) => {
                      const newWidths = prev;
                      if (newWidths.length < index + 1) newWidths.push(width);
                      else newWidths[index] = width;
                      return newWidths;
                    });
                  }}
                >
                  <Text
                    className={cn(
                      "font-BeVietnamMedium",
                      index === funcIndex ? "text-lime-600" : "text-white-400"
                    )}
                  >
                    {func}
                  </Text>
                </Button>
              );
            })}

            {/* Animated underline */}
            <MotiView
              className="bg-lime-500 h-[2] rounded-full w-9 absolute bottom-2"
              animate={{
                left:
                  widthFuncs
                    .slice(0, funcIndex)
                    .reduce((sum, width) => sum + width, 0) + // Sum the widths
                  _gap * funcIndex,
              }}
              transition={{
                type: "timing",
                duration: 200,
              }}
            />
          </View>
        </ScrollView>
      </View>
      {/* Uncomment this section if you want to add more content below the ScrollView */}
      {/* <View
        className="flex-1 px-3 pb-3"
        style={{
          paddingBottom: 12,
        }}
      >
        <View className="bg-white-50 flex-1 rounded-xl"></View>
      </View> */}
    </View>
  );
};

export default PersonScreen;
