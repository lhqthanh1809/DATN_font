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
import { ChevronRight, Home2, Notification, Plus, PlusTiny } from "@/ui/icon/symbol";
import ViewHasButtonAdd from "@/ui/layouts/ViewHasButtonAdd";
import SearchAndSegmentedControl from "@/ui/components/SearchAndSearchAndSegmentedControl";
import { initializeEcho } from "@/utils/echo";
import { Channel } from "@ably/laravel-echo";
import axios from "axios";
import { router, useFocusEffect } from "expo-router";
import { Skeleton } from "moti/skeleton";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, Text } from "react-native";
import { View } from "react-native";
import { createScrollHandler } from "@/utils/scrollHandle";
import LoadingAnimation from "@/ui/LoadingAnimation";
import EmptyScreen from "@/ui/layouts/EmptyScreen";

function ListFeedback() {
  const { user } = useGeneral();
  const { feedbacks, setFeedbacks, updateFeedback, removeFeedback } =
    useFeedbackStore();

  const limit = constant.limit;

  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [statusActive, setStatusActive] = useState<number | null>(null);
  const feedbackService = new FeedbackService();

  const [sourceAxios, setSourceAxios] = useState(axios.CancelToken.source());
  const statusRef = useRef(statusActive);
  const searchRef = useRef(search);

  // Fetch feedback data from the server
  const fetchFeedback = useCallback(
    async (cancelToken: any, loadMore = false) => {
      // Calculate the new offset for pagination
      const offsetNew = loadMore ? offset + limit : 0;

      // Prevent further loading if there are no more items
      if (loadMore && !hasMore) {
        return;
      }


      // Reset offset if not loading more
      loadMore ? setLoadingMore(true) : setLoading(true);

      try {
        // Fetch feedback data from the service
        const result = await feedbackService.list(
          {
            status: statusActive, // Filter by active status
            scope: "user", // Scope limited to user feedback
            search, // Search query
            limit, // Limit per page
            offset: offsetNew, // Offset for pagination
          },
          cancelToken // Cancel token for request cancellation
        );

        // Handle invalid data or cancelled requests
        if ("message" in result || cancelToken.reason) {
          return;
        }

        setFeedbacks(loadMore ? [...feedbacks, ...result.data] : result.data);

        setOffset(offsetNew); // Update the offset for next request
        // Update the state to indicate if more items are available
        setHasMore(result.total > offsetNew + result.data.length); // Check if the returned data length matches the limit
      } finally {
        // Reset offset if not loading more
        loadMore ? setLoadingMore(false) : setLoading(false);
      }
    },
    [user?.id, statusActive, search, offset, feedbacks, hasMore] // Dependencies for the callback
  );

  useFocusEffect(
    useCallback(() => {
      const source = axios.CancelToken.source();
      setSourceAxios(source);
      statusRef.current = statusActive;

      fetchFeedback(source.token);

      return () => {
        source.cancel("Hủy request do mất focus hoặc dữ liệu thay đổi");
      };
    }, [user, user?.id, statusActive])
  );

  useEffect(() => {
    searchRef.current = search;
    const delayDebounce = setTimeout(() => {
      fetchFeedback(sourceAxios.token);
    }, 100);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  useEffect(() => {
    let channel: Channel | null = null;
    const setupEcho = async () => {
      try {
        const echo = await initializeEcho();
        channel = echo.private(`feedback.user.${user?.id}`);
        channel.listen(".update", (payload: IDataRealtime<IFeedback>) => {
          const { feedbacks, updateFeedback, removeFeedback } =
            useFeedbackStore.getState();
          if (
            (!statusRef.current || payload.data.status == statusRef.current) &&
            (!searchRef.current ||
              payload.data.title.includes(searchRef.current))
          ) {
            updateFeedback(payload.data);
            return;
          }

          const feedback = feedbacks.find(
            (item) => item.id === payload.data.id
          );
          if (feedback && feedback.status != payload.data.status) {
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
      <SearchAndSegmentedControl
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
        <EmptyScreen description="Hãy thử thay đổi bộ lọc hoặc kiểm tra lại kết nối mạng." icon={Notification} title="Không tìm thấy góp ý phù hợp"/>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 76,
          }}
          onScroll={createScrollHandler({
            callback: () => fetchFeedback(sourceAxios.token, true),
            hasMore,
            loading: loadingMore,
            threshold: 20,
          })}
          scrollEventThrottle={16}
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
                  onPress={() => router.push(`/feedback/detail/${feedback.id}`)}
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
                  <View className={cn("px-4 py-2 rounded-full", status.bg)}>
                    <Text
                      className={cn(
                        "font-BeVietnamRegular text-12",
                        status.text
                      )}
                    >
                      {status?.name}
                    </Text>
                  </View>
                </Button>
              );
            })}
          </View>

          {loadingMore && (
            <View>
              <LoadingAnimation />
            </View>
          )}
        </ScrollView>
      )}
    </ViewHasButtonAdd>
  );
}

export default ListFeedback;
