import { useState, useEffect } from "react";
import { Character } from "@/interface/character.interface";
import { dragonBallAPI } from "@/services/api.service";
import { useNavigationStore } from "@/core/store/navigation.store";

interface UseCharacterDetailReturn {
  character: Character | null;
  loading: boolean;
  error: string | null;
  showModel: boolean;
  modelLoading: boolean;
  handleShowModel: () => void;
  handlePlanetPress: (planetId: number) => void;
  handleTransformationPress: (transformationId: number) => void;
  handleRetry: () => Promise<void>;
}

export function useCharacterDetail(
  characterId: number
): UseCharacterDetailReturn {
  const navigateTo = useNavigationStore((state) => state.navigateTo);
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModel, setShowModel] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);

  const fetchCharacter = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dragonBallAPI.getCharacterById(characterId);
      setCharacter(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch character details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacter();
  }, [characterId]);

  const handleShowModel = () => {
    setModelLoading(true);
    setShowModel(true);

    setTimeout(() => {
      setModelLoading(false);
    }, 2000);
  };

  const handlePlanetPress = (planetId: number) => {
    navigateTo("PlanetsTab", {
      screen: "PlanetDetail",
      params: { planetId },
    });
  };

  const handleTransformationPress = (transformationId: number) => {
    navigateTo("CharacterDetail", {
      screen: "TransformationDetail",
      params: { transformationId },
    });
  };

  const handleRetry = async () => {
    await fetchCharacter();
  };

  return {
    character,
    loading,
    error,
    showModel,
    modelLoading,
    handleShowModel,
    handlePlanetPress,
    handleTransformationPress,
    handleRetry,
  };
}
