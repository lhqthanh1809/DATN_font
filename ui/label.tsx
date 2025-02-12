import { cn } from "@/helper/helper";
import { Text, View } from "react-native";

function Label({label, className} : {label: string, className?: string}) {
    return ( 
        <View className={cn("bg-white-200/70 px-3 py-2 rounded-lg", className)}>
            <Text  className="font-BeVietnamRegular text-12 text-mineShaft-950">{label}</Text>
        </View>
     );
}

export default Label;