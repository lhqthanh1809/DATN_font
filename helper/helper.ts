import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Constants from "expo-constants";
import CryptoJS from "crypto-js";
import moment from "moment";
import * as Application from "expo-application";
import { Platform, StatusBar, Dimensions } from "react-native";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function encrypt(data: string) {
  const key = CryptoJS.enc.Base64.parse(env("AES_KEY"));
  const iv = CryptoJS.enc.Base64.parse(env("AES_IV"));

  const encrypt = CryptoJS.AES.encrypt(data, key, { iv: iv });
  return CryptoJS.enc.Base64.stringify(encrypt.ciphertext);
}

export function env(data: string) {
  return Constants.expoConfig?.extra?.[data];
}

export function formatNumber(number: string, type: "int" | "float" = "int") {
  if (!number) return null;

  if (checkLastChar(number, ",")) {
    number = number.slice(0, -1);
  }

  number = number.replace(/,/g, ".");
  if (number.trim() === "" || isNaN(Number(number))) {
    return null;
  }

  return type === "int" ? parseInt(number, 10) : parseFloat(number);
}

export const checkLastChar = (str: string, char: string) => {
  return str.slice(-1) === char;
};

export function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

export const convertToNumber = (value: string) => {
  if (!value) return "";
  const indexLastComma = value.lastIndexOf(",");
  if (indexLastComma == -1)
    return new Intl.NumberFormat("vi-VN").format(Number(value));

  const fontPart = value.slice(0, indexLastComma).replaceAll(",", "");
  const backPart = value.slice(indexLastComma + 1, value.length);
  return `${new Intl.NumberFormat("vi-VN").format(
    Number(fontPart)
  )},${backPart}`;
};

export const getTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const convertStringToDate = (dateString: string) => {
  if (dateString.length < 8) return null;
  const day = dateString.substring(0, 2);
  const month = dateString.substring(2, 4);
  const year = dateString.substring(4, 8);
  return new Date(`${year}-${month}-${day}`);
};

export const formatDateForRequest = (date: Date, isTime: boolean = false) => {
  let format = "YYYY-MM-DD";
  if (isTime) {
    format = `${format} HH:mm:ss`;
  }
  return moment(date).tz(env("TIMEZONE")).format(format);
};

export const getDeviceID = async () => {
  if (Platform.OS === "android") {
    return await Application.getAndroidId();
  } else {
    return await Application.getIosIdForVendorAsync();
  }
};

export const getTimeAgo = (timestamp: string) => {
  const now = moment().tz(getTimezone());
  const notifTime = moment.tz(timestamp, env("TIMEZONE")).tz(getTimezone());
  const diffHours = now.diff(notifTime, "hours");
  const diffSeconds = now.diff(notifTime, "seconds");

  if (diffSeconds < 60) {
    return `${diffSeconds} giây trước`;
  } else if (diffHours < 1) {
    return `${Math.floor(diffSeconds / 60)} phút trước`;
  } else if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  } else {
    return notifTime.format("DD/MM/YYYY");
  }
};

export const getStatusBarHeight = () => {
  const X_WIDTH = 375;
  const X_HEIGHT = 812;

  const XSMAX_WIDTH = 414;
  const XSMAX_HEIGHT = 896;

  const { height, width } = Dimensions.get("window");

  const isIPhoneX = () =>
    Platform.OS === "ios" && !Platform.isPad && !Platform.isTV
      ? (width === X_WIDTH && height === X_HEIGHT) ||
        (width === XSMAX_WIDTH && height === XSMAX_HEIGHT)
      : false;

  return Platform.select({
    ios: isIPhoneX() ? 44 : 20,
    android: StatusBar.currentHeight,
    default: 0,
  });
};
