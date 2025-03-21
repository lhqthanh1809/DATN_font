import { IIcon } from "@/ui/Icon";
import Svg, { Path } from "react-native-svg";

const QuarterCircleInsideBLeft: React.FC<IIcon> = ({
  className,
  currentColor,
}) => {
  return (
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <Path d="M0 20V0C0 0 0 20 20 20H0Z" fill={currentColor} />
    </Svg>
  );
};

const QuarterCircleInsideBRight: React.FC<IIcon> = ({
  className,
  currentColor,
}) => {
  return (
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <Path d="M20.0044 20L0.00439453 20C0.00439453 20 20.0044 20 20.0044 9.05991e-06L20.0044 20Z" fill={currentColor} />
    </Svg>
  );
};

const QuarterCircleInsideTLeft: React.FC<IIcon> = ({
  className,
  currentColor,
}) => {
  return (
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <Path d="M1.7643e-05 0.00012207L20 0.00012207C20 0.00012207 1.7643e-05 0.00012207 1.7643e-05 20.0001V0.00012207Z" fill={currentColor} />
    </Svg>
  );
};

const QuarterCircleInsideTRight: React.FC<IIcon> = ({
  className,
  currentColor,
}) => {
  return (
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <Path d="M20 0L20 20C20 20 20 0 0 0L20 0Z" fill={currentColor} />
    </Svg>
  );
};

export { QuarterCircleInsideBLeft, QuarterCircleInsideBRight, QuarterCircleInsideTLeft, QuarterCircleInsideTRight };