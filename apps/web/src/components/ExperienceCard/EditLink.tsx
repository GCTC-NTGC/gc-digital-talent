import React from "react";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";

import { IconLink, IconButton, Color } from "@gc-digital-talent/ui";

interface EditLinkProps {
  children: React.ReactNode;
  ariaLabel: string;
  editUrl?: string; // A link to edit the experience will only appear if editUrl is defined.
  onEditClick?: () => void; // Callback function if edit is a button
}

const EditLink = ({
  children,
  editUrl,
  onEditClick,
  ariaLabel,
}: EditLinkProps) => {
  if (!!onEditClick && !!editUrl) {
    throw new Error(
      "Please only pass either onEditClick or editUrl, not both.",
    );
  }

  const commonProps = {
    color: "secondary" as Color,
    icon: PencilSquareIcon,
    "aria-label": ariaLabel,
  };

  if (!!onEditClick && !editUrl) {
    return (
      <IconButton mode="inline" onClick={onEditClick} {...commonProps}>
        {children}
      </IconButton>
    );
  }

  if (!!editUrl && !onEditClick) {
    return (
      <IconLink href={editUrl} {...commonProps}>
        {children}
      </IconLink>
    );
  }

  return null;
};

export default EditLink;
