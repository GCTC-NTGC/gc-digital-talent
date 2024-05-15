import * as React from "react";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";

import { Link, Button, Color, ButtonLinkMode } from "@gc-digital-talent/ui";

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
    color: "tertiary" as Color,
    icon: PencilSquareIcon,
    "aria-label": ariaLabel,
    mode: "inline" as ButtonLinkMode,
  };

  if (!!onEditClick && !editUrl) {
    return (
      <Button onClick={onEditClick} {...commonProps}>
        {children}
      </Button>
    );
  }

  if (!!editUrl && !onEditClick) {
    return (
      <Link href={editUrl} {...commonProps}>
        {children}
      </Link>
    );
  }

  return null;
};

export default EditLink;
