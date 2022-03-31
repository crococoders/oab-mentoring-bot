import { Mentor } from "./mentor";

export interface SessionState {
  languageCode?: string;
  step:
    | "gotName"
    | "gotSpecialization"
    | "gotYearsOfExperience"
    | "displayMentors";
  mentors: Mentor[];
  mentorsPage: number;
}
