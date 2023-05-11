import React from "react";

import { Link, Button } from "@gc-digital-talent/ui";

interface EditExperienceLinkProps {
  children: React.ReactNode;
  editUrl?: string; // A link to edit the experience will only appear if editUrl is defined.
  onEditClick?: () => void; // Callback function if edit is a button
}

const EditExperienceLink = ({
  children,
  editUrl,
  onEditClick,
}: EditExperienceLinkProps) => {
  const styles = {
    "data-h2-font-size": "base(h6, 1)",
    "data-h2-color": "base(primary.darker)",
    "data-h2-font-weight": "base(700)",
  };

  if (!!onEditClick && !!editUrl) {
    throw new Error(
      "Please only pass either onEditClick or editUrl, not both.",
    );
  }

  if (!!onEditClick && !editUrl) {
    return (
      <Button type="button" mode="inline" onClick={onEditClick} {...styles}>
        {children}
      </Button>
    );
  }

  if (!!editUrl && !onEditClick) {
    return (
      <Link href={editUrl} {...styles}>
        {children}
      </Link>
    );
  }

  return null;
};

export default EditExperienceLink;
