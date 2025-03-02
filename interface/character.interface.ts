import { QueryParams, PaginatedResponse } from "./api.interface";

export interface Character {
  id: number;
  name: string;
  ki: string;
  maxKi: string;
  race: string;
  gender: Gender;
  description: string;
  image: string;
  affiliation: string;
  originPlanet?: {
    id: number;
    name: string;
  };
  isAlive?: boolean;
  transformations?: Array<{
    id: number;
    name: string;
  }>;
  deletedAt: null | string;
}

export enum Gender {
  Female = "Female",
  Male = "Male",
  Unknown = "Unknown",
}

export interface CharacterQueryParams extends QueryParams {
  race?: string;
  gender?: Gender;
  affiliation?: string;
}

export type CharactersResponse = PaginatedResponse<Character>;
