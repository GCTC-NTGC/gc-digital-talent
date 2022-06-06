import React, { ReactElement } from "react";
import { Link } from "@common/components";
import { useIntl } from "react-intl";

export interface TableEditButtonProps {
  /** Id of the object in the table. */
  id: string;
  /** The current url root. */
  editUrlRoot: string;
}

function TableEditButton({
  id,
  editUrlRoot,
}: TableEditButtonProps): ReactElement {
  const intl = useIntl();
  const href = `${editUrlRoot}/${id}/edit`;
  return (
    <Link href={href} type="button" mode="inline" color="primary">
      {intl.formatMessage({
        defaultMessage: "Edit",
        description: "Title displayed for the Edit column.",
      })}
    </Link>
  );
}

export default TableEditButton;

export function tableEditButtonAccessor(id: string, editUrlRoot: string) {
  return <TableEditButton id={id} editUrlRoot={editUrlRoot} />;
}
