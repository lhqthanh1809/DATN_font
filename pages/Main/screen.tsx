import { useScreenRouter } from "@/hooks/useScreenRouter";
import { LoginScreen } from "../pages";
import React from "react";
import { View } from "react-native";

function MainScreen() {
  const { renderScreen } = useScreenRouter();
  return <View className="flex-1 bg-white-50">{renderScreen()}</View>;
}

export default MainScreen;
