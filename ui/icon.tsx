import React, { useEffect } from "react";
import { cn } from "@/helper/helper";
import useTailwindColor from "@/hooks/useTailwindColor";

interface IIcon {
  className?: string;
  currentColor?: string;
  strokeWidth?: number;
  viewBox?: string;
  width?: number | string;
  height?: number | string;
}

const Icon: React.FC<{
  icon: React.ElementType<IIcon>;
  className?: string;
  strokeWidth?: number;
  viewBox?: string;
  width?: number | string;
  height?: number | string;
}> = ({
  icon: IconComponent,
  className,
  strokeWidth,
  viewBox,
  width,
  height,
}) => {
  const { getColor } = useTailwindColor();
  const classNameIcon = cn("text-mineShaft-600", className);
  const textColorMatch = classNameIcon.match(/\btext-(\w+)-(\d+)\b/);

  const textColor = textColorMatch ? textColorMatch[0] : "";
  return (
    <IconComponent
      className={classNameIcon}
      currentColor={getColor(textColor)}
      strokeWidth={strokeWidth}
      viewBox={viewBox}
      width={width}
      height={height}
    />
  );
};

export default Icon;
export type { IIcon };
