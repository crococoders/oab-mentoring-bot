import { getMentors } from "@bot/services/users.service";
import { Filters } from "@bot/types/filters";
import { Mentor } from "@bot/types";

const tryToFindMentors = async (filters: Filters) => {
  const mentors: Mentor[] = await getMentors(filters);
  return mentors;
};

export default tryToFindMentors;
