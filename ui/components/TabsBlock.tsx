import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  Animated,
  LayoutChangeEvent,
  LayoutRectangle,
  View,
} from "react-native";
import Button from "../Button";
import { cn } from "@/helper/helper";

const TabsBlock: React.FC<{
  tabs: any[];
  renderKey: string;
  onChange: (tab: any) => void;
  className?: string;
}> = ({ tabs, className, onChange, renderKey }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [tabIndexAction, setTabIndexAction] = useState(0);
  const [tabLayout, setTabLayout] = useState<LayoutRectangle | null>(null);

  useEffect(() => {
    if (!tabLayout) return;
    onChange(tabs[tabIndexAction])
    const newTranslate = (tabLayout.width / tabs.length) * tabIndexAction;

    Animated.timing(translateX, {
      toValue: newTranslate,
      useNativeDriver: true,
      duration: 200,
    }).start();
  }, [tabIndexAction, tabLayout]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (!tabLayout) {
        setTabLayout(event.nativeEvent.layout);
      }
    },
    [tabLayout]
  );

  return (
    <View className={cn("bg-white-50 flex-row rounded-full p-1", className)}>
      {/* Tab Indicator */}
      <View
        className="h-full w-full rounded-full absolute top-0 translate-y-1 mx-1"
        onLayout={handleLayout}
      >
        {tabLayout && (
          <Animated.View
            className="bg-lime-300 h-full rounded-full"
            style={{
              width: tabLayout.width / tabs.length,
              transform: [{ translateX }],
            }}
          />
        )}
      </View>

      {/* Tabs */}
      {tabs.map((tab, index) => (
        <Button
          className="py-3 flex-1"
          key={index}
          onPress={() => setTabIndexAction(index)}
        >
          <Tab tab={tab[renderKey]} indexAction={tabIndexAction} index={index} />
        </Button>
      ))}
    </View>
  );
};

const Tab: React.FC<{ tab: string; indexAction: number; index: number }> = ({
  tab,
  indexAction,
  index,
}) => {
  // const animationText = useRef(new Animated.Value(0)).current;

  // useEffect(() => {
  //   Animated.timing(animationText, {
  //     toValue: index === indexAction ? 1 : 0,
  //     useNativeDriver: true,
  //     duration: 100,
  //   }).start();
  // }, [indexAction]);

  // const animatedStyle = useMemo(
  //   () => ({
  //     color: animationText.interpolate({
  //       inputRange: [0, 1],
  //       outputRange: ["#4D7C0F", "#3D3D3D"],
  //     }),
  //   }),
  //   []
  // );

  return (
    <Animated.Text
      className="font-BeVietnamSemiBold text-center text-mineShaft-900"
      // style={}
    >
      {tab}
    </Animated.Text>
  );
};

export default TabsBlock;
