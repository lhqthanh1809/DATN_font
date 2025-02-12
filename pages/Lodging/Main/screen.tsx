import { cn } from "@/helper/helper";
import Box from "@/ui/box";
import BoxItem from "@/ui/box_item";
import Button from "@/ui/button";
import Icon from "@/ui/icon";
import { Home, Menu as MenuIcon } from "@/ui/icon/symbol";
import Menu from "@/ui/layout/menu";
import Tabs from "@/ui/layout/tabs";
import {  useMemo } from "react";

import {
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
const HomeLodging = () => {
  const tabs = useMemo(() => {
    return ["Quản lý", "Tổng quan"];
  }, []);

  return (
    <View className="flex-1">
      <StatusBar barStyle={"light-content"} backgroundColor="#2A2A2A" />
      <View className="relative z-10 rounded-b-xl border-b-4 border-white-50">
        <View className="bg-mineShaft-950 px-4 pb-16 pt-7 rounded-b-xl flex-row items-center justify-between">
          <Text className="text-white-50 font-BeVietnamBold text-2xl">
            Happy Home
          </Text>
          <Button className="p-0">
            <Icon icon={MenuIcon} className="text-white-50" />
          </Button>
        </View>
        <Tabs
          tabs={tabs}
          className="absolute top-full shadow-sm shadow-white-400/20 -translate-y-9 mx-4"
        />
      </View>
      <ScrollView className="pt-5 px-2 flex-1" contentContainerStyle={{paddingBottom: 68}}>
        <View className="flex-1 gap-3">
          <Box className="flex-row gap-2 flex-wrap">
            <BoxItem
              className="basis-1/3"
              title="Cọc giữ chỗ"
              description="Khách đặt cọc giữ chỗ trước khi vào ở."
              icon={Home}
            />
            <BoxItem
              className="basis-1/3"
              title="Lập hợp đồng mới"
              description="Khách đặt cọc giữ chỗ trước."
              icon={Home}
            />
            <BoxItem
              className="basis-1/3"
              title="Lập hợp đồng mới"
              description="Khách đặt cọc giữ chỗ trước."
              icon={Home}
            />
            <BoxItem
              className="basis-1/3"
              title="Lập hợp đồng mới"
              description="Khách đặt cọc giữ chỗ trước."
              icon={Home}
            />
          </Box>
          <Box className="flex-row gap-2">
            <BoxItem
              title="Cọc giữ chỗ"
              description="Khách đặt cọc giữ chỗ trước khi vào ở."
              icon={Home}
            />
            <BoxItem
              title="Lập hợp đồng mới"
              description="Khách đặt cọc giữ chỗ trước."
              icon={Home}
            />
            {/* <BoxItem
            title="Cọc giữ chỗ"
            description="Khách đặt cọc giữ chỗ trước."
            icon={Home}
          /> */}
          </Box>
          <Box className="flex-row gap-2">
            <BoxItem
              title="Cọc giữ chỗ"
              description="Khách đặt cọc giữ chỗ trước khi vào ở."
              icon={Home}
            />
            <BoxItem
              title="Lập hợp đồng mới"
              description="Khách đặt cọc giữ chỗ trước."
              icon={Home}
            />
            {/* <BoxItem
            title="Cọc giữ chỗ"
            description="Khách đặt cọc giữ chỗ trước."
            icon={Home}
          /> */}
          </Box>
        </View>
      </ScrollView>
      <Menu />
    </View>
  );
};

export default HomeLodging;
