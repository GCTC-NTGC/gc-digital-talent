import BuildingOfficeIcon from "@heroicons/react/24/outline/BuildingOfficeIcon";
import { useIntl } from "react-intl";
import MapPinIcon from "@heroicons/react/24/outline/MapPinIcon";
import CurrencyDollarIcon from "@heroicons/react/24/outline/CurrencyDollarIcon";
import ChatBubbleLeftRightIcon from "@heroicons/react/24/outline/ChatBubbleLeftRightIcon";
import { differenceInDays } from "date-fns/differenceInDays";
import { isPast } from "date-fns/isPast";

import {
  FragmentType,
  getFragment,
  graphql,
  Maybe,
} from "@gc-digital-talent/graphql";
import { commonMessages, getLocale } from "@gc-digital-talent/i18n";
import {
  Card,
  Heading,
  HeadingLevel,
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

import AreaOfSelectionFlag from "./AreaOfSelectionRibbon";

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
      group
      level
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
}: {
  publishedAt?: Maybe<string>;
  applicantsCount?: Maybe<number>;
}) => {
  const intl = useIntl();
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);
  return (
    <div className="flex gap-3 text-gray-500 dark:text-gray-300">
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
        className="text-gray-300 xs:inline-block dark:text-gray-200"
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

interface JobCardProps {
  poolQuery: FragmentType<typeof JobCard_Fragment>;
  headingLevel?: HeadingLevel;
}

const JobCard = ({ poolQuery, headingLevel = "h3" }: JobCardProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const pool = getFragment(JobCard_Fragment, poolQuery);

  const department = pool.department?.name.localized;
  const location = pool.isRemote
    ? intl.formatMessage(commonMessages.remote)
    : pool.location?.localized;
  const salaryRange = getSalaryRange(locale, pool.classification);
  const languageRequirement = pool.language?.label.localized;

  const deadline = pool.closingDate
    ? differenceInDays(parseDateTimeUtc(pool.closingDate), Date.now()) < 3 &&
      differenceInDays(parseDateTimeUtc(pool.closingDate), Date.now()) > 0
    : null;

  const poolIsClosed = pool.closingDate
    ? isPast(parseDateTimeUtc(pool.closingDate))
    : false;

  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  return (
    <Card className="relative">
      <div className="mr-6 mb-6 flex items-center justify-between">
        {pool.areaOfSelection && (
          <div className="-ml-8 flex flex-col sm:flex-row">
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
      <div className="relative mx-6 flex flex-col items-start justify-between gap-6 xs:flex-row xs:items-center">
        <div className="flex flex-col gap-1.5">
          <Heading
            level={headingLevel}
            size="h5"
            className="mt-0 mb-2 pl-0 font-bold"
          >
            {getShortPoolTitleHtml(intl, {
              workStream: pool.workStream,
              name: pool.name,
              publishingGroup: pool.publishingGroup,
              classification: pool.classification,
            })}
          </Heading>
          <div className="mb-6 flex flex-col gap-3 font-normal text-gray-700">
            <IconLabel label={department} icon={BuildingOfficeIcon} />
            <IconLabel label={location} icon={MapPinIcon} />
            <IconLabel label={salaryRange} icon={CurrencyDollarIcon} />
            <IconLabel
              label={languageRequirement}
              icon={ChatBubbleLeftRightIcon}
            />
          </div>
          <p
            className={
              deadline
                ? "font-bold text-error-600 dark:text-error-100"
                : "font-bold"
            }
          >
            {poolIsClosed
              ? intl.formatMessage(
                  {
                    defaultMessage: "Applications closed on {closingDate}",
                    id: "D8mu6E",
                    description:
                      "Message informing user applications won't be accepted after closing date",
                  },
                  {
                    closingDate: pool.closingDate
                      ? formatDate({
                          date: parseDateTimeUtc(pool.closingDate),
                          formatString: DATE_FORMAT_LOCALIZED,
                          intl,
                          timeZone: "Canada/Pacific",
                        })
                      : notAvailable,
                  },
                )
              : intl.formatMessage(
                  {
                    defaultMessage: "Apply on or before {closingDate}",
                    id: "LjYzkS",
                    description: "Message to apply to the pool before deadline",
                  },
                  {
                    closingDate: pool.closingDate
                      ? formatDate({
                          date: parseDateTimeUtc(pool.closingDate),
                          formatString: DATE_FORMAT_LOCALIZED,
                          intl,
                          timeZone: "Canada/Pacific",
                        })
                      : notAvailable,
                  },
                )}
          </p>
        </div>
        <Link
          className="justify-self-end after:absolute after:inset-0 after:content-[''] xs:self-end"
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
          />
        </div>
      </div>
    </Card>
  );
};

export default JobCard;
