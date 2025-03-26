import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Constants from "expo-constants";
import CryptoJS from "crypto-js";
import moment from "moment";
import * as Application from "expo-application";
import { Platform, StatusBar, Dimensions } from "react-native";

// Gộp và làm sạch class tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mã hoá AES
export function encrypt(data: string) {
  const key = CryptoJS.enc.Base64.parse(env("AES_KEY"));
  const iv = CryptoJS.enc.Base64.parse(env("AES_IV"));

  const encrypt = CryptoJS.AES.encrypt(data, key, { iv: iv });
  return CryptoJS.enc.Base64.stringify(encrypt.ciphertext);
}

// Lấy giá tri trong app
export function env(data: string) {
  return Constants.expoConfig?.extra?.[data];
}

// Chuyển số chuyển về dạng số
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

// Kiểm tra giá trị cuối cùng của 1 chuỗi
export const checkLastChar = (str: string, char: string) => {
  return str.slice(-1) === char;
};

// Chuyển giá trị số dạng string về kiểu hiện thị cần
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

// Lấy timezone thiết bị
export const getTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

// Chuyển string không đúng định dạng về Date
export const convertStringToDate = (dateString: string) => {
  if (dateString.length < 8) return null;
  const day = dateString.substring(0, 2);
  const month = dateString.substring(2, 4);
  const year = dateString.substring(4, 8);
  return new Date(`${year}-${month}-${day}`);
};

// Chuyển date từ client về đúng định dạng của server
export const formatDateForRequest = (date: Date, isTime: boolean = false) => {
  let format = "YYYY-MM-DD";
  if (isTime) {
    format = `${format} HH:mm:ss`;
  }
  return moment(date).tz(env("TIMEZONE")).format(format);
};

// Chuyển timestamp từ server về định dạng cần
export const convertToDate = (date: string, format?: string) => {
  if (!format) {
    format = "DD/MM/YYYY";
  }
  return moment(date, "YYYY-MM-DD HH:mm:ss", env("TIMEZONE"))
    .tz(env("TIMEZONE"))
    .format(format);
};

// Lấy ID thiết bị
export const getDeviceID = async () => {
  if (Platform.OS === "android") {
    return await Application.getAndroidId();
  } else {
    return await Application.getIosIdForVendorAsync();
  }
};

// Lấy khoảng cách thời gian tính tới hiện tại
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

// Lấy chiều cao statusBar
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

export const formatCurrencyVND = (value: number) => {
  // Chuyển đổi giá trị thành số, mặc định là 0 nếu không hợp lệ
  const num = value || 0;

  if (num < 1000) {
    // Dưới 1.000 VNĐ: hiển thị toàn bộ
    return `${num} đ`;
  } else if (num >= 1000 && num < 1000000) {
    const exactValueInK = num / 1000; // Giá trị chính xác (ví dụ: 2.5 cho 2500)
    const formatted = exactValueInK.toFixed(1).replace(/\.0$/, ""); // Làm tròn 1 chữ số thập phân và loại bỏ .0
    const roundedValue = Number(formatted); // Giá trị sau khi làm tròn
    const isApproximate = exactValueInK !== roundedValue && num % 1000 !== 0; // Kiểm tra xem có xấp xỉ hay không
    return `${isApproximate ? "~" : ""}${formatted}K đ`;
  } else {
    const exactValueInM = num / 1000000; // Giá trị chính xác (ví dụ: 2.5 cho 2500000)
    const formatted = exactValueInM.toFixed(1).replace(/\.0$/, ""); // Làm tròn 1 chữ số thập phân và loại bỏ .0
    const roundedValue = Number(formatted); // Giá trị sau khi làm tròn
    const isApproximate = exactValueInM !== roundedValue && num % 1000000 !== 0; // Kiểm tra xem có xấp xỉ hay không
    return `${isApproximate ? "~" : ""}${formatted}M đ`;
  }
};

export const getDimensionsDevice = () => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  return {
    width: windowWidth,
    height: windowHeight,
  };
};


export const formatTime = (dateString: string) =>  {
  const now = moment();
  const date = moment(dateString);

  if (now.isSame(date, 'day')) {
      return date.format("HH:mm"); // Trong ngày
  } else if (now.isSame(date, 'week')) {
      return date.format("dddd HH:mm"); // Trong cùng tuần
  } else if (now.isSame(date, 'year')) {
      return date.format("DD/MM HH:mm"); // Trong cùng năm nhưng khác tuần
  } else {
      return date.format("HH:mm DD/MM/YYYY"); // Khác năm
  }
}