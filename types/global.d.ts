import * as Ably from "ably";
import Echo from "@ably/laravel-echo";

declare global {
  var Ably: typeof Ably;
}