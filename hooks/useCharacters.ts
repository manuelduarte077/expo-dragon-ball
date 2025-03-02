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
    characters,
    isLoading,
    error,
    loadMoreCharacters,
    fetchCharacters,
    fetchPlanets,
  } = useApiStore();

  useEffect(() => {
    fetchCharacters();
    fetchPlanets();
  }, []);

  const handleCharacterPress = (characterId: number) => {
    navigation.navigate("CharacterDetail", { characterId });
  };

  return {
    characters,
    isLoading,
    error,
    loadMoreCharacters,
    handleCharacterPress,
  };
}
