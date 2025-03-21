import { constant } from "@/assets/constant";
import { reference } from "@/assets/reference";
import { cn } from "@/helper/helper";
import { useGeneral } from "@/hooks/useGeneral";
import { IFeedback } from "@/interfaces/FeedbackInterface";
import { IDataRealtime } from "@/interfaces/GeneralInterface";
import FeedbackService from "@/services/Feedback/FeedbackService";
import useFeedbackStore from "@/store/feedback/useFeedbackStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import { Building } from "@/ui/icon/general";
import { ChevronRight, Home2, Plus, PlusTiny } from "@/ui/icon/symbol";
import ViewHasButtonAdd from "@/ui/layout/ViewHasButtonAdd";
import SearchAndStatus from "@/ui/layout/SearchAndStatus";
import { initializeEcho } from "@/utils/echo";
import { Channel } from "@ably/laravel-echo";
import axios from "axios";
import { router, useFocusEffect } from "expo-router";
import { isArray } from "lodash";
import { Skeleton } from "moti/skeleton";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, Text } from "react-native";
import { View } from "react-native";

function ListFeedback() {
  const { user } = useGeneral();
  const { feedbacks, setFeedbacks, updateFeedback, removeFeedback } =
    useFeedbackStore();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [statusActive, setStatusActive] = useState<number | null>(null);
  const feedbackService = new FeedbackService();

  const statusRef = useRef(statusActive);

  const fetchFeedback = useCallback(
    async (cancelToken: any) => {
      setLoading(true);
      const data = await feedbackService.listFeedbackByUser(cancelToken, {
        status: statusActive,
      });
      if (isArray(data)) {
        setFeedbacks(data);
      }

      if (!cancelToken.reason) setLoading(false);
    },
    [user, user?.id, statusActive]
  );

  useFocusEffect(
    useCallback(() => {
      const source = axios.CancelToken.source();
      statusRef.current = statusActive;

      fetchFeedback(source.token);

      return () => {
        source.cancel("Hủy request do mất focus hoặc dữ liệu thay đổi");
      };
    }, [user, user?.id, statusActive])
  );

  useEffect(() => {
    let channel: Channel | null = null;
    const setupEcho = async () => {
      try {
        const echo = await initializeEcho();
        channel = echo.private(`feedback.user.${user?.id}`);
        channel.listen(".update", (data: IDataRealtime<IFeedback>) => {
          const { feedbacks, updateFeedback, removeFeedback } =
            useFeedbackStore.getState();
          if (!statusRef.current || data.data.status == statusRef.current) {
            updateFeedback(data.data);
            return;
          }

          const feedback = feedbacks.find((item) => item.id === data.data.id);
          if (feedback && feedback.status != data.data.status) {
            removeFeedback(feedback);
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    setupEcho();
    return () => {
      if (channel) {
        channel.stopListening(".update");
      }
    };
  }, [user, user?.id]);

  return (
    <ViewHasButtonAdd
      onPressAdd={() => router.push("/feedback/create")}
      className="gap-2 flex-1"
    >
      <SearchAndStatus
        dataObject={reference.feedback.status}
        onChangeSearch={(search) => setSearch(search)}
        onChangeStatus={(status) => setStatusActive(status)}
        placeHolder="Tìm kiếm phản hồi/đóng góp ý kiến..."
      />
      {loading ? (
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 76,
          }}
          className="flex-1 px-3 "
        >
          <View className="gap-2 w-full">
            {Array(3)
              .fill("")
              .map((_, index) => (
                <View
                  className="justify-between items-start px-4 py-3 gap-3 flex-row rounded-2xl bg-gray-100"
                  key={`skeleton-${index}`} // Key tối ưu hơn
                >
                  <View className="items-start gap-3 flex-1">
                    <Skeleton height={20} width="60%" colorMode="light" />
                    <View className="gap-2">
                      <Skeleton height={24} width="50%" colorMode="light" />
                      <Skeleton height={24} width="60%" colorMode="light" />
                    </View>
                    <Skeleton height={20} width="50%" colorMode="light" />
                  </View>
                  <View className="w-1/4">
                    <Skeleton height={24} width="100%" colorMode="light" />
                  </View>
                </View>
              ))}
          </View>
        </ScrollView>
      ) : feedbacks.length <= 0 ? (
        <View className="flex-1 items-center justify-center px-3 ">
          <Text className="font-BeVietnamRegular text-mineShaft-200">
            Không có kết quả
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 76,
          }}
          className="flex-1 px-3 "
        >
          <View className="gap-2 w-full h-full">
            {feedbacks.map((feedback, index) => {
              const status = feedbackService.getReferenceToStatus(
                feedback.status
              );
              return (
                <Button
                  key={index}
                  className="border-1 border-mineShaft-100 justify-between items-start px-4 py-3 gap-3"
                >
                  <View className="items-start gap-3">
                    <Text className="font-BeVietnamMedium">
                      {feedback.title}
                    </Text>
                    <View className="gap-2">
                      <View className="flex-row items-center gap-3">
                        <View>
                          <Icon icon={Home2} />
                        </View>
                        <Text className="font-BeVietnamRegular text-12">
                          Phòng {feedback.room?.room_code ?? "Không xác định"}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-3">
                        <View>
                          <Icon icon={Building} />
                        </View>
                        <Text className="font-BeVietnamRegular text-12">
                          {feedback.lodging?.name ?? "Không xác định"}
                        </Text>
                      </View>
                    </View>

                    <Button className="gap-1">
                      <Text className="font-BeVietnamRegular text-lime-600 text-12">
                        Xem chi tiết
                      </Text>
                      <Icon icon={ChevronRight} className="text-lime-600" />
                    </Button>
                  </View>
                  <View
                    className={cn(
                      "px-4 py-2 rounded-full",status.bg
                    )}
                  >
                    <Text
                      className={cn(
                        "font-BeVietnamRegular text-12",status.text
                      )}
                    >
                      {status?.name}
                    </Text>
                  </View>
                </Button>
              );
            })}
          </View>
        </ScrollView>
      )}
    </ViewHasButtonAdd>
  );
}

export default ListFeedback;
