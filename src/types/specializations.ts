type Specialization = {
  name: string;
  key: string;
};

const specializations: Specialization[] = [
  { name: "Backend разработка", key: "backend" },
  { name: "Frontend разработка", key: "frontend" },
  { name: "Мобильная разработка", key: "mobile" },
  { name: "QA / Тестирование", key: "qa" },
  { name: "Data Science", key: "ds" },
  { name: "UX / UI Design", key: "design" },
  { name: "Product / Project Менеджмент", key: "pm" },
];

const regexToMatchSpecializations = /backend|frontend|mobile|qa|ds|design|pm/;

export { specializations, regexToMatchSpecializations, type Specialization };
