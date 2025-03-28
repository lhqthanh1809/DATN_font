import { create } from "zustand";
import { constant } from "@/assets/constant";
import { IChannel, IListChannel } from "@/interfaces/ChannelInterface";
import { IError } from "@/interfaces/ErrorInterface";
import { IListResponse } from "@/interfaces/GeneralInterface";
import { IChatHistory, ICreateChat, IListChat } from "@/interfaces/ChatInterface";
import ChatService from "@/services/Chat/ChatService";
import useToastStore from "../toast/useToastStore";
import uuid from "react-native-uuid";
import moment from "moment";

interface IChatHistoriesStore {
  messages: IChatHistory[];
  loading: boolean;
  loadingMore: boolean;
  offset: number;
  limit: number;
  total: number;
  hasMore: boolean;

  params: Omit<IListChat, "offset" | "limit"> | null;
  fetchChatHistories: (params: Omit<IListChat, "offset" | "limit">) => void;
  createChat: (data: ICreateChat) => void,

  updateMessages: (message: IChatHistory) => void
  loadMore: () => void;
  resetChannels: () => void;
}

const useChatHistoriesStore = create<IChatHistoriesStore>((set, get) => {
  const service = new ChatService();
  const { addToast } = useToastStore.getState();

  const internalFetch = async (newOffset: number, isLoadMore = false) => {
    const { limit, params, messages, total } = get();
    if (!params) return;

    const result: IListResponse<IChatHistory> | IError | null =
      await service.listChatHistory({
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

    const newData = result.data as IChatHistory[];
    const currentData = isLoadMore ? [...messages, ...newData] : newData;

    set({
      messages: currentData,
      offset: newOffset,
      total: result.total,
      hasMore: currentData.length < result.total,
    });
  };

  const removeMessageById = (id: string) => {
    set(state => ({
      messages: state.messages.filter(msg => msg.id !== id),
    }));
  };

  return {
    messages: [],
    loading: false,
    loadingMore: false,
    offset: 0,
    limit: 10,
    total: 0,
    hasMore: true,
    params: null,

    fetchChatHistories: async (params) => {
      set({ loading: true, params });
      try {
        await internalFetch(0, false);
      } finally {
        set({ loading: false });
      }
    },

    createChat: async (params: ICreateChat) => {
      const id = uuid.v4();
      const newChat: IChatHistory = {
        id,
        channel_id: params.channel_id,
        sender_id: params.member_id,
        sender_type: params.member_type,
        status: 0,
        content: { text: params.message },
        created_at: moment().tz('UTC').format(),
      };
    
      set(state => ({ messages: [newChat, ...state.messages] }));
    
      const result = await service.createChat(params);
    
      if (!result || "message" in result) {
        addToast(
          constant.toast.type.error,
          result?.message || "Lỗi không xác định"
        );
        removeMessageById(id);
        return;
      }
      set(state => ({
        messages: state.messages.map(msg => 
          msg.id === id ? result as IChatHistory : msg
        ),
      }));
    },
    
    updateMessages: (message: IChatHistory) => {
      set(state => ({
        messages: [
          ...state.messages.filter(msg => msg.id !== message.id),
          message
        ].sort((a, b) => b.created_at.localeCompare(a.created_at)),
      }));
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

    resetChannels: () => {
      set({
        messages: [],
        offset: 0,
        total: 0,
        hasMore: true,
        params: null,
      });
    },
  };
});


export default useChatHistoriesStore;