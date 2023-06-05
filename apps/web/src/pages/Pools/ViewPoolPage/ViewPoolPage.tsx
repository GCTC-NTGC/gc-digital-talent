import * as React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";
import ClipboardIcon from "@heroicons/react/24/outline/ClipboardIcon";
import {
  Pending,
  Chip,
  Chips,
  IconButton,
  NotFound,
  Link,
} from "@gc-digital-talent/ui";
import {
  commonMessages,
  getLocalizedName,
  getPoolStatus,
  getLanguageRequirement,
  getPoolStream,
  getSecurityClearance,
} from "@gc-digital-talent/i18n";
import { Input } from "@gc-digital-talent/forms";
import {
  parseDateTimeUtc,
  relativeClosingDate,
} from "@gc-digital-talent/date-helpers";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import { Scalars, SkillCategory, useGetPoolQuery, Pool } from "~/api/generated";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import { notEmpty } from "@gc-digital-talent/helpers";
import adminMessages from "~/messages/adminMessages";

interface ViewPoolProps {
  pool: Pool;
}

export const ViewPool = ({ pool }: ViewPoolProps): JSX.Element => {
  const intl = useIntl();
  const paths = useRoutes();
  const form = useForm();
  const [linkCopied, setLinkCopied] = React.useState<boolean>(false);
  const notProvided = intl.formatMessage(commonMessages.notProvided);

  /** Reset link copied after 3 seconds */
  React.useEffect(() => {
    if (linkCopied) {
      setTimeout(() => {
        setLinkCopied(false);
      }, 3000);
    }
  }, [linkCopied, setLinkCopied]);

  const classification = pool.classifications ? pool.classifications[0] : null;

  const essentialOccupationalSkills = pool.essentialSkills?.filter((skill) => {
    return skill.families?.some(
      (family) => family.category === SkillCategory.Technical,
    );
  });

  const essentialTransferableSkills = pool.essentialSkills?.filter((skill) => {
    return skill.families?.some(
      (family) => family.category === SkillCategory.Behavioural,
    );
  });

  const nonEssentialOccupationalSkills = pool.nonessentialSkills?.filter(
    (skill) => {
      return skill.families?.some(
        (family) => family.category === SkillCategory.Technical,
      );
    },
  );

  const nonEssentialTransferableSkills = pool.nonessentialSkills?.filter(
    (skill) => {
      return skill.families?.some(
        (family) => family.category === SkillCategory.Behavioural,
      );
    },
  );

  const languageRequirement = pool.language
    ? intl.formatMessage(getLanguageRequirement(pool.language))
    : notProvided;

  const securityClearance = pool.securityClearance
    ? intl.formatMessage(getSecurityClearance(pool.securityClearance))
    : notProvided;

  const screeningQuestions = pool?.screeningQuestions?.filter(notEmpty) || [];

  const relativeToAbsoluteURL = (path: string): string => {
    const { host, protocol } = window.location;
    return `${protocol}//${host}${path}`;
  };

  let closingStringLocal;
  let closingStringPacific;
  if (pool.closingDate) {
    const closingDateObject = parseDateTimeUtc(pool.closingDate);
    closingStringLocal = relativeClosingDate({
      closingDate: closingDateObject,
      intl,
    });
    closingStringPacific = relativeClosingDate({
      closingDate: closingDateObject,
      intl,
      timeZone: "Canada/Pacific",
    });
  } else {
    closingStringLocal = "";
    closingStringPacific = "";
  }

  const pageTitle = intl.formatMessage({
    defaultMessage: "View pool",
    id: "vINfxJ",
    description: "Page title for the individual pool page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <div data-h2-container="base(left, medium, 0)">
        <FormProvider {...form}>
          <h2
            data-h2-margin="base(x2, 0, 0, 0)"
            data-h2-font-size="base(h3, 1)"
          >
            {intl.formatMessage({
              defaultMessage: "View pool advertisement",
              id: "w9FYqi",
              description: "Sub title for admin view pool page",
            })}
          </h2>
          <div data-h2-flex-grid="base(flex-start, x1, 0)">
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <Input
                readOnly
                value={relativeToAbsoluteURL(paths.pool(pool.id))}
                hideOptional
                id="poolUrl"
                name="poolUrl"
                type="text"
                label={intl.formatMessage({
                  defaultMessage: "Pool advertisement",
                  id: "de2F/x",
                  description: "Label for pool advertisement url field",
                })}
              />
            </div>
            <div
              data-h2-flex-item="base(1of1)"
              data-h2-display="base(flex)"
              data-h2-align-items="base(center)"
            >
              <IconButton
                data-h2-margin="base(0, x.5, 0, 0)"
                mode="outline"
                color="secondary"
                disabled={linkCopied}
                icon={linkCopied ? CheckIcon : ClipboardIcon}
                onClick={() => {
                  navigator.clipboard.writeText(
                    relativeToAbsoluteURL(paths.pool(pool.id)),
                  );
                  setLinkCopied(true);
                }}
              >
                <span aria-live={linkCopied ? "assertive" : "off"}>
                  {linkCopied
                    ? intl.formatMessage({
                        defaultMessage: "Link copied!",
                        id: "E9S4B8",
                        description:
                          "Button text to be displayed after link was copied",
                      })
                    : intl.formatMessage({
                        defaultMessage: "Copy link",
                        id: "044hi7",
                        description: "Button text to copy a url",
                      })}
                </span>
              </IconButton>
              <Link
                data-h2-margin="base(0, x.5, 0, 0)"
                mode="outline"
                color="secondary"
                href={paths.pool(pool.id)}
                newTab
              >
                {intl.formatMessage({
                  defaultMessage: "View pool advertisement",
                  id: "G/MFLe",
                  description:
                    "Link text to view the public facing pool advertisement",
                })}
              </Link>
            </div>
          </div>
          <h2 data-h2-margin="base(x2, 0, 0, 0)" data-h2-font-size="base(h3)">
            {intl.formatMessage({
              defaultMessage: "Details",
              id: "xzkqPm",
              description: "Sub title for admin view pool page",
            })}
          </h2>
          {classification ? (
            <div data-h2-flex-grid="base(flex-start, x1, 0)">
              <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
                <Input
                  id="classification"
                  name="classification"
                  type="text"
                  readOnly
                  hideOptional
                  value={`${classification.group}-0${
                    classification.level
                  }  (${getLocalizedName(classification.name, intl)})`}
                  label={intl.formatMessage({
                    defaultMessage: "Classification",
                    id: "w/qZsH",
                    description:
                      "Label displayed on the pool form classification field.",
                  })}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
                <Input
                  id="stream"
                  name="stream"
                  type="text"
                  readOnly
                  hideOptional
                  value={
                    pool.stream
                      ? intl.formatMessage(getPoolStream(pool.stream))
                      : ""
                  }
                  label={intl.formatMessage({
                    defaultMessage: "Streams/Job Titles",
                    id: "PzijvH",
                    description:
                      "Label displayed on the pool form stream/job title field.",
                  })}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
                <Input
                  id="specificTitleEn"
                  name="specificTitleEn"
                  type="text"
                  readOnly
                  hideOptional
                  value={pool.name?.en ?? ""}
                  label={intl.formatMessage({
                    defaultMessage: "Specific Title (English)",
                    id: "fTwl6k",
                    description:
                      "Label for a pool advertisements specific English title",
                  })}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
                <Input
                  id="specificTitleFr"
                  name="specificTitleFr"
                  type="text"
                  readOnly
                  hideOptional
                  value={pool.name?.fr ?? ""}
                  label={intl.formatMessage({
                    defaultMessage: "Specific Title (French)",
                    id: "MDjwSO",
                    description:
                      "Label for a pool advertisements specific French title",
                  })}
                />
              </div>
            </div>
          ) : null}
          <div data-h2-flex-grid="base(flex-start, x1, 0)">
            <div data-h2-flex-item="base(1of1) p-tablet(1of3)">
              <Input
                id="processNumber"
                name="processNumber"
                type="text"
                readOnly
                hideOptional
                value={pool.processNumber ?? ""}
                label={intl.formatMessage({
                  defaultMessage: "Process Number",
                  id: "1E0RiD",
                  description: "Label for a pools process number",
                })}
              />
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of3)">
              <Input
                id="expiryDate"
                name="expiryDate"
                type="text"
                readOnly
                hideOptional
                value={closingStringLocal}
                label={intl.formatMessage({
                  defaultMessage: "Closing date",
                  id: "VWz3+d",
                  description: "Label for a pool advertisements expiry date",
                })}
              />
            </div>
            {closingStringPacific &&
              closingStringPacific !== closingStringLocal && (
                <div data-h2-flex-item="base(1of1) p-tablet(1of3)">
                  <Input
                    id="expiryDatePacific"
                    name="expiryDatePacific"
                    type="text"
                    readOnly
                    hideOptional
                    value={closingStringPacific}
                    label={intl.formatMessage({
                      defaultMessage: "Closing date (Pacific time zone)",
                      id: "j6V32h",
                      description:
                        "Label for a pool advertisements expiry date in the Pacific time zone",
                    })}
                  />
                </div>
              )}
            <div data-h2-flex-item="base(1of1) p-tablet(1of3)">
              <Input
                id="status"
                name="status"
                type="text"
                readOnly
                hideOptional
                value={intl.formatMessage(getPoolStatus(pool.status ?? ""))}
                label={intl.formatMessage({
                  defaultMessage: "Status",
                  id: "cy5aj8",
                  description: "Label for a pool advertisements status",
                })}
              />
            </div>

            <div data-h2-flex-item="base(1of1)">
              <h2
                data-h2-margin="base(x2, 0, 0, 0)"
                data-h2-font-size="base(h3)"
              >
                {intl.formatMessage({
                  defaultMessage: "Your impact",
                  id: "rGE0gj",
                  description: "Title for pool advertisement impact section",
                })}
              </h2>
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <p
                data-h2-margin="base(x1, 0, 0, 0)"
                data-h2-font-weight="base(700)"
                data-h2-font-size="base(h6)"
              >
                {intl.formatMessage({
                  defaultMessage: "English impact text",
                  id: "BzaGwp",
                  description: "Title for English pool advertisement impact",
                })}
              </p>
              <p data-h2-margin="base(x.5, 0, 0, 0)">
                {pool.yourImpact?.en || notProvided}
              </p>
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <p
                data-h2-margin="base(x1, 0, 0, 0)"
                data-h2-font-weight="base(700)"
                data-h2-font-size="base(h6)"
              >
                {intl.formatMessage({
                  defaultMessage: "French impact text",
                  id: "CTnN9W",
                  description: "Title for French pool advertisement impact",
                })}
              </p>
              <p data-h2-margin="base(x.5, 0, 0, 0)">
                {pool.yourImpact?.fr || notProvided}
              </p>
            </div>
            <div data-h2-flex-item="base(1of1)">
              <h2
                data-h2-margin="base(x2, 0, 0, 0)"
                data-h2-font-size="base(h3)"
              >
                {intl.formatMessage({
                  defaultMessage: "Your work",
                  id: "Qp6B20",
                  description: "Title for pool advertisement work text section",
                })}
              </h2>
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <p
                data-h2-margin="base(x1, 0, 0, 0)"
                data-h2-font-weight="base(700)"
                data-h2-font-size="base(h6)"
              >
                {intl.formatMessage({
                  defaultMessage: "English work text",
                  id: "UjGx0m",
                  description: "Title for English pool advertisement Work",
                })}
              </p>
              <p data-h2-margin="base(x.5, 0, 0, 0)">
                {pool.keyTasks?.en || notProvided}
              </p>
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <p
                data-h2-margin="base(x1, 0, 0, 0)"
                data-h2-font-weight="base(700)"
                data-h2-font-size="base(h6)"
              >
                {intl.formatMessage({
                  defaultMessage: "French work text",
                  id: "88Haix",
                  description: "Title for French pool advertisement Work",
                })}
              </p>
              <p data-h2-margin="base(x.5, 0, 0, 0)">
                {pool.keyTasks?.fr || notProvided}
              </p>
            </div>
          </div>
          <h2 data-h2-margin="base(x2, 0, 0, 0)" data-h2-font-size="base(h3)">
            {intl.formatMessage({
              defaultMessage: "Need to have skills",
              id: "FFaQND",
              description: "Title required skills for a pool advertisement",
            })}
          </h2>
          <h3
            data-h2-font-size="base(h6)"
            data-h2-font-weight="base(700)"
            data-h2-margin="base(x1, 0, x.5, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "Occupational",
              id: "Vpk+nl",
              description:
                "Title for pool advertisement occupational skill list",
            })}
          </h3>
          {essentialOccupationalSkills?.length ? (
            <Chips>
              {essentialOccupationalSkills.map((skill) => (
                <Chip
                  key={`occupationalSkill-${skill.id}`}
                  mode="outline"
                  color="primary"
                  label={getLocalizedName(skill.name, intl)}
                />
              ))}
            </Chips>
          ) : (
            <p>{notProvided}</p>
          )}
          <h3
            data-h2-font-size="base(h6)"
            data-h2-font-weight="base(700)"
            data-h2-margin="base(x1, 0, x.5, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "Transferable",
              id: "eGEusj",
              description:
                "Title for pool advertisement transferable skill list",
            })}
          </h3>
          {essentialTransferableSkills?.length ? (
            <Chips>
              {essentialTransferableSkills.map((skill) => (
                <Chip
                  key={`occupationalSkill-${skill.id}`}
                  mode="outline"
                  color="primary"
                  label={getLocalizedName(skill.name, intl)}
                />
              ))}
            </Chips>
          ) : (
            <p>{notProvided}</p>
          )}
          <h2 data-h2-margin="base(x2, 0, 0, 0)" data-h2-font-size="base(h3)">
            {intl.formatMessage({
              defaultMessage: "Nice to have skills",
              id: "kTW+mP",
              description: "Title optional skills for a pool advertisement",
            })}
          </h2>
          <h3
            data-h2-font-size="base(h6)"
            data-h2-font-weight="base(700)"
            data-h2-margin="base(x1, 0, x.5, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "Occupational",
              id: "Vpk+nl",
              description:
                "Title for pool advertisement occupational skill list",
            })}
          </h3>
          {nonEssentialOccupationalSkills?.length ? (
            <Chips>
              {nonEssentialOccupationalSkills.map((skill) => (
                <Chip
                  key={`occupationalSkill-${skill.id}`}
                  mode="outline"
                  color="primary"
                  label={getLocalizedName(skill.name, intl)}
                />
              ))}
            </Chips>
          ) : (
            <p>{notProvided}</p>
          )}
          <h3
            data-h2-font-size="base(h6)"
            data-h2-font-weight="base(700)"
            data-h2-margin="base(x1, 0, x.5, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "Transferable",
              id: "eGEusj",
              description:
                "Title for pool advertisement transferable skill list",
            })}
          </h3>
          {nonEssentialTransferableSkills?.length ? (
            <Chips>
              {nonEssentialTransferableSkills.map((skill) => (
                <Chip
                  key={`occupationalSkill-${skill.id}`}
                  mode="outline"
                  color="primary"
                  label={getLocalizedName(skill.name, intl)}
                />
              ))}
            </Chips>
          ) : (
            <p>{notProvided}</p>
          )}
          <h2 data-h2-margin="base(x2, 0, x1, 0)" data-h2-font-size="base(h3)">
            {intl.formatMessage({
              defaultMessage: "Requirements",
              id: "P5xgmH",
              description: "Title for a pool advertisement requirements",
            })}
          </h2>
          <ul>
            <li>
              {intl.formatMessage(
                {
                  defaultMessage: "Language requirement: {languageRequirement}",
                  id: "fvJnoC",
                  description: "Pool advertisement language requirement",
                },
                {
                  languageRequirement,
                },
              )}
            </li>
            <li>
              {intl.formatMessage(
                {
                  defaultMessage: "Security clearance: {securityClearance}",
                  id: "GYk6Nz",
                  description:
                    "Pool advertisement security clearance requirement",
                },
                {
                  securityClearance,
                },
              )}
            </li>
            {pool.isRemote ? (
              <li>
                {intl.formatMessage({
                  defaultMessage: "Location: Remote optional",
                  id: "3OfvwW",
                  description:
                    "Label for a pool advertisement that has remote option.",
                })}
              </li>
            ) : (
              <>
                <li>
                  {intl.formatMessage(
                    {
                      defaultMessage: "Location (English): {locationEn}",
                      id: "IcDAU1",
                      description:
                        "Pool advertisement location requirement, English",
                    },
                    {
                      locationEn: pool.location?.en ?? notProvided,
                    },
                  )}
                </li>
                <li>
                  {intl.formatMessage(
                    {
                      defaultMessage: "Location (French): {locationFr}",
                      id: "cEeW3m",
                      description:
                        "Pool advertisement location requirement, French",
                    },
                    {
                      locationFr: pool.location?.fr ?? notProvided,
                    },
                  )}
                </li>
              </>
            )}
          </ul>
          <h2 data-h2-margin="base(x2, 0, x1, 0)" data-h2-font-size="base(h3)">
            {intl.formatMessage({
              defaultMessage: "Screening questions",
              id: "c+QwbR",
              description: "Subtitle for the pool screening questions",
            })}
          </h2>
          {screeningQuestions.length ? (
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x.5, 0)"
            >
              {screeningQuestions.map((screeningQuestion, index) => (
                <div
                  key={screeningQuestion.id}
                  data-h2-background="base(background)"
                  data-h2-display="base(flex)"
                  data-h2-align-items="base(flex-start)"
                  data-h2-gap="base(0, x.25)"
                >
                  <div
                    data-h2-flex-grow="base(1)"
                    data-h2-padding="base(x1)"
                    data-h2-shadow="base(medium)"
                    data-h2-radius="base(rounded)"
                  >
                    <div
                      data-h2-display="base(grid)"
                      data-h2-grid-template-columns="base(1fr 1fr)"
                      data-h2-gap="base(0, x.5)"
                    >
                      <div>
                        <h3
                          data-h2-font-size="base(copy)"
                          data-h2-font-weight="base(700)"
                        >
                          {intl.formatMessage(
                            {
                              defaultMessage: "Question {number} (EN)",
                              id: "0moSLr",
                              description:
                                "Heading for displaying a screening question English",
                            },
                            { number: index + 1 },
                          )}
                        </h3>
                        <p data-h2-margin="base(x.5, 0, 0, 0)">
                          {screeningQuestion.question?.en}
                        </p>
                      </div>
                      <div>
                        <h3
                          data-h2-font-size="base(copy)"
                          data-h2-font-weight="base(700)"
                        >
                          {intl.formatMessage(
                            {
                              defaultMessage: "Question {number} (FR)",
                              id: "cag7TH",
                              description:
                                "Heading for displaying a screening question French",
                            },
                            { number: index + 1 },
                          )}
                        </h3>
                        <p data-h2-margin="base(x.5, 0, 0, 0)">
                          {screeningQuestion.question?.fr}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    data-h2-radius="base(rounded)"
                    data-h2-shadow="base(medium)"
                    data-h2-overflow="base(hidden)"
                    data-h2-padding="base(x.25, x.5)"
                  >
                    <span
                      aria-hidden="true"
                      data-h2-text-align="base(center)"
                      data-h2-font-weight="base(700)"
                    >
                      {index + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>{notProvided}</p>
          )}
        </FormProvider>
        <p data-h2-margin="base(x2, 0, 0, 0)">
          <Link mode="solid" color="secondary" href={paths.poolTable()}>
            {intl.formatMessage({
              defaultMessage: "Back to pools",
              id: "Pr8bok",
              description:
                "Link text for buttons to go back to the admin pools page",
            })}
          </Link>
        </p>
      </div>
    </>
  );
};

type RouteParams = {
  poolId: Scalars["ID"];
};

const ViewPoolPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { poolId } = useParams<RouteParams>();
  const [{ data, fetching, error }] = useGetPoolQuery({
    variables: { id: poolId || "" },
  });

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: routes.home(),
    },
    {
      label: intl.formatMessage(adminMessages.pools),
      url: routes.poolTable(),
    },
    ...(poolId
      ? [
          {
            label: getLocalizedName(data?.pool?.name, intl),
            url: routes.poolView(poolId),
          },
        ]
      : []),
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <Pending fetching={fetching} error={error}>
        {data?.pool ? (
          <ViewPool pool={data.pool} />
        ) : (
          <NotFound
            headingMessage={intl.formatMessage(commonMessages.notFound)}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage: "Pool {poolId} not found.",
                  id: "Sb2fEr",
                  description: "Message displayed for pool not found.",
                },
                { poolId },
              )}
            </p>
          </NotFound>
        )}
      </Pending>
    </AdminContentWrapper>
  );
};

export default ViewPoolPage;
