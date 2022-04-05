import { Specialization, Type } from "@prisma/client";

interface User {
  name: string;
  specialization: Specialization;
  yearsOfExperience: number;
  type: Type;
  telegramId: string;
}

export { User };
