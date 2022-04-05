import { User } from "./user";

export interface SessionState {
  languageCode?: string;
  user: User;
  userId: number;
  mentors: User[];
  mentorsPage: number;
}
