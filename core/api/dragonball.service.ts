import {
  CharacterQueryParams,
  CharactersResponse,
  Character,
} from "@/interface/character.interface";
import {
  PlanetQueryParams,
  PlanetsResponse,
  Planet,
} from "@/interface/planet.interface";
import {
  TransformationQueryParams,
  TransformationsResponse,
  Transformation,
} from "@/interface/transformation.interface";
import api from "./dragonball-api";

export const DragonBallAPI = {
  // Characters
  getCharacters: async (
    params?: CharacterQueryParams
  ): Promise<CharactersResponse> => {
    const response = await api.get("/characters", { params });
    return response.data;
  },

  getCharacterById: async (id: number): Promise<Character> => {
    const response = await api.get(`/characters/${id}`);
    return response.data;
  },

  // Planets
  getPlanets: async (params?: PlanetQueryParams): Promise<PlanetsResponse> => {
    const response = await api.get("/planets", { params });
    return response.data;
  },

  getPlanetById: async (id: number): Promise<Planet> => {
    const response = await api.get(`/planets/${id}`);
    return response.data;
  },

  // Transformations
  getTransformations: async (
    params?: TransformationQueryParams
  ): Promise<TransformationsResponse> => {
    const response = await api.get("/transformations", { params });
    return response.data;
  },

  getTransformationById: async (id: number): Promise<Transformation> => {
    const response = await api.get(`/transformations/${id}`);
    return response.data;
  },
};
