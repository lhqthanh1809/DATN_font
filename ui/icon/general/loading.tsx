import React from "react";
import { IIcon } from "../../Icon";
import Svg, { Path } from "react-native-svg";

const Loading: React.FC<IIcon> = ({ className, currentColor }) => {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <Path
        d="M11 1.25V3.75M11 17V21M4.75 11H1.25M20.25 11H18.75M17.4571 17.4571L16.75 16.75M17.6642 4.41579L16.25 5.83M3.92157 18.0784L6.75 15.25M4.12868 4.20868L6.25 6.33"
        stroke={currentColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Loading;
