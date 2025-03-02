import { QueryParams, PaginatedResponse } from "./api.interface";
import { Character } from "./character.interface";

export interface Transformation {
  id: number;
  name: string;
  image: string;
  ki: string;
  maxKi: string;
  character: Character;
  description: string;
  deletedAt: string | null;
}

export interface TransformationQueryParams extends QueryParams {
  characterId?: number;
}

export type TransformationsResponse = PaginatedResponse<Transformation>;
