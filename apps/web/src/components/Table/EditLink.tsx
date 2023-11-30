import React from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";

import { Link } from "@gc-digital-talent/ui";

import { Maybe } from "~/api/generated";

interface EditLinkProps {
  /** Id of the object in the table. */
  id: string;
  /** The current url root. */
  editUrlRoot: string;
  /** Label for link text  */
  label?: Maybe<string>;
  /** Visible text for the string, if you want to override default. */
  text?: Maybe<string>;
}

function EditLink({
  id,
  editUrlRoot,
  label,
  text,
}: EditLinkProps): React.ReactElement {
  const intl = useIntl();
  const href = `${editUrlRoot}/${id}/edit`;
  const { pathname, search, hash } = useLocation();
  const currentUrl = `${pathname}${search}${hash}`; // Passing the current url, including search params, allows the next page to return to current table state.
  return (
    <Link
      href={href}
      color="black"
      aria-label={intl.formatMessage(
        {
          defaultMessage: "Edit {label}",
          id: "GG15JI",
          description: "Aria Label displayed for the Edit column.",
        },
        { label },
      )}
      state={{ from: currentUrl }}
    >
      {text ??
        intl.formatMessage(
          {
            defaultMessage: "Edit<hidden> {label}</hidden>",
            id: "i9ND/M",
            description: "Title displayed for the Edit column.",
          },
          { label },
        )}
    </Link>
  );
}

export default EditLink;
