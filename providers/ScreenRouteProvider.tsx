import {
  ScreenRouterContextValue,
  ScreenRouterProviderProps,
} from "@/interfaces/RouterInterface";
import React, { createContext, ReactNode, useCallback, useState } from "react";
import { Text, View } from "react-native";

export const ScreenRouterContext = createContext<
  ScreenRouterContextValue | undefined
>(undefined);

export const ScreenRouterProvider: React.FC<ScreenRouterProviderProps> = ({
  initialScreen = "Home",
  screens,
  children,
}) => {
  const [currentScreen, setCurrentScreen] = useState(initialScreen);
  const [previousScreen, setPreviousScreen] = useState<string | null>(null);

  const navigate = useCallback(
    (newScreen: string) => {
      setPreviousScreen(currentScreen);
      setCurrentScreen(newScreen);
    },
    [currentScreen]
  );

  const goBack = useCallback(() => {
    if (previousScreen) {
      setCurrentScreen(previousScreen);
      setPreviousScreen(null);
    }
  }, [previousScreen]);

  // Render màn hình
  const renderScreen = useCallback((): ReactNode => {
    const routeKeys = Object.keys(screens);

    const matchingRoute = routeKeys.find((route) => {
      const dynamicMatch = route.match(/:([^/]+)/g);
      if (dynamicMatch) {
        const routeRegex = new RegExp(
          `^${route.replace(/:([^/]+)/g, "([^/]+)")}$`
        );
        return routeRegex.test(currentScreen);
      }
      return route === currentScreen;
    });

    if (matchingRoute) {
      const dynamicMatch = matchingRoute.match(/:([^/]+)/g);
      const screenComponent = screens[matchingRoute];
      if (typeof screenComponent !== "function") {
        return screenComponent;
      } else {
        if (dynamicMatch) {
          const routeRegex = new RegExp(
            `^${matchingRoute.replace(/:([^/]+)/g, "([^/]+)")}$`
          );
          const match = currentScreen.match(routeRegex);
          const params: Record<string, string> = {};
          dynamicMatch.forEach((param, index) => {
            params[param.substring(1)] = match?.[index + 1] || "";
          });
          return screenComponent(params);
        }
      }
    }
    return (
      <View>
        <Text>Screen not found: {currentScreen}</Text>
      </View>
    );
  }, [currentScreen]);

  return (
    <ScreenRouterContext.Provider
      value={{
        currentScreen,
        previousScreen,
        navigate,
        goBack,
        renderScreen,
      }}
    >
      {children}
    </ScreenRouterContext.Provider>
  );
};
