import BuildingOfficeIcon from "@heroicons/react/24/outline/BuildingOfficeIcon";
import { useIntl } from "react-intl";
import MapPinIcon from "@heroicons/react/24/outline/MapPinIcon";
import CurrencyDollarIcon from "@heroicons/react/24/outline/CurrencyDollarIcon";
import ChatBubbleLeftRightIcon from "@heroicons/react/24/outline/ChatBubbleLeftRightIcon";
import { differenceInDays } from "date-fns/differenceInDays";
import { isPast } from "date-fns/isPast";
import type { ReactNode } from "react";
import { tv } from "tailwind-variants";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql, PoolLanguage } from "@gc-digital-talent/graphql";
import { commonMessages, getLocale } from "@gc-digital-talent/i18n";
import type { HeadingLevel } from "@gc-digital-talent/ui";
import {
  Card,
  Heading,
  Link,
  IconLabel,
  UNICODE_CHAR,
} from "@gc-digital-talent/ui";
import {
  DATE_FORMAT_LOCALIZED,
  DATE_FORMAT_STRING,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import {
  getShortPoolTitleHtml,
  getShortPoolTitleLabel,
} from "~/utils/poolUtils";
import { getSalaryRange } from "~/utils/classification";
import { useStableDate } from "~/hooks/useStableDate";

import AreaOfSelectionFlag from "./AreaOfSelectionRibbon";

const postedOnDate = tv({
  base: "flex items-center gap-3 text-gray-600 dark:text-gray-200",
});

export const JobCard_Fragment = graphql(/* GraphQL */ `
  fragment JobCard on Pool {
    id
    department {
      name {
        localized
      }
    }
    workStream {
      id
      name {
        en
        fr
      }
    }
    publishingGroup {
      value
      label {
        en
        fr
      }
    }
    closingDate
    name {
      en
      fr
    }
    classification {
      id
      groupAndLevel
      minSalary
      maxSalary
    }
    poolSkills {
      id
      type {
        value
        label {
          en
          fr
        }
      }
      skill {
        id
        category {
          value
          label {
            en
            fr
          }
        }
        key
        name {
          en
          fr
        }
      }
    }
    areaOfSelection {
      value
    }
    selectionLimitations {
      value
    }
    isRemote
    location {
      localized
    }
    language {
      value
      label {
        localized
      }
    }
    publishedAt
    applicantsCount
  }
`);

const PostedOnDate = ({
  publishedAt,
  applicantsCount,
  className,
}: {
  publishedAt?: string | null;
  applicantsCount?: number | null;
  className?: string;
}) => {
  const intl = useIntl();
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);
  return (
    <div className={postedOnDate({ class: className })}>
      <p>
        {intl.formatMessage(
          {
            defaultMessage: "Posted on {publishedDate}",
            id: "9lg3QJ",
            description: "Text displaying the date a job was posted",
          },
          {
            publishedDate: publishedAt
              ? formatDate({
                  date: parseDateTimeUtc(publishedAt),
                  formatString: DATE_FORMAT_STRING,
                  intl,
                })
              : notAvailable,
          },
        )}
      </p>
      <span
        className="hidden text-gray-500 xxs:inline-block dark:text-gray-200"
        aria-hidden
      >
        {UNICODE_CHAR.BULLET}
      </span>
      <p>
        {intl.formatMessage(
          {
            defaultMessage: "{applicantsCount} applications",
            id: "RC8Q0J",
            description: "Text displaying number of applications for a job",
          },
          { applicantsCount: applicantsCount },
        )}
      </p>
    </div>
  );
};

const closeDate = tv({
  base: "font-bold",
  variants: {
    deadlineNear: {
      true: "text-error-600 dark:text-error-100",
    },
  },
});

interface JobCardProps {
  poolQuery: FragmentType<typeof JobCard_Fragment>;
  headingLevel?: HeadingLevel;
}

