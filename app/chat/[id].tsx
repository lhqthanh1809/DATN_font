import { cn, formatTime } from "@/helper/helper";
import { IChatHistory } from "@/interfaces/ChatInterface";
import { IDataRealtime } from "@/interfaces/GeneralInterface";
import ChatService from "@/services/Chat/ChatService";
import useChannelsStore from "@/store/channel/useChannelsStore";
import useChatHistoriesStore from "@/store/chat/useChatHistoriesStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import { ChevronLeft, PaperPlane } from "@/ui/icon/symbol";
import Input from "@/ui/Input";
import HeaderBack from "@/ui/components/HeaderBack";
import LoadingAnimation from "@/ui/LoadingAnimation";
import TextArea from "@/ui/Textarea";
import { initializeEcho } from "@/utils/echo";
import { Channel } from "@ably/laravel-echo";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { Skeleton } from "moti/skeleton";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Image, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { Text, View, ScrollView } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { string } from "yup";

function Chat() {
  const { id, member_id, member_type } = useLocalSearchParams();
  const {
    messages,
    fetchChatHistories,
    loadMore,
    hasMore,
    loading,
    loadingMore,
    createChat,
    updateMessages,
  } = useChatHistoriesStore();
  const {changeLastMessage} = useChannelsStore()

  const [mess, setMess] = useState("");

  const handleSendMessage = useCallback(() => {
    setMess("");
    createChat({
      channel_id: id as string,
      member_id: member_id as string,
      member_type: member_type as string,
      message: mess,
    });
  }, [id, mess, member_id, member_type]);

  useEffect(() => {
    let channel: Channel | null = null;
    const setupEcho = async () => {
      try {
        const echo = await initializeEcho();
        channel = echo.private(`chat.${id}`);
        channel.listen(
          `.chat.new-${id}`,
          (data: IDataRealtime<IChatHistory>) => {
            changeLastMessage(data.data.channel_id, data.data);
            if (data.data.sender_id != member_id) {
              updateMessages(data.data);
            }
          }
        );
      } catch (error) {
        console.error(error);
      }
    };

    setupEcho();
    return () => {
      if (channel) {
        channel.stopListening(`.chat.new-${id}`);
      }
    };
  }, [id, member_id, member_type]);

  useEffect(() => {
    fetchChatHistories({
      channel_id: id as string,
      member_id: member_id as string,
      member_type: member_type as string,
    });
  }, [id, member_id, member_type]);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white-50"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 18 : 0}
    >
      {/* Header - Begin */}
      <View className="px-4 bg-white-50 py-2 flex-row items-center gap-1 border-b-1 border-mineShaft-100">
        <Button
          onPress={() => {
            router.back();
          }}
          className="flex items-center justify-center p-1 rounded-full "
        >
          <Icon icon={ChevronLeft} className="text-mineShaft-950" />
        </Button>
        <Text className="font-BeVietnamSemiBold text-14 text-mineShaft-950 w-full">
          Phòng D003 - Chung cư mini Vườn Mây
        </Text>
      </View>
      {/* Header - End */}

      {/* Content - Begin */}

      <View className="flex-1">
        {loading ? (
          <ScreenMessageLoad />
        ) : messages.length > 0 ? (
          <ScreenMessage memberId={member_id as string} messages={messages} />
        ) : (
          <EmptyMessage />
        )}
      </View>
      {/* Content - End */}

      <View className="p-3 max-h-36 flex-row gap-1 items-start min-h-4">
        <TextArea
          className="max-h-full pt-1 pb-2.5"
          // classNameInput="min-h-4"
          value={mess}
          onChange={(text) => setMess(text)}
          placeHolder="Nhập tin nhắn ..."
        />
        <Button
          onPress={handleSendMessage}
          className="p-2 rounded-xl bg-lime-400"
        >
          <Icon icon={PaperPlane} className="text-lime-100" />
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const EmptyMessage = () => {
  return (
    <Button
      onPress={() => {
        Keyboard.dismiss();
      }}
      className="flex-1 items-center justify-center flex-col gap-0"
    >
      <Image
        source={require("@/assets/images/start-chat.png")}
        className="max-w-full max-h-full object-contain"
        resizeMode="contain"
        style={{
          height: "70%",
        }}
      />
      <Text className="font-BeVietnamMedium text-16 text-mineShaft-950 text-center -translate-y-6">
        Hãy bắt đầu cuộc trò chuyện
      </Text>
    </Button>
  );
};

const ScreenMessage: React.FC<{
  messages: IChatHistory[];
  memberId: string;
}> = ({ messages, memberId }) => {
  const { loadMore, hasMore, loadingMore } = useChatHistoriesStore();
  return (
    <>
      <ScrollView
        className="px-3"
        style={{ transform: [{ scaleY: -1 }] }}
        contentContainerStyle={{
          paddingBottom: 12,
        }}
        onScroll={({ nativeEvent }) => {
          if (nativeEvent.contentOffset.y <= 50 && hasMore && !loadingMore) {
            loadMore();
          }
        }}
        scrollEventThrottle={16}
      >
        <Button className="gap-2 flex-col">
          {messages.map((message, index) => {
            const prev = messages[index - 1];
            const next = messages[index + 1];
            const isMe = message.sender_id === memberId;
            const prevSameSender = prev?.sender_id === message.sender_id;
            const nextSameSender = next?.sender_id === message.sender_id;

            const isLastMessage = !next && !hasMore;
            const isTimeGap =
              next &&
              moment(message.created_at).diff(
                moment(next.created_at),
                "minutes"
              ) > 10;
            const showTimeNext = isLastMessage || isTimeGap;

            const showTimePrev =
              !prev ||
              moment(prev.created_at).diff(
                moment(message.created_at),
                "minutes"
              ) > 10;

            return (
              <View
                key={message.id}
                className="w-full"
                style={{ transform: [{ scaleY: -1 }] }}
              >
                {showTimeNext && (
                  <View className="mb-2 w-full items-center">
                    <Text className="font-BeVietnamRegular text-gray-500">
                      {formatTime(message.created_at)}
                    </Text>
                  </View>
                )}
                <View
                  className={`flex-col items-start gap-1 ${
                    isMe ? "self-end" : "self-start"
                  }`}
                >
                  {/* Hiển thị tên người gửi nếu là "other" và khác sender trước đó */}
                  {!isMe && (!next || next.sender_id !== message.sender_id) && (
                    <Text className="font-BeVietnamRegular text-12 pl-6 pt-2">
                      {ChatService.getNameSender(message)}
                    </Text>
                  )}

                  <Button
                    className={cn(
                      "py-4 px-6 rounded-3xl max-w-[90%]",
                      isMe ? "bg-lime-200" : "bg-white-100",
                      next && nextSameSender && !showTimeNext
                        ? isMe
                          ? "rounded-tr-lg"
                          : "rounded-tl-lg"
                        : "",
                      prev && prevSameSender && !showTimePrev
                        ? isMe
                          ? "rounded-br-lg"
                          : "rounded-bl-lg"
                        : ""
                    )}
                  >
                    <Text className="font-BeVietnamRegular text-mineShaft-950">
                      {message.content.text}
                    </Text>
                  </Button>
                </View>
              </View>
            );
          })}
        </Button>
        {loadingMore && (
          <View className="py-2">
            <LoadingAnimation />
          </View>
        )}
      </ScrollView>
    </>
  );
};

const ScreenMessageLoad = () => {
  const skeletonMessages = useMemo(() => {
    return [
      {
        type: "me", // hoặc "other"
        width: "70%",
        hasName: false,
      },
      {
        type: "other",
        width: "80%",
        hasName: true,
      },
      {
        type: "me",
        width: "60%",
        hasName: false,
      },
      {
        type: "other",
        width: "85%",
        hasName: true,
      },
      {
        type: "other",
        width: "90%",
        hasName: true,
      },
    ];
  }, []);

  return (
    <ScrollView
      className="px-3"
      style={{ transform: [{ scaleY: -1 }] }}
      contentContainerStyle={{
        paddingBottom: 12,
      }}
    >
      <View
        className="gap-4 flex-col-reverse"
        style={{ transform: [{ scaleY: -1 }] }}
      >
        {skeletonMessages.map((item, index) => (
          <View
            key={index}
            className={`flex-col items-start gap-1 ${
              item.type === "me" ? "self-end" : "self-start"
            }`}
            style={{
              width: item.width as any,
            }}
          >
            {/* Nếu là tin nhắn của người khác, hiển thị skeleton tên */}
            {item.hasName && (
              <Skeleton
                colorMode="light"
                height={20}
                width={100}
                radius="round"
              />
            )}

            {/* Skeleton message bubble */}
            <Skeleton
              colorMode="light"
              height={40}
              width={"100%"}
              radius="round"
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Chat;
