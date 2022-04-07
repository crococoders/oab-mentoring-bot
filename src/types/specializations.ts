type Specialization = {
  name: string;
  key: string;
};

const specializations: Specialization[] = [
  { name: "Backend development", key: "BACKEND" },
  { name: "Frontend development", key: "FRONTEND" },
  { name: "Мобильная development", key: "MOBILE" },
  { name: "QA / Testing", key: "QA" },
  { name: "Data Science", key: "DATASCIENCE" },
  { name: "UX / UI Design", key: "DESIGN" },
  { name: "Product / Project Management", key: "MANAGEMENT" },
];

const regexToMatchSpecializations =
  /BACKEND|FRONTEND|MOBILE|QA|DATASCIENCE|DESIGN|MANAGEMENT/;

export { specializations, regexToMatchSpecializations, type Specialization };
