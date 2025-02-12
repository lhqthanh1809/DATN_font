import React, { useEffect } from "react";
import { cn } from "@/helper/helper";
import useTailwindColor from "@/hooks/useTailwindColor";

interface IIcon {
  className?: string;
  currentColor?: string;
}

const Icon: React.FC<{
  icon: React.ElementType<IIcon>;
  className?: string;
}> = ({ icon: IconComponent, className }) => {
  const { getColor } = useTailwindColor();
  const classNameIcon = cn("text-mineShaft-600", className)
  const textColorMatch = classNameIcon.match(/\btext-(\w+)-(\d+)\b/);

  const textColor = textColorMatch ? textColorMatch[0] : "";
  return <IconComponent className={classNameIcon} currentColor={getColor(textColor)} />;
};

export default Icon;
export type { IIcon };
