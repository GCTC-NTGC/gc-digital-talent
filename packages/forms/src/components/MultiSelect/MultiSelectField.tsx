import React from "react";

import SelectFieldV2, {
  type SelectFieldV2Props,
} from "../Select/SelectFieldV2";

export type MultiSelectFieldProps = Omit<
  SelectFieldV2Props,
  "isMulti" | "forceArrayFormValue"
>;

const MultiSelectField = (props: MultiSelectFieldProps) => (
  <SelectFieldV2 isMulti {...props} />
);

export default MultiSelectField;
