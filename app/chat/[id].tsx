import { cn, formatTime } from "@/helper/helper";
import { IChatHistory } from "@/interfaces/ChatInterface";
import { IDataRealtime } from "@/interfaces/GeneralInterface";
import ChatService from "@/services/Chat/ChatService";
import useChannelsStore from "@/store/channel/useChannelsStore";
import useChatHistoriesStore from "@/store/chat/useChatHistoriesStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import {
  ArrowRightSquare,
  ChevronLeft,
  PaperPlane,
  Trash,
} from "@/ui/icon/symbol";
import Input from "@/ui/Input";
import HeaderBack from "@/ui/components/HeaderBack";
import LoadingAnimation from "@/ui/LoadingAnimation";
import TextArea from "@/ui/Textarea";
import { initializeEcho } from "@/utils/echo";
import { Channel } from "@ably/laravel-echo";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { Skeleton } from "moti/skeleton";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  Image,
  InteractionManager,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text, View, ScrollView } from "react-native";
import ChannelService from "@/services/Channel/ChannelService";
import { SvgUri } from "react-native-svg";
import { createScrollHandler } from "@/utils/scrollHandle";
import { BlurView } from "expo-blur";
import { useUI } from "@/hooks/useUI";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { update } from "lodash";
import { constant } from "@/assets/constant";
import useToastStore from "@/store/toast/useToastStore";

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
    title,
  } = useChatHistoriesStore();
  const { changeLastMessage } = useChannelsStore();

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

  const handleLeaveChannel = useCallback(async () => {
    await new ChannelService().leaveChannel({
      channel_id: id as string,
      member_id: member_id as string,
      member_type: member_type as string,
    });
    router.back();
  }, [id, member_id, member_type]);

  useEffect(() => {
    let channel: Channel | null = null;
    const setupEcho = async () => {
      try {
        const echo = await initializeEcho();
        channel = echo.private(`chat.${id}`);
        channel.listen(`.new`, (payload: IDataRealtime<IChatHistory>) => {
          changeLastMessage(payload.data.channel_id, payload.data);
          if (payload.data.sender_id != member_id) {
            updateMessages(payload.data);
          }
        });
        channel.listen(".update", (payload: IDataRealtime<IChatHistory>) => {
          const messages = useChatHistoriesStore.getState().messages;
          const foundMessage = messages.find(
            (item) => item.id == payload.data.id
          );
          if (foundMessage) {
            updateMessages(payload.data);
          }

          if (messages[messages.length - 1].id == payload.data.id) {
            changeLastMessage(payload.data.channel_id, payload.data);
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    setupEcho();
    return () => {
      if (channel) {
        channel.stopListening(`.new`);
        channel.stopListening(".update");
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
      <View className="px-4 bg-white-50 py-3 flex-row items-center gap-1 border-b-1 border-mineShaft-100">
        <Button
          onPress={() => {
            handleLeaveChannel();
          }}
          className="flex items-center justify-center p-1 rounded-full "
        >
          <Icon icon={ChevronLeft} className="text-mineShaft-950" />
        </Button>
        <Text className="font-BeVietnamSemiBold text-14 text-mineShaft-950 w-full">
          {title}
        </Text>
      </View>
      {/* Header - End */}

      {/* Content - Begin */}

      <View className="flex-1">
        {loading ? (
          <ScreenMessageLoad />
        ) : messages.length > 0 ? (
          <ScreenMessage
            memberId={member_id as string}
            messages={messages}
            memberType={member_type as string}
          />
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
      <SvgUri
        uri={
          "https://qqmdkbculairrumaowaj.supabase.co/storage/v1/object/public/lodging_management/asset/empy_mess.svg"
        }
      />
    </Button>
  );
};

const ScreenMessage: React.FC<{
  messages: IChatHistory[];
  memberId: string;
  memberType: string;
}> = ({ messages, memberId, memberType }) => {
  const { loadMore, hasMore, loadingMore } = useChatHistoriesStore();
  const { showModal } = useUI();
  const messageRefs = useRef(new Map());
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  const showModalMessage = useCallback(
    (message: IChatHistory) => {
      const messageRef = messageRefs.current.get(message.id);
      if (messageRef) {
        InteractionManager.runAfterInteractions(() => {
          messageRef.measureInWindow(
            (x: number, y: number, width: number, height: number) => {
              showModal(
                <ModalMessage
                  message={message}
                  y={y}
                  memberId={memberId}
                  memberType={memberType}
                />
              );
            }
          );
        });
      }
    },
    [showModal, memberId, memberType]
  );

  return (
    <ScrollView
      ref={scrollViewRef}
      className="px-3"
      style={{ transform: [{ scaleY: -1 }] }}
      contentContainerStyle={{ paddingBottom: 12 }}
      onScroll={(event) => {
        setScrollOffset(event.nativeEvent.contentOffset.y);
        createScrollHandler({
          callback: () => loadMore(),
          hasMore,
          loading: loadingMore,
          threshold: 50,
        })(event);
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
              {(isMe && message.status != constant.chat.status.deleted) ||
              !isMe ? (
                <>
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
                    {!isMe &&
                      (!next || next.sender_id !== message.sender_id) && (
                        <Text className="font-BeVietnamRegular text-12 pl-6 pt-2">
                          {ChatService.getNameSender(message)}
                        </Text>
                      )}
                    <Button
                      onLongPress={() =>
                        isMe &&
                        message.status == constant.chat.status.send &&
                        showModalMessage(message)
                      }
                      ref={(ref) => {
                        if (ref) messageRefs.current.set(message.id, ref);
                      }}
                      className={cn(
                        "py-4 px-6 rounded-3xl max-w-[80%]",
                        // Màu nền tin nhắn tùy thuộc vào người gửi
                        isMe ? "bg-lime-200" : "bg-white-100",

                        // Màu khi tin nhắn bị thu hồi/xoá,
                        message.status == constant.chat.status.recall &&
                          "bg-white-50 border-1 border-mineShaft-100",

                        // Nếu tin nhắn tiếp theo cùng người gửi và không hiển thị thời gian
                        next &&
                          nextSameSender &&
                          !showTimeNext &&
                          (isMe ? "rounded-tr-lg" : "rounded-tl-lg"),

                        // Nếu tin nhắn trước cùng người gửi và không hiển thị thời gian
                        prev &&
                          prevSameSender &&
                          !showTimePrev &&
                          (isMe ? "rounded-br-lg" : "rounded-bl-lg")
                      )}
                    >
                      <Text
                        className={cn(
                          "font-BeVietnamRegular ",
                          message.status == constant.chat.status.recall
                            ? "text-mineShaft-700"
                            : "text-mineShaft-950"
                        )}
                      >
                        {message.status == constant.chat.status.recall
                          ? `${
                              isMe
                                ? "Bạn"
                                : ChatService.getNameSender(message, true)
                            } đã thu hồi tin nhắn`
                          : message.content.text}
                      </Text>
                    </Button>
                  </View>
                </>
              ) : null}
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
        width: "55%",
        hasName: true,
      },
      {
        type: "other",
        width: "80%",
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

const ModalMessage: React.FC<{
  message: IChatHistory;
  y: number;
  memberId: string;
  memberType: string;
}> = ({ message, y, memberId, memberType }) => {
  const insets = useSafeAreaInsets();
  const { addToast } = useToastStore();
  const screenHeight = Dimensions.get("window").height;
  const modalRef = useRef<View>(null);
  const [modalHeight, setModalHeight] = useState(0);
  const { updateMessages } = useChatHistoriesStore();
  const { hideModal } = useUI();

  const updateStatus = useCallback(
    async (status: number) => {
      try {
        const result = await new ChatService().updateStatusChat({
          chat_id: message.id,
          status: status,
          member_id: memberId,
          member_type: memberType,
        });

        if ("message" in result) throw new Error(result.message);

        updateMessages(result);

        hideModal();
      } catch (error: any) {
        addToast(
          constant.toast.type.error,
          error.message || "Có lỗi xảy ra, vui lòng thử lại sau"
        );
      }
    },
    [memberId, memberType]
  );

  // Đo chiều cao modal khi render
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.measure((_, __, ___, height) => {
        setModalHeight(height);
      });
    }
  }, []);

  // Giới hạn vị trí top để modal không vượt quá đáy màn hình
  const adjustedTop = Math.min(
    y + insets.top - 20,
    screenHeight - modalHeight - insets.bottom - 20 // Đảm bảo modal không chạm đáy
  );

  return (
    <View className="w-screen h-screen">
      <BlurView className="absolute w-full h-full" intensity={60} tint="dark" />
      <View
        ref={modalRef}
        className="w-full px-3 items-end gap-2 absolute"
        style={{ top: adjustedTop }}
      >
        <Button className={cn("py-4 px-6 rounded-3xl max-w-[80%] bg-lime-200")}>
          <Text className="font-BeVietnamRegular text-mineShaft-950">
            {message.content.text}
          </Text>
        </Button>
        <View className="bg-white-50 rounded-2xl flex-row px-7 py-3 gap-7">
          <Button
            className="flex-col items-center gap-1"
            onPress={() => updateStatus(constant.chat.status.recall)}
          >
            <Icon icon={ArrowRightSquare} className="text-yellow-400" />
            <Text className="font-BeVietnamRegular">Thu hồi</Text>
          </Button>
          <Button
            className="flex-col items-center gap-1"
            onPress={() => updateStatus(constant.chat.status.deleted)}
          >
            <Icon icon={Trash} className="text-red-600" />
            <Text className="font-BeVietnamRegular">Xoá</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Chat;
