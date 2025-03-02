import { QueryParams, PaginatedResponse } from "./api.interface";

export interface Character {
  id: number;
  name: string;
  ki?: number;
  maxKi?: number;
  race?: string;
  gender?: string;
  description?: string;
  image?: string;
  affiliation?: string;
  originPlanet?: {
    id: number;
    name: string;
  };
  transformations?: {
    id: number;
    name: string;
    ki?: number;
  }[];
  isAlive?: boolean;
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
