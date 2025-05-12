import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

export const createScrollHandler = ({
  callback,
  loading,
  hasMore,
  threshold = 20, // mặc định cách đáy 20px sẽ load thêm
}: {
    callback: () => void;
    loading: boolean;
    hasMore: boolean;
    threshold?: number; // khoảng cách từ đáy
}) => {
  return (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - threshold;

    if (isCloseToBottom && !loading && hasMore) {
      callback();
    }
  };
};