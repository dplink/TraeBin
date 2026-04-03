import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Season = '冬' | '春' | '夏' | '秋';

interface AnimeReview {
  id: string;
  title: string;
  year: number;
  season: Season;
  tags: string[];
  content: string;
  createdAt: string;
}

interface AnimeStore {
  reviews: AnimeReview[];
  addReview: (title: string, year: number, season: Season, content: string) => void;
  deleteReview: (id: string) => void;
  updateReview: (id: string, title: string, year: number, season: Season, content: string) => void;
  setReviews: (reviews: AnimeReview[]) => void;
  addReviews: (reviews: AnimeReview[]) => void;
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
            tags: [`${year}年`, `${season}季`],
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
          review.id === id ? { ...review, title, year, season, tags: [`${year}年`, `${season}季`], content } : review
        ),
      })),
      setReviews: (reviews) => set({ reviews }),
      addReviews: (reviews) => set((state) => ({
        reviews: [...state.reviews, ...reviews]
      })),
    }),
    {
      name: 'anime-review-storage-v3',
      storage: createJSONStorage(() => localStorage),
    }
  )
);