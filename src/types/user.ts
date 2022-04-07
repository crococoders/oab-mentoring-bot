import { Specialization, Type, Availability } from "@prisma/client";

interface User {
  name: string;
  specialization: Specialization;
  yearsOfExperience: number;
  type: Type;
  telegramId: string;
  availability?: Availability | null;
}

export { User };
