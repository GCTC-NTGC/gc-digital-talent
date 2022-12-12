import React from "react";
import { CpuChipIcon } from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";
import Heading from "@common/components/Heading";
import { PoolStream } from "@common/api/generated";
import Accordion from "@common/components/Accordion";
import { Link } from "@common/components";
import { FAR_FUTURE_DATE } from "@common/helpers/dateUtils";
import { PoolAdvertisement } from "../../api/generated";
import useRoutes from "../../hooks/useRoutes";
import messages from "./messages";

// the shape of the data model to populate this component
interface DataModel {
  streams: {
    key: PoolStream;
    title: string;
    summary: string;
    classifications: {
      title: string;
      description: string;
      poolAdvertisementId: PoolAdvertisement["id"] | undefined;
      applyMessage: string;
    }[];
  }[];
}

// choose a pool advertisement from a collection of pools for association with a stream, classification group, and classification level
const selectPoolIdForSection = (
  pools: PoolAdvertisement[],
  stream: PoolStream,
  group: string,
  level: number,
): PoolAdvertisement["id"] | undefined => {
  return (
    pools
      // last expiry date first to be selected
      .sort((p1, p2) =>
        (p1.expiryDate ?? FAR_FUTURE_DATE) < (p2.expiryDate ?? FAR_FUTURE_DATE)
          ? 1
          : -1,
      )
      .find(
        (p) =>
          // must match section stream
          p.stream === stream &&
          // must include section classification group and level
          !!p.classifications?.find(
            (c) => c?.group === group && c.level === level,
          ),
      )?.id
  );
};

export interface OngoingRecruitmentSectionProps {
  pools: PoolAdvertisement[];
}

