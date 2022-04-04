import { Mentor } from "./mentor";

export interface SessionState {
  languageCode?: string;
  specialization: string;
  yoe: number;
  mentors: Mentor[];
  mentorsPage: number;
}
