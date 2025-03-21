
import { IIcon } from "@/ui/Icon";
import React from "react";
import Svg, { Path } from "react-native-svg";

const Error: React.FC<IIcon> = ({ className, currentColor, strokeWidth = 1.5 }) => {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <Path
        d="M12 16V12M12 8H12.01M4.21 9.23V14.77C4.21 15.84 4.78 16.83 5.71 17.37L10.5 20.13C11.43 20.67 12.57 20.67 13.5 20.13L18.29 17.37C19.22 16.83 19.79 15.84 19.79 14.77V9.23C19.79 8.16 19.22 7.17 18.29 6.63L13.5 3.87C12.57 3.33 11.43 3.33 10.5 3.87L5.71 6.63C4.78 7.17 4.21 8.16 4.21 9.23Z"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default Error;