export const OngoingRecruitmentSection = ({
  pools,
}: OngoingRecruitmentSectionProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  // this great big object is all the data to populate the accordions
  const dataModel: DataModel = {
    streams: [
      // IT business line advisory services bucket
      {
        key: PoolStream.BusinessAdvisoryServices,
        title: intl.formatMessage(messages.businessAdvisoryServicesTitle),
        summary: intl.formatMessage(messages.businessAdvisoryServicesSummary),
        classifications: [
          {
            title: intl.formatMessage(messages.it01Title),
            description: intl.formatMessage(messages.it01Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.BusinessAdvisoryServices,
              "IT",
              1,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 1,
              name: intl.formatMessage(messages.businessAdvisoryServicesTitle),
            }),
          },
          {
            title: intl.formatMessage(messages.it02Title),
            description: intl.formatMessage(messages.it02Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.BusinessAdvisoryServices,
              "IT",
              2,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 2,
              name: intl.formatMessage(messages.businessAdvisoryServicesTitle),
            }),
          },
          {
            title: intl.formatMessage(messages.it03Title),
            description: intl.formatMessage(messages.it03Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.BusinessAdvisoryServices,
              "IT",
              3,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 3,
              name: intl.formatMessage(messages.businessAdvisoryServicesTitle),
            }),
          },
          {
            title: intl.formatMessage(messages.it04Title),
            description: intl.formatMessage(messages.it04Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.BusinessAdvisoryServices,
              "IT",
              4,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 4,
              name: intl.formatMessage(messages.businessAdvisoryServicesTitle),
            }),
          },
        ],
      },
      // IT database management
      {
        key: PoolStream.DatabaseManagement,
        title: intl.formatMessage(messages.databaseManagementTitle),
        summary: intl.formatMessage(messages.databaseManagementSummary),
        classifications: [
          {
            title: intl.formatMessage(messages.it01Title),
            description: intl.formatMessage(messages.it01Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.DatabaseManagement,
              "IT",
              1,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 1,
              name: intl.formatMessage(messages.databaseManagementTitle),
            }),
          },
          {
            title: intl.formatMessage(messages.it02Title),
            description: intl.formatMessage(messages.it02Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.DatabaseManagement,
              "IT",
              2,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 2,
              name: intl.formatMessage(messages.databaseManagementTitle),
            }),
          },
          {
            title: intl.formatMessage(messages.it03Title),
            description: intl.formatMessage(messages.it03Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.DatabaseManagement,
              "IT",
              3,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 3,
              name: intl.formatMessage(messages.databaseManagementTitle),
            }),
          },
          {
            title: intl.formatMessage(messages.it04Title),
            description: intl.formatMessage(messages.it04Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.DatabaseManagement,
              "IT",
              4,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 4,
              name: intl.formatMessage(messages.databaseManagementTitle),
            }),
          },
        ],
      },
      // IT enterprise architecture
      {
        key: PoolStream.EnterpriseArchitecture,
        title: intl.formatMessage(messages.enterpriseArchitectureTitle),
        summary: intl.formatMessage(messages.enterpriseArchitectureSummary),
        classifications: [
          {
            title: intl.formatMessage(messages.it01Title),
            description: intl.formatMessage(messages.it01Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.EnterpriseArchitecture,
              "IT",
              1,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 1,
              name: intl.formatMessage(messages.enterpriseArchitectureTitle),
            }),
          },
          {
            title: intl.formatMessage(messages.it02Title),
            description: intl.formatMessage(messages.it02Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.EnterpriseArchitecture,
              "IT",
              2,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 2,
              name: intl.formatMessage(messages.enterpriseArchitectureTitle),
            }),
          },
          {
            title: intl.formatMessage(messages.it03Title),
            description: intl.formatMessage(messages.it03Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.EnterpriseArchitecture,
              "IT",
              3,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 3,
              name: intl.formatMessage(messages.enterpriseArchitectureTitle),
            }),
          },
          {
            title: intl.formatMessage(messages.it04Title),
            description: intl.formatMessage(messages.it04Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.EnterpriseArchitecture,
              "IT",
              4,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 4,
              name: intl.formatMessage(messages.enterpriseArchitectureTitle),
            }),
          },
        ],
      },
      // IT infrastructure operations
      {
        key: PoolStream.InfrastructureOperations,
        title: intl.formatMessage(messages.infrastructureOperationsTitle),
        summary: intl.formatMessage(messages.infrastructureOperationsSummary),
        classifications: [
          {
            title: intl.formatMessage(messages.it01Title),
            description: intl.formatMessage(messages.it01Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.InfrastructureOperations,
              "IT",
              1,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 1,
              name: intl.formatMessage(messages.infrastructureOperationsTitle),
            }),
          },
          {
            title: intl.formatMessage(messages.it02Title),
            description: intl.formatMessage(messages.it02Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.InfrastructureOperations,
              "IT",
              2,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 2,
              name: intl.formatMessage(messages.infrastructureOperationsTitle),
            }),
          },
          {
            title: intl.formatMessage(messages.it03Title),
            description: intl.formatMessage(messages.it03Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.InfrastructureOperations,
              "IT",
              3,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 3,
              name: intl.formatMessage(messages.infrastructureOperationsTitle),
            }),
          },
          {
            title: intl.formatMessage(messages.it04Title),
            description: intl.formatMessage(messages.it04Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.InfrastructureOperations,
              "IT",
              4,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 4,
              name: intl.formatMessage(messages.infrastructureOperationsTitle),
            }),
          },
        ],
      },
      // IT planning and reporting
      {
        key: PoolStream.PlanningAndReporting,
        title: intl.formatMessage(messages.planningAndReportingTitle),
        summary: intl.formatMessage(messages.planningAndReportingSummary),
        classifications: [
          {
            title: intl.formatMessage(messages.it01Title),
            description: intl.formatMessage(messages.it01Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.PlanningAndReporting,
              "IT",
              1,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 1,
              name: intl.formatMessage(messages.planningAndReportingTitle),
            }),
          },
          {
            title: intl.formatMessage(messages.it02Title),
            description: intl.formatMessage(messages.it02Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.PlanningAndReporting,
              "IT",
              2,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 2,
              name: intl.formatMessage(messages.planningAndReportingTitle),
            }),
          },
          {
            title: intl.formatMessage(messages.it03Title),
            description: intl.formatMessage(messages.it03Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.PlanningAndReporting,
              "IT",
              3,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 3,
              name: intl.formatMessage(messages.planningAndReportingTitle),
            }),
          },
          {
            title: intl.formatMessage(messages.it04Title),
            description: intl.formatMessage(messages.it04Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.PlanningAndReporting,
              "IT",
              4,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 4,
              name: intl.formatMessage(messages.planningAndReportingTitle),
            }),
          },
        ],
      },
      // IT project portfolio management
      {
        key: PoolStream.ProjectPortfolioManagement,
        title: intl.formatMessage(messages.projectPortfolioManagementTitle),
        summary: intl.formatMessage(messages.projectPortfolioSummary),
        classifications: [
          {
            title: intl.formatMessage(messages.it01Title),
            description: intl.formatMessage(messages.it01Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.ProjectPortfolioManagement,
              "IT",
              1,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 1,
              name: intl.formatMessage(
                messages.projectPortfolioManagementTitle,
              ),
            }),
          },
          {
            title: intl.formatMessage(messages.it02Title),
            description: intl.formatMessage(messages.it02Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.ProjectPortfolioManagement,
              "IT",
              2,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 2,
              name: intl.formatMessage(
                messages.projectPortfolioManagementTitle,
              ),
            }),
          },
          {
            title: intl.formatMessage(messages.it03Title),
            description: intl.formatMessage(messages.it03Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.ProjectPortfolioManagement,
              "IT",
              3,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 3,
              name: intl.formatMessage(
                messages.projectPortfolioManagementTitle,
              ),
            }),
          },
          {
            title: intl.formatMessage(messages.it04Title),
            description: intl.formatMessage(messages.it04Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.ProjectPortfolioManagement,
              "IT",
              4,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 4,
              name: intl.formatMessage(
                messages.projectPortfolioManagementTitle,
              ),
            }),
          },
        ],
      },
      // IT security
      {
        key: PoolStream.Security,
        title: intl.formatMessage(messages.securityTitle),
        summary: intl.formatMessage(messages.securitySummary),
        classifications: [
          {
            title: intl.formatMessage(messages.it01Title),
            description: intl.formatMessage(messages.it01Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.Security,
              "IT",
              1,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 1,
              name: intl.formatMessage(messages.securityTitle),
            }),
          },
          {
            title: intl.formatMessage(messages.it02Title),
            description: intl.formatMessage(messages.it02Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.Security,
              "IT",
              2,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 2,
              name: intl.formatMessage(messages.securityTitle),
            }),
          },
          {
            title: intl.formatMessage(messages.it03Title),
            description: intl.formatMessage(messages.it03Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.Security,
              "IT",
              3,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 3,
              name: intl.formatMessage(messages.securityTitle),
            }),
          },
          {
            title: intl.formatMessage(messages.it04Title),
            description: intl.formatMessage(messages.it04Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.Security,
              "IT",
              4,
            ),

            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 4,
              name: intl.formatMessage(messages.securityTitle),
            }),
          },
        ],
      },
      // IT software solutions
      {
        key: PoolStream.SoftwareSolutions,
        title: intl.formatMessage(messages.softwareSolutionsTitle),
        summary: intl.formatMessage(messages.softwareSolutionsSummary),
        classifications: [
          {
            title: intl.formatMessage(messages.it01Title),
            description: intl.formatMessage(messages.it01Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.SoftwareSolutions,
              "IT",
              1,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 1,
              name: intl.formatMessage(messages.softwareSolutionsTitle),
            }),
          },
          {
            title: intl.formatMessage(messages.it02Title),
            description: intl.formatMessage(messages.it02Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.SoftwareSolutions,
              "IT",
              2,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 2,
              name: intl.formatMessage(messages.softwareSolutionsTitle),
            }),
          },
          {
            title: intl.formatMessage(messages.it03Title),
            description: intl.formatMessage(messages.it03Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.SoftwareSolutions,
              "IT",
              3,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 3,
              name: intl.formatMessage(messages.softwareSolutionsTitle),
            }),
          },
          {
            title: intl.formatMessage(messages.it04Title),
            description: intl.formatMessage(messages.it04Description),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.SoftwareSolutions,
              "IT",
              4,
            ),
            applyMessage: intl.formatMessage(messages.apply, {
              levelNumber: 4,
              name: intl.formatMessage(messages.softwareSolutionsTitle),
            }),
          },
        ],
      },
    ],
  };

  return (
    <>
      <Heading
        level="h2"
        Icon={CpuChipIcon}
        color="purple"
        data-h2-margin="base(0, 0, x1, 0)"
      >
        {intl.formatMessage({
          defaultMessage: "Apply to ongoing recruitment",
          id: "RBsGRp",
          description: "title for section with ongoing pool advertisements",
        })}
      </Heading>
      <p data-h2-margin="base(0, 0, x1, 0)" data-h2-font-weight="base(700)">
        {intl.formatMessage({
          id: "2czUAZ",
          defaultMessage:
            "Not seeing an active recruitment that matches your skillset? No problem, we still want to hear from you.",
          description: "summary for section with ongoing pool advertisements",
        })}
      </p>
      <p>
        {intl.formatMessage({
          id: "BWvfeG",
          defaultMessage:
            "We also offer passive recruitment buckets that allow us to find talent fast when the demand arises. While there’s no guarantee a job will result from the opportunities below, it’s an easy way for your name and resume to be found by managers when the time comes. Feel free to submit your name to any bucket that matches your skills.",
          description:
            "instructions for section with ongoing pool advertisements",
        })}
      </p>
      <div data-h2-padding="base(x2, 0, 0, 0) p-tablet(x3, 0, 0, 0)">
        <Accordion.Root
          data-h2-margin="base(0)"
          data-h2-padding="base(0)"
          type="multiple"
        >
          {dataModel.streams
            .filter(
              // filter streams with no classifications with a pool ID to apply to
              (stream) =>
                !!stream.classifications.find(
                  (classification) => classification.poolAdvertisementId,
                ),
            )
            .map((stream) => (
              <Accordion.Item value={stream.key} key={stream.key}>
                <Accordion.Trigger
                  subtitle={stream.summary}
                  data-h2-font-size="base(h4)"
                  headerAs="h3"
                >
                  {stream.title}
                </Accordion.Trigger>
                <Accordion.Content>
                  <div
                    data-h2-display="base(grid)"
                    data-h2-grid-template-columns="base(1fr) p-tablet(1fr 1fr)"
                    data-h2-gap="base(x.5) p-tablet(x2)"
                    data-h2-align-items="base(center)"
                  >
                    {stream.classifications
                      .filter(
                        // filter to only classifications with a pool ID that can be applied to
                        (classification) => classification.poolAdvertisementId,
                      )
                      .map((classification) => (
                        <div
                          key={classification.title}
                          data-h2-padding="base(0,0,x1, 0)"
                        >
                          <h4
                            data-h2-font-size="base(h6)"
                            data-h2-font-weight="base(700)"
                            data-h2-padding="base(0,0,x0.75, 0)"
                          >
                            {classification.title}
                          </h4>
                          <p data-h2-padding="base(0,0,x0.75, 0)">
                            {classification.description}
                          </p>
                          {classification.poolAdvertisementId && (
                            <Link
                              href={paths.pool(
                                classification.poolAdvertisementId,
                              )}
                              color="blue"
                              type="button"
                              mode="solid"
                              data-h2-font-weight="base(700)"
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
      </div>
    </>
  );
};
