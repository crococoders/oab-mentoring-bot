/* eslint-disable no-else-return */
import { Type } from "@prisma/client";

/*
Это делается для того, чтобы когда у пользователя уже есть профиль,
и нам нужно понять он стал `BOTH` или нет.

Пример: он был MENTOR, и вызвал /find_mentors, значит его новый тип должен стать 
*/

export const compose = (a: Type, b: Type) => {
  if (a !== b) {
    return Type.BOTH;
  } else {
    return a;
  }
};
