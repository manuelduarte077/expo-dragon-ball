// Interfaz base para las respuestas paginadas
export interface PaginatedResponse<T> {
  items: T[];
  meta: Meta;
  links: Links;
}

export interface Meta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface Links {
  first: string;
  previous: string | null;
  next: string | null;
  last: string;
}

// Parámetros de consulta comunes
export interface QueryParams {
  page?: number;
  limit?: number;
  name?: string;
}
