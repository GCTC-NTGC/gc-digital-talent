import CpuChipIcon from "@heroicons/react/24/outline/CpuChipIcon";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";
import ChevronDownIcon from "@heroicons/react/24/solid/ChevronDownIcon";
import { Fragment, ReactNode, useEffect, useState } from "react";

import {
  Accordion,
  Link,
  Chip,
  Heading,
  DropdownMenu,
  Button,
} from "@gc-digital-talent/ui";
import { FAR_FUTURE_DATE } from "@gc-digital-talent/date-helpers";
import { getId, notEmpty, uniqueItems } from "@gc-digital-talent/helpers";
import {
  graphql,
  PoolStream,
  Skill,
  Pool,
  getFragment,
  FragmentType,
  PoolSkillType,
} from "@gc-digital-talent/graphql";
import { getLocalizedEnumStringByValue } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";
import { wrapAbbr } from "~/utils/nameUtils";
import { filterPoolSkillsByType } from "~/utils/skillUtils";

import messages from "../../messages";

// the shape of the data model to populate this component
interface StreamViewModel {
  key: PoolStream;
  title: ReactNode;
  label: ReactNode;
  summary: ReactNode;
  classifications: {
    key: string;
    title: ReactNode;
    description: ReactNode;
    pool: Pool | undefined;
    applyMessage: ReactNode;
  }[];
}

// choose a pool from a collection of pools for association with a stream, classification group, and classification level
const selectPoolForSection = (
  pools: Pool[],
  stream: PoolStream,
  group: string,
  level: number,
): Pool | undefined => {
  return (
    pools
      // last closing date first to be selected
      .sort((p1, p2) =>
        (p1.closingDate ?? FAR_FUTURE_DATE) <
        (p2.closingDate ?? FAR_FUTURE_DATE)
          ? 1
          : -1,
      )
      .find(
        (p) =>
          // must match section stream
          p.stream?.value === stream &&
          // must include section classification group and level
          !!(
            p.classification?.group === group &&
            p.classification.level === level
          ),
      )
  );
};

// Stream is recommended if any of the classifications match condition.
// Every essential skill in the classification is present in the user's skills.
const streamIsRecommended = (
  stream: StreamViewModel,
  userSkillIds: Skill["id"][],
): boolean =>
  stream.classifications.some((classification) => {
    const essentialSkills = filterPoolSkillsByType(
      classification.pool?.poolSkills,
      PoolSkillType.Essential,
    );

    return essentialSkills.every((skill) => userSkillIds.includes(skill.id));
  });

const OngoingRecruitmentSection_QueryFragment = graphql(/* GraphQL */ `
  fragment OngoingRecruitmentSection on Query {
    me {
      experiences {
        id
        skills {
          id
        }
      }
    }
    streams: localizedEnumStrings(enumName: "PoolStream") {
      value
      label {
        en
        fr
      }
    }
  }
`);

export interface OngoingRecruitmentSectionProps {
  pools: Pool[];
  query?: FragmentType<typeof OngoingRecruitmentSection_QueryFragment>;
}

