import { AnimatePresence, MotiView, View } from "moti";
import Icon from "./Icon";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, Text, FlatList, ScrollView, Pressable } from "react-native";
import { Cross, CrossMedium, CrossSmall, ImageAdd } from "./icon/symbol";
import { Camera } from "./icon/active";
import Button from "./Button";
import { useUI } from "@/hooks/useUI";
import * as MediaLibrary from "expo-media-library";
import { cn } from "@/helper/helper";
import { Camera as Cam } from "expo-camera";
import { router } from "expo-router";
import eventEmitter from "@/utils/eventEmitter";

const ImagePicker: React.FC<{
  label?: string;
  required?: boolean;
  onChange: (values: (MediaLibrary.AssetInfo | string)[]) => void;
  value: (MediaLibrary.AssetInfo | string)[];
  single?: boolean;
}> = React.memo(({ label, required, onChange, single, value }) => {
  const { showModal, hideModal } = useUI();
  const [width, setWidth] = useState(0);
  const [selectPhotos, setSelectPhotos] = useState<
    (MediaLibrary.AssetInfo | string)[]
  >(value);
  const _COLUMN = 4;
  const _GAP = 8;
  const [itemSize, setItemSize] = useState(
    (width - _GAP * (_COLUMN - 1)) / _COLUMN
  );

  const openImagePicker = useCallback(async () => {
    let { status, accessPrivileges } = await MediaLibrary.getPermissionsAsync();

    if (status !== "granted") {
      const { status: newStatus, accessPrivileges: newAccessPrivileges } =
        await MediaLibrary.requestPermissionsAsync();
      if (newStatus !== "granted") return;
      status = newStatus;
      accessPrivileges = newAccessPrivileges;
    }
    showModal(
      <ViewModalImagePicker
        single={single}
        permissionType={accessPrivileges}
        selects={selectPhotos.filter((item) => typeof item != "string")}
        onChangeSelects={(photos: MediaLibrary.AssetInfo[]) => {
          setSelectPhotos((prev) => {
            const stringItems = prev.filter(item => typeof item === "string");
            return [...photos, ...stringItems];
          });
        }}
        hideModal={hideModal}
      />
    );
  }, [single, selectPhotos, showModal, hideModal]);

  const removeImage = useCallback((data: MediaLibrary.AssetInfo | string) => {
    setSelectPhotos((prev) => prev.filter((item) => item !== data));
  }, []);

  const openViewImage = useCallback(
    (image: string) => {
      showModal(
        <View className="w-full h-full">
          <View className="absolute z-10 items-center top-8 left-5">
            <Button
              className="rounded-full p-3 bg-white-50/80"
              onPress={hideModal}
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
    },
    [showModal, hideModal]
  );

  useEffect(() => {
    setItemSize((width - _GAP * (_COLUMN - 1)) / _COLUMN);
  }, [width]);

  const cameraListener = useCallback(
    (data: MediaLibrary.AssetInfo) => {
      setSelectPhotos((prev) => (single ? [data] : [...prev, data]));
    },
    [single]
  );

  useEffect(() => {
    eventEmitter.on("camera", cameraListener);
    return () => {
      eventEmitter.off("camera", cameraListener);
    };
  }, [cameraListener]);

  useEffect(() => {
    onChange(selectPhotos);
  }, [selectPhotos, onChange]);

  useEffect(() => {
    if(value != selectPhotos){
      setSelectPhotos(value)
    }
  }, [value])

  return (
    <View className="gap-2">
      {label && (
        <View className="flex-row">
          <Text className="font-BeVietnamRegular text-14 text-mineShaft-950 ml-2">
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
        className={cn(
          "border-1 rounded-xl border-mineShaft-200 border-dashed min-h-28 justify-evenly items-center",
          selectPhotos.length > 0 ? "flex-row border-solid p-2" : "flex-1"
        )}
        style={{ minHeight: 80, maxHeight: single ? undefined : 300 }}
      >
        {selectPhotos.length > 0 ? (
          <ScrollView>
            <View
              className={cn("w-full flex-row flex-wrap", single && "h-80")}
              style={{ gap: _GAP }}
              onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
            >
              {!single && (
                <Button
                  className="border-1 items-center justify-center border-dashed border-mineShaft-300 aspect-square"
                  onPress={openImagePicker}
                  style={{ width: itemSize, height: itemSize }}
                >
                  <Icon icon={ImageAdd} />
                </Button>
              )}

              {selectPhotos.map((photo, index) => (
                <Button
                  onPress={() =>
                    openViewImage(typeof photo === "string" ? photo : photo.uri)
                  }
                  key={index}
                  className="border-1 items-center justify-center border-mineShaft-200 overflow-hidden"
                  style={{
                    width: single ? "100%" : itemSize,
                    height: single ? 280 : itemSize,
                  }}
                >
                  <Image
                    source={{
                      uri: typeof photo == "string" ? photo : photo.uri,
                    }}
                    className="w-full h-full rounded-lg"
                    resizeMode="cover"
                  />
                  <Button
                    className="absolute bg-white-50 p-2 right-2 top-2 ring-1 ring-white-900"
                    onPress={() => removeImage(photo)}
                  >
                    <Icon icon={CrossSmall} />
                  </Button>
                </Button>
              ))}
            </View>
          </ScrollView>
        ) : (
          <Button
            onPress={openImagePicker}
            className="flex-1 w-full rounded-xl"
          >
            <Icon icon={ImageAdd} />
          </Button>
        )}
      </View>
    </View>
  );
});

const ViewModalImagePicker: React.FC<{
  numberColumn?: number;
  permissionType?: "all" | "limited" | "none" | undefined | null;
  selects: MediaLibrary.AssetInfo[];
  onChangeSelects: (photos: MediaLibrary.AssetInfo[]) => void;
  hideModal: () => void;
  single?: boolean;
}> = ({
  numberColumn = 4,
  permissionType,
  selects,
  onChangeSelects,
  hideModal,
  single,
}) => {
  const [selectPhotos, setSelectPhotos] =
    useState<MediaLibrary.AssetInfo[]>(selects);
  const [width, setWidth] = useState(0);
  const [photos, setPhotos] = useState<MediaLibrary.AssetInfo[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [lastAsset, setLastAsset] = useState<string | undefined>(undefined);
  const isLoading = useRef(false);
  const _GAP = 8;
  const itemSize = (width - _GAP * (numberColumn - 1)) / numberColumn;

  const photosRef = useRef<MediaLibrary.AssetInfo[]>([]);

  // Lưu lại danh sách ảnh đã chọn
  const handleSelect = useCallback(() => {
    onChangeSelects(selectPhotos);
    hideModal();
  }, [selectPhotos]);

  const loadPhotos = useCallback(
    async (loadMore = false) => {
      if (isLoading.current || (!hasMore && loadMore)) return;

      isLoading.current = true;

      const media = await MediaLibrary.getAssetsAsync({
        mediaType: "photo",
        first: 20,
        after: loadMore ? lastAsset : undefined,
        sortBy: MediaLibrary.SortBy.creationTime,
      });

      const photosWithUri = await Promise.all(
        media.assets.map(async (photo) => {
          const assetInfo = await MediaLibrary.getAssetInfoAsync(photo.id);
          return assetInfo.localUri
            ? { ...photo, uri: assetInfo.localUri }
            : null;
        })
      );

      const filteredPhotos = photosWithUri.filter((photo) => photo !== null);

      if (loadMore) {
        photosRef.current = [...photosRef.current, ...filteredPhotos];
      } else {
        photosRef.current = filteredPhotos;
      }
      setPhotos(photosRef.current);

      setLastAsset(media.endCursor);
      setHasMore(media.hasNextPage);

      isLoading.current = false;
    },
    [lastAsset, hasMore]
  );

  const requestCameraRollPermission = useCallback(async () => {
    const { status } = await Cam.getCameraPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } = await Cam.requestCameraPermissionsAsync();
      if (newStatus !== "granted") return;
    }
    hideModal();
    router.push("/camera");
  }, []);

  const requestMorePhotos = useCallback(async () => {
    if (permissionType === "limited") {
      await MediaLibrary.presentPermissionsPickerAsync();

      const listener = MediaLibrary.addListener((event) => {
        if (!event.hasIncrementalChanges) {
          loadPhotos();
          MediaLibrary.removeAllListeners();
        }
      });
    }
  }, [permissionType, loadPhotos]);

  // Xử lí khi chọn ảnh
  const handleSelectPhoto = useCallback((photo: MediaLibrary.AssetInfo) => {
    !single
      ? setSelectPhotos((prev) =>
          prev.some((p) => p.id === photo.id)
            ? prev.filter((p) => p.id != photo.id)
            : [...prev, photo]
        )
      : setSelectPhotos([photo]);
  }, []);

  useEffect(() => {
    loadPhotos();
  }, []);

  useEffect(() => {
    onChangeSelects(selectPhotos);
  }, [selectPhotos]);

  useEffect(() => {
    if (selects.length <= 0) {
      onChangeSelects([]);
    }
  }, [selectPhotos]);

  return (
    <Pressable
      onPress={() => {}}
      className="absolute bottom-0 bg-white-50 rounded-t-xl py-4 gap-4 w-full"
    >
      <ScrollView
        className="px-4 h-96"
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom =
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 80;

          if (isCloseToBottom && hasMore && !isLoading.current) {
            loadPhotos(true);
          }
        }}
        contentContainerStyle={{ paddingBottom: 50 }}
        scrollEventThrottle={400} // Giảm tần suất gọi onScroll
      >
        <View
          className="flex-row"
          style={{ flexWrap: "wrap", gap: _GAP }}
          onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        >
          <Button
            className="border-1 items-center justify-center border-dashed border-mineShaft-300 aspect-square"
            style={{
              width: itemSize,
              height: itemSize,
            }}
            onPress={requestCameraRollPermission}
          >
            <Icon icon={Camera} />
          </Button>
          {/* Add image for library */}
          {permissionType !== "all" && (
            <Button
              className="border-1 items-center justify-center border-dashed border-mineShaft-300 aspect-square"
              onPress={requestMorePhotos}
              style={{
                width: itemSize,
                height: itemSize,
              }}
            >
              <Icon icon={ImageAdd} />
            </Button>
          )}

          {photos.map((photo, index) => (
            <PhotoItem
              key={index}
              photo={photo}
              size={itemSize}
              onPress={() => handleSelectPhoto(photo)}
              checked={selectPhotos.some((p) => p.id === photo.id)}
            />
          ))}
        </View>
      </ScrollView>
      <AnimatePresence>
        {selectPhotos.length > 0 && (
          <MotiView
            className="p-4 absolute w-full bottom-0"
            from={{ translateY: 100, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ translateY: 100, opacity: 0 }}
            transition={{ type: "timing", duration: 300 }}
          >
            <Button
              className="bg-mineShaft-950 p-4 rounded-xl items-center justify-center"
              onPress={handleSelect}
            >
              <Text className="font-BeVietnamMedium text-white-50">
                Chọn ảnh
              </Text>
            </Button>
          </MotiView>
        )}
      </AnimatePresence>
    </Pressable>
  );
};

const PhotoItem = React.memo(
  ({
    photo,
    size,
    checked,
    onPress,
  }: {
    photo: MediaLibrary.AssetInfo;
    size: number;
    checked?: boolean;
    onPress?: () => void;
  }) => {
    return (
      <Button
        onPress={onPress}
        className="border-1 items-center justify-center border-mineShaft-200 overflow-hidden aspect-square"
        style={{ width: size, height: size }}
      >
        <View
          className={cn(
            "absolute w-5 h-5 rounded-full border-1 border-mineShaft-100 top-2 right-2 z-10",
            checked ? "bg-lime-500" : "bg-white-50"
          )}
        />

        <Image
          source={{ uri: photo.uri }}
          style={{ width: "100%", height: "100%", borderRadius: 8 }}
          resizeMode="cover"
        />
      </Button>
    );
  },
  (prevProps, nextProps) => prevProps.checked === nextProps.checked
);

export default ImagePicker;
