import { Classification } from "../api/generated";

export default (): Classification[] => {
  return [
    {
      id: "IT-01",
      name: {
        en: "Information Technology",
        fr: "Technologie de l'information",
      },
      group: "IT",
      level: 1,
      minSalary: 50000,
      maxSalary: 80000,
    },
    {
      id: "IT-02",
      name: {
        en: "Information Technology",
        fr: "Technologie de l'information",
      },
      group: "IT",
      level: 2,
      minSalary: 65000,
      maxSalary: 94000,
    },
    {
      id: "IT-03",
      name: {
        en: "Information Technology",
        fr: "Technologie de l'information",
      },
      group: "IT",
      level: 3,
      minSalary: 83000,
      maxSalary: 113000,
    },
    {
      id: "IT-04",
      name: {
        en: "Information Technology",
        fr: "Technologie de l'information",
      },
      group: "IT",
      level: 4,
      minSalary: 94000,
      maxSalary: 130000,
    },
  ];
};
