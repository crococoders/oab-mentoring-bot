import { MentorData } from "../types/mentor";

const tryToFindMentors = async () => {
  const mentors: MentorData[] = [
    {
      name: "Марат Абылкаиров",
      yearsOfExperience: 3,
    },
    {
      name: "Айдар Нугманов",
      yearsOfExperience: 2,
    },
    {
      name: "Мурат Тишкул",
      yearsOfExperience: 4,
    },
    {
      name: "Адиль Искендер",
      yearsOfExperience: 5,
    },
    {
      name: "Нуржан Машпиев",
      yearsOfExperience: 3,
    },
    {
      name: "Есхат Куат",
      yearsOfExperience: 4.5,
    },
    {
      name: "Аружан Жаубасар",
      yearsOfExperience: 3,
    },
    {
      name: "Айдана Нугманова",
      yearsOfExperience: 2.5,
    },
  ];

  return mentors;
};

export default tryToFindMentors;
