import { create } from "zustand";
import { Character } from "@/interface/character.interface";
import { Planet } from "@/interface/planet.interface";
import { Transformation } from "@/interface/transformation.interface";
import { dragonBallAPI } from "@/services/api.service";

interface ApiState {
  // Data
  characters: Character[];
  planets: Planet[];
  transformations: Transformation[];

  // Status
  isLoading: boolean;
  error: string | null;

  // Pagination
  currentPage: number;
  totalPages: number;

  // Actions
  fetchCharacters: () => Promise<void>;
  fetchPlanets: () => Promise<void>;
  fetchTransformations: () => Promise<void>;
  loadMoreCharacters: () => Promise<void>;
}

export const useApiStore = create<ApiState>((set, get) => ({
  // Initial state
  characters: [],
  planets: [],
  transformations: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,

  // Actions
  fetchCharacters: async () => {
    try {
      const { currentPage } = get();
      set({ isLoading: true, error: null });
      const response = await dragonBallAPI.getCharacters(currentPage);

      set((state) => ({
        characters:
          currentPage === 1
            ? response.items
            : [...state.characters, ...response.items],
        currentPage: response.meta.currentPage + 1,
        totalPages: response.meta.totalPages,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch characters",
        isLoading: false,
      });
    }
  },

  fetchPlanets: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await dragonBallAPI.getPlanets(1, 100);
      set({ planets: response.items, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch planets",
        isLoading: false,
      });
    }
  },

  fetchTransformations: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await dragonBallAPI.getTransformations(1);
      set({ transformations: response.items, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch transformations",
        isLoading: false,
      });
    }
  },

  loadMoreCharacters: async () => {
    const { currentPage, totalPages, isLoading } = get();
    if (!isLoading && currentPage < totalPages) {
      await get().fetchCharacters();
    }
  },
}));
