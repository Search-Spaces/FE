import { create } from 'zustand';
import { apiService } from '@/pages/api/api';

interface UserState {
  isLoggedIn: boolean;
  userInfo: {
    email: string;
    nickname: string;
    profileImage: string;
  } | null;
  setUserInfo: (info: UserState['userInfo']) => void;
  setIsLoggedIn: (status: boolean) => void;
  fetchUserInfo: () => Promise<void>;
  clearUserInfo: () => void;
}

export const useUserStore = create<UserState>(set => ({
  isLoggedIn: false,
  userInfo: null,
  setUserInfo: info => set({ userInfo: info }),
  setIsLoggedIn: status => set({ isLoggedIn: status }),
  fetchUserInfo: async () => {
    try {
      const memberInfo = await apiService.getMemberInfo();
      set({
        userInfo: memberInfo,
        isLoggedIn: true,
      });
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      set({
        userInfo: null,
        isLoggedIn: false,
      });
    }
  },
  clearUserInfo: () =>
    set({
      userInfo: null,
      isLoggedIn: false,
    }),
}));
