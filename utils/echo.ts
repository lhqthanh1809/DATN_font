
import Echo from "@ably/laravel-echo";
import * as Ably from "ably";
import { BaseHttpService } from "@/services/BaseHttpService";

global.Ably = Ably;


export const initializeEcho = async () => {
  const echo = new Echo({
    broadcaster: "ably",
    useTls: true,
    echoMessages: true,
    encrypted: true,
    requestTokenFn: async (channelName: string, existingToken: string) => {
      let postData = { channel_name: channelName, token: existingToken };
      const res = await new BaseHttpService().https({
        method: "POST",
        url: "/broadcasting/auth",
        authentication_requested: true,
        body: postData,
      });

      return res;
    },
  });
  return echo;
};
