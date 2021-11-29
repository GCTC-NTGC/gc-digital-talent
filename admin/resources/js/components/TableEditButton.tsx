import React, { ReactElement } from "react";
import { Button } from "@common/components";
import { useIntl } from "react-intl";
import { navigate } from "@common/helpers/router";

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
  return (
    <Button
      color="primary"
      mode="inline"
      onClick={(event) => {
        event.preventDefault();
        navigate(`${editUrlRoot}/${id}/edit`);
      }}
    >
      {intl.formatMessage({
        defaultMessage: "Edit",
        description: "Title displayed for the Edit column.",
      })}
    </Button>
  );
}

export default TableEditButton;

export function tableEditButtonAccessor(id: string, editUrlRoot: string) {
  return <TableEditButton id={id} editUrlRoot={editUrlRoot} />;
}
