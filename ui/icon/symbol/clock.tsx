import React from "react";
import { IIcon } from "../../Icon";
import Svg, { Path } from "react-native-svg";

const ClockRefresh: React.FC<IIcon> = ({
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
        d="M21.9376 13.0502C21.611 16.1202 19.8726 18.997 16.996 20.6588C12.2168 23.4198 6.10564 21.7813 3.34635 16.9992L3.05246 16.4898M2.06231 10.9498C2.38888 7.87982 4.12729 5.00299 7.00387 3.34119C11.7831 0.580233 17.8943 2.21871 20.6536 7.00082L20.9474 7.51016M2 19.1352L2.86057 15.9216L6.07226 16.7827M17.9277 7.21728L21.1394 8.07837L22 4.86474M12 6.70675V12L14.9389 13.7644"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export  {ClockRefresh};
