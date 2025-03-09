import React from "react";
import { IIcon } from "../../icon";
import Svg, { Path } from "react-native-svg";

const Pin: React.FC<IIcon> = ({
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
        d="M17.7661 10.2815C17.9188 9.72221 18 9.16522 18 8.61432C18 5.51362 15.3137 3 12 3C8.68629 3 6 5.51362 6 8.61432C6 9.66797 6.29693 10.7439 6.82351 11.8154M17.7661 10.2815C17.1602 12.5 15.6775 14.4222 13.661 16.3498C12.7539 17.2168 11.2461 17.2168 10.339 16.3498C8.82331 14.9009 7.58394 13.3627 6.82351 11.8154M17.7661 10.2815L19.4339 10.652C20.3489 10.8553 21 11.6669 21 12.6043V17.6587C21 18.9382 19.8152 19.8887 18.5661 19.6111L17.8016 19.4412C16.9443 19.2507 16.0557 19.2507 15.1984 19.4412L8.80158 20.8627C7.94432 21.0532 7.05568 21.0532 6.19842 20.8627L4.56614 20.5C3.65106 20.2966 3 19.485 3 18.5476V13.3049C3 12.122 4.09533 11.2434 5.25 11.5L6.19842 11.7108C6.40525 11.7567 6.61391 11.7916 6.82351 11.8154M14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
};

const PinCircle: React.FC<IIcon> = ({
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
        d="M17.1504 11.8991C19.4778 12.803 21 14.3027 21 16C21 18.7614 16.9706 21 12 21C7.02944 21 3 18.7614 3 16C3 14.2996 4.5279 12.7974 6.86261 11.8941M17.1504 11.8991C17.4072 11.3754 17.6142 10.8377 17.7661 10.2815C17.9188 9.72221 18 9.16522 18 8.61432C18 5.51362 15.3137 3 12 3C8.68629 3 6 5.51362 6 8.61432C6 9.66797 6.29693 10.7439 6.82351 11.8154C6.83641 11.8416 6.84944 11.8679 6.86261 11.8941M17.1504 11.8991C16.3831 13.4643 15.1719 14.9055 13.661 16.3498C12.7539 17.2168 11.2461 17.2168 10.339 16.3498C8.84901 14.9255 7.62606 13.4149 6.86261 11.8941M14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
};

const PinSmall: React.FC<IIcon> = ({
  className,
  currentColor,
  strokeWidth = 1.5,
}) => {
  return (
    <Svg
      height="18"
      width={18}
      viewBox="0 0 18 18"
      fill="none"
      className={className}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.875 6.87538C8.875 5.83943 8.03557 5 7.00038 5C5.96443 5 5.125 5.83943 5.125 6.87538C5.125 7.91057 5.96443 8.75 7.00038 8.75C8.03557 8.75 8.875 7.91057 8.875 6.87538Z"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.99963 14.75C6.10078 14.75 1.375 10.9238 1.375 6.92247C1.375 3.78998 3.89283 1.25 6.99963 1.25C10.1064 1.25 12.625 3.78998 12.625 6.92247C12.625 10.9238 7.89849 14.75 6.99963 14.75Z"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export { Pin, PinCircle, PinSmall };
