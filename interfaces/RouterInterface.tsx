import { ReactNode } from "react";

export interface ScreenRouterContextValue {
  currentScreen: string;
  previousScreen: string | null;
  navigate: (newScreen: string) => void;
  goBack: () => void;
  renderScreen: () => ReactNode
}

export interface ScreenRouterProviderProps {
  initialScreen?: string;
  screens: Record<
    string,
    ReactNode | ((params?: Record<string, string>) => ReactNode)
  >;
  children: ReactNode;
}
