import { Classification } from "../api/generated";

export default (): Pick<Classification, "group" | "level">[] => {
  return [
    {
      group: "IT",
      level: 1,
    },
    {
      group: "IT",
      level: 2,
    },
    {
      group: "IT",
      level: 3,
    },
    {
      group: "IT",
      level: 4,
    },
  ];
};
