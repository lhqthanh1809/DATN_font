import { constant } from "@/assets/constant";
import { formatTime } from "@/helper/helper";
import { IChatHistory } from "@/interfaces/ChatInterface";
import { IDataRealtime } from "@/interfaces/GeneralInterface";
import ChatService from "@/services/Chat/ChatService";
import useChannelsStore from "@/store/channel/useChannelsStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import { Chats } from "@/ui/icon/symbol";
import { initializeEcho } from "@/utils/echo";
import { Channel } from "@ably/laravel-echo";
import { Href, router } from "expo-router";
import { AnimatePresence, MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";

const ListChannels: React.FC<{
  hasTitle?: boolean;
  memberId: string;
  memberType: (typeof constant.object.type)[keyof typeof constant.object.type];
}> = ({ memberId, memberType, hasTitle }) => {
  const {
    channels,
    fetchChannels,
    loadingMore,
    loadMore,
    loading,
    changeLastMessage,
  } = useChannelsStore();

  useEffect(() => {
    fetchChannels({
      member_id: memberId,
      member_type: memberType,
    });
  }, []);

  useEffect(() => {
    let channel: Channel | null = null;
    const setupEcho = async () => {
      try {
        const echo = await initializeEcho();
        channel = echo.channel(`${memberType}.${memberId}`);
        channel.listen(`.channels`, (data: IDataRealtime<IChatHistory>) => {
          changeLastMessage(data.data.channel_id, data.data);
        });
      } catch (error) {
        console.error(error);
      }
    };

    setupEcho();
    return () => {
      if (channel) {
        channel.stopListening(`.channels`);
      }
    };
  }, [memberId, memberType]);

  return (
    <View className="flex-1">
      {hasTitle && (
        <Text className="font-BeVietnamBold text-20 text-mineShaft-950 px-3 pb-5 pt-3">
          Trò chuyện
        </Text>
      )}
      <ScrollView
        className="fle-1 px-3"
        contentContainerStyle={{
          paddingBottom: 76,
        }}
      >
        <View className="flex-1 gap-3">
          {loading ? (
            [...Array(7)].map((_, index) => (
              <Button
                key={index}
                className="w-full bg-white-100 rounded-xl px-4 py-5 flex-col items-start gap-2"
              >
                <View className="flex-row justify-between items-center w-full">
                  <View className="flex-1">
                    <Skeleton colorMode="light" width={"90%"} height={26} />
                  </View>

                  <Skeleton colorMode="light" width={40} height={26} />
                </View>

                <Skeleton colorMode="light" width={"90%"} height={22} />
              </Button>
            ))
          ) : (
            <AnimatePresence>
              {channels.map((channel) => (
                <MotiView
                  key={channel.id}
                  from={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", damping: 15, stiffness: 100 }}
                >
                  <Button
                    onPress={() =>
                      router.push(
                        `chat/${channel.id}?member_id=${memberId}&member_type=${memberType}` as Href
                      )
                    }
                    className="w-full bg-white-50 rounded-xl p-3 py-5 border-1 shadow-soft-md border-white-100 gap-3"
                  >
                    <View className="bg-mineShaft-50 p-3 rounded-full">
                      <Icon icon={Chats} className="text-lime-400" />
                    </View>
                    <View className="flex-1 pr-1">
                      <View className="flex-row justify-between items-center gap-4 flex-1">
                        <Text
                          numberOfLines={1}
                          className="font-BeVietnamSemiBold flex-1"
                        >
                          Phòng {channel.room?.room_code}{" "}
                          {memberType !== constant.object.type.lodging &&
                            `- ${channel.room?.lodging?.type?.name} ${channel.room?.lodging?.name}`}
                        </Text>
                        <Text className="font-BeVietnamRegular text-12">
                          {formatTime(
                            channel.latest_message?.created_at ??
                              channel.joined_at ??
                              channel.created_at
                          )}
                        </Text>
                      </View>

                      {channel.latest_message ? (
                        <Text
                          numberOfLines={1}
                          className="font-BeVietnamMedium text-12"
                        >
                          {channel.latest_message?.sender_id == memberId
                            ? "Bạn"
                            : ChatService.getNameSender(channel.latest_message)}
                          :{" "}
                          <Text className="font-BeVietnamRegular">
                            {channel.latest_message?.content.text}
                          </Text>
                        </Text>
                      ) : (
                        <Text
                          numberOfLines={1}
                          className="font-BeVietnamMedium text-12"
                        >
                          <Text className="font-BeVietnamRegular">
                            Hãy bắt đầu cuộc trò chuyện
                          </Text>
                        </Text>
                      )}
                    </View>
                  </Button>
                </MotiView>
              ))}
            </AnimatePresence>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ListChannels;
