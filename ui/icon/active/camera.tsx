import React from "react";
import { IIcon } from "../../Icon";
import Svg, { Path } from "react-native-svg";

const Camera: React.FC<IIcon> = ({
  className,
  currentColor,
  strokeWidth = 1.5,
}) => {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.4381 12.4983C15.4381 10.7614 14.0297 9.35303 12.2928 9.35303C10.556 9.35303 9.14758 10.7614 9.14758 12.4983C9.14758 14.2351 10.556 15.6436 12.2928 15.6436C14.0297 15.6436 15.4381 14.2351 15.4381 12.4983Z"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.2925 20.2002C20.3378 20.2002 21.2957 17.7897 21.2957 12.5665C21.2957 8.90545 20.8115 6.94651 17.762 6.1044C17.482 6.01598 17.1715 5.84756 16.9199 5.57072C16.5136 5.12545 16.2167 3.75809 15.2357 3.3444C14.2546 2.93177 10.3146 2.95072 9.34937 3.3444C8.38516 3.73914 8.07147 5.12545 7.66516 5.57072C7.41358 5.84756 7.1041 6.01598 6.82305 6.1044C3.77358 6.94651 3.28937 8.90545 3.28937 12.5665C3.28937 17.7897 4.24726 20.2002 12.2925 20.2002Z"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17.2045 9H17.2135"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

const CameraOff: React.FC<IIcon> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <Path
        d="M5 5C3.34315 5 2 6.34315 2 8V16C2 17.6569 3.34315 19 5 19H14C15.3527 19 16.4962 18.1048 16.8705 16.8745M17 12L20.6343 8.36569C21.0627 7.93731 21.2769 7.72312 21.4608 7.70865C21.6203 7.69609 21.7763 7.76068 21.8802 7.88238C22 8.02265 22 8.32556 22 8.93137V15.0686C22 15.6744 22 15.9774 21.8802 16.1176C21.7763 16.2393 21.6203 16.3039 21.4608 16.2914C21.2769 16.2769 21.0627 16.0627 20.6343 15.6343L17 12ZM17 12V9.8C17 8.11984 17 7.27976 16.673 6.63803C16.3854 6.07354 15.9265 5.6146 15.362 5.32698C14.7202 5 13.8802 5 12.2 5H9.5M2 2L22 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export { CameraOff };
export default Camera;
