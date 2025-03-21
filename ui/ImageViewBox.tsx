import { View } from "moti";
import Icon from "./Icon";
import React, { useCallback, useMemo, useState } from "react";
import { Image, Text, ScrollView } from "react-native";
import { CrossMedium } from "./icon/symbol";
import Button from "./Button";
import { useUI } from "@/hooks/useUI";
import { cn } from "@/helper/helper";

const ImageViewBox: React.FC<{
  label?: string;
  required?: boolean;
  value: string[];
}> = ({ label, required, value }) => {
  const { showModal, hideModal } = useUI();
  const [width, setWidth] = useState(0);
  const selectPhotos = useMemo(() => value, [value]);
  const _COLUMN = 3;
  const _GAP = 8;
  const itemSize = useMemo(
    () => (width - _GAP * (_COLUMN - 1)) / _COLUMN,
    [width, _GAP, _COLUMN]
  );

  const openViewImage = useCallback((image: string) => {
    showModal(
      <View className="w-full h-full">
        <View className="absolute z-10 items-center top-8 left-5">
          <Button
            className="rounded-full p-3 bg-white-50/80"
            onPress={() => hideModal()}
          >
            <Icon icon={CrossMedium} />
          </Button>
        </View>
        <Image
          className="h-full w-full"
          source={{ uri: image }}
          resizeMode="contain"
        />
      </View>
    );
  }, []);

  return (
    <View className="gap-1 w-full">
      {label && (
        <View className="flex-row">
          <Text className="font-BeVietnamRegular text-12 text-white-400">
            {label}
          </Text>
          {required && (
            <Text className="font-BeVietnamRegular text-14 text-red-600 ml-2">
              *
            </Text>
          )}
        </View>
      )}
      <View
        style={{ minHeight: 80, maxHeight: 300 }}
      >
        {selectPhotos.length > 0 && (
          <ScrollView>
            <View
              className="w-full flex-row flex-wrap"
              style={{ gap: _GAP }}
              onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
              
            >
              {selectPhotos.map((photo, index) => (
                <Button
                  onPress={() => openViewImage(photo)}
                  key={index}
                  className="border-1 items-center justify-center border-mineShaft-200 overflow-hidden flex-1"
                  style={{ minWidth: itemSize, height: itemSize }}
                >
                  <Image
                    source={{ uri: photo }}
                    style={{ width: "100%", height: "100%", borderRadius: 8 }}
                    resizeMode="cover"
                  />
                </Button>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};
export default ImageViewBox;
