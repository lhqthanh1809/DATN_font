import { cn } from "@/helper/helper";
import { View } from "react-native";
import Icon from "./icon";
import { CheckSimple, CheckSimpleMedium, CheckSimpleTiny } from "./icon/symbol";
import { remapProps } from "nativewind";

const CheckBox: React.FC<{
  checked: boolean;
  className?: string;
  classNameChecked?: string;
  classNameIcon?: string;
}> = ({ checked, className, classNameIcon, classNameChecked }) => {
  return (
    <View
      className={cn(
        "items-center justify-center rounded-md border-1 p-1 h-5 w-5",
        checked ? cn("bg-lime-50 border-transparent", classNameChecked) : className
      )}
    >
      {checked && (
        <Icon
          icon={CheckSimpleTiny}
          className={cn("text-lime-900", classNameIcon)}
        />
      )}
    </View>
  );
};


export default CheckBox;
