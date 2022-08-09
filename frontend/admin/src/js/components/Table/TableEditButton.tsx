import React from "react";
import { useIntl } from "react-intl";
import { Link } from "@common/components";
import { Maybe } from "../../api/generated";

export interface TableEditButtonProps {
  /** Id of the object in the table. */
  id: string;
  /** The current url root. */
  editUrlRoot: string;
  /** Label for link text  */
  label?: Maybe<string>;
}

function TableEditButton({
  id,
  editUrlRoot,
  label,
}: TableEditButtonProps): React.ReactElement {
  const intl = useIntl();
  const href = `${editUrlRoot}/${id}/edit`;
  return (
    <Link href={href} type="button" mode="inline" color="primary">
      {intl.formatMessage(
        {
          defaultMessage: "Edit <hidden>{label}</hidden>",
          description: "Title displayed for the Edit column.",
        },
        { label },
      )}
    </Link>
  );
}

export default TableEditButton;

export function tableEditButtonAccessor(
  id: string,
  editUrlRoot: string,
  label?: Maybe<string>,
) {
  return <TableEditButton id={id} editUrlRoot={editUrlRoot} label={label} />;
}
