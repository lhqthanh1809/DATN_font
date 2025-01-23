import React from "react";
import { IIcon } from "../../icon";
import Svg, { Path } from "react-native-svg";

const Show: React.FC<IIcon> = ({ className }) => {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <Path
        d="M3.50898 13.1306C5.14013 14.7522 7.98484 17 11.2213 17C14.4578 17 17.3019 14.7522 18.9331 13.1306C19.3633 12.703 19.5791 12.4884 19.7161 12.0685C19.8138 11.7689 19.8138 11.2312 19.7161 10.9316C19.5791 10.5117 19.3633 10.2971 18.9331 9.86938C17.3019 8.24776 14.4578 6 11.2213 6C7.98484 6 5.14013 8.24776 3.50898 9.86938C3.07845 10.2974 2.86317 10.5115 2.72613 10.9316C2.6284 11.2312 2.6284 11.7689 2.72613 12.0685C2.86317 12.4886 3.07845 12.7026 3.50898 13.1306Z"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.38778 11.5C9.38778 12.5126 10.2086 13.3334 11.2211 13.3334C12.2337 13.3334 13.0545 12.5126 13.0545 11.5C13.0545 10.4875 12.2337 9.66669 11.2211 9.66669C10.2086 9.66669 9.38778 10.4875 9.38778 11.5Z"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Show;
