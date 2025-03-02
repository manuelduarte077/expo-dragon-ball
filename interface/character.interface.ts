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
  transformations?: number[]; // IDs de las transformaciones
  planets?: number[]; // IDs de los planetas
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
