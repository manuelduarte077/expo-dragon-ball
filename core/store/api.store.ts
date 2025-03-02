import { create } from "zustand";
import { Character } from "@/interface/character.interface";
import { Planet } from "@/interface/planet.interface";
import { Transformation } from "@/interface/transformation.interface";
import { dragonBallAPI } from "@/services/api.service";

interface Filters {
  isAlive?: boolean;
  hasTransformations?: boolean;
  power?: {
    min: number;
    max: number;
  };
}

interface ApiState {
  // Data
  characters: Character[];
  planets: Planet[];
  transformations: Transformation[];
  filteredCharacters: Character[];

  // Filters
  selectedPlanet: number | null;
  searchQuery: string;
  showFilters: boolean;
  activeFilters: Filters;

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
  filterCharacters: (
    query: string,
    planetId: number | null,
    filters: Filters
  ) => void;
  setSelectedPlanet: (planetId: number | null) => void;
  setSearchQuery: (query: string) => void;
  setShowFilters: (show: boolean) => void;
  setActiveFilters: (filters: Filters) => void;
  loadMoreCharacters: () => Promise<void>;
  resetFilters: () => void;
}

export const useApiStore = create<ApiState>((set, get) => ({
  // Initial state
  characters: [],
  planets: [],
  transformations: [],
  filteredCharacters: [],
  selectedPlanet: null,
  searchQuery: "",
  showFilters: false,
  activeFilters: {},
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
        filteredCharacters:
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

  filterCharacters: (
    query: string,
    planetId: number | null,
    filters: Filters
  ) => {
    const { characters } = get();
    let filtered = [...characters];

    // Text search
    if (query) {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter((char) =>
        char.name.toLowerCase().includes(searchLower)
      );
    }

    // Planet filter
    if (planetId) {
      filtered = filtered.filter((char) => char.originPlanet?.id === planetId);
    }

    // Additional filters
    if (filters.isAlive !== undefined) {
      filtered = filtered.filter((char) => char.isAlive === filters.isAlive);
    }

    if (filters.hasTransformations) {
      filtered = filtered.filter(
        (char) => char.transformations && char.transformations.length > 0
      );
    }

    if (filters.power) {
      filtered = filtered.filter((char) => {
        const power = char.maxKi || 0;
        return power >= filters.power!.min && power <= filters.power!.max;
      });
    }

    set({ filteredCharacters: filtered });
  },

  setSelectedPlanet: (planetId: number | null) => {
    const { searchQuery, activeFilters } = get();
    set({ selectedPlanet: planetId });
    get().filterCharacters(searchQuery, planetId, activeFilters);
  },

  setSearchQuery: (query: string) => {
    const { selectedPlanet, activeFilters } = get();
    set({ searchQuery: query });
    get().filterCharacters(query, selectedPlanet, activeFilters);
  },

  setShowFilters: (show: boolean) => {
    set({ showFilters: show });
  },

  setActiveFilters: (filters: Filters) => {
    const { searchQuery, selectedPlanet } = get();
    set({ activeFilters: filters });
    get().filterCharacters(searchQuery, selectedPlanet, filters);
  },

  loadMoreCharacters: async () => {
    const { currentPage, totalPages, isLoading } = get();
    if (!isLoading && currentPage < totalPages) {
      await get().fetchCharacters();
    }
  },

  resetFilters: () => {
    const { characters } = get();
    set({
      selectedPlanet: null,
      searchQuery: "",
      activeFilters: {},
      showFilters: false,
      filteredCharacters: characters,
    });
  },
}));
