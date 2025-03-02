import { create } from "zustand";

type NavigationState = {
  navigateTo: (screen: string, params?: any) => void;
  goBack: () => void;
  navigation: any | null;
  setNavigation: (navigation: any) => void;
};

export const useNavigationStore = create<NavigationState>((set, get) => ({
  navigation: null,
  setNavigation: (navigation) => set({ navigation }),
  navigateTo: (screen, params) => {
    const { navigation } = get();
    if (navigation) {
      navigation.navigate(screen, params);
    }
  },
  goBack: () => {
    const { navigation } = get();
    if (navigation) {
      navigation.goBack();
    }
  },
}));
