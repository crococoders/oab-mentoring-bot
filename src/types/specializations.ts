type Specialization = {
  name: string;
  key: string;
};

const specializations: Specialization[] = [
  { name: "Backend разработка", key: "BACKEND" },
  { name: "Frontend разработка", key: "FRONTEND" },
  { name: "Мобильная разработка", key: "MOBILE" },
  { name: "QA / Тестирование", key: "QA" },
  { name: "Data Science", key: "DATASCIENCE" },
  { name: "UX / UI Design", key: "DESIGN" },
  { name: "Product / Project Менеджмент", key: "MANAGEMENT" },
];

const regexToMatchSpecializations =
  /BACKEND|FRONTEND|MOBILE|QA|DATASCIENCE|DESIGN|MANAGEMENT/;

export { specializations, regexToMatchSpecializations, type Specialization };
