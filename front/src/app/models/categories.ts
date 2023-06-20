import { User } from "./user";

export interface Category {
  id: number;
  created: string;
  updated: string;
  title: string;
  is_deleted: boolean;
  board: number;
}

export interface CategoryRequest {
  title: string;
}

export interface CategoryWithDetails extends Category {
  user: User;
}

export enum CategoriesOrderField {
  title = "title",
  created = "created"
}

export interface CategoriesRequest {
  board: number;
  ordering?: string;
  search: string;
  limit: number;
  offset: number;
}
