import React from "react";
import { useIntl } from "react-intl";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

import { Link, Button } from "@gc-digital-talent/ui";

import { Maybe } from "~/api/generated";

interface TableActionsProps {
  id: string;
  label?: Maybe<string>;
  editPathFunc: (id: string) => string;
}

const TableActions = ({ id, label, editPathFunc }: TableActionsProps) => {
  const intl = useIntl();
  const editPath = editPathFunc(id);

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-wrap="base(wrap)"
      data-h2-gap="base(x.25)"
    >
      <Link
        href={editPath}
        mode="outline"
        color="secondary"
        type="button"
        aria-label={intl.formatMessage(
          {
            defaultMessage: "Edit {label}",
            id: "2jFKrM",
            description: "Label for link to edit a specific item in a table",
          },
          { label },
        )}
      >
        <PencilIcon data-h2-height="base(x.75)" data-h2-width="base(x.75)" />
      </Link>
      <Button
        mode="outline"
        color="secondary"
        aria-label={intl.formatMessage(
          {
            defaultMessage: "Delete {label}",
            id: "NLX/aa",
            description: "Label for link to delete a specific item in a table",
          },
          { label },
        )}
      >
        <TrashIcon data-h2-height="base(x.75)" data-h2-width="base(x.75)" />
      </Button>
    </div>
  );
};

const tableActionsAccessor = (props: TableActionsProps) => (
  <TableActions {...props} />
);

export default tableActionsAccessor;
