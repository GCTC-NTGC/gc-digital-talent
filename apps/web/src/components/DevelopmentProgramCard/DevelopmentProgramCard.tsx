import { useState } from "react";
import type { ReactNode } from "react";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon";
import { useIntl } from "react-intl";

import type { Classification } from "@gc-digital-talent/graphql";
import { Chip, Chips, DropdownMenu, IconButton } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import { formatClassificationString } from "~/utils/poolUtils";

interface DevelopmentProgramCardProps {
  title: string;
  description: string;
  iconLabel: string;
  edit: ReactNode;
  remove: ReactNode;
  classificationRestrictions?: Pick<Classification, "id" | "group" | "level">[];
}

const DevelopmentProgramCard = ({
  title,
  description,
  iconLabel,
  edit,
  remove,
  classificationRestrictions,
}: DevelopmentProgramCardProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 p-6 last:border-b-0 odd:bg-gray-100/30 dark:odd:bg-gray-700/50 dark:even:bg-gray-700/30">
      <div className="flex items-start gap-6">
        <DropdownMenu.Root open={open} onOpenChange={setOpen}>
          <DropdownMenu.Trigger
            render={
              <IconButton
                icon={open ? XMarkIcon : PencilSquareIcon}
                color="primary"
                label={iconLabel}
                className="m-0 p-0"
              />
            }
          />
          <DropdownMenu.Popup
            className="flex flex-col items-start gap-3 p-3"
            portalProps={{ keepMounted: true }}
          >
            {edit && <DropdownMenu.Item>{edit}</DropdownMenu.Item>}
            {remove && <DropdownMenu.Item>{remove}</DropdownMenu.Item>}
          </DropdownMenu.Popup>
        </DropdownMenu.Root>
        <div className="flex flex-col items-start gap-6">
          <span>
            <p className="font-bold">{title}</p>
            {description && <p>{description}</p>}
          </span>

          {classificationRestrictions && (
            <span className="flex gap-3">
              <p>
                {intl.formatMessage({
                  defaultMessage: "Restricted to",
                  id: "622Kr4",
                  description:
                    "List of classifications that development programs are limited to",
                })}
                {intl.formatMessage(commonMessages.dividingColon)}
              </p>
              <Chips>
                {classificationRestrictions.map((cr) => (
                  <Chip color="primary" key={cr.id}>
                    {formatClassificationString(cr)}
                  </Chip>
                ))}
              </Chips>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevelopmentProgramCard;
