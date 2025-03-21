import { IIcon } from "@/ui/Icon";
import Svg, { Path } from "react-native-svg";

const Users: React.FC<IIcon> = ({ className, currentColor, strokeWidth }) => {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <Path
        d="M12 20C12 17.7909 10.2091 16 8 16H6C3.79086 16 2 17.7909 2 20M22 17C22 14.7909 20.2091 13 18 13H16C14.8053 13 13.7329 13.5238 13 14.3542M10 10C10 11.6569 8.65685 13 7 13C5.34315 13 4 11.6569 4 10C4 8.34315 5.34315 7 7 7C8.65685 7 10 8.34315 10 10ZM20 7C20 8.65685 18.6569 10 17 10C15.3431 10 14 8.65685 14 7C14 5.34315 15.3431 4 17 4C18.6569 4 20 5.34315 20 7Z"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

const User: React.FC<IIcon> = ({
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.84455 20.6618C4.15273 20.6618 1 20.0873 1 17.7865C1 15.4858 4.13273 13.3618 7.84455 13.3618C11.5364 13.3618 14.6891 15.4652 14.6891 17.766C14.6891 20.0658 11.5564 20.6618 7.84455 20.6618Z"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.83731 10.1735C10.26 10.1735 12.2237 8.2099 12.2237 5.78718C12.2237 3.36445 10.26 1.3999 7.83731 1.3999C5.41458 1.3999 3.45004 3.36445 3.45004 5.78718C3.44186 8.20172 5.39186 10.1654 7.8064 10.1735C7.81731 10.1735 7.82731 10.1735 7.83731 10.1735Z"
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export { User };
export default Users;
