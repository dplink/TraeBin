import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AnimeReview {
  id: string;
  title: string;
  tags: string[];
  content: string;
  createdAt: string;
}

interface AnimeStore {
  reviews: AnimeReview[];
  addReview: (title: string, tags: string[], content: string) => void;
  deleteReview: (id: string) => void;
  updateReview: (id: string, title: string, tags: string[], content: string) => void;
}

export const useAnimeStore = create<AnimeStore>()(
  persist(
    (set) => ({
      reviews: [],
      addReview: (title, tags, content) => set((state) => ({
        reviews: [
          ...state.reviews,
          {
            id: Date.now().toString(),
            title,
            tags,
            content,
            createdAt: new Date().toISOString(),
          },
        ],
      })),
      deleteReview: (id) => set((state) => ({
        reviews: state.reviews.filter((review) => review.id !== id),
      })),
      updateReview: (id, title, tags, content) => set((state) => ({
        reviews: state.reviews.map((review) =>
          review.id === id ? { ...review, title, tags, content } : review
        ),
      })),
    }),
    {
      name: 'anime-review-storage-v2',
    }
  )
);