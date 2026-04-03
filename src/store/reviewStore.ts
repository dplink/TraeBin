import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReviewItem {
  id: string;
  content: string;
  category: string;
  createdAt: string;
}

interface ReviewStore {
  reviews: ReviewItem[];
  addReview: (content: string, category: string) => void;
  deleteReview: (id: string) => void;
  updateReview: (id: string, content: string, category: string) => void;
}

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set) => ({
      reviews: [],
      addReview: (content, category) => set((state) => ({
        reviews: [
          ...state.reviews,
          {
            id: Date.now().toString(),
            content,
            category,
            createdAt: new Date().toISOString(),
          },
        ],
      })),
      deleteReview: (id) => set((state) => ({
        reviews: state.reviews.filter((review) => review.id !== id),
      })),
      updateReview: (id, content, category) => set((state) => ({
        reviews: state.reviews.map((review) =>
          review.id === id ? { ...review, content, category } : review
        ),
      })),
    }),
    {
      name: 'review-storage',
    }
  )
);