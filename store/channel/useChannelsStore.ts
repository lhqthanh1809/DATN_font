import { create } from "zustand";
import { constant } from "@/assets/constant";
import { IChannel, IListChannel } from "@/interfaces/ChannelInterface";
import { IError } from "@/interfaces/ErrorInterface";
import ChannelService from "@/services/Channel/ChannelService";
import useToastStore from "../toast/useToastStore";
import { IListResponse } from "@/interfaces/GeneralInterface";
import { IChatHistory } from "@/interfaces/ChatInterface";

interface IChannelsStore {
  channels: IChannel[];
  loading: boolean;
  loadingMore: boolean;
  offset: number;
  limit: number;
  total: number;
  hasMore: boolean;

  params: Omit<IListChannel, "offset" | "limit"> | null;
  fetchChannels: (params: Omit<IListChannel, "offset" | "limit">) => void;
  loadMore: () => void;
  changeLastMessage: (channelId: string, message: IChatHistory) => void;
  resetChannels: () => void;

}

const useChannelsStore = create<IChannelsStore>((set, get) => {
  const service = new ChannelService();
  const { addToast } = useToastStore.getState();

  const internalFetch = async (newOffset: number, isLoadMore = false) => {
    const { limit, params, channels, total } = get();
    if (!params) return;

    const result: IListResponse<IChannel> | IError | null =
      await service.listChannel({
        ...params,
        offset: newOffset,
        limit,
      });

    if (!result || "message" in result) {
      addToast(
        constant.toast.type.error,
        result ? result.message : "Lỗi không xác định"
      );
      set({ hasMore: false });
      return;
    }

    const newData = result.data as IChannel[];
    const currentData = isLoadMore ? [...channels, ...newData] : newData;

    set({
      channels: currentData,
      offset: newOffset,
      total: result.total,
      hasMore: currentData.length < result.total,
    });
  };

  return {
    channels: [],
    loading: false,
    loadingMore: false,
    offset: 0,
    limit: 10,
    total: 0,
    hasMore: true,
    params: null,

    fetchChannels: async (params) => {
      set({ loading: true, params });
      try {
        await internalFetch(0, false);
      } finally {
        set({ loading: false });
      }
    },

    loadMore: async () => {
      const { offset, limit, hasMore } = get();
      if (!hasMore) return;

      const newOffset = offset + limit;
      set({ loadingMore: true });
      try {
        await internalFetch(newOffset, true);
      } finally {
        set({ loadingMore: false });
      }
    },

    changeLastMessage: (channelId, newMessage) => {
      set((state) => {
        const updatedChannels = state.channels.map((channel) =>
          channel.id === channelId
            ? { ...channel, latest_message: newMessage }
            : channel
        );
  

        const sortedChannels = updatedChannels.sort((a, b) => {
          const timeA = new Date(a.latest_message?.created_at || a.joined_at || a.created_at).getTime();
          const timeB = new Date(b.latest_message?.created_at || b.joined_at  ||b.created_at).getTime();
          return timeB - timeA;
        });
  
        return { channels: sortedChannels };
      });
    },

    resetChannels: () => {
      set({
        channels: [],
        offset: 0,
        total: 0,
        hasMore: true,
        params: null,
      });
    },
  };
});


export default useChannelsStore;