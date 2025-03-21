import React from "react";
import { IIcon } from "../../Icon";
import Svg, { Path } from "react-native-svg";

const Cube: React.FC<IIcon> = ({
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
        d="M3.16992 7.44043L11.9999 12.5504L20.7699 7.47043"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 21.61V12.54"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.39014 13.2496V14.8296C2.39014 16.2096 3.38014 17.8896 4.59014 18.5596L9.93014 21.5296C11.0701 22.1596 12.9401 22.1596 14.0801 21.5296L19.4201 18.5596C20.6301 17.8896 21.6201 16.2096 21.6201 14.8296V9.16957C21.6201 7.78957 20.6301 6.10957 19.4201 5.43957L14.0801 2.46957C12.9401 1.83957 11.0701 1.83957 9.93014 2.46957L4.59014 5.43957C3.38014 6.10957 2.39014 7.78957 2.39014 9.16957"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export { Cube };
