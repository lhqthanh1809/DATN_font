import { ScreenRouterProviderProps } from "@/interfaces/RouterInterface";
import { LoginScreen, MainScreen, RegisterScreen } from "@/pages/pages";
import { ScreenRouterProvider } from "@/providers/ScreenRouteProvider";
import React from "react";

export default function Index() {
  const screens: ScreenRouterProviderProps['screens'] = {
    Login: <LoginScreen />,
    Register: <RegisterScreen/>
  };
  return (
    <ScreenRouterProvider initialScreen="Login" screens={screens}>
      <MainScreen/>
    </ScreenRouterProvider>
  );
}
