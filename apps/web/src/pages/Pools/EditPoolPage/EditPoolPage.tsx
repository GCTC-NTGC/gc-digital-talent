import * as React from "react";
import { useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import RocketLaunchIcon from "@heroicons/react/24/outline/RocketLaunchIcon";

import {
  NotFound,
  Pending,
  Link,
  TableOfContents,
  Heading,
  Pill,
} from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import {
  Pool,
  Scalars,
  Classification,
  useGetEditPoolDataQuery,
  Skill,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import adminMessages from "~/messages/adminMessages";

import PoolNameSection, {
  type PoolNameSubmitData,
} from "./components/PoolNameSection";
import ClosingDateSection, {
  type ClosingDateSubmitData,
} from "./components/ClosingDateSection";
import YourImpactSection, {
  type YourImpactSubmitData,
} from "./components/YourImpactSection";
import WorkTasksSection, {
  type WorkTasksSubmitData,
} from "./components/WorkTasksSection";
import OtherRequirementsSection, {
  type OtherRequirementsSubmitData,
} from "./components/OtherRequirementsSection";
import StatusSection from "./components/StatusSection";
import EssentialSkillsSection, {
  type EssentialSkillsSubmitData,
} from "./components/EssentialSkillsSection";
import AssetSkillsSection, {
  type AssetSkillsSubmitData,
} from "./components/AssetSkillsSection";
import ScreeningQuestions, {
  type ScreeningQuestionsSubmitData,
} from "./components/ScreeningQuestions";
import WhatToExpectSection, {
  type WhatToExpectSubmitData,
} from "./components/WhatToExpectSection";
import SpecialNoteSection, {
  SpecialNoteSubmitData,
} from "./components/SpecialNoteSection";
import EditPoolContext from "./components/EditPoolContext";
import useMutations from "./hooks/useMutations";

export type PoolSubmitData =
  | AssetSkillsSubmitData
  | ClosingDateSubmitData
  | EssentialSkillsSubmitData
  | OtherRequirementsSubmitData
  | PoolNameSubmitData
  | WorkTasksSubmitData
  | YourImpactSubmitData
  | WhatToExpectSubmitData
  | SpecialNoteSubmitData
  | ScreeningQuestionsSubmitData;

export interface EditPoolFormProps {
  pool: Pool;
  classifications: Array<Classification>;
  skills: Array<Skill>;
  onSave: (submitData: PoolSubmitData) => void;
  onPublish: () => void;
  onDelete: () => void;
  onClose: () => void;
  onExtend: (closingDate: Scalars["DateTime"]) => Promise<void>;
  onArchive: () => void;
  onDuplicate: () => void;
  onUnarchive: () => void;
}

export const EditPoolForm = ({
  pool,
  classifications,
  skills,
  onSave,
  onPublish,
  onDelete,
  onDuplicate,
  onClose,
  onExtend,
  onArchive,
  onUnarchive,
}: EditPoolFormProps): JSX.Element => {
  const intl = useIntl();
  const paths = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Advertisement information",
    id: "rwQPZE",
    description: "Page title for process' advertisement information page",
  });

  const pageSubtitle = intl.formatMessage({
    defaultMessage:
      "Define the recruitment's information and requirements such as classification, impact, and skill requirement's among others.",
    id: "JJ7dh2",
    description: "Description of a process' advertisement",
  });

  const sectionMetadata = {
    poolName: {
      id: "pool-name",
      title: intl.formatMessage({
        defaultMessage: "Pool name and target classification",
        id: "jdoFE6",
        description: "Sub title for pool name and classification",
      }),
    },
    closingDate: {
      id: "closing-date",
      title: intl.formatMessage({
        defaultMessage: "Closing date",
        id: "I8jlr2",
        description: "Sub title for pool closing date",
      }),
    },
    yourImpact: {
      id: "your-impact",
      title: intl.formatMessage({
        defaultMessage: "Your impact",
        id: "ry3jFR",
        description: "Sub title for the pool introduction",
      }),
    },
    workTasks: {
      id: "work-tasks",
      title: intl.formatMessage({
        defaultMessage: "Work tasks",
        id: "GXw2um",
        description: "Sub title for the pool work tasks",
      }),
    },
    essentialSkills: {
      id: "essential-skills",
      title: intl.formatMessage({
        defaultMessage: "Essential skills (Need to have)",
        id: "LccTZJ",
        description: "Sub title for the pool essential skills",
      }),
    },
    assetSkills: {
      id: "asset-skills",
      title: intl.formatMessage({
        defaultMessage: "Asset skills (Nice to have skills)",
        id: "N0ySd0",
        description: "Sub title for the pool essential skills",
      }),
    },
    otherRequirements: {
      id: "other-requirements",
      title: intl.formatMessage({
        defaultMessage: "Other requirements",
        id: "Fm4Muz",
        description: "Sub title for the pool other requirements",
      }),
    },
    screeningQuestions: {
      id: "screening-questions",
      title: intl.formatMessage({
        defaultMessage: "Screening questions",
        id: "c+QwbR",
        description: "Subtitle for the pool screening questions",
      }),
    },
    whatToExpect: {
      id: "what-to-expect",
      title: intl.formatMessage({
        defaultMessage: "What to expect after you apply",
        id: "QdSYpe",
        description: "Sub title for the what to expect section",
      }),
    },
    specialNote: {
      id: "special-note",
      title: intl.formatMessage({
        defaultMessage: "Special note for this process",
        id: "ye0xFe",
        description: "Sub title for the special note section",
      }),
    },
    status: {
      id: "status",
      title: intl.formatMessage({
        defaultMessage: "Advertisement status",
        id: "xkxwfP",
        description: "Sub title for the pool advertisement status",
      }),
    },
  };

  return (
    <>
      <SEO title={pageTitle} description={pageSubtitle} />
      <div data-h2-container="base(left, large, 0)">
        <div
          data-h2-display="base(flex)"
          data-h2-align-items="base(flex-start) p-tablet(flex-end)"
          data-h2-flex-direction="base(column) p-tablet(row)"
          data-h2-gap="base(x1)"
        >
          <Heading
            level="h2"
            Icon={RocketLaunchIcon}
            color="primary"
            data-h2-margin-top="base(0)"
          >
            {pageTitle}
          </Heading>
        </div>
        <p data-h2-margin="base(x1 0)">{pageSubtitle}</p>
        <TableOfContents.Wrapper>
          <TableOfContents.Navigation>
            <TableOfContents.List>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={sectionMetadata.poolName.id}>
                  {sectionMetadata.poolName.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={sectionMetadata.closingDate.id}>
                  {sectionMetadata.closingDate.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={sectionMetadata.yourImpact.id}>
                  {sectionMetadata.yourImpact.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={sectionMetadata.workTasks.id}>
                  {sectionMetadata.workTasks.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink
                  id={sectionMetadata.essentialSkills.id}
                >
                  {sectionMetadata.essentialSkills.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={sectionMetadata.assetSkills.id}>
                  {sectionMetadata.assetSkills.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink
                  id={sectionMetadata.otherRequirements.id}
                >
                  {sectionMetadata.otherRequirements.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink
                  id={sectionMetadata.screeningQuestions.id}
                >
                  {sectionMetadata.screeningQuestions.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink
                  id={sectionMetadata.whatToExpect.id}
                >
                  {sectionMetadata.whatToExpect.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={sectionMetadata.specialNote.id}>
                  {sectionMetadata.specialNote.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={sectionMetadata.status.id}>
                  {sectionMetadata.status.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            </TableOfContents.List>
            <Link mode="solid" href={paths.poolView(pool.id)} color="secondary">
              {intl.formatMessage({
                defaultMessage: "Back to process information",
                id: "wCvkgI",
                description:
                  "Text on a link to navigate back to the process information page",
              })}
            </Link>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <PoolNameSection
              pool={pool}
              classifications={classifications}
              sectionMetadata={sectionMetadata.poolName}
              onSave={onSave}
            />
            <ClosingDateSection
              pool={pool}
              sectionMetadata={sectionMetadata.closingDate}
              onSave={onSave}
            />
            <YourImpactSection
              pool={pool}
              sectionMetadata={sectionMetadata.yourImpact}
              onSave={onSave}
            />
            <WorkTasksSection
              pool={pool}
              sectionMetadata={sectionMetadata.workTasks}
              onSave={onSave}
            />
            <EssentialSkillsSection
              pool={pool}
              skills={skills}
              sectionMetadata={sectionMetadata.essentialSkills}
              onSave={onSave}
            />
            <AssetSkillsSection
              pool={pool}
              skills={skills}
              sectionMetadata={sectionMetadata.assetSkills}
              onSave={onSave}
            />
            <OtherRequirementsSection
              pool={pool}
              sectionMetadata={sectionMetadata.otherRequirements}
              onSave={onSave}
            />
            <ScreeningQuestions
              pool={pool}
              sectionMetadata={sectionMetadata.screeningQuestions}
              onSave={onSave}
            />
            <WhatToExpectSection
              pool={pool}
              sectionMetadata={sectionMetadata.whatToExpect}
              onSave={onSave}
            />
            <SpecialNoteSection
              pool={pool}
              sectionMetadata={sectionMetadata.specialNote}
              onSave={onSave}
            />
            <StatusSection
              pool={pool}
              sectionMetadata={sectionMetadata.status}
              onPublish={onPublish}
              onDelete={onDelete}
              onClose={onClose}
              onExtend={onExtend}
              onArchive={onArchive}
              onDuplicate={onDuplicate}
              onUnarchive={onUnarchive}
            />
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
    </>
  );
};

type RouteParams = {
  poolId: Scalars["ID"];
};

export const EditPoolPage = () => {
  const intl = useIntl();
  const { poolId } = useParams<RouteParams>();
  const routes = useRoutes();

  const notFoundMessage = intl.formatMessage(
    {
      defaultMessage: "Pool {poolId} not found.",
      id: "Sb2fEr",
      description: "Message displayed for pool not found.",
    },
    { poolId },
  );

  if (!poolId) {
    throw new Response(notFoundMessage, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const [{ data, fetching, error }] = useGetEditPoolDataQuery({
    variables: { poolId: poolId || "" },
  });

  const { isFetching, mutations } = useMutations();

  const ctx = React.useMemo(() => {
    return { isSubmitting: isFetching };
  }, [isFetching]);

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: routes.adminDashboard(),
    },
    {
      label: intl.formatMessage(adminMessages.pools),
      url: routes.poolTable(),
    },
    {
      label: getLocalizedName(data?.pool?.name, intl),
      url: routes.poolView(poolId),
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Edit<hidden> pool</hidden>",
        id: "D6HIId",
        description: "Edit pool breadcrumb text",
      }),
      url: routes.poolUpdate(poolId),
    },
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <Pending fetching={fetching} error={error}>
        {data?.pool ? (
          <EditPoolContext.Provider value={ctx}>
            <EditPoolForm
              pool={data.pool}
              classifications={data.classifications.filter(notEmpty)}
              skills={data.skills.filter(notEmpty)}
              onSave={(saveData) => mutations.update(poolId, saveData)}
              onPublish={() => mutations.publish(poolId)}
              onDelete={() => mutations.delete(poolId)}
              onDuplicate={() =>
                mutations.duplicate(poolId, data.pool?.team?.id || "")
              }
              onClose={() => mutations.close(poolId)}
              onExtend={(closingDate) => mutations.extend(poolId, closingDate)}
              onArchive={() => mutations.archive(poolId)}
              onUnarchive={() => mutations.unarchive(poolId)}
            />
          </EditPoolContext.Provider>
        ) : (
          <NotFound
            headingMessage={intl.formatMessage(commonMessages.notFound)}
          >
            <p>{notFoundMessage}</p>
          </NotFound>
        )}
      </Pending>
    </AdminContentWrapper>
  );
};

export default EditPoolPage;