const JobCard = ({ poolQuery, headingLevel = "h3" }: JobCardProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const pool = getFragment(JobCard_Fragment, poolQuery);
  const now = useStableDate();

  const department = pool.department?.name.localized;
  const location = pool.isRemote
    ? intl.formatMessage(commonMessages.remote)
    : pool.location?.localized;
  const salaryRange = getSalaryRange(locale, pool.classification);
  const languageRequirement = pool.language?.value;
  const localizedLanguageLabel = pool.language?.label.localized;

  const bilingual = intl.formatMessage(commonMessages.bilingual);

  const languageLabel = new Map<PoolLanguage | undefined, ReactNode>([
    [
      PoolLanguage.BilingualAdvanced,
      <>
        <span>{bilingual}</span>{" "}
        <span className="text-gray-500 dark:text-gray-200">
          {intl.formatMessage({
            defaultMessage: "(C B C)",
            id: "8m4Fvb",
            description: "Second part of bilingual advanced pool language",
          })}
        </span>
      </>,
    ],
    [
      PoolLanguage.BilingualIntermediate,
      <>
        <span>{bilingual}</span>{" "}
        <span className="text-gray-500 dark:text-gray-200">
          {intl.formatMessage({
            defaultMessage: "(B B B)",
            id: "ZI0wBf",
            description: "Second part of bilingual intermediate pool language",
          })}
        </span>
      </>,
    ],
    [PoolLanguage.VariousBilingual, localizedLanguageLabel],
    [PoolLanguage.English, localizedLanguageLabel],
    [PoolLanguage.French, localizedLanguageLabel],
    [PoolLanguage.Various, localizedLanguageLabel],
  ]);

  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  const deadlineUtc = pool.closingDate && parseDateTimeUtc(pool.closingDate);
  const deadlineIn = deadlineUtc ? differenceInDays(deadlineUtc, now) : null;
  const deadlineNear = Boolean(
    deadlineIn !== null && deadlineIn <= 3 && deadlineIn >= 0,
  );
  const poolIsClosed = deadlineUtc ? isPast(deadlineUtc) : false;
  const deadline = deadlineUtc
    ? formatDate({
        date: deadlineUtc,
        formatString: DATE_FORMAT_LOCALIZED,
        intl,
        timeZone: "Canada/Pacific",
      })
    : notAvailable;

  return (
    <Card className="relative mt-1.5 pb-10">
      <div className="mr-6 mb-6 flex items-start justify-between">
        {pool.areaOfSelection && (
          <div className="-ml-8 flex flex-col gap-1.5 sm:flex-row sm:gap-0">
            <AreaOfSelectionFlag
              areaOfSelection={pool.areaOfSelection?.value}
              selectionLimitations={unpackMaybes(pool.selectionLimitations).map(
                (l) => l.value,
              )}
            />
          </div>
        )}
        <div className="hidden xs:block">
          <PostedOnDate
            publishedAt={pool.publishedAt}
            applicantsCount={pool.applicantsCount}
          />
        </div>
      </div>
      <div className="relative mx-4 flex flex-col items-start justify-between gap-4 xs:flex-row xs:items-center">
        <div className="flex flex-col gap-3">
          <Heading
            level={headingLevel}
            size="h5"
            className="mt-0 mb-2 pl-0 font-bold dark:text-gray-100"
          >
            {getShortPoolTitleHtml(intl, {
              workStream: pool.workStream,
              name: pool.name,
              publishingGroup: pool.publishingGroup,
              classification: pool.classification,
            })}
          </Heading>
          <div className="flex flex-col gap-3 font-normal text-gray-700 dark:text-gray-100">
            <IconLabel label={department} icon={BuildingOfficeIcon} />
            <IconLabel label={location} icon={MapPinIcon} />
            <IconLabel
              label={
                salaryRange ?? intl.formatMessage(commonMessages.notAvailable)
              }
              icon={CurrencyDollarIcon}
            />
            <IconLabel
              label={languageLabel.get(languageRequirement)}
              icon={ChatBubbleLeftRightIcon}
            />
          </div>
          <p className={closeDate({ deadlineNear })}>
            {poolIsClosed
              ? intl.formatMessage(
                  {
                    defaultMessage: "Applications closed on {closingDate}",
                    id: "D8mu6E",
                    description:
                      "Message informing user applications won't be accepted after closing date",
                  },
                  {
                    closingDate: deadline,
                  },
                )
              : intl.formatMessage(
                  {
                    defaultMessage: "Apply on or before {closingDate}",
                    id: "LjYzkS",
                    description: "Message to apply to the pool before deadline",
                  },
                  {
                    closingDate: deadline,
                  },
                )}
          </p>
        </div>
        <Link
          className="shrink-0 justify-self-end after:absolute after:inset-0 after:content-[''] xs:self-end"
          color="primary"
          mode="solid"
          href={paths.jobPoster(pool.id)}
        >
          {poolIsClosed ? (
            <>
              <span aria-hidden="true">
                {intl.formatMessage({
                  id: "rZ9ljW",
                  defaultMessage: "View job ad",
                  description: "Label on link to closed job ad",
                })}
              </span>
              <span className="sr-only">
                {intl.formatMessage(
                  {
                    id: "D0Yslc",
                    defaultMessage: "View job ad {name}",
                    description: "Message on link that say to apply to a job",
                  },
                  { name: getShortPoolTitleLabel(intl, pool) },
                )}
              </span>
            </>
          ) : (
            <>
              <span aria-hidden="true">
                {intl.formatMessage({
                  id: "OjI368",
                  defaultMessage: "Apply now",
                  description: "Label on link to apply to a job",
                })}
              </span>
              <span className="sr-only">
                {intl.formatMessage(
                  {
                    id: "5s1vaA",
                    defaultMessage: "Apply to ({name})",
                    description: "Message on link that say to apply to a job",
                  },
                  { name: getShortPoolTitleLabel(intl, pool) },
                )}
              </span>
            </>
          )}
        </Link>
        <div className="xs:hidden">
          <PostedOnDate
            publishedAt={pool.publishedAt}
            applicantsCount={pool.applicantsCount}
            className="flex-col items-start xxs:flex-row xxs:items-center"
          />
        </div>
      </div>
    </Card>
  );
};

export default JobCard;
