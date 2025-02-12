import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Constants from "expo-constants";
import CryptoJS from "crypto-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function encrypt(data: string) {
  const key = CryptoJS.enc.Base64.parse(constant("AES_KEY"));
  const iv = CryptoJS.enc.Base64.parse(constant("AES_IV"));

  const encrypt = CryptoJS.AES.encrypt(data, key, { iv: iv });
  return CryptoJS.enc.Base64.stringify(encrypt.ciphertext);
}

export function constant(data: string) {
  return Constants.expoConfig?.extra?.[data];
}
