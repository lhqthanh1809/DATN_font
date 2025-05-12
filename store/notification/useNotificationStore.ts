import { create } from "zustand";
import { env, getTimezone } from "@/helper/helper";
import { INotification } from "@/interfaces/NotificationInterface";
import NotificationService from "@/services/Notification/NotificationService";
import { isArray } from "lodash";
import moment from "moment-timezone";

interface NotificationStore {
  loading: boolean;
  loadingMore: boolean;
  limit: number;
  offset: number;
  hasMore: boolean;
  notifications: INotification[];
  newNotifies: INotification[];
  todayNotifies: INotification[];
  yesterdayNotifies: INotification[];
  oldNotifies: INotification[];
  addNotification: (notify: INotification) => void;
  setNotifications: (notifies: INotification[]) => void;
  filterNotifications: () => void;
  fetchNotifications: (id: string, type: string, loadMore?: boolean) => void;
}

const useNotificationStore = create<NotificationStore>((set, get) => ({
  loading: false,
  loadingMore: false,
  limit: 10,
  offset: 0,
  hasMore: false,
  notifications: [],
  newNotifies: [],
  todayNotifies: [],
  yesterdayNotifies: [],
  oldNotifies: [],

  addNotification: (notify) => {
    set((state) => ({
      notifications: [notify, ...state.notifications],
    }));
    get().filterNotifications();
  },

  setNotifications: (notifies) => {
    set({ notifications: notifies });
    get().filterNotifications();
  },

  filterNotifications: () => {
    const now = moment().tz(getTimezone());
    const today = now.clone().startOf("day"); // Lấy khoảng 00:00:00
    const notifications = get().notifications;

    const newNotifs = notifications.filter((n) => {
      const notifTime = moment
        .tz(n.created_at, env("TIMEZONE"))
        .tz(getTimezone());
      return now.diff(notifTime, "hours") < 1;
    });

    const todayNotifs = notifications.filter((n) => {
      const notifTime = moment
        .tz(n.created_at, env("TIMEZONE"))
        .tz(getTimezone());
      return notifTime.isSame(now, "day") && now.diff(notifTime, "hours") >= 1;
    });

    const yesterdayNotifs = notifications.filter((n) => {
      const notifTime = moment
        .tz(n.created_at, env("TIMEZONE"))
        .tz(getTimezone());
      return notifTime.isSame(today.clone().subtract(1, "day"), "day");
    });

    const olderNotifs = notifications.filter((n) => {
      const notifTime = moment
        .tz(n.created_at, env("TIMEZONE"))
        .tz(getTimezone());
      return notifTime.isBefore(today.clone().subtract(1, "day"), "day");
    });

    set({
      newNotifies: newNotifs,
      todayNotifies: todayNotifs,
      yesterdayNotifies: yesterdayNotifs,
      oldNotifies: olderNotifs,
    });
  },

  fetchNotifications: async (id, type, loadMore = false) => {
    const offsetNew = loadMore ? get().offset + get().limit : 0;

    // Prevent further loading if there are no more items
    if (loadMore && (!get().hasMore || get().loadingMore)) {
      return;
    }



    // Reset offset if not loading more
    set(loadMore ? { loadingMore: true } : { loading: true });

    try {
      const notificationService = new NotificationService();
      const result = await notificationService.list({
        object_id: id,
        object_type: type,
        offset: offsetNew,
        limit: get().limit,
      });

      if ("message" in result) return;

      set({
        hasMore: result.total > offsetNew + result.data.length,
        offset: offsetNew,
        notifications: loadMore ? [...get().notifications, ...result.data] : result.data,
      })

      get().filterNotifications();
    } finally {
      set(loadMore ? { loadingMore: false } : { loading: false });
    }
  },
}));

export default useNotificationStore;
