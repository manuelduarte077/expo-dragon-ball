import { QueryParams, PaginatedResponse } from "./api.interface";

export interface Planets {
  items: Planet[];
  meta: Meta;
  links: Links;
}

export interface Planet {
  id: number;
  name: string;
  isDestroyed: boolean;
  description: string;
  image: string;
  characters?: number[]; // IDs de los personajes relacionados
  deletedAt: null | string;
}

export interface Links {
  first: string;
  previous: string;
  next: string;
  last: string;
}

export interface Meta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PlanetQueryParams extends QueryParams {
  isDestroyed?: boolean;
}

export type PlanetsResponse = PaginatedResponse<Planet>;
