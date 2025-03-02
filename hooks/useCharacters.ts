import { useEffect } from "react";
import { useApiStore } from "@/core/store/api.store";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  CharacterDetail: { characterId: number };
};

export function useCharacters(
  navigation: NativeStackNavigationProp<RootStackParamList>
) {
  const {
    filteredCharacters,
    searchQuery,
    selectedPlanet,
    showFilters,
    activeFilters,
    isLoading,
    error,
    planets,
    setSearchQuery,
    setSelectedPlanet,
    setShowFilters,
    setActiveFilters,
    loadMoreCharacters,
    fetchCharacters,
    fetchPlanets,
    resetFilters,
  } = useApiStore();

  useEffect(() => {
    fetchCharacters();
    fetchPlanets();
  }, []);

  const handleCharacterPress = (characterId: number) => {
    navigation.navigate("CharacterDetail", { characterId });
  };

  const handleFilterChange = (filters: {
    isAlive?: boolean;
    hasTransformations?: boolean;
    power?: { min: number; max: number };
  }) => {
    setActiveFilters(filters);
  };

  return {
    // Data
    filteredCharacters,
    planets,

    // Search and filters
    searchQuery,
    selectedPlanet,
    showFilters,
    activeFilters,

    // Status
    isLoading,
    error,

    // Actions
    setSearchQuery,
    setSelectedPlanet,
    setShowFilters,
    handleFilterChange,
    loadMoreCharacters,
    handleCharacterPress,
    resetFilters,
  };
}
