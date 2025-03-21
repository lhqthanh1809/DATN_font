import { cn, getTimeAgo } from "@/helper/helper";
import { IDataRealtime } from "@/interfaces/GeneralInterface";
import { INotification } from "@/interfaces/NotificationInterface";
import useNotificationStore from "@/store/notification/useNotificationStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import { Bell } from "@/ui/icon/symbol";
import { initializeEcho } from "@/utils/echo";
import { Channel } from "@ably/laravel-echo";
import { Skeleton } from "moti/skeleton";
import { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";

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
  return (
    <View className="gap-2">
      <Text className="text-16 font-BeVietnamMedium text-mineShaft-950">
        {title}
      </Text>
      <View className="gap-2">
        {items.map((item) => (
          <NotificationItem item={item} key={item.id} />
        ))}
      </View>
    </View>
  );
}

function NotificationItem({ item }: { item: INotification }) {
  return (
    <Button
      className={cn(
        "border-1 rounded-lg p-3 border-white-100 gap-1 flex-col items-start",
        !item.is_seen &&
          "bg-lime-100 border-lime-200 shadow-sm shadow-lime-500/20"
      )}
    >
      <Text
        numberOfLines={1}
        className="truncate font-BeVietnamMedium text-14 text-mineShaft-950"
      >
        {item.title}
      </Text>
      <Text
        numberOfLines={2}
        className="truncate font-BeVietnamRegular text-14 text-mineShaft-800"
      >
        {item.body}
      </Text>
      <Text className="font-BeVietnamMedium text-12 text-mineShaft-500">
        {getTimeAgo(item.created_at)}
      </Text>
    </Button>
  );
}

export default ListNotify;
