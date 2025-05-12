import { constant } from "@/assets/constant";
import { cn, getTimeAgo } from "@/helper/helper";
import { IDataRealtime } from "@/interfaces/GeneralInterface";
import { INotification } from "@/interfaces/NotificationInterface";
import NotificationService from "@/services/Notification/NotificationService";
import useNotificationStore from "@/store/notification/useNotificationStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import { Bell } from "@/ui/icon/symbol";
import { initializeEcho } from "@/utils/echo";
import { Channel } from "@ably/laravel-echo";
import { Href, router, useFocusEffect } from "expo-router";
import { Skeleton } from "moti/skeleton";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import LoadingAnimation from "../LoadingAnimation";
import { createScrollHandler } from "@/utils/scrollHandle";

const ListNotify: React.FC<{
  id: string;
  type: string;
  hasTitle?: boolean;
}> = ({ id, type, hasTitle = false }) => {
  const {
    addNotification,
    notifications,
    fetchNotifications,
    newNotifies,
    todayNotifies,
    oldNotifies,
    yesterdayNotifies,
    loading,
    loadingMore,
    hasMore,
  } = useNotificationStore();

  useEffect(() => {
    let channel: Channel | null = null;
    const setupEcho = async () => {
      try {
        const echo = await initializeEcho();
        channel = echo.private(`notification.${type}.${id}`);
        channel.listen(".new", (data: IDataRealtime<INotification>) => {
          addNotification(data.data);
        });
      } catch (error) {
        console.error(error);
      }
    };

    setupEcho();
    fetchNotifications(id, type);

    return () => {
      if (channel) {
        channel.stopListening(".new");
      }
    };
  }, [id, type]);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications(id, type);
    }, [id, type])
  );

  return (
    <>
      {notifications.length <= 0 && !loading ? (
        <ViewNotifyEmpty />
      ) : (
        <View className="flex-1">
          {hasTitle && (
            <Text className="font-BeVietnamBold text-20 text-mineShaft-950 px-3 pb-5 pt-3">
              Thông báo
            </Text>
          )}

          <ScrollView
            contentContainerStyle={{
              paddingBottom: 76,
            }}
            onScroll={createScrollHandler({
              callback: () => {
                !loading && fetchNotifications(id, type, true);
              },
              hasMore,
              loading: loadingMore,
              threshold: 20,
            })}
            scrollEventThrottle={20}
            className="flex-1"
          >
            <View className="flex-1 gap-3 px-3">
              {loading ? (
                <View className="gap-2">
                  <Skeleton colorMode="light" height={24} width={"40%"} />
                  <View className="gap-1">
                    {Array(4)
                      .fill("")
                      .map((_, index) => (
                        <Button
                          key={index}
                          className={cn(
                            "rounded-lg p-3 bg-white-100 gap-2 flex-col items-start"
                          )}
                        >
                          <Skeleton
                            colorMode="light"
                            height={24}
                            width={"50%"}
                          />
                          <View className="gap-1">
                            <Skeleton
                              colorMode="light"
                              height={20}
                              width={"100%"}
                            />
                            <Skeleton
                              colorMode="light"
                              height={20}
                              width={"40%"}
                            />
                          </View>
                          <Skeleton
                            colorMode="light"
                            height={20}
                            width={"20%"}
                          />
                        </Button>
                      ))}
                  </View>
                </View>
              ) : (
                <>
                  {newNotifies.length > 0 && (
                    <NotificationBox items={newNotifies} title="Mới nhất" />
                  )}

                  {todayNotifies.length > 0 && (
                    <NotificationBox items={todayNotifies} title="Hôm nay" />
                  )}

                  {yesterdayNotifies.length > 0 && (
                    <NotificationBox
                      items={yesterdayNotifies}
                      title="Hôm qua"
                    />
                  )}

                  {oldNotifies.length > 0 && (
                    <NotificationBox items={oldNotifies} title="Trước đó" />
                  )}
                </>
              )}
            </View>

            {loadingMore && (
              <View className="py-2">
                <LoadingAnimation />
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </>
  );
};

function ViewNotifyEmpty() {
  return (
    <View
      className="flex-1 items-center justify-center"
      style={{
        paddingBottom: 76,
      }}
    >
      <View className="items-center gap-11">
        <View className="p-6 bg-white-50 rounded-full shadow-md shadow-black/10">
          <View className="p-11 rounded-full bg-mineShaft-50 border-4 border-mineShaft-100">
            <View className="p-9 bg-white-50 rounded-full shadow-md shadow-black/10">
              <View className="bg-mineShaft-950 p-4 rounded-full">
                <Icon icon={Bell} strokeWidth={2} />
              </View>
            </View>
          </View>
        </View>
        <View className="items-center gap-2 px-8">
          <Text className="font-BeVietnamBold text-18 text-mineShaft-900">
            Không có thông báo nào
          </Text>
          <Text className="font-BeVietnamRegular text-16 text-center text-mineShaft-400">
            Thông báo sẽ xuất hiện trên trang này
          </Text>
        </View>
      </View>
    </View>
  );
}

function NotificationBox({
  items,
  title,
}: {
  items: INotification[];
  title: string;
}) {
  const handlePush = useCallback((item: INotification) => {
    if (!item.is_seen) new NotificationService().toggleRead(item.id);

    router.push(item.url as Href);
  }, []);
  return (
    <View className="gap-2">
      <Text className="text-14 font-BeVietnamMedium text-mineShaft-950">
        {title}
      </Text>
      <View className="gap-2">
        {items.map((item) => (
          <NotificationItem
            onPress={() => handlePush(item)}
            item={item}
            key={item.id}
          />
        ))}
      </View>
    </View>
  );
}

function NotificationItem({
  item,
  onPress,
}: {
  item: INotification;
  onPress: () => void;
}) {
  return (
    <Button
      className={cn(
        "border-1 rounded-2xl p-4 border-white-100 items-start justify-between",
        !item.is_seen && "border-l-4 border-lime-400"
      )}
      onPress={onPress}
    >
      <View className="gap-4 flex-1">
        <View
          className="
      gap-1"
        >
          <Text
            style={{
              fontSize: 16,
            }}
            numberOfLines={1}
            className={cn(
              "truncate font-BeVietnamRegular text-mineShaft-950",
              !item.is_seen && "font-BeVietnamSemiBold"
            )}
          >
            {item.title}
          </Text>
          <Text
            numberOfLines={2}
            className="truncate font-BeVietnamRegular text-14 text-mineShaft-800"
          >
            {item.body}
          </Text>
        </View>
        <Text className="font-BeVietnamMedium text-12 text-mineShaft-500">
          {getTimeAgo(item.created_at)}
        </Text>
      </View>

      {!item.is_seen && <View className="h-3 w-3 bg-lime-400 rounded-full" />}
    </Button>
  );
}

export default ListNotify;
