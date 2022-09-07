/* eslint-disable jsx-a11y/anchor-is-valid */
/* NOTE: This is temporary until we start the Candidates/Requests pages */
import * as React from "react";
import { useIntl } from "react-intl";
import {
  CheckIcon,
  ClipboardIcon,
  CogIcon,
  ArrowTopRightOnSquareIcon,
  TicketIcon,
  UserGroupIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

import Breadcrumbs from "@common/components/Breadcrumbs";
import type { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import PageHeader from "@common/components/PageHeader";
import { commonMessages } from "@common/messages";
import { getLocale, getLocalizedName } from "@common/helpers/localize";

import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import Chip, { Chips } from "@common/components/Chip";
import Link, { IconLink } from "@common/components/Link";
import { Input } from "@common/components/form";
import { IconButton } from "@common/components/Button";
import { FormProvider, useForm } from "react-hook-form";
import {
  getAdvertisementStatus,
  getLanguageRequirement,
  getSecurityClearance,
} from "@common/constants/localizedConstants";
import { useAdminRoutes } from "../../adminRoutes";
import {
  SkillCategory,
  useGetPoolAdvertisementQuery,
} from "../../api/generated";
import type { PoolAdvertisement } from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";

type SpacerProps = React.HTMLProps<HTMLSpanElement>;

const Spacer = ({ children, ...rest }: SpacerProps) => (
  <span data-h2-margin="base(0, x.5, x.5, 0)" {...rest}>
    {children}
  </span>
);

interface ViewPoolPageProps {
  pool: PoolAdvertisement;
}

export const ViewPoolPage = ({ pool }: ViewPoolPageProps): JSX.Element => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const adminPaths = useAdminRoutes();
  const form = useForm();
  const [linkCopied, setLinkCopied] = React.useState<boolean>(false);

  /** Reset link copied after 3 seconds */
  React.useEffect(() => {
    if (linkCopied) {
      setTimeout(() => {
        setLinkCopied(false);
      }, 3000);
    }
  }, [linkCopied, setLinkCopied]);

  const pageTitle = intl.formatMessage({
    defaultMessage: "Pool Details",
    id: "yBmBnd",
    description: "Title for the page when viewing an individual pool.",
  });

  const poolName = pool.name ? pool.name[locale] : pageTitle;
  const classification = pool.classifications ? pool.classifications[0] : null;
  const genericTitle = classification?.genericJobTitles?.length
    ? classification.genericJobTitles[0]
    : null;

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

  const languageRequirement = intl.formatMessage(
    getLanguageRequirement(pool.advertisementLanguage ?? ""),
  );

  const securityClearance = intl.formatMessage(
    getSecurityClearance(pool.securityClearance ?? ""),
  );

  const links = [
    {
      title: intl.formatMessage({
        defaultMessage: "Home",
        id: "DUK/pz",
        description: "Breadcrumb title for the home page link.",
      }),
      href: adminPaths.home(),
    },
    {
      title: intl.formatMessage({
        defaultMessage: "Pools",
        id: "3fAkvM",
        description: "Breadcrumb title for the pools page link.",
      }),
      href: adminPaths.poolTable(),
    },
    {
      title: intl.formatMessage(
        {
          defaultMessage: `Pool ID #{id}`,
          id: "fp7Nll",
          description: "Current pool breadcrumb text",
        },
        { id: pool.id },
      ),
    },
  ] as BreadcrumbsProps["links"];

  return (
    <DashboardContentContainer>
      <div data-h2-container="base(left, medium, 0)">
        <PageHeader icon={Squares2X2Icon}>{poolName}</PageHeader>
        <Breadcrumbs links={links} />
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column) l-tablet(row)"
          data-h2-margin="base(x2, 0)"
        >
          <Spacer>
            <IconLink
              mode="solid"
              color="secondary"
              type="button"
              href={adminPaths.poolEdit(pool.id)}
              icon={UserGroupIcon}
            >
              {intl.formatMessage({
                defaultMessage: "Manage candidates",
                id: "B/VlGq",
                description:
                  "Link text for button to manage candidates of a specific pool",
              })}
            </IconLink>
          </Spacer>
          <Spacer>
            <IconLink
              mode="solid"
              color="secondary"
              type="button"
              href="#"
              disabled
              icon={TicketIcon}
            >
              {intl.formatMessage({
                defaultMessage: "Manage requests",
                id: "v2mXcp",
                description:
                  "Link text for button to manage requests of a specific pool",
              })}
            </IconLink>
          </Spacer>
          <Spacer>
            <IconLink
              mode="solid"
              color="secondary"
              type="button"
              href={adminPaths.poolEdit(pool.id)}
              icon={CogIcon}
            >
              {intl.formatMessage({
                defaultMessage: "Edit pool advertisement",
                id: "dmGvCL",
                description: "Link text for button to edit a specific pool",
              })}
            </IconLink>
          </Spacer>
        </div>
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
          <div data-h2-flex-grid="base(flex-start, 0, x1, 0)">
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <Input
                readOnly
                value={pool.id}
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
                  // TO DO: Update with real URL once we get it
                  navigator.clipboard.writeText(pool.id);
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
              <IconLink
                data-h2-margin="base(0, x.5, 0, 0)"
                mode="outline"
                color="secondary"
                type="button"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                icon={ArrowTopRightOnSquareIcon}
              >
                {intl.formatMessage({
                  defaultMessage: "View pool advertisement",
                  id: "G/MFLe",
                  description:
                    "Link text to view the public facing pool advertisement",
                })}
              </IconLink>
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
            <div data-h2-flex-grid="base(flex-start, 0, x1, 0)">
              <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
                <Input
                  id="targetClassification"
                  name="targetClassification"
                  type="text"
                  readOnly
                  hideOptional
                  value={`${classification.group}-0${classification.level}`}
                  label={intl.formatMessage({
                    defaultMessage: "Target classification",
                    id: "fhkgW2",
                    description:
                      "Label for a pool advertisements classification group and level",
                  })}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
                <Input
                  id="genericTitle"
                  name="genericTitle"
                  type="text"
                  readOnly
                  hideOptional
                  value={getLocalizedName(genericTitle?.name, intl)}
                  label={intl.formatMessage({
                    defaultMessage: "Generic",
                    id: "OumQY2",
                    description:
                      "Label for a pool advertisements generic title",
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
                  value={classification?.name?.en ?? ""}
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
                  value={classification?.name?.fr ?? ""}
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
          <div data-h2-flex-grid="base(flex-start, 0, x1, 0)">
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <Input
                id="expiryDate"
                name="expiryDate"
                type="text"
                readOnly
                hideOptional
                value={new Date(pool.expiryDate).toLocaleString(locale, {
                  dateStyle: "medium",
                })}
                label={intl.formatMessage({
                  defaultMessage: "Closing date",
                  id: "VWz3+d",
                  description: "Label for a pool advertisements expiry date",
                })}
              />
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <Input
                id="status"
                name="status"
                type="text"
                readOnly
                hideOptional
                value={intl.formatMessage(
                  getAdvertisementStatus(pool.advertisementStatus ?? ""),
                )}
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
                  defaultMessage: "Your Impact (English)",
                  id: "LvsYj+",
                  description: "Title for English pool advertisement impact",
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
                  defaultMessage: "Your Impact (English)",
                  id: "LvsYj+",
                  description: "Title for English pool advertisement impact",
                })}
              </p>
              <p data-h2-margin="base(x.5, 0, 0, 0)">
                {pool.yourImpact?.en || ""}
              </p>
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <p
                data-h2-margin="base(x1, 0, 0, 0)"
                data-h2-font-weight="base(700)"
                data-h2-font-size="base(h6)"
              >
                {intl.formatMessage({
                  defaultMessage: "Your Impact (French)",
                  id: "6BD4FK",
                  description: "Title for French pool advertisement impact",
                })}
              </p>
              <p data-h2-margin="base(x.5, 0, 0, 0)">
                {pool.yourImpact?.fr || ""}
              </p>
            </div>
            <div data-h2-flex-item="base(1of1)">
              <h2
                data-h2-margin="base(x2, 0, 0, 0)"
                data-h2-font-size="base(h3)"
              >
                Your work
              </h2>
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <p
                data-h2-margin="base(x1, 0, 0, 0)"
                data-h2-font-weight="base(700)"
                data-h2-font-size="base(h6)"
              >
                {intl.formatMessage({
                  defaultMessage: "Your Work (English)",
                  id: "/7tcPl",
                  description: "Title for English pool advertisement Work",
                })}
              </p>
              <p data-h2-margin="base(x.5, 0, 0, 0)">
                {pool.keyTasks?.en || ""}
              </p>
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <p
                data-h2-margin="base(x1, 0, 0, 0)"
                data-h2-font-weight="base(700)"
                data-h2-font-size="base(h6)"
              >
                {intl.formatMessage({
                  defaultMessage: "Your Work (French)",
                  id: "y3mLbv",
                  description: "Title for French pool advertisement Work",
                })}
              </p>
              <p data-h2-margin="base(x.5, 0, 0, 0)">
                {pool.keyTasks?.fr || ""}
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
          {essentialOccupationalSkills?.length ? (
            <>
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
            </>
          ) : null}
          {essentialTransferableSkills?.length ? (
            <>
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
            </>
          ) : null}
          <h2 data-h2-margin="base(x2, 0, 0, 0)" data-h2-font-size="base(h3)">
            {intl.formatMessage({
              defaultMessage: "Nice to have skills",
              id: "kTW+mP",
              description: "Title optional skills for a pool advertisement",
            })}
          </h2>
          {nonEssentialOccupationalSkills?.length ? (
            <>
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
            </>
          ) : null}
          {nonEssentialTransferableSkills?.length ? (
            <>
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
            </>
          ) : null}
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
                      locationEn: pool.advertisementLocation?.en ?? "",
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
                      locationFr: pool.advertisementLocation?.fr ?? "",
                    },
                  )}
                </li>
              </>
            )}
          </ul>
        </FormProvider>
        <p data-h2-margin="base(x2, 0, 0, 0)">
          <Link
            type="button"
            mode="solid"
            color="secondary"
            href={adminPaths.poolTable()}
          >
            {intl.formatMessage({
              defaultMessage: "Back to pools",
              id: "Pr8bok",
              description:
                "Link text for buttons to go back to the admin pools page",
            })}
          </Link>
        </p>
      </div>
    </DashboardContentContainer>
  );
};

interface ViewPoolProps {
  poolId: string;
}

const ViewPool = ({ poolId }: ViewPoolProps) => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useGetPoolAdvertisementQuery({
    variables: { id: poolId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.poolAdvertisement ? (
        <ViewPoolPage pool={data.poolAdvertisement} />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
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
  );
};

export default ViewPool;
