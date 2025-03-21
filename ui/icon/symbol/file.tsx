import Svg, { Path } from "react-native-svg";
import { IIcon } from "../../Icon";

const File: React.FC<IIcon> = ({
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
      d="M11.7378 0.761748H5.0848C3.0048 0.753748 1.2998 2.41175 1.2508 4.49075V15.2037C1.2048 17.3167 2.8798 19.0677 4.9928 19.1147C5.0238 19.1147 5.0538 19.1157 5.0848 19.1147H13.0738C15.1678 19.0297 16.8178 17.2997 16.8028 15.2037V6.03775L11.7378 0.761748Z"
      stroke={currentColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.4751 0.75V3.659C11.4751 5.079 12.6231 6.23 14.0431 6.234H16.7981"
      stroke={currentColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.2881 13.3585H5.88806"
      stroke={currentColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.24321 9.60596H5.88721"
      stroke={currentColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    </Svg>
  );
};

const FileAdd: React.FC<IIcon> = ({
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
      d="M11.7366 0.76187H5.08455C3.00455 0.75387 1.29955 2.41087 1.25055 4.49087V15.3399C1.21555 17.3899 2.84855 19.0809 4.89955 19.1169C4.96055 19.1169 5.02255 19.1169 5.08455 19.1149H13.0726C15.1416 19.0939 16.8056 17.4089 16.8026 15.3399V6.03987L11.7366 0.76187Z"
      stroke={currentColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.4742 0.750122V3.65912C11.4742 5.07912 12.6232 6.23012 14.0432 6.23412H16.7972"
      stroke={currentColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.2937 10.9142H6.39368"
      stroke={currentColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.84448 13.3639V8.46387"
      stroke={currentColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    </Svg>
  );
};


export { File, FileAdd};
