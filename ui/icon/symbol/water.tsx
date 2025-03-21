import React from "react";
import { IIcon } from "../../Icon";
import Svg, { Path } from "react-native-svg";

const Water: React.FC<IIcon> = ({
  className,
  currentColor,
  strokeWidth = 1.5,
}) => {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <Path
        d="M16.0001 13.3846C16.0001 14.6087 15.526 15.7827 14.6821 16.6482C14.203 17.1396 13.6269 17.5087 13 17.7361M19 13.6923C19 7.11538 12 2 12 2C12 2 5 7.11538 5 13.6923C5 15.6304 5.7375 17.4891 7.05025 18.8596C8.36301 20.23 10.1435 21 12 21C13.8566 21 15.637 20.2301 16.9497 18.8596C18.2625 17.4892 19 15.6304 19 13.6923Z"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export { Water };
