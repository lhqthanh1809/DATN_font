import React from "react";
import { IIcon } from "../../Icon";
import Svg, { G, Path } from "react-native-svg";

const Logout: React.FC<IIcon> = ({ className, currentColor, strokeWidth = 1.5 }) => {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
    <G>
      <Path
        d="M17.4395 14.62L19.9995 12.06L17.4395 9.5"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.75977 12.0596H19.9298"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Path
      d="M11.7598 20C7.33977 20 3.75977 17 3.75977 12C3.75977 7 7.33977 4 11.7598 4"
      stroke={currentColor}
      strokeWidth={strokeWidth}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    </Svg>
  );
};

export default Logout;
