import { useState } from "react";
import type { ReactNode } from "react";
import { useIntl } from "react-intl";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";

import {
  DropdownMenu,
  Heading,
  IconButton,
  Link,
  UNICODE_CHAR,
  type HeadingRank,
} from "@gc-digital-talent/ui";

interface LinkedExperienceProps {
  title: string;
  href: string;
  headingAs?: HeadingRank;
  iconLabel?: string;
  edit?: ReactNode;
  remove?: ReactNode;
  institution?: string | null;
  dateRange?: string;
  skillCount?: number;
  experienceType?: string;
}

const LinkedExperience = ({
  title,
  href,
  headingAs = "h3",
  iconLabel,
  edit,
  remove,
  institution,
  dateRange,
  skillCount,
  experienceType,
}: LinkedExperienceProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);

  return (
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
        <Heading
          level={headingAs}
          size="h6"
          className="mt-0 mb-0 text-base font-bold"
        >
          <Link href={href} newTab inHeading>
            {title}
          </Link>
        </Heading>
        {institution && <p>{institution}</p>}
        {(experienceType !== undefined ||
          dateRange !== undefined ||
          skillCount !== undefined) && (
          <p className="text-sm text-gray-600 dark:text-gray-100">
            {[
              experienceType,
              dateRange,
              skillCount !== undefined
                ? intl.formatMessage(
                    {
                      defaultMessage:
                        "{count, plural, one {# skill} other {# skills}}",
                      id: "EQI4l2",
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
      </div>
    </div>
  );
};

export default LinkedExperience;
