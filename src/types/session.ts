import { User } from "./user";

export interface SessionState {
  languageCode?: string;
  user: User;
  mentors: User[];
  mentorsPage: number;
}
