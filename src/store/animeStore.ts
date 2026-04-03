import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Season = '冬' | '春' | '夏' | '秋';

interface AnimeReview {
  id: string;
  title: string;
  year: number;
  season: Season;
  content: string;
  createdAt: string;
}

interface AnimeStore {
  reviews: AnimeReview[];
  addReview: (title: string, year: number, season: Season, content: string) => void;
  deleteReview: (id: string) => void;
  updateReview: (id: string, title: string, year: number, season: Season, content: string) => void;
}

export const useAnimeStore = create<AnimeStore>()(
  persist(
    (set) => ({
      reviews: [],
      addReview: (title, year, season, content) => set((state) => ({
        reviews: [
          ...state.reviews,
          {
            id: Date.now().toString(),
            title,
            year,
            season,
            content,
            createdAt: new Date().toISOString(),
          },
        ],
      })),
      deleteReview: (id) => set((state) => ({
        reviews: state.reviews.filter((review) => review.id !== id),
      })),
      updateReview: (id, title, year, season, content) => set((state) => ({
        reviews: state.reviews.map((review) =>
          review.id === id ? { ...review, title, year, season, content } : review
        ),
      })),
    }),
    {
      name: 'anime-review-storage',
    }
  )
);