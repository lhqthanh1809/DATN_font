import { cn } from "@/helper/helper";
import { useRouter } from "expo-router";
import { ReactNode } from "react";
import GestureRecognizer from "react-native-swipe-gestures";

function BackView({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const route = useRouter();
  return (
    <GestureRecognizer
      onSwipeRight={() => route.back()}
      className={cn("flex-1 bg-white-50", className)}
    >
      {children}
    </GestureRecognizer>
  );
}

export default BackView;
