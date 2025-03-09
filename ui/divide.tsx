import { cn } from "@/helper/helper";
import { View } from "react-native";

interface Props {
    direction?: 'horizontal' | 'vertical'
    className?: string
}

function Divide({className, direction = 'horizontal'} : Props) {
    return ( <View  className={cn("rounded-full h-[2] bg-white-200 w-full",direction === "vertical" && "rotate-90" , className)}></View> );
}

export default Divide;