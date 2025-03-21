import { ScrollView, Text, View } from "react-native";
import Button from "../Button";
import { useState, useMemo } from "react";
import { cn } from "@/helper/helper";
import { MotiView } from "moti";

type TabsLineProps<T extends { name: string }> = {
  gap?: number;
  active: T;
  tabs: T[];
  onChange: (tab: T) => void;
};

const TabsLine = <T extends { name: string }>({
  gap = 10,
  active,
  tabs,
  onChange,
}: TabsLineProps<T>) => {
  const [widthTabs, setWidthTabs] = useState<Array<number>>([]);

  // Tính vị trí underline chỉ khi có thay đổi
  const underlineLeft = useMemo(() => {
    const tabIndex = tabs.findIndex((tab) => tab === active);
    if (tabIndex === -1) return 0;
    return widthTabs.slice(0, tabIndex).reduce((sum, width) => sum + width, 0) + gap * tabIndex;
  }, [widthTabs, tabs, active, gap]);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row relative" style={{ gap }}>
        {tabs.map((tab, index) => (
          <Button
            className="py-4"
            key={tab.name}
            onPress={() => onChange(tab)}
            onLayout={(event) => {
              const { width } = event.nativeEvent.layout;
              setWidthTabs((prev) => {
                if (prev[index] === width) return prev;
                const newWidths = [...prev];
                newWidths[index] = width;
                return newWidths;
              });
            }}
          >
            <Text
              className={cn(
                "font-BeVietnamMedium",
                tab === active ? "text-lime-600" : "text-white-400"
              )}
            >
              {tab.name}
            </Text>
          </Button>
        ))}

        {/* Animated underline */}
        <MotiView
          className="bg-lime-500 h-[2] rounded-full w-9 absolute bottom-2"
          from={{ left: 0 }}
          animate={{ left: underlineLeft }}
          transition={{
            type: "spring",
            damping: 10,
            stiffness: 100,
          }}
        />
      </View>
    </ScrollView>
  );
};

export default TabsLine;
