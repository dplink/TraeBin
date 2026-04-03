import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReviewItem {
  id: string;
  content: string;
  tags: string[];
  createdAt: string;
}

interface ReviewStore {
  reviews: ReviewItem[];
  addReview: (content: string, tags: string[]) => void;
  deleteReview: (id: string) => void;
  updateReview: (id: string, content: string, tags: string[]) => void;
}

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set) => ({
      reviews: [],
      addReview: (content, tags) => set((state) => ({
        reviews: [
          ...state.reviews,
          {
            id: Date.now().toString(),
            content,
            tags,
            createdAt: new Date().toISOString(),
          },
        ],
      })),
      deleteReview: (id) => set((state) => ({
        reviews: state.reviews.filter((review) => review.id !== id),
      })),
      updateReview: (id, content, tags) => set((state) => ({
        reviews: state.reviews.map((review) =>
          review.id === id ? { ...review, content, tags } : review
        ),
      })),
    }),
    {
      name: 'review-storage',
      migrate: (persistedState: unknown) => {
        const state = persistedState as { reviews: Array<{ id: string; content: string; category?: string; tags?: string[]; createdAt: string }> };
        if (state && state.reviews) {
          return {
            ...state,
            reviews: state.reviews.map((review) => ({
              ...review,
              tags: review.tags || (review.category ? [review.category] : []),
            })),
          };
        }
        return state;
      },
    }
  )
);