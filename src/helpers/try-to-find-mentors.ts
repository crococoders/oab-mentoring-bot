import { Mentor } from "../types/mentor";

const tryToFindMentors = async () => {
  const mentors: Mentor[] = [
    {
      name: "Марат Абылкаиров",
      specialization: "mobile",
      yearsOfExperience: 3,
    },
    {
      name: "Айдар Нугманов",
      specialization: "mobile",
      yearsOfExperience: 2,
    },
    {
      name: "Мурат Тишкул",
      specialization: "mobile",
      yearsOfExperience: 4,
    },
    {
      name: "Адиль Искендер",
      specialization: "mobile",
      yearsOfExperience: 5,
    },
    {
      name: "Нуржан Машпиев",
      specialization: "mobile",
      yearsOfExperience: 3,
    },
    {
      name: "Есхат Куат",
      specialization: "mobile",
      yearsOfExperience: 4.5,
    },
    {
      name: "Аружан Жаубасар",
      specialization: "mobile",
      yearsOfExperience: 3,
    },
    {
      name: "Айдана Нугманова",
      specialization: "mobile",
      yearsOfExperience: 2.5,
    },
  ];

  return mentors;
};

export default tryToFindMentors;
