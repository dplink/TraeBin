import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserStore {
  username: string;
  avatar: string;
  setUsername: (username: string) => void;
  setAvatar: (avatar: string) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      username: '旅行者',
      avatar: '',
      setUsername: (username) => set({ username }),
      setAvatar: (avatar) => set({ avatar }),
    }),
    {
      name: 'user-storage-v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
