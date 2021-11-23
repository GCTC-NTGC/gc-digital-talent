import { CheckIcon, XIcon } from "@heroicons/react/solid";
import React, { ReactElement } from "react";

export interface TableBooleanProps {
  checked?: boolean | undefined | null;
}

function TableBoolean({ checked }: TableBooleanProps): ReactElement {
  return checked ? (
    <CheckIcon style={{ width: "1rem" }} />
  ) : (
    <XIcon style={{ width: "1rem" }} />
  );
}

export default TableBoolean;
