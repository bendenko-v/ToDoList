import { Participant, ParticipantDetail } from "./user";

export interface BoardCreate {
  title: string;
}

export interface BoardUpdate {
  title: string;
  participants: Participant[];
}

export interface Board {
  id: number;
  created: string;
  updated: string;
  title: string;
  is_deleted: boolean;
}

export interface BoardDetails extends Board {
  participants: ParticipantDetail[];
}
