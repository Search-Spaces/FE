import { create } from 'zustand';

interface NavigationStore {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

export const useNavigationStore = create<NavigationStore>(set => ({
  activeMenu: 'map',
  setActiveMenu: (menu: string) => set({ activeMenu: menu }),
  
}));
