import { Character } from "@/interface/character.interface";
import { Planet } from "@/interface/planet.interface";
import { Transformation } from "@/interface/transformation.interface";

const API_URL = "https://dragonball-api.com/api";

interface PaginatedResponse<T> {
  items: T[];
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}

interface ApiError extends Error {
  status?: number;
}

class DragonBallAPI {
  private async fetchApi<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const error: ApiError = new Error("API request failed");
        error.status = response.status;
        throw error;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`API Error: ${error.message}`);
      }
      throw new Error("Unknown API error occurred");
    }
  }

  async getCharacters(
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Character>> {
    return this.fetchApi<PaginatedResponse<Character>>(
      `/characters?page=${page}&limit=${limit}`
    );
  }

  async getCharacterById(id: number): Promise<Character> {
    return this.fetchApi<Character>(`/characters/${id}`);
  }

  async getPlanets(page = 1, limit = 20): Promise<PaginatedResponse<Planet>> {
    return this.fetchApi<PaginatedResponse<Planet>>(
      `/planets?page=${page}&limit=${limit}`
    );
  }

  async getPlanetById(id: number): Promise<Planet> {
    return this.fetchApi<Planet>(`/planets/${id}`);
  }

  async getTransformations(
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Transformation>> {
    return this.fetchApi<PaginatedResponse<Transformation>>(
      `/transformations?page=${page}&limit=${limit}`
    );
  }

  async getTransformationById(id: number): Promise<Transformation> {
    return this.fetchApi<Transformation>(`/transformations/${id}`);
  }
}

export const dragonBallAPI = new DragonBallAPI();
