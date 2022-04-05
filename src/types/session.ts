import { Filters } from "./filters";
import { Mentor } from "./mentor";

export interface SessionState {
  languageCode?: string;
  filters: Filters;
  mentors: Mentor[];
  mentorsPage: number;
}
