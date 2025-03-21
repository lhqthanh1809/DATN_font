import React from "react";
import { IIcon } from "../../Icon";
import Svg, { Path } from "react-native-svg";

const Fingerprint: React.FC<IIcon> = ({ className, currentColor }) => {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <Path
        d="M12.5 10.5V14.5M7.94712 3.92103C9.23941 3.02503 10.8084 2.5 12.5 2.5C16.9183 2.5 20.5 6.08172 20.5 10.5V11.7367M4.91632 7.94607C4.64633 8.74809 4.5 9.60696 4.5 10.5V14.5C4.5 18.1349 6.92416 21.2035 10.244 22.1775M20.1588 16.8187C19.4294 19.2314 17.5911 21.1626 15.2367 22.0196M14.825 6.64635C14.1464 6.2361 13.3508 6 12.5 6C10.0147 6 8 8.01472 8 10.5V13.45M17 11.54V14.5C17 16.9853 14.9853 19 12.5 19C11.6514 19 10.8576 18.7651 10.1801 18.3567"
        stroke={currentColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export { Fingerprint };
