import React from "react";
import { IIcon } from "../../Icon";
import Svg, { Path } from "react-native-svg";

const Octagon: React.FC<IIcon> = ({ className }) => {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <Path
        d="M12 21H15.6716C16.202 21 16.7107 20.7893 17.0858 20.4142L20.4142 17.0858C20.7893 16.7107 21 16.202 21 15.6716V12V8.32843C21 7.79799 20.7893 7.28929 20.4142 6.91421L17.0858 3.58579C16.7107 3.21071 16.202 3 15.6716 3H12H8.32843C7.79799 3 7.28929 3.21071 6.91421 3.58579L3.58579 6.91421C3.21071 7.28929 3 7.79799 3 8.32843V12V15.6716C3 16.202 3.21071 16.7107 3.58579 17.0858L6.91421 20.4142C7.28929 20.7893 7.79799 21 8.32843 21H12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default Octagon;
