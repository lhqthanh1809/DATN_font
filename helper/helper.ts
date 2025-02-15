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

