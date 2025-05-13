import { constant } from "@/assets/constant";
import { formatTime } from "@/helper/helper";
import { IChatHistory } from "@/interfaces/ChatInterface";
import { IDataRealtime } from "@/interfaces/GeneralInterface";
import ChatService from "@/services/Chat/ChatService";
import useChannelsStore from "@/store/channel/useChannelsStore";
import useChatHistoriesStore from "@/store/chat/useChatHistoriesStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import { Chat, Chats } from "@/ui/icon/symbol";
import EmptyScreen from "@/ui/layouts/EmptyScreen";
import { initializeEcho } from "@/utils/echo";
import { Channel } from "@ably/laravel-echo";
import { Href, router, useFocusEffect } from "expo-router";
import { AnimatePresence, MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { useCallback, useEffect } from "react";
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

  const getLastMessage = useCallback((message: IChatHistory) => {
    const contentByStatus = {
      [constant.chat.status.send]: message.content.text,
      [constant.chat.status.deleted]: message.sender_id == memberId ? "Tin nhắn đã bị xoá" : message.content.text,
      [constant.chat.status.recall]: "Tin nhắn đã thu hồi",
    };

    return contentByStatus[message.status];
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchChannels({
        member_id: memberId,
        member_type: memberType,
      });
    }, [])
  );

  useEffect(() => {
    let channel: Channel | null = null;
    const setupEcho = async () => {
      try {
        const echo = await initializeEcho();
        channel = echo.channel(`${memberType}.${memberId}`);
        channel.listen(
          `.channels`,
          (payload: { data: IChatHistory; extra: any }) => {
            console.log("payload", payload);
            const foundChannel = channels.find(
              (item) => item.id == payload.data.channel_id
            );
            if (!foundChannel) return;

            if (payload.extra?.action == "update") {
              if (payload.data.id == foundChannel.latest_message?.id) {
                changeLastMessage(payload.data.channel_id, payload.data);
              }
            } else changeLastMessage(payload.data.channel_id, payload.data);
          }
        );
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

      {!loading && channels.length <= 0 ? (
        <EmptyScreen
          className="pb-16"
          icon={Chat}
          description="Hãy thử thay đổi bộ lọc hoặc kiểm tra lại kết nối mạng."
          title="Không có kênh nào hiển thị"
        />
      ) : (
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
                {channels.map((channel) => {
                  const title = `Phòng ${channel.room?.room_code} ${
                    memberType !== constant.object.type.lodging
                      ? `- ${channel.room?.lodging?.type?.name} ${channel.room?.lodging?.name}`
                      : ""
                  }`;
                  return (
                    <MotiView
                      key={channel.id}
                      from={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        type: "spring",
                        damping: 15,
                        stiffness: 100,
                      }}
                    >
                      <Button
                        onPress={() => {
                          useChatHistoriesStore.setState({
                            title,
                          });

                          router.push(
                            `chat/${channel.id}?member_id=${memberId}&member_type=${memberType}` as Href
                          );
                        }}
                        className="w-full bg-white-50 rounded-xl p-4 border-1 shadow-soft-sx border-white-100"
                      >
                        <View className="bg-lime-100 p-1.5 rounded-full border-1 border-lime-400">
                          <Icon icon={Chats} className="text-lime-400" />
                        </View>
                        <View className="flex-1 gap-1">
                          <View className="flex-row justify-between items-center gap-4">
                            <Text
                              numberOfLines={1}
                              className="font-BeVietnamSemiBold flex-1"
                            >
                              {title}
                            </Text>
                            <Text className="font-BeVietnamRegular text-12 text-white-700">
                              {formatTime(
                                channel.latest_message?.created_at ??
                                  channel.joined_at ??
                                  channel.created_at
                              )}
                            </Text>
                          </View>

                          <View className="flex-row items-center justify-between gap-4">
                            <View className="flex-1">
                              {channel.latest_message ? (
                                <Text
                                  numberOfLines={1}
                                  className="font-BeVietnamMedium text-12 text-white-700 truncate"
                                >
                                  {channel.latest_message?.sender_id == memberId
                                    ? "Bạn"
                                    : ChatService.getNameSender(
                                        channel.latest_message
                                      )}
                                  :{" "}
                                  <Text
                                    numberOfLines={1}
                                    className="truncate font-BeVietnamRegular text-white-700"
                                  >
                                    {getLastMessage(channel.latest_message)}
                                  </Text>
                                </Text>
                              ) : (
                                <Text
                                  numberOfLines={1}
                                  className="font-BeVietnamMedium text-12 truncate"
                                >
                                  <Text className="font-BeVietnamRegular">
                                    Hãy bắt đầu cuộc trò chuyện
                                  </Text>
                                </Text>
                              )}
                            </View>

                            {!channel.is_read && (
                              <View className="w-2 h-2 rounded-full bg-lime-400" />
                            )}
                          </View>
                        </View>
                      </Button>
                    </MotiView>
                  );
                })}
              </AnimatePresence>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default ListChannels;
