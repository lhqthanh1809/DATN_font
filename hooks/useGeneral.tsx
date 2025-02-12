import { GeneralContextValue } from "@/interfaces/GeneralInterface";
import { GeneralContext } from "@/providers/GeneralProvider";
import { useContext } from "react";

export const useGeneral = (): GeneralContextValue => {
  const context = useContext(GeneralContext);
  if (!context) {
    throw new Error(
      "useGeneral must be used within a GeneralProvider"
    );
  }
  return context;
};
