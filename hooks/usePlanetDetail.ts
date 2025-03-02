import { useState, useEffect } from "react";
import { Planet } from "@/interface/planet.interface";
import { dragonBallAPI } from "@/services/api.service";

interface UsePlanetDetailReturn {
  planet: Planet | null;
  loading: boolean;
  error: string | null;
  handleRetry: () => Promise<void>;
}

export function usePlanetDetail(planetId: number): UsePlanetDetailReturn {
  const [planet, setPlanet] = useState<Planet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanet = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dragonBallAPI.getPlanetById(planetId);
      setPlanet(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch planet details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanet();
  }, [planetId]);

  const handleRetry = async () => {
    await fetchPlanet();
  };

  return {
    planet,
    loading,
    error,
    handleRetry,
  };
}
