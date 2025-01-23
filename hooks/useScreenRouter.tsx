import { ScreenRouterContextValue } from "@/interfaces/RouterInterface";
import { ScreenRouterContext } from "@/providers/ScreenRouteProvider";
import { useContext } from "react";

export const useScreenRouter = (): ScreenRouterContextValue => {
  const context = useContext(ScreenRouterContext);
  if (!context) {
    throw new Error(
      "useScreenRouter must be used within a ScreenRouterProvider"
    );
  }
  return context;
};