const OngoingRecruitmentSection = ({
  pools,
  query,
}: OngoingRecruitmentSectionProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { hash } = useLocation();

  /**
   * Scroll to this section if there is a hash and ID that matches
   */
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.substring(1));
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({
            block: "start",
          });
        }, 10);
      }
    }
  }, [hash]);

  // is either a PoolStream or has a value of "ALL" which is the default and matches with no filtering
  const [quickFilterStream, setQuickFilterStream] = useState<
    PoolStream | "ALL"
  >("ALL");

  const data = getFragment(OngoingRecruitmentSection_QueryFragment, query);
  // const pools =
  //   data?.publishedPools.filter(
  //     (pool) => typeof pool !== `undefined` && !!pool,
  //   ) ?? [];
  const mySkillIdsWithDuplicates = data?.me?.experiences
    ?.flatMap((e) => e?.skills)
    .filter(notEmpty)
    .map(getId);
  const mySkillIds = uniqueItems(mySkillIdsWithDuplicates ?? []);

  const abbreviation = (text: ReactNode) => wrapAbbr(text, intl);

  // this great big object is all the data to populate the accordions
  const streams: StreamViewModel[] = [
    // IT business line advisory services
    {
      key: PoolStream.BusinessAdvisoryServices,
      title: intl.formatMessage(messages.businessAdvisoryServicesTitle, {
        abbreviation,
      }),
      label: intl.formatMessage(messages.businessAdvisoryServicesLabel),
      summary: intl.formatMessage(messages.businessAdvisoryServicesSummary, {
        abbreviation,
      }),
      classifications: [
        {
          key: "ba-it01",
          title: intl.formatMessage(messages.it01Title, {
            abbreviation,
          }),
          description: intl.formatMessage(messages.it01Description),
          pool: selectPoolForSection(
            pools,
            PoolStream.BusinessAdvisoryServices,
            "IT",
            1,
          ),
          applyMessage: intl.formatMessage(messages.it01ApplyMessage, {
            name: intl.formatMessage(messages.businessAdvisoryServicesTitle, {
              abbreviation,
            }),
          }),
        },
        {
          key: "ba-it02",
          title: intl.formatMessage(messages.it02Title, {
            abbreviation,
          }),
          description: intl.formatMessage(messages.it02Description),
          pool: selectPoolForSection(
            pools,
            PoolStream.BusinessAdvisoryServices,
            "IT",
            2,
          ),
          applyMessage: intl.formatMessage(messages.it02ApplyMessage, {
            name: intl.formatMessage(messages.businessAdvisoryServicesTitle, {
              abbreviation,
            }),
          }),
        },
        {
          key: "ba-it03",
          title: intl.formatMessage(messages.it03Title, {
            abbreviation,
          }),
          description: (
            <>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it03Description1)}
              </p>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it03Description2)}
              </p>
            </>
          ),
          pool: selectPoolForSection(
            pools,
            PoolStream.BusinessAdvisoryServices,
            "IT",
            3,
          ),
          applyMessage: intl.formatMessage(messages.it03ApplyMessage, {
            name: intl.formatMessage(messages.businessAdvisoryServicesTitle, {
              abbreviation,
            }),
          }),
        },
        {
          key: "ba-it04",
          title: intl.formatMessage(messages.it04Title, {
            abbreviation,
          }),
          description: (
            <>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description1, {
                  abbreviation,
                })}
              </p>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description2)}
              </p>
            </>
          ),
          pool: selectPoolForSection(
            pools,
            PoolStream.BusinessAdvisoryServices,
            "IT",
            4,
          ),
          applyMessage: intl.formatMessage(messages.it04ApplyMessage, {
            name: intl.formatMessage(messages.businessAdvisoryServicesTitle, {
              abbreviation,
            }),
          }),
        },
      ],
    },
    // IT database management
    {
      key: PoolStream.DatabaseManagement,
      title: intl.formatMessage(messages.databaseManagementTitle, {
        abbreviation,
      }),
      label: intl.formatMessage(messages.databaseManagementLabel),
      summary: intl.formatMessage(messages.databaseManagementSummary),
      classifications: [
        {
          key: "dm-it01",
          title: intl.formatMessage(messages.it01Title, {
            abbreviation,
          }),
          description: intl.formatMessage(messages.it01Description),
          pool: selectPoolForSection(
            pools,
            PoolStream.DatabaseManagement,
            "IT",
            1,
          ),
          applyMessage: intl.formatMessage(messages.it01ApplyMessage, {
            name: intl.formatMessage(messages.databaseManagementTitle, {
              abbreviation,
            }),
          }),
        },
        {
          key: "dm-it02",
          title: intl.formatMessage(messages.it02Title, {
            abbreviation,
          }),
          description: intl.formatMessage(messages.it02Description),
          pool: selectPoolForSection(
            pools,
            PoolStream.DatabaseManagement,
            "IT",
            2,
          ),
          applyMessage: intl.formatMessage(messages.it02ApplyMessage, {
            name: intl.formatMessage(messages.databaseManagementTitle, {
              abbreviation,
            }),
          }),
        },
        {
          key: "dm-it03",
          title: intl.formatMessage(messages.it03Title, {
            abbreviation,
          }),
          description: (
            <>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it03Description1)}
              </p>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it03Description2)}
              </p>
            </>
          ),
          pool: selectPoolForSection(
            pools,
            PoolStream.DatabaseManagement,
            "IT",
            3,
          ),
          applyMessage: intl.formatMessage(messages.it03ApplyMessage, {
            name: intl.formatMessage(messages.databaseManagementTitle, {
              abbreviation,
            }),
          }),
        },
        {
          key: "dm-it04",
          title: intl.formatMessage(messages.it04Title, {
            abbreviation,
          }),
          description: (
            <>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description1, {
                  abbreviation,
                })}
              </p>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description2)}
              </p>
            </>
          ),
          pool: selectPoolForSection(
            pools,
            PoolStream.DatabaseManagement,
            "IT",
            4,
          ),
          applyMessage: intl.formatMessage(messages.it04ApplyMessage, {
            name: intl.formatMessage(messages.databaseManagementTitle, {
              abbreviation,
            }),
          }),
        },
      ],
    },
    // IT enterprise architecture
    {
      key: PoolStream.EnterpriseArchitecture,
      title: intl.formatMessage(messages.enterpriseArchitectureTitle, {
        abbreviation,
      }),
      label: intl.formatMessage(messages.enterpriseArchitectureLabel),
      summary: intl.formatMessage(messages.enterpriseArchitectureSummary, {
        abbreviation,
      }),
      classifications: [
        {
          key: "ea-it01",
          title: intl.formatMessage(messages.it01Title, {
            abbreviation,
          }),
          description: intl.formatMessage(messages.it01Description),
          pool: selectPoolForSection(
            pools,
            PoolStream.EnterpriseArchitecture,
            "IT",
            1,
          ),
          applyMessage: intl.formatMessage(messages.it01ApplyMessage, {
            name: intl.formatMessage(messages.enterpriseArchitectureTitle, {
              abbreviation,
            }),
          }),
        },
        {
          key: "ea-it02",
          title: intl.formatMessage(messages.it02Title, {
            abbreviation,
          }),
          description: intl.formatMessage(messages.it02Description),
          pool: selectPoolForSection(
            pools,
            PoolStream.EnterpriseArchitecture,
            "IT",
            2,
          ),
          applyMessage: intl.formatMessage(messages.it02ApplyMessage, {
            name: intl.formatMessage(messages.enterpriseArchitectureTitle, {
              abbreviation,
            }),
          }),
        },
        {
          key: "ea-it03",
          title: intl.formatMessage(messages.it03Title, {
            abbreviation,
          }),
          description: (
            <>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it03Description1)}
              </p>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it03Description2)}
              </p>
            </>
          ),
          pool: selectPoolForSection(
            pools,
            PoolStream.EnterpriseArchitecture,
            "IT",
            3,
          ),
          applyMessage: intl.formatMessage(messages.it03ApplyMessage, {
            name: intl.formatMessage(messages.enterpriseArchitectureTitle, {
              abbreviation,
            }),
          }),
        },
        {
          key: "ea-it04",
          title: intl.formatMessage(messages.it04Title, {
            abbreviation,
          }),
          description: (
            <>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description1, {
                  abbreviation,
                })}
              </p>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description2)}
              </p>
            </>
          ),
          pool: selectPoolForSection(
            pools,
            PoolStream.EnterpriseArchitecture,
            "IT",
            4,
          ),
          applyMessage: intl.formatMessage(messages.it04ApplyMessage, {
            name: intl.formatMessage(messages.enterpriseArchitectureTitle, {
              abbreviation,
            }),
          }),
        },
      ],
    },
    // IT infrastructure operations
    {
      key: PoolStream.InfrastructureOperations,
      title: intl.formatMessage(messages.infrastructureOperationsTitle, {
        abbreviation,
      }),
      label: intl.formatMessage(messages.infrastructureOperationsLabel),
      summary: intl.formatMessage(messages.infrastructureOperationsSummary, {
        abbreviation,
      }),
      classifications: [
        {
          key: "io-it01",
          title: intl.formatMessage(messages.it01Title, {
            abbreviation,
          }),
          description: intl.formatMessage(messages.it01Description),
          pool: selectPoolForSection(
            pools,
            PoolStream.InfrastructureOperations,
            "IT",
            1,
          ),
          applyMessage: intl.formatMessage(messages.it01ApplyMessage, {
            name: intl.formatMessage(messages.infrastructureOperationsTitle, {
              abbreviation,
            }),
          }),
        },
        {
          key: "io-it02",
          title: intl.formatMessage(messages.it02Title, {
            abbreviation,
          }),
          description: intl.formatMessage(messages.it02Description),
          pool: selectPoolForSection(
            pools,
            PoolStream.InfrastructureOperations,
            "IT",
            2,
          ),
          applyMessage: intl.formatMessage(messages.it02ApplyMessage, {
            name: intl.formatMessage(messages.infrastructureOperationsTitle, {
              abbreviation,
            }),
          }),
        },
        {
          key: "io-it03",
          title: intl.formatMessage(messages.it03Title, {
            abbreviation,
          }),
          description: (
            <>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it03Description1)}
              </p>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it03Description2)}
              </p>
            </>
          ),
          pool: selectPoolForSection(
            pools,
            PoolStream.InfrastructureOperations,
            "IT",
            3,
          ),
          applyMessage: intl.formatMessage(messages.it03ApplyMessage, {
            name: intl.formatMessage(messages.infrastructureOperationsTitle, {
              abbreviation,
            }),
          }),
        },
        {
          key: "io-it04",
          title: intl.formatMessage(messages.it04Title, {
            abbreviation,
          }),
          description: (
            <>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description1, {
                  abbreviation,
                })}
              </p>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description2)}
              </p>
            </>
          ),
          pool: selectPoolForSection(
            pools,
            PoolStream.InfrastructureOperations,
            "IT",
            4,
          ),
          applyMessage: intl.formatMessage(messages.it04ApplyMessage, {
            name: intl.formatMessage(messages.infrastructureOperationsTitle, {
              abbreviation,
            }),
          }),
        },
      ],
    },
    // IT planning and reporting
    {
      key: PoolStream.PlanningAndReporting,
      title: intl.formatMessage(messages.planningAndReportingTitle, {
        abbreviation,
      }),
      label: intl.formatMessage(messages.planningAndReportingLabel),
      summary: intl.formatMessage(messages.planningAndReportingSummary, {
        abbreviation,
      }),
      classifications: [
        {
          key: "pr-it01",
          title: intl.formatMessage(messages.it01Title, {
            abbreviation,
          }),
          description: intl.formatMessage(messages.it01Description),
          pool: selectPoolForSection(
            pools,
            PoolStream.PlanningAndReporting,
            "IT",
            1,
          ),
          applyMessage: intl.formatMessage(messages.it01ApplyMessage, {
            name: intl.formatMessage(messages.planningAndReportingTitle, {
              abbreviation,
            }),
          }),
        },
        {
          key: "pr-it02",
          title: intl.formatMessage(messages.it02Title, {
            abbreviation,
          }),
          description: intl.formatMessage(messages.it02Description),
          pool: selectPoolForSection(
            pools,
            PoolStream.PlanningAndReporting,
            "IT",
            2,
          ),
          applyMessage: intl.formatMessage(messages.it02ApplyMessage, {
            name: intl.formatMessage(messages.planningAndReportingTitle, {
              abbreviation,
            }),
          }),
        },
        {
          key: "pr-it03",
          title: intl.formatMessage(messages.it03Title, {
            abbreviation,
          }),
          description: (
            <>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it03Description1)}
              </p>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it03Description2)}
              </p>
            </>
          ),
          pool: selectPoolForSection(
            pools,
            PoolStream.PlanningAndReporting,
            "IT",
            3,
          ),
          applyMessage: intl.formatMessage(messages.it03ApplyMessage, {
            name: intl.formatMessage(messages.planningAndReportingTitle, {
              abbreviation,
            }),
          }),
        },
        {
          key: "pr-it04",
          title: intl.formatMessage(messages.it04Title, {
            abbreviation,
          }),
          description: (
            <>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description1, {
                  abbreviation,
                })}
              </p>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description2)}
              </p>
            </>
          ),
          pool: selectPoolForSection(
            pools,
            PoolStream.PlanningAndReporting,
            "IT",
            4,
          ),
          applyMessage: intl.formatMessage(messages.it04ApplyMessage, {
            name: intl.formatMessage(messages.planningAndReportingTitle, {
              abbreviation,
            }),
          }),
        },
      ],
    },
    // IT project portfolio management
    {
      key: PoolStream.ProjectPortfolioManagement,
      title: intl.formatMessage(messages.projectPortfolioManagementTitle, {
        abbreviation,
      }),
      label: intl.formatMessage(messages.projectPortfolioManagementLabel),
      summary: intl.formatMessage(messages.projectPortfolioSummary, {
        abbreviation,
      }),
      classifications: [
        {
          key: "ppm-it01",
          title: intl.formatMessage(messages.it01Title, {
            abbreviation,
          }),
          description: intl.formatMessage(messages.it01Description),
          pool: selectPoolForSection(
            pools,
            PoolStream.ProjectPortfolioManagement,
            "IT",
            1,
          ),
          applyMessage: intl.formatMessage(messages.it01ApplyMessage, {
            name: intl.formatMessage(messages.projectPortfolioManagementTitle, {
              abbreviation,
            }),
          }),
        },
        {
          key: "ppm-it02",
          title: intl.formatMessage(messages.it02Title, {
            abbreviation,
          }),
          description: intl.formatMessage(messages.it02Description),
          pool: selectPoolForSection(
            pools,
            PoolStream.ProjectPortfolioManagement,
            "IT",
            2,
          ),
          applyMessage: intl.formatMessage(messages.it02ApplyMessage, {
            name: intl.formatMessage(messages.projectPortfolioManagementTitle, {
              abbreviation,
            }),
          }),
        },
        {
          key: "ppm-it03",
          title: intl.formatMessage(messages.it03Title, {
            abbreviation,
          }),
          description: (
            <>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it03Description1)}
              </p>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it03Description2)}
              </p>
            </>
          ),
          pool: selectPoolForSection(
            pools,
            PoolStream.ProjectPortfolioManagement,
            "IT",
            3,
          ),
          applyMessage: intl.formatMessage(messages.it03ApplyMessage, {
            name: intl.formatMessage(messages.projectPortfolioManagementTitle, {
              abbreviation,
            }),
          }),
        },
        {
          key: "ppm-it04",
          title: intl.formatMessage(messages.it04Title, {
            abbreviation,
          }),
          description: (
            <>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description1, {
                  abbreviation,
                })}
              </p>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description2)}
              </p>
            </>
          ),
          pool: selectPoolForSection(
            pools,
            PoolStream.ProjectPortfolioManagement,
            "IT",
            4,
          ),
          applyMessage: intl.formatMessage(messages.it04ApplyMessage, {
            name: intl.formatMessage(messages.projectPortfolioManagementTitle, {
              abbreviation,
            }),
          }),
        },
      ],
    },
    // IT security
    {
      key: PoolStream.Security,
      title: intl.formatMessage(messages.securityTitle, {
        abbreviation,
      }),
      label: intl.formatMessage(messages.securityLabel),
      summary: intl.formatMessage(messages.securitySummary),
      classifications: [
        {
          key: "s-it01",
          title: intl.formatMessage(messages.it01Title, {
            abbreviation,
          }),
          description: intl.formatMessage(messages.it01Description),
          pool: selectPoolForSection(pools, PoolStream.Security, "IT", 1),
          applyMessage: intl.formatMessage(messages.it01ApplyMessage, {
            name: intl.formatMessage(messages.securityTitle, {
              abbreviation,
            }),
          }),
        },
        {
          key: "s-it02",
          title: intl.formatMessage(messages.it02Title, {
            abbreviation,
          }),
          description: intl.formatMessage(messages.it02Description),
          pool: selectPoolForSection(pools, PoolStream.Security, "IT", 2),
          applyMessage: intl.formatMessage(messages.it02ApplyMessage, {
            name: intl.formatMessage(messages.securityTitle, {
              abbreviation,
            }),
          }),
        },
        {
          key: "s-it03",
          title: intl.formatMessage(messages.it03Title, {
            abbreviation,
          }),
          description: (
            <>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it03Description1)}
              </p>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it03Description2)}
              </p>
            </>
          ),
          pool: selectPoolForSection(pools, PoolStream.Security, "IT", 3),
          applyMessage: intl.formatMessage(messages.it03ApplyMessage, {
            name: intl.formatMessage(messages.securityTitle, {
              abbreviation,
            }),
          }),
        },
        {
          key: "s-it04",
          title: intl.formatMessage(messages.it04Title, {
            abbreviation,
          }),
          description: (
            <>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description1, {
                  abbreviation,
                })}
              </p>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description2)}
              </p>
            </>
          ),
          pool: selectPoolForSection(pools, PoolStream.Security, "IT", 4),

          applyMessage: intl.formatMessage(messages.it04ApplyMessage, {
            name: intl.formatMessage(messages.securityTitle, {
              abbreviation,
            }),
          }),
        },
      ],
    },
    // IT software solutions
    {
      key: PoolStream.SoftwareSolutions,
      title: intl.formatMessage(messages.softwareSolutionsTitle, {
        abbreviation,
      }),
      label: intl.formatMessage(messages.softwareSolutionsLabel),
      summary: intl.formatMessage(messages.softwareSolutionsSummary),
      classifications: [
        {
          key: "ss-it01",
          title: intl.formatMessage(messages.it01Title, {
            abbreviation,
          }),
          description: intl.formatMessage(messages.it01Description),
          pool: selectPoolForSection(
            pools,
            PoolStream.SoftwareSolutions,
            "IT",
            1,
          ),
          applyMessage: intl.formatMessage(messages.it01ApplyMessage, {
            name: intl.formatMessage(messages.softwareSolutionsTitle, {
              abbreviation,
            }),
          }),
        },
        {
          key: "ss-it02",
          title: intl.formatMessage(messages.it02Title, {
            abbreviation,
          }),
          description: intl.formatMessage(messages.it02Description),
          pool: selectPoolForSection(
            pools,
            PoolStream.SoftwareSolutions,
            "IT",
            2,
          ),
          applyMessage: intl.formatMessage(messages.it02ApplyMessage, {
            name: intl.formatMessage(messages.softwareSolutionsTitle, {
              abbreviation,
            }),
          }),
        },
        {
          key: "ss-it03",
          title: intl.formatMessage(messages.it03Title, {
            abbreviation,
          }),
          description: (
            <>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it03Description1)}
              </p>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it03Description2)}
              </p>
            </>
          ),
          pool: selectPoolForSection(
            pools,
            PoolStream.SoftwareSolutions,
            "IT",
            3,
          ),
          applyMessage: intl.formatMessage(messages.it03ApplyMessage, {
            name: intl.formatMessage(messages.softwareSolutionsTitle, {
              abbreviation,
            }),
          }),
        },
        {
          key: "ss-it04",
          title: intl.formatMessage(messages.it04Title, {
            abbreviation,
          }),
          description: (
            <>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description1, {
                  abbreviation,
                })}
              </p>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description2)}
              </p>
            </>
          ),
          pool: selectPoolForSection(
            pools,
            PoolStream.SoftwareSolutions,
            "IT",
            4,
          ),
          applyMessage: intl.formatMessage(messages.it04ApplyMessage, {
            name: intl.formatMessage(messages.softwareSolutionsTitle, {
              abbreviation,
            }),
          }),
        },
      ],
    },
  ];

  // filter to only streams with classifications with a pool ID to apply to
  const streamsWithAvailablePools = streams.filter(
    (stream) =>
      !!stream.classifications.find(
        (classification) => classification.pool?.id,
      ),
  );

  // stream options for the <Dropdown>
  const options = [
    ...streamsWithAvailablePools.map((stream) => ({
      value: stream.key,
      label: stream.label,
    })),
  ];

  // if the quick filter is not "ALL", only show the filtered stream
  const streamsToShow =
    quickFilterStream !== "ALL"
      ? streamsWithAvailablePools.filter((s) => s.key === quickFilterStream)
      : streamsWithAvailablePools;

  // sort list so that recommended streams come first
  streamsToShow.sort((s1, s2) => {
    const a = streamIsRecommended(s1, mySkillIds) ? 1 : 0;
    const b = streamIsRecommended(s2, mySkillIds) ? 1 : 0;
    return b - a;
  });

  return (
    <>
      <Heading
        level="h2"
        size="h3"
        data-h2-font-weight="base(400)"
        id="ongoingRecruitments"
        Icon={CpuChipIcon}
        color="primary"
        data-h2-margin="base(x3, 0, x1, 0)"
      >
        {intl.formatMessage({
          defaultMessage: "Apply to ongoing recruitment",
          id: "RBsGRp",
          description: "title for section with ongoing pool advertisements",
        })}
      </Heading>
      <p data-h2-margin="base(x.5, 0)" data-h2-font-weight="base(700)">
        {intl.formatMessage({
          id: "Uzx5dR",
          defaultMessage:
            "Not seeing an active recruitment process that matches your skillset? No problem, we still want to hear from you.",
          description: "summary for section with ongoing pool advertisements",
        })}
      </p>
      <p>
        {intl.formatMessage({
          id: "ITLoHV",
          defaultMessage:
            "We also offer passive recruitment processes that allow us to find talent fast when the demand arises. While there’s no guarantee a job will result from the opportunities below, it’s an easy way for your name and career timeline to be found by managers when the time comes. Feel free to submit your name to any stream that matches your skills.",
          description:
            "instructions for section with ongoing pool advertisements",
        })}
      </p>
      <p data-h2-margin="base(x1, 0, x.25, 0)">
        {intl.formatMessage({
          defaultMessage: "Select a job stream",
          id: "dJXjhw",
          description:
            "Placeholder for stream filter in browse opportunities form.",
        })}
      </p>
      <div data-h2-display="base(flex)">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button color="primary" utilityIcon={ChevronDownIcon}>
              {quickFilterStream === "ALL"
                ? intl.formatMessage({
                    defaultMessage: "All",
                    id: "XnvXtO",
                    description: "All",
                  })
                : getLocalizedEnumStringByValue(
                    quickFilterStream,
                    data?.streams,
                    intl,
                  )}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content data-h2-padding="base(0)">
            <div data-h2-padding="base(x.5, x1, x.5, x.5)">
              <DropdownMenu.RadioGroup value={quickFilterStream}>
                <Fragment key="ALL">
                  <DropdownMenu.RadioItem
                    value="ALL"
                    onSelect={() => {
                      setQuickFilterStream("ALL");
                    }}
                  >
                    <DropdownMenu.ItemIndicator>
                      <CheckIcon />
                    </DropdownMenu.ItemIndicator>
                    <span>
                      {intl.formatMessage({
                        defaultMessage: "All",
                        id: "XnvXtO",
                        description: "All",
                      })}
                    </span>
                  </DropdownMenu.RadioItem>
                </Fragment>
                {options.map((option, index) => (
                  <Fragment key={option.value}>
                    <DropdownMenu.RadioItem
                      value={option.value}
                      onSelect={() => {
                        setQuickFilterStream(option.value);
                      }}
                    >
                      <DropdownMenu.ItemIndicator>
                        <CheckIcon />
                      </DropdownMenu.ItemIndicator>
                      {option.label}
                    </DropdownMenu.RadioItem>

                    {index + 1 < options.length && <DropdownMenu.Separator />}
                  </Fragment>
                ))}
              </DropdownMenu.RadioGroup>
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <p aria-live="polite" data-h2-visually-hidden="base(invisible)">
        {quickFilterStream !== "ALL"
          ? intl.formatMessage(
              {
                defaultMessage:
                  "The list is filtered to the {jobStream} job stream.",
                id: "SypvZP",
                description:
                  "Announcement that the job stream filter is active.",
              },
              {
                jobStream: streams.find((s) => s.key === quickFilterStream)
                  ?.title,
              },
            )
          : intl.formatMessage({
              defaultMessage: "The list is not filtered.",
              id: "0lDq3P",
              description:
                "Announcement that the job stream filter is not active.",
            })}
      </p>
      {streamsToShow.length ? (
        <Accordion.Root
          mode="card"
          type="multiple"
          data-h2-margin="base(x.5, 0, 0, 0)"
        >
          {streamsToShow.map((stream) => (
            <Accordion.Item value={stream.key} key={stream.key}>
              <Accordion.Trigger
                subtitle={stream.summary}
                as="h3"
                context={
                  streamIsRecommended(stream, mySkillIds) ? (
                    <Chip color="success">
                      <span data-h2-color="base(black)">
                        {intl.formatMessage({
                          defaultMessage: "Recommended based on your skills",
                          id: "LFYdXR",
                          description:
                            "Tip that your skills match this section well and so it is recommended",
                        })}
                      </span>
                    </Chip>
                  ) : undefined
                }
              >
                {stream.title}
              </Accordion.Trigger>
              <Accordion.Content>
                <div
                  data-h2-display="base(grid)"
                  data-h2-grid-template-columns="base(1fr) p-tablet(1fr 1fr)"
                  data-h2-gap="base(x.5) p-tablet(x2)"
                >
                  {stream.classifications
                    .filter(
                      // filter to only classifications with a pool ID that can be applied to
                      (classification) => classification.pool?.id,
                    )
                    .map((classification) => (
                      <div key={classification.key}>
                        <h4
                          data-h2-font-size="base(copy)"
                          data-h2-font-weight="base(700)"
                          data-h2-margin="base(x1, 0)"
                        >
                          {classification.title}
                        </h4>
                        <div data-h2-padding="base(0,0,x0.75, 0)">
                          {classification.description}
                        </div>
                        {classification.pool?.id && (
                          <Link
                            href={paths.pool(classification.pool.id)}
                            color="secondary"
                            mode="solid"
                          >
                            {classification.applyMessage}
                          </Link>
                        )}
                      </div>
                    ))}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      ) : null}
    </>
  );
};

export default OngoingRecruitmentSection;
