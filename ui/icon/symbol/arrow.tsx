import React from "react";
import { IIcon } from "../../Icon";
import Svg, { Path } from "react-native-svg";

const ArrowUpCircle: React.FC<IIcon> = ({
  className,
  currentColor,
  strokeWidth = 1.5,
}) => {
  return (
    <Svg
      width={24}
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 15.5V9.5"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 11.5L12 8.5L15 11.5"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

const ArrowDownCircle: React.FC<IIcon> = ({
  className,
  currentColor,
  strokeWidth = 1.5,
}) => {
  return (
    <Svg
      width={24}
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 8.5V14.5"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 12.5L12 15.5L15 12.5"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

const ArrowExportCircle: React.FC<IIcon> = ({
  className,
  currentColor,
  strokeWidth = 1.5,
}) => {
  return (
    <Svg
      width={24}
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <Path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13 11L21.2 2.8"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21.9999 6.83V2H17.1699"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

const ArrowImportCircle: React.FC<IIcon> = ({
  className,
  currentColor,
  strokeWidth = 1.5,
}) => {
  return (
    <Svg
      width={24}
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
    <Path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12"
      stroke={currentColor}
      strokeWidth={strokeWidth}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M22 2L13.8 10.2"
      stroke={currentColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13 6.17V11H17.83"
      stroke={currentColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    </Svg>
  );
};

export { ArrowUpCircle, ArrowDownCircle,ArrowExportCircle,ArrowImportCircle };
