import { CameraView } from "expo-camera";
import {
  Dimensions,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Overlay } from "@/ui/Overplay";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import eventEmitter from "@/utils/eventEmitter";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import { Cross, CrossMedium } from "@/ui/icon/symbol";
import * as Haptics from "expo-haptics";
import { useRef } from "react";

const { width, height } = Dimensions.get("window");
const SCAN_BOX_SIZE = 300;
const QRScan = () => {
  const hasScannedRef = useRef(false);

  const handleScan = useCallback(
    ({ bounds, data }: { bounds?: any; data: string }) => {
      if (hasScannedRef.current) return;
      const { origin, size } = bounds;
      const qrCenterX = origin.x + size.width / 2;
      const qrCenterY = origin.y + size.height / 2;

      const scanBoxX1 = width / 2 - SCAN_BOX_SIZE / 2;
      const scanBoxX2 = width / 2 + SCAN_BOX_SIZE / 2;
      const scanBoxY1 = height / 2 - SCAN_BOX_SIZE / 2;
      const scanBoxY2 = height / 2 + SCAN_BOX_SIZE / 2;

      if (
        qrCenterX >= scanBoxX1 &&
        qrCenterX <= scanBoxX2 &&
        qrCenterY >= scanBoxY1 &&
        qrCenterY <= scanBoxY2
      ) {
        hasScannedRef.current = true;
        eventEmitter.emit("qrScanner", data);

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (router.canGoBack()) {
          // console.log("1");
          router.back();
        }
      }
    },
    []
  );

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <StatusBar hidden />
      {/* Nút Back trên cùng */}
      <View className="absolute z-10 top-6 left-6">
        <Button
          className="bg-white-600 p-3 rounded-full"
          onPress={() => router.back()}
        >
          <Icon icon={CrossMedium} className="text-white-50" />
        </Button>
      </View>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={handleScan}
      />
      <Overlay />
    </SafeAreaView>
  );
};

export default QRScan;
