import { getMentors } from "@bot/services/users.service";
import { Mentor } from "../types/mentor";

const tryToFindMentors = async () => {
  const mentors: Mentor[] = await getMentors();
  return mentors;
};

export default tryToFindMentors;
