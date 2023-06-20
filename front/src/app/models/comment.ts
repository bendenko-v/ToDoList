import { User } from "./user";

export interface CommentRequest {
  text: number;
  goal: number;
}

export interface CommentDTO extends CommentRequest {
  id: number;
  created: string;
  updated: string;
  user: User;
}

export interface CommentsQuery {
  ordering: string;
  limit: number;
  offset: number;
  goal: number;
}
