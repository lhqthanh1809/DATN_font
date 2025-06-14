import { useGeneral } from "@/hooks/useGeneral";
import Icon from "@/ui/Icon";
import { Bell } from "@/ui/icon/symbol";
import { Image, InteractionManager, Text, View } from "react-native";
import { Building } from "@/ui/icon/general";
import { Fingerprint } from "@/ui/icon/security";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ItemMenu,
  ManagementScreen,
  MenuHome,
  PersonScreen,
} from "@/pages/User/Home/components";
import useToastStore from "@/store/toast/useToastStore";
import Button from "@/ui/Button";
import { router, useFocusEffect } from "expo-router";
import MonthPicker from "@/ui/MonthPicker";

function Index() {
  const { user } = useGeneral();
  useFocusEffect(
    useCallback(() => {
      if (!user) return router.navigate("/login");

      const task = InteractionManager.runAfterInteractions(() => {
        if (user?.rule === "manager") router.navigate("/lodging");
        else router.navigate("/user");
      });

      return () => task.cancel();
    }, [user?.rule])
  );

  return (
    <View className="flex-1 bg-white-50 items-center justify-center gap-4">
      <Image
        style={{ width: 150, height: 150 }}
        source={require("../assets/images/icon512.png")}
      />

      <Text className="font-BeVietnamBold text-5xl text-mineShaft-950">
        Nestify
      </Text>
    </View>
  );
}

export default Index;
