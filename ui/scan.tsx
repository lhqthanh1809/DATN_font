import { useCameraPermissions } from "expo-camera";
import Button from "./Button";
import { Text } from "react-native";
import { router } from "expo-router";
import Icon from "./Icon";
import { Home, QR } from "./icon/symbol";
import { useEffect, useState } from "react";
import eventEmitter from "@/utils/eventEmitter";

const Scan: React.FC<{
  onChange: (value: string) => void;
}> = ({ onChange }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  useEffect(() => {
    // Lắng nghe sự kiện khi nhận dữ liệu từ scanner
    const listener = (data: string) => {
      onChange(data);
    //   eventEmitter.off("qrScanner", listener);
    };

    eventEmitter.on("qrScanner", listener);

    return () => {
      eventEmitter.off("qrScanner", listener);
    };
  }, []);

  return (
    <>
      <Button
        onPress={() =>
          !isPermissionGranted ? requestPermission : router.push("/scanner")
        }
      >
        <Icon icon={QR} />
      </Button>
    </>
  );
};

export default Scan;
