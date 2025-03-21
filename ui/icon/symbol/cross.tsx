import React from "react";
import { IIcon } from "../../Icon";
import Svg, { Path } from "react-native-svg";

const Cross: React.FC<IIcon> = ({
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
        d="M5 5L19 19M19 5L5 19"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
};

const CrossMedium: React.FC<IIcon> = ({
  className,
  currentColor,
  strokeWidth = 1.5,
}) => {
  return (
    <Svg

      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <Path
        d="M3.3335 3.33331L12.6668 12.6666M12.6668 3.33331L3.3335 12.6666"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
};

const CrossSmall: React.FC<IIcon> = ({
  className,
  currentColor,
  strokeWidth = 1.5,
}) => {
  return (
    <Svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      className={className}
    >
      <Path
        d="M1.66666 1.66675L6.33332 6.33341M6.33332 1.66675L1.66666 6.33341"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export { CrossSmall, CrossMedium };
export default Cross;
