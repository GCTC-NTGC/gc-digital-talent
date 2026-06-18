import { useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useIntl } from "react-intl";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";

import type { Classification } from "@gc-digital-talent/graphql";
import {
  Chip,
  Chips,
  DropdownMenu,
  Heading,
  IconButton,
  Ul,
  type HeadingRank,
} from "@gc-digital-talent/ui";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";

interface DevelopmentProgramCardProps {
  id: string;
  title: string;
  headingAs?: HeadingRank;
  description: ReactNode;
  iconLabel?: string;
  edit?: ReactNode;
  remove?: ReactNode;
  actions?: boolean;
  classificationRestrictions?: Pick<Classification, "id" | "groupAndLevel">[];
  setEditOpen?: Dispatch<SetStateAction<string | null>>;
  setRemoveOpen?: Dispatch<SetStateAction<string | null>>;
}

const DevelopmentProgramCard = ({
  id,
  title,
  headingAs = "h3",
  description,
  iconLabel,
  edit,
  remove,
  actions = true,
  classificationRestrictions,
  setEditOpen,
  setRemoveOpen,
}: DevelopmentProgramCardProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);

  return (
    <li className="border-b border-gray-200 p-6 last:border-b-0 odd:bg-gray-100/30 dark:border-gray-700 dark:odd:bg-gray-600 dark:even:bg-gray-600/80">
      <div className="flex items-start gap-3">
        {actions && (
          <DropdownMenu.Root open={open} onOpenChange={setOpen}>
            <DropdownMenu.Trigger
              render={
                <IconButton
                  icon={open ? XMarkIcon : PencilSquareIcon}
                  color="primary"
                  label={iconLabel}
                  className="-mt-0.5"
                />
              }
            />
            <DropdownMenu.Popup portalProps={{ keepMounted: true }}>
              {edit && (
                <DropdownMenu.Item onClick={() => setEditOpen?.(id)}>
                  {intl.formatMessage(formMessages.editDetails)}
                </DropdownMenu.Item>
              )}
              {remove && (
                <DropdownMenu.Item onClick={() => setRemoveOpen?.(id)}>
                  {intl.formatMessage(commonMessages.remove)}
                </DropdownMenu.Item>
              )}
            </DropdownMenu.Popup>
          </DropdownMenu.Root>
        )}
        <div className="flex flex-col items-start gap-3">
          <span>
            <Heading
              level={headingAs}
              size="h6"
              className="mt-0 text-base font-bold"
            >
              {title}
            </Heading>
            {description && <p>{description}</p>}
          </span>

          {classificationRestrictions?.length ? (
            <span className="flex gap-1.5">
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
                    {cr.groupAndLevel}
                  </Chip>
                ))}
              </Chips>
            </span>
          ) : null}
        </div>
      </div>
      {edit}
      {remove}
    </li>
  );
};

const Root = ({ children }: { children: ReactNode }) => {
  return (
    <Ul unStyled className="bg-white dark:bg-gray-700">
      {children}
    </Ul>
  );
};

export default {
  Root,
  Item: DevelopmentProgramCard,
};
