import React from "react";

import MultiSelectFieldBase, {
  type MultiSelectFieldBaseProps,
} from "../Select/MultiSelectFieldBase";

export type MultiSelectFieldProps = Omit<
  MultiSelectFieldBaseProps,
  "isMulti" | "forceArrayFormValue"
>;

const MultiSelectField = (props: MultiSelectFieldProps) => (
  <MultiSelectFieldBase isMulti {...props} />
);

export default MultiSelectField;
