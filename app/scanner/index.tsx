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
import { Overlay } from "@/ui/overplay";
import { router } from "expo-router";
import { useCallback } from "react";
import eventEmitter from "@/utils/eventEmitter";
import Button from "@/ui/button";


const { width, height } = Dimensions.get("window");
const SCAN_BOX_SIZE = 300;
const QRScan = () => {
  const handleScan = useCallback(({ bounds, data }: { bounds?: any; data: string }) => {

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
      eventEmitter.emit("qrScanner", data);
      router.back();
    }
  }, []);

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <StatusBar hidden />
      {/* Nút Back trên cùng */}
      <View className="absolute z-10 items-center w-full" style={{
        bottom: 50
      }}>
        <Button
          className="bg-white-50"
          onPress={() => router.back()}
          style={{
            paddingHorizontal: 50,
            paddingVertical: 8,
            borderRadius: 10,
          }}
        >
          <Text className="font-BeVietnamSemiBold text-mineShaft-950" style={{ fontSize: 16 }}>Đóng</Text>
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
