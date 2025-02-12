import Svg, { Path } from "react-native-svg";
import { IIcon } from "../../icon";

import React from "react";
import { cn } from "@/helper/helper";

const ChevronDown: React.FC<IIcon> = ({ className, currentColor }) => {
  return (
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <Path
        d="M15 8.33334L10.5893 12.7441C10.2638 13.0695 9.73618 13.0695 9.41074 12.7441L5 8.33334"
        stroke={currentColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

const ChevronDownSmall: React.FC<IIcon> = ({ className, currentColor }) => {
  return (
    <Svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={className}
    >
      <Path
        d="M9 5L6.35355 7.64645C6.15829 7.84171 5.84171 7.84171 5.64645 7.64645L3 5"
        stroke={currentColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

const ChevronRight: React.FC<IIcon> = ({ className, currentColor }) => {
  return (
    <ChevronDown
      className={cn(className, "-rotate-90")}
      currentColor={currentColor}
    />
  );
};

const ChevronLeft: React.FC<IIcon> = ({ className, currentColor }) => {
  return (
    <Svg width={24} height={24} fill="none" className={className}>
      <Path
        stroke={currentColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13.0316 8L10.2318 11.3598C9.92274 11.7307 9.92274 12.2693 10.2318 12.6402L13.0316 16"
      />
    </Svg>
  );
};


const ChevronUp: React.FC<IIcon> = ({ className, currentColor }) => {
  return (
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <Path
        d="M5 12.9882L9.4107 8.57739C9.7362 8.25199 10.2638 8.25199 10.5893 8.57739L15 12.9882"
        stroke={currentColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};


export { ChevronDown, ChevronRight, ChevronDownSmall, ChevronLeft, ChevronUp };
