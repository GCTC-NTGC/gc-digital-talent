import React from "react";
import { CpuChipIcon } from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";
import Heading from "@common/components/Heading";
import { PoolStream, Skill } from "@common/api/generated";
import Accordion from "@common/components/Accordion";
import { Link, Pill } from "@common/components";
import { FAR_FUTURE_DATE } from "@common/helpers/dateUtils";
import { Select } from "@common/components/form";
import { FormProvider, useForm } from "react-hook-form";
import { AuthorizationContext } from "@common/components/Auth";
import { getId, notEmpty, uniqueItems } from "@common/helpers/util";
import { PoolAdvertisement, useMySkillsQuery } from "../../api/generated";
import useRoutes from "../../hooks/useRoutes";
import messages from "./messages";

// the shape of the data model to populate this component
interface StreamViewModel {
  key: PoolStream;
  title: string;
  summary: string;
  classifications: {
    title: string;
    description: React.ReactNode;
    poolAdvertisement: PoolAdvertisement | undefined;
    applyMessage: string;
  }[];
}

// choose a pool advertisement from a collection of pools for association with a stream, classification group, and classification level
const selectPoolForSection = (
  pools: PoolAdvertisement[],
  stream: PoolStream,
  group: string,
  level: number,
): PoolAdvertisement | undefined => {
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
          p.stream === stream &&
          // must include section classification group and level
          !!p.classifications?.find(
            (c) => c?.group === group && c.level === level,
          ),
      )
  );
};

type FormValues = {
  quickFilter: PoolStream | undefined;
};

// Stream is recommended if any of the classifications match condition.
// Every essential skill in the classification is present in the user's skills.
const streamIsRecommended = (
  stream: StreamViewModel,
  userSkillIds: Skill["id"][],
): boolean =>
  stream.classifications.some((classification) =>
    classification.poolAdvertisement?.essentialSkills?.every((skill) =>
      userSkillIds.includes(skill.id),
    ),
  );

export interface OngoingRecruitmentSectionProps {
  pools: PoolAdvertisement[];
}

