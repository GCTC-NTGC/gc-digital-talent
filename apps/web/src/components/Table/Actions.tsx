import React from "react";
import { useIntl } from "react-intl";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import { useLocation } from "react-router-dom";

import { Link } from "@gc-digital-talent/ui";

import { Maybe } from "~/api/generated";

export interface ActionsProps {
  id: string;
  label?: Maybe<string>;
  editPathFunc: (id: string) => string;
}

const Actions = ({ id, label, editPathFunc }: ActionsProps) => {
  const intl = useIntl();
  const editPath = editPathFunc(id);
  const { pathname, search, hash } = useLocation();
  const currentUrl = `${pathname}${search}${hash}`;
  return (
    <Link
      href={editPath}
      mode="solid"
      data-h2-padding="base(x.5)"
      color="secondary"
      aria-label={intl.formatMessage(
        {
          defaultMessage: "Edit {label}",
          id: "2jFKrM",
          description: "Label for link to edit a specific item in a table",
        },
        { label },
      )}
      state={{ from: currentUrl }}
    >
      <PencilIcon
        data-h2-display="base(block)"
        data-h2-height="base(x.75)"
        data-h2-width="base(x.75)"
      />
    </Link>
  );
};

export default Actions;
