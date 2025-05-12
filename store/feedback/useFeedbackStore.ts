import { create } from "zustand";
import { IFeedback } from "@/interfaces/FeedbackInterface";
import moment from "moment";

interface IFeedbackStore {
  feedbacks: IFeedback[];
  addFeedback: (feedback: IFeedback) => void;
  updateFeedback: (feedback: IFeedback) => void;
  removeFeedback: (feedback: IFeedback) => void;
  setFeedbacks: (feedbacks: IFeedback[]) => void;
}

const useFeedbackStore = create<IFeedbackStore>((set, get) => ({
  feedbacks: [],

  addFeedback: (feedback: IFeedback) => {
    set((state) => ({
      feedbacks: [feedback, ...state.feedbacks],
    }));
  },

  updateFeedback: (feedback: IFeedback) => {
    set((state) => {
      let feedbacks = [...state.feedbacks];
      const index = feedbacks.findIndex((f) => f.id === feedback.id);
      if (index !== -1) {
        feedbacks[index] = feedback;
      } else {
        feedbacks.push(feedback);
      }
      feedbacks.sort(
        (a, b) => moment(b.created_at).valueOf() - moment(a.created_at).valueOf()
      );
      return { feedbacks };
    });
  },

  removeFeedback: (feedback: IFeedback) => {
    set((state) => ({
      feedbacks: state.feedbacks.filter((f) => f.id !== feedback.id),
    }));
  },



  setFeedbacks(feedbacks) {
    set({feedbacks})
  },
}));

export default useFeedbackStore;
