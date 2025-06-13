import { useIntl } from "react-intl";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import { useLocation } from "react-router";

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
      className="p-3"
      color="primary"
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
      <PencilIcon className="block size-4.5" />
    </Link>
  );
};

export default Actions;