export const OngoingRecruitmentSection = ({
  pools,
}: OngoingRecruitmentSectionProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const methods = useForm<FormValues>({
    mode: "onChange",
  });

  const quickFilterStream = methods.watch("quickFilter");
  const { loggedInUser, isLoaded } = React.useContext(AuthorizationContext);
  const [{ data: skillsData }] = useMySkillsQuery({
    pause: !isLoaded || !loggedInUser,
  });

  const mySkillIdsWithDuplicates = skillsData?.me?.experiences
    ?.flatMap((e) => e?.skills)
    .filter(notEmpty)
    .map(getId);
  const mySkillIds = uniqueItems(mySkillIdsWithDuplicates ?? []);

  // this great big object is all the data to populate the accordions
  const streams: StreamViewModel[] = [
    // IT business line advisory services bucket
    {
      key: PoolStream.BusinessAdvisoryServices,
      title: intl.formatMessage(messages.businessAdvisoryServicesTitle),
      summary: intl.formatMessage(messages.businessAdvisoryServicesSummary),
      classifications: [
        {
          title: intl.formatMessage(messages.it01Title),
          description: intl.formatMessage(messages.it01Description),
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.BusinessAdvisoryServices,
            "IT",
            1,
          ),
          applyMessage: intl.formatMessage(messages.it01ApplyMessage, {
            name: intl.formatMessage(messages.businessAdvisoryServicesTitle),
          }),
        },
        {
          title: intl.formatMessage(messages.it02Title),
          description: intl.formatMessage(messages.it02Description),
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.BusinessAdvisoryServices,
            "IT",
            2,
          ),
          applyMessage: intl.formatMessage(messages.it02ApplyMessage, {
            name: intl.formatMessage(messages.businessAdvisoryServicesTitle),
          }),
        },
        {
          title: intl.formatMessage(messages.it03Title),
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
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.BusinessAdvisoryServices,
            "IT",
            3,
          ),
          applyMessage: intl.formatMessage(messages.it03ApplyMessage, {
            name: intl.formatMessage(messages.businessAdvisoryServicesTitle),
          }),
        },
        {
          title: intl.formatMessage(messages.it04Title),
          description: (
            <>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description1)}
              </p>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description2)}
              </p>
            </>
          ),
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.BusinessAdvisoryServices,
            "IT",
            4,
          ),
          applyMessage: intl.formatMessage(messages.it04ApplyMessage, {
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
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.DatabaseManagement,
            "IT",
            1,
          ),
          applyMessage: intl.formatMessage(messages.it01ApplyMessage, {
            name: intl.formatMessage(messages.databaseManagementTitle),
          }),
        },
        {
          title: intl.formatMessage(messages.it02Title),
          description: intl.formatMessage(messages.it02Description),
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.DatabaseManagement,
            "IT",
            2,
          ),
          applyMessage: intl.formatMessage(messages.it02ApplyMessage, {
            name: intl.formatMessage(messages.databaseManagementTitle),
          }),
        },
        {
          title: intl.formatMessage(messages.it03Title),
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
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.DatabaseManagement,
            "IT",
            3,
          ),
          applyMessage: intl.formatMessage(messages.it03ApplyMessage, {
            name: intl.formatMessage(messages.databaseManagementTitle),
          }),
        },
        {
          title: intl.formatMessage(messages.it04Title),
          description: (
            <>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description1)}
              </p>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description2)}
              </p>
            </>
          ),
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.DatabaseManagement,
            "IT",
            4,
          ),
          applyMessage: intl.formatMessage(messages.it04ApplyMessage, {
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
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.EnterpriseArchitecture,
            "IT",
            1,
          ),
          applyMessage: intl.formatMessage(messages.it01ApplyMessage, {
            name: intl.formatMessage(messages.enterpriseArchitectureTitle),
          }),
        },
        {
          title: intl.formatMessage(messages.it02Title),
          description: intl.formatMessage(messages.it02Description),
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.EnterpriseArchitecture,
            "IT",
            2,
          ),
          applyMessage: intl.formatMessage(messages.it02ApplyMessage, {
            name: intl.formatMessage(messages.enterpriseArchitectureTitle),
          }),
        },
        {
          title: intl.formatMessage(messages.it03Title),
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
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.EnterpriseArchitecture,
            "IT",
            3,
          ),
          applyMessage: intl.formatMessage(messages.it03ApplyMessage, {
            name: intl.formatMessage(messages.enterpriseArchitectureTitle),
          }),
        },
        {
          title: intl.formatMessage(messages.it04Title),
          description: (
            <>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description1)}
              </p>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description2)}
              </p>
            </>
          ),
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.EnterpriseArchitecture,
            "IT",
            4,
          ),
          applyMessage: intl.formatMessage(messages.it04ApplyMessage, {
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
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.InfrastructureOperations,
            "IT",
            1,
          ),
          applyMessage: intl.formatMessage(messages.it01ApplyMessage, {
            name: intl.formatMessage(messages.infrastructureOperationsTitle),
          }),
        },
        {
          title: intl.formatMessage(messages.it02Title),
          description: intl.formatMessage(messages.it02Description),
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.InfrastructureOperations,
            "IT",
            2,
          ),
          applyMessage: intl.formatMessage(messages.it02ApplyMessage, {
            name: intl.formatMessage(messages.infrastructureOperationsTitle),
          }),
        },
        {
          title: intl.formatMessage(messages.it03Title),
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
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.InfrastructureOperations,
            "IT",
            3,
          ),
          applyMessage: intl.formatMessage(messages.it03ApplyMessage, {
            name: intl.formatMessage(messages.infrastructureOperationsTitle),
          }),
        },
        {
          title: intl.formatMessage(messages.it04Title),
          description: (
            <>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description1)}
              </p>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description2)}
              </p>
            </>
          ),
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.InfrastructureOperations,
            "IT",
            4,
          ),
          applyMessage: intl.formatMessage(messages.it04ApplyMessage, {
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
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.PlanningAndReporting,
            "IT",
            1,
          ),
          applyMessage: intl.formatMessage(messages.it01ApplyMessage, {
            name: intl.formatMessage(messages.planningAndReportingTitle),
          }),
        },
        {
          title: intl.formatMessage(messages.it02Title),
          description: intl.formatMessage(messages.it02Description),
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.PlanningAndReporting,
            "IT",
            2,
          ),
          applyMessage: intl.formatMessage(messages.it02ApplyMessage, {
            name: intl.formatMessage(messages.planningAndReportingTitle),
          }),
        },
        {
          title: intl.formatMessage(messages.it03Title),
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
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.PlanningAndReporting,
            "IT",
            3,
          ),
          applyMessage: intl.formatMessage(messages.it03ApplyMessage, {
            name: intl.formatMessage(messages.planningAndReportingTitle),
          }),
        },
        {
          title: intl.formatMessage(messages.it04Title),
          description: (
            <>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description1)}
              </p>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description2)}
              </p>
            </>
          ),
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.PlanningAndReporting,
            "IT",
            4,
          ),
          applyMessage: intl.formatMessage(messages.it04ApplyMessage, {
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
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.ProjectPortfolioManagement,
            "IT",
            1,
          ),
          applyMessage: intl.formatMessage(messages.it01ApplyMessage, {
            name: intl.formatMessage(messages.projectPortfolioManagementTitle),
          }),
        },
        {
          title: intl.formatMessage(messages.it02Title),
          description: intl.formatMessage(messages.it02Description),
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.ProjectPortfolioManagement,
            "IT",
            2,
          ),
          applyMessage: intl.formatMessage(messages.it02ApplyMessage, {
            name: intl.formatMessage(messages.projectPortfolioManagementTitle),
          }),
        },
        {
          title: intl.formatMessage(messages.it03Title),
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
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.ProjectPortfolioManagement,
            "IT",
            3,
          ),
          applyMessage: intl.formatMessage(messages.it03ApplyMessage, {
            name: intl.formatMessage(messages.projectPortfolioManagementTitle),
          }),
        },
        {
          title: intl.formatMessage(messages.it04Title),
          description: (
            <>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description1)}
              </p>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description2)}
              </p>
            </>
          ),
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.ProjectPortfolioManagement,
            "IT",
            4,
          ),
          applyMessage: intl.formatMessage(messages.it04ApplyMessage, {
            name: intl.formatMessage(messages.projectPortfolioManagementTitle),
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
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.Security,
            "IT",
            1,
          ),
          applyMessage: intl.formatMessage(messages.it01ApplyMessage, {
            name: intl.formatMessage(messages.securityTitle),
          }),
        },
        {
          title: intl.formatMessage(messages.it02Title),
          description: intl.formatMessage(messages.it02Description),
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.Security,
            "IT",
            2,
          ),
          applyMessage: intl.formatMessage(messages.it02ApplyMessage, {
            name: intl.formatMessage(messages.securityTitle),
          }),
        },
        {
          title: intl.formatMessage(messages.it03Title),
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
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.Security,
            "IT",
            3,
          ),
          applyMessage: intl.formatMessage(messages.it03ApplyMessage, {
            name: intl.formatMessage(messages.securityTitle),
          }),
        },
        {
          title: intl.formatMessage(messages.it04Title),
          description: (
            <>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description1)}
              </p>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description2)}
              </p>
            </>
          ),
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.Security,
            "IT",
            4,
          ),

          applyMessage: intl.formatMessage(messages.it04ApplyMessage, {
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
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.SoftwareSolutions,
            "IT",
            1,
          ),
          applyMessage: intl.formatMessage(messages.it01ApplyMessage, {
            name: intl.formatMessage(messages.softwareSolutionsTitle),
          }),
        },
        {
          title: intl.formatMessage(messages.it02Title),
          description: intl.formatMessage(messages.it02Description),
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.SoftwareSolutions,
            "IT",
            2,
          ),
          applyMessage: intl.formatMessage(messages.it02ApplyMessage, {
            name: intl.formatMessage(messages.softwareSolutionsTitle),
          }),
        },
        {
          title: intl.formatMessage(messages.it03Title),
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
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.SoftwareSolutions,
            "IT",
            3,
          ),
          applyMessage: intl.formatMessage(messages.it03ApplyMessage, {
            name: intl.formatMessage(messages.softwareSolutionsTitle),
          }),
        },
        {
          title: intl.formatMessage(messages.it04Title),
          description: (
            <>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description1)}
              </p>
              <p data-h2-margin="base(0, 0, x0.75, 0)">
                {intl.formatMessage(messages.it04Description2)}
              </p>
            </>
          ),
          poolAdvertisement: selectPoolForSection(
            pools,
            PoolStream.SoftwareSolutions,
            "IT",
            4,
          ),
          applyMessage: intl.formatMessage(messages.it04ApplyMessage, {
            name: intl.formatMessage(messages.softwareSolutionsTitle),
          }),
        },
      ],
    },
  ];

  // filter to only streams with classifications with a pool ID to apply to
  const streamsWithAvailablePools = streams.filter(
    (stream) =>
      !!stream.classifications.find(
        (classification) => classification.poolAdvertisement?.id,
      ),
  );

  // if a quick filter is selected, only show the filtered stream
  const streamsToShow = quickFilterStream
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
      <div data-h2-display="base(flex)">
        <FormProvider {...methods}>
          <Select
            id="quickFilter"
            name="quickFilter"
            label={intl.formatMessage({
              defaultMessage: "Quick filter",
              id: "8NB+Ay",
              description: "A label for a quick filter input.",
            })}
            options={[
              {
                value: "",
                disabled: true,
                label: intl.formatMessage({
                  defaultMessage: "Select a job stream...",
                  id: "cmFeXj",
                  description:
                    "Placeholder for stream filter in browse opportunities form.",
                }),
              },
              ...streamsWithAvailablePools.map((stream) => ({
                value: stream.key,
                label: stream.title,
              })),
            ]}
            trackUnsaved={false}
          />
        </FormProvider>
      </div>

      <p aria-live="polite" data-h2-visually-hidden="base(invisible)">
        {quickFilterStream
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

      <div>
        <Accordion.Root
          data-h2-margin="base(0)"
          data-h2-padding="base(0)"
          type="multiple"
        >
          {streamsToShow.map((stream) => (
            <Accordion.Item value={stream.key} key={stream.key}>
              <Accordion.Trigger
                subtitle={stream.summary}
                data-h2-font-size="base(h4)"
                headerAs="h3"
                context={
                  streamIsRecommended(stream, mySkillIds) ? (
                    <Pill color="green" mode="outline">
                      <span data-h2-color="base(black)">
                        {intl.formatMessage({
                          defaultMessage: "Recommended based on your skills",
                          id: "LFYdXR",
                          description:
                            "Tip that your skills match this section well and so it is recommended",
                        })}
                      </span>
                    </Pill>
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
                      (classification) => classification.poolAdvertisement?.id,
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
                        <div data-h2-padding="base(0,0,x0.75, 0)">
                          {classification.description}
                        </div>
                        {classification.poolAdvertisement?.id && (
                          <Link
                            href={paths.pool(
                              classification.poolAdvertisement.id,
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
