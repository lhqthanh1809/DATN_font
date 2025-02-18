import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Constants from "expo-constants";
import CryptoJS from "crypto-js";

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
  if(!value) return ""
  const indexLastComma = value.lastIndexOf(",")
  if(indexLastComma == -1) return new Intl.NumberFormat("vi-VN").format(Number(value));

  const fontPart = value.slice(0, indexLastComma).replaceAll(",", "")
  const backPart = value.slice(indexLastComma + 1, value.length )
  return `${new Intl.NumberFormat("vi-VN").format(Number(fontPart))},${backPart}`
};
