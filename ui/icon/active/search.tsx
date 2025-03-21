import React from "react";
import { IIcon } from "../../Icon";
import Svg, { Path } from "react-native-svg";

const Search: React.FC<IIcon> = ({ className, currentColor }) => {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <Path
        d="M20 20L16.4153 16.4153M16.4153 16.4153C17.7314 15.0992 18.5455 13.281 18.5455 11.2727C18.5455 7.25611 15.2893 4 11.2727 4C7.25611 4 4 7.25611 4 11.2727C4 15.2893 7.25611 18.5455 11.2727 18.5455C13.281 18.5455 15.0992 17.7314 16.4153 16.4153Z"
        stroke={currentColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Search;
