import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import React, { ReactElement } from "react";

export interface TableBooleanProps {
  checked?: boolean | undefined | null;
}

function TableBoolean({ checked }: TableBooleanProps): ReactElement {
  return checked ? (
    <CheckIcon style={{ width: "1rem" }} />
  ) : (
    <XMarkIcon style={{ width: "1rem" }} />
  );
}

export default TableBoolean;

export function tableBooleanAccessor(checked: boolean | null | undefined) {
  return <TableBoolean checked={checked} />;
}
