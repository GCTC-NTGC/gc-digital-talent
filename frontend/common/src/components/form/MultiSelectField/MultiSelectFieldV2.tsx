import React from "react";
import SelectFieldV2, {
  type SelectFieldV2Props,
} from "../Select/SelectFieldV2";

export type MultiSelectFieldV2Props = Omit<
  SelectFieldV2Props,
  "isMulti" | "forceArrayFormValue"
>;

const MultiSelectFieldV2 = (props: MultiSelectFieldV2Props) => (
  <SelectFieldV2 isMulti {...props} />
);

export default MultiSelectFieldV2;
export type { Option } from "../Select/SelectFieldV2";
