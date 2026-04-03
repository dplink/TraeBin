import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
  setReviews: (reviews: ReviewItem[]) => void;
  addReviews: (reviews: ReviewItem[]) => void;
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
      setReviews: (reviews) => set({ reviews }),
      addReviews: (reviews) => set((state) => ({
        reviews: [...state.reviews, ...reviews]
      })),
    }),
    {
      name: 'review-storage-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);