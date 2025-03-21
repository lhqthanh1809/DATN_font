import Svg, { Path } from "react-native-svg";
import { IIcon } from "../../Icon";

import React from "react";
import { cn } from "@/helper/helper";

const Menu: React.FC<IIcon> = ({ className, currentColor }) => {
  return (
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <Path
        d="M3 12H21M3 6H21M9 18H21"
        stroke={currentColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Menu