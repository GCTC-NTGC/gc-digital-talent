import { useState } from "react";
import type { ReactNode } from "react";
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
  UNICODE_CHAR,
  type HeadingRank,
} from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import { formatClassificationString } from "~/utils/poolUtils";

interface DevelopmentProgramCardProps {
  title: string;
  headingAs?: HeadingRank;
  description: string;
  iconLabel: string;
  edit: ReactNode;
  remove: ReactNode;
  classificationRestrictions?: Pick<Classification, "id" | "group" | "level">[];
  institution?: string | null;
  dateRange?: string;
  skillCount?: number;
  experienceType?: string;
}

const DevelopmentProgramCard = ({
  title,
  headingAs = "h3",
  description,
  iconLabel,
  edit,
  remove,
  classificationRestrictions,
  institution,
  dateRange,
  skillCount,
  experienceType,
}: DevelopmentProgramCardProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);

  return (
    <li className="border-b border-gray-200 p-6 last:border-b-0 odd:bg-gray-100/30 dark:border-gray-700 dark:odd:bg-gray-600 dark:even:bg-gray-600/80">
      <div className="flex items-start gap-3">
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
            {edit && <DropdownMenu.Item>{edit}</DropdownMenu.Item>}
            {remove && <DropdownMenu.Item>{remove}</DropdownMenu.Item>}
          </DropdownMenu.Popup>
        </DropdownMenu.Root>
        <div className="flex flex-col items-start gap-3">
          <span>
            <Heading
              level={headingAs}
              size="h6"
              className="mt-0 text-base font-bold"
            >
              {title}
            </Heading>
            {institution && <p>{institution}</p>}
            {description && <p>{description}</p>}
            {(experienceType !== undefined || dateRange !== undefined || skillCount !== undefined) && (
              <p className="text-sm text-gray-600 dark:text-gray-100">
                {[
                  experienceType,
                  dateRange,
                  skillCount !== undefined
                    ? intl.formatMessage(
                        {
                          defaultMessage:
                            "{count, plural, one {# skill} other {# skills}}",
                          id: 'EQI4l2',
                          description: "Number of skills on an experience",
                        },
                        { count: skillCount },
                      )
                    : undefined,
                ]
                  .filter(Boolean)
                  .join(` ${UNICODE_CHAR.BULLET} `)}
              </p>
            )}
          </span>

          {classificationRestrictions && (
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
                    {formatClassificationString(cr)}
                  </Chip>
                ))}
              </Chips>
            </span>
          )}
        </div>
      </div>
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
