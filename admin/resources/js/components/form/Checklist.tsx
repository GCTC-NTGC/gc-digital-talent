import * as React from "react";
import get from "lodash/get";
import { RegisterOptions, useFormContext } from "react-hook-form";
import Fieldset from "../H2Components/Fieldset";

export type Checkbox = { value: string | number; label: string };

export interface ChecklistProps {
  /** Each input element will be given an id to match to its label, of the form `${idPrefix}-${value}` */
  idPrefix: string;
  /** Holds text for the legend associated with the checklist fieldset. */
  label: string;
  /** A string specifying a name for the input control. */
  name: string;
  items: Checkbox;
  /** Set of validation rules and error messages to impose on all input elements. */
  rules?: RegisterOptions;
}

const Checklist: React.FunctionComponent<ChecklistProps> = ({
  idPrefix,
  label,
  name,
  rules = {},
  ...rest
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message;

  return (
    <Fieldset>
      <p>In progress</p>
    </Fieldset>
  );
};

export default Checklist;
