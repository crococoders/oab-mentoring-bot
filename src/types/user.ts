import { Specialization } from "@prisma/client";

interface User {
  name: string;
  specialization: Specialization;
  yearsOfExperience: number;
}

export { User };
