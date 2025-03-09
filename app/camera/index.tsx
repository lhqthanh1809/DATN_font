import { CameraView, Camera } from "expo-camera"; // Dùng CameraView thay vì Camera
import * as MediaLibrary from "expo-media-library";
import {
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Image,
  Text,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import Icon from "@/ui/icon";
import { ChevronLeft } from "@/ui/icon/symbol";
import Button from "@/ui/button";
import eventEmitter from "@/utils/eventEmitter";

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permissionTypeLibrary, setPermissionTypeLibrary] = useState<
    "all" | "limited" | "none" | undefined
  >(undefined);
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null); // Đúng kiểu của CameraView

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const { status: mediaStatus, accessPrivileges } =
        await MediaLibrary.requestPermissionsAsync();
      setPermissionTypeLibrary(accessPrivileges);
      if (status !== "granted" || mediaStatus !== "granted") {
        router.back();
      } else {
        setHasPermission(true);
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        setPhoto(photo.uri);
      }
    }
  };

  const savePhoto = async () => {
    if (photo) {
      const asset = await MediaLibrary.createAssetAsync(photo);
      const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);
      if (permissionTypeLibrary === "all") {
        eventEmitter.emit("camera", {
          ...assetInfo,
          uri: assetInfo.localUri,
        });
      }
      router.back();
    }
  };

  if (!hasPermission) return null;

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <StatusBar hidden />

      {/* Nút Back */}
      <View className="absolute z-10 items-center top-5 left-5">
        <Button
          className="rounded-full p-3 bg-white-50/80"
          onPress={() => router.back()}
        >
          <Icon icon={ChevronLeft} />
        </Button>
      </View>

      {/* Camera */}
      {!photo && (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing="back"
        />
      )}

      {/* Nếu đã chụp ảnh thì hiển thị ảnh và các nút xác nhận */}
      {photo ? (
        <View style={StyleSheet.absoluteFillObject} className="z-20">
          <Image
            source={{ uri: photo }}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Nút Lưu & Hủy */}
          <View className="absolute bottom-10 px-4 gap-2 w-full flex-row justify-around">
            <Button
              // disabled={processingCreate}
              onPress={() => setPhoto(null)}
              className="flex-1 bg-white-50 border-1 border-mineShaft-200 py-4"
            >
              <Text className="text-mineShaft-950 text-16 font-BeVietnamSemiBold">
                Chụp lại
              </Text>
            </Button>
            <Button
              onPress={savePhoto}
              className="flex-1 bg-mineShaft-950 py-4"
            >
              <Text className="text-white-50 text-16 font-BeVietnamSemiBold">
                Lưu ảnh
              </Text>
            </Button>
          </View>
        </View>
      ) : (
        // Nút Chụp Ảnh
        <View
          className="absolute z-10 items-center w-full"
          style={{ bottom: 50 }}
        >
          <Button
            className="rounded-full p-3 bg-mineShaft-900/45"
            onPress={takePicture}
          >
            <View className="w-16 h-16 bg-red-600 rounded-full" />
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CameraScreen;
