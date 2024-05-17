import { useIntl } from "react-intl";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import { useLocation } from "react-router-dom";

import { Link } from "@gc-digital-talent/ui";
import { Maybe } from "@gc-digital-talent/graphql";

export interface ActionsProps {
  id: string;
  label?: Maybe<string>;
  editPathFunc: (id: string) => string;
}

const Actions = ({ id, label, editPathFunc }: ActionsProps) => {
  const intl = useIntl();
  const editPath = editPathFunc(id);
  const { pathname, search, hash } = useLocation();
  const currentUrl = `${pathname}${search}${hash}`; // Passing the current url, including search params, allows the next page to return to current table state.
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
      <PencilIcon className="block h-4.5 w-4.5" />
    </Link>
  );
};

export default Actions;
