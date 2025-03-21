import { IIcon } from "@/ui/Icon";
import React from "react";
import Svg, { Path } from "react-native-svg";

const Warning: React.FC<IIcon> = ({
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
        d="M11.9998 17V13M11.9998 9.00001H12.0098M17.926 21H6.07361C3.7918 21 2.34531 18.5536 3.44496 16.5543L10.2474 4.18625C11.0072 2.8047 12.9924 2.8047 13.7522 4.18625L20.5546 16.5543C21.6543 18.5536 20.2078 21 17.926 21Z"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default Warning;
