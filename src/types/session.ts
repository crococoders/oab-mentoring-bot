import { MentorData } from "./mentor";

export interface SessionData {
  languageCode?: string;
  step:
    | "gotName"
    | "gotSpecialization"
    | "gotYearsOfExperience"
    | "displayMentors";
  mentors: MentorData[];
  mentorsPage: number;
}
