import { Classification } from "@common/api/generated";

export type SimpleClassification = Pick<Classification, "group" | "level">;

export type SimplePool = {
  id: string;
  classification?: SimpleClassification;
};
