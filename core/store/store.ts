import { create } from "zustand";
import { DragonBallAPI } from "@/core/api/dragonball.service";
import {
  Character,
  CharacterQueryParams,
} from "@/interface/character.interface";
import { Planet, PlanetQueryParams } from "@/interface/planet.interface";
import { Transformation } from "@/interface/transformation.interface";

interface DragonBallStore {
  // Estado
  characters: Character[];
  planets: Planet[];
  transformations: Transformation[];
  isLoading: boolean;
  error: string | null;

  // Agregar estados de paginación
  charactersPagination: {
    currentPage: number;
    totalPages: number;
  };
  planetsPagination: {
    currentPage: number;
    totalPages: number;
  };

  // Acciones
  fetchCharacters: (
    page?: number,
    filters?: CharacterQueryParams
  ) => Promise<void>;
  fetchPlanets: (page?: number, filters?: PlanetQueryParams) => Promise<void>;
  fetchTransformations: (page?: number) => Promise<void>;
  setError: (error: string | null) => void;
  loadMoreCharacters: () => Promise<void>;
}

export const useStore = create<DragonBallStore>((set, get) => ({
  characters: [],
  planets: [],
  transformations: [],
  isLoading: false,
  error: null,

  charactersPagination: {
    currentPage: 1,
    totalPages: 1,
  },
  planetsPagination: {
    currentPage: 1,
    totalPages: 1,
  },

  fetchCharacters: async (page = 1, filters = {}) => {
    try {
      set({ isLoading: true });
      const response = await DragonBallAPI.getCharacters({ page, ...filters });
      set({
        characters: response.items,
        charactersPagination: {
          currentPage: response.meta.currentPage,
          totalPages: response.meta.totalPages,
        },
        error: null,
      });
    } catch (error) {
      set({ error: "Error fetching characters" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPlanets: async (page = 1) => {
    try {
      set({ isLoading: true });
      const response = await DragonBallAPI.getPlanets({ page });
      set({ planets: response.items, error: null });
    } catch (error) {
      set({ error: "Error fetching planets" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTransformations: async (page = 1) => {
    try {
      set({ isLoading: true });
      const response = await DragonBallAPI.getTransformations({ page });
      set({ transformations: response.items, error: null });
    } catch (error) {
      set({ error: "Error fetching transformations" });
    } finally {
      set({ isLoading: false });
    }
  },

  setError: (error) => set({ error }),

  loadMoreCharacters: async () => {
    const { charactersPagination, characters } = get();
    if (charactersPagination.currentPage < charactersPagination.totalPages) {
      try {
        const nextPage = charactersPagination.currentPage + 1;
        const response = await DragonBallAPI.getCharacters({ page: nextPage });
        set({
          characters: [...characters, ...response.items],
          charactersPagination: {
            currentPage: response.meta.currentPage,
            totalPages: response.meta.totalPages,
          },
        });
      } catch (error) {
        set({ error: "Error loading more characters" });
      }
    }
  },
}));
