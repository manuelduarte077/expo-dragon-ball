import { useState, useEffect } from "react";
import { Transformation } from "@/interface/transformation.interface";
import { dragonBallAPI } from "@/services/api.service";
import { useNavigation } from "@react-navigation/native";
import { useNavigationStore } from "@/core/store/navigation.store";

interface UseTransformationDetailReturn {
  transformation: Transformation | null;
  loading: boolean;
  error: string | null;
  handleRetry: () => Promise<void>;
}

export function useTransformationDetail(
  transformationId: number
): UseTransformationDetailReturn {
  const [transformation, setTransformation] = useState<Transformation | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation();
  const setNavigation = useNavigationStore((state) => state.setNavigation);

  const fetchTransformation = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dragonBallAPI.getTransformationById(transformationId);
      setTransformation(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch transformation details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransformation();
  }, [transformationId]);

  useEffect(() => {
    setNavigation(navigation);
  }, [navigation]);

  const handleRetry = async () => {
    await fetchTransformation();
  };

  return {
    transformation,
    loading,
    error,
    handleRetry,
  };
}
