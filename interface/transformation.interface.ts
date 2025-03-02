import { QueryParams, PaginatedResponse } from "./api.interface";

export interface Transformation {
  id: number;
  name: string;
  image: string;
  ki: string;
  maxKi: string;
  character: number; // ID del personaje
  description: string;
  deletedAt: null | string;
}

export interface TransformationQueryParams extends QueryParams {
  characterId?: number;
}

export type TransformationsResponse = PaginatedResponse<Transformation>;
