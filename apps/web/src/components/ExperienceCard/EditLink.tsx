import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";
import { ReactNode } from "react";

import { Link, Button, ButtonProps, LinkProps } from "@gc-digital-talent/ui";

interface EditLinkProps {
  children: ReactNode;
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

  const commonProps: Pick<
    ButtonProps,
    "color" | "icon" | "mode" | "aria-label"
  > = {
    color: "error",
    icon: PencilSquareIcon,
    "aria-label": ariaLabel,
    mode: "inline",
  };

  if (!!onEditClick && !editUrl) {
    return (
      <Button {...commonProps} onClick={onEditClick}>
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
