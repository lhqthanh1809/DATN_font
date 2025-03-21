import React from "react";
import { IIcon } from "../../Icon";
import Svg, { Path } from "react-native-svg";

const Bulb: React.FC<IIcon> = ({
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
        d="M9 21H15M12 3C8.68629 3 6 5.68629 6 9C6 10.2145 6.36084 11.3447 6.98117 12.2893C7.93507 13.7418 8.41182 14.4681 8.47373 14.5766C9.02449 15.5415 8.92287 15.2009 8.99219 16.3098C8.99998 16.4345 9 16.6231 9 17.0002C9 17.5525 9.44772 18.0002 10 18.0002L14 18.0002C14.5523 18.0002 15 17.5525 15 17.0002C15 16.6231 15 16.4345 15.0078 16.3098C15.0771 15.2009 14.9751 15.5415 15.5259 14.5766C15.5878 14.4681 16.0651 13.7418 17.019 12.2893C17.6394 11.3447 18.0002 10.2145 18.0002 9C18.0002 5.68629 15.3137 3 12 3Z"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export { Bulb };
