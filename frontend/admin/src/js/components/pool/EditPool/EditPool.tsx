/* eslint-disable no-console */
// remove this eslint-disable when the action handlers are implemented
import * as React from "react";
import { useIntl } from "react-intl";
import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import { commonMessages } from "@common/messages";
import { Link } from "@common/components";
import PageHeader from "@common/components/PageHeader";
import { Squares2X2Icon } from "@heroicons/react/24/outline";
import Breadcrumbs, { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import TableOfContents from "@common/components/TableOfContents";
import { notEmpty } from "@common/helpers/util";
import { useParams } from "react-router-dom";
import {
  PoolAdvertisement,
  Scalars,
  Classification,
  useGetEditPoolDataQuery,
  Skill,
} from "../../../api/generated";
import DashboardContentContainer from "../../DashboardContentContainer";
import { useAdminRoutes } from "../../../adminRoutes";
import PoolNameSection, { type PoolNameSubmitData } from "./PoolNameSection";
import ClosingDateSection, {
  type ClosingDateSubmitData,
} from "./ClosingDateSection";
import YourImpactSection, {
  type YourImpactSubmitData,
} from "./YourImpactSection";
import WorkTasksSection, { type WorkTasksSubmitData } from "./WorkTasksSection";
import OtherRequirementsSection, {
  type OtherRequirementsSubmitData,
} from "./OtherRequirementsSection";
import StatusSection, { type ExtendSubmitData } from "./StatusSection";
import EssentialSkillsSection, {
  type EssentialSkillsSubmitData,
} from "./EssentialSkillsSection";
import AssetSkillsSection, {
  type AssetSkillsSubmitData,
} from "./AssetSkillsSection";
import EditPoolContext from "./EditPoolContext";
import useMutations from "./useMutations";

export type PoolSubmitData =
  | AssetSkillsSubmitData
  | ClosingDateSubmitData
  | EssentialSkillsSubmitData
  | ExtendSubmitData
  | OtherRequirementsSubmitData
  | PoolNameSubmitData
  | WorkTasksSubmitData
  | YourImpactSubmitData;

export interface EditPoolFormProps {
  poolAdvertisement: PoolAdvertisement;
  classifications: Array<Classification>;
  skills: Array<Skill>;
  onSave: (submitData: PoolSubmitData) => void;
  onPublish: () => void;
  onDelete: () => void;
  onClose: () => void;
  onExtend: (submitData: ExtendSubmitData) => Promise<void>;
  onArchive: () => void;
}

export interface SectionMetadata {
  id: string;
  title: string;
}

type SpacerProps = React.HTMLProps<HTMLSpanElement>;

export const Spacer = ({ children, ...rest }: SpacerProps) => (
  <span data-h2-margin="base(0, x.5, x.5, 0)" {...rest}>
    {children}
  </span>
);

export const EditPoolForm = ({
  poolAdvertisement,
  classifications,
  skills,
  onSave,
  onPublish,
  onDelete,
  onClose,
  onExtend,
  onArchive,
}: EditPoolFormProps): JSX.Element => {
  const intl = useIntl();
  const adminPaths = useAdminRoutes();

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
        { id: poolAdvertisement.id },
      ),
      href: adminPaths.poolView(poolAdvertisement.id),
    },
    {
      title: intl.formatMessage({
        defaultMessage: `Edit Pool`,
        id: "Hn6YgE",
        description: "Edit pool breadcrumb text",
      }),
    },
  ] as BreadcrumbsProps["links"];

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
    <div>
      <PageHeader icon={Squares2X2Icon}>
        {intl.formatMessage({
          defaultMessage: "Edit pool advertisement",
          id: "/6voUd",
          description: "Header for page to edit pool advertisements",
        })}
      </PageHeader>
      <Breadcrumbs links={links} />
      <div data-h2-container="base(left, large, 0)">
        <TableOfContents.Wrapper>
          <TableOfContents.Navigation>
            <TableOfContents.AnchorLink id={sectionMetadata.poolName.id}>
              {sectionMetadata.poolName.title}
            </TableOfContents.AnchorLink>
            <TableOfContents.AnchorLink id={sectionMetadata.closingDate.id}>
              {sectionMetadata.closingDate.title}
            </TableOfContents.AnchorLink>
            <TableOfContents.AnchorLink id={sectionMetadata.yourImpact.id}>
              {sectionMetadata.yourImpact.title}
            </TableOfContents.AnchorLink>
            <TableOfContents.AnchorLink id={sectionMetadata.workTasks.id}>
              {sectionMetadata.workTasks.title}
            </TableOfContents.AnchorLink>
            <TableOfContents.AnchorLink id={sectionMetadata.essentialSkills.id}>
              {sectionMetadata.essentialSkills.title}
            </TableOfContents.AnchorLink>
            <TableOfContents.AnchorLink id={sectionMetadata.assetSkills.id}>
              {sectionMetadata.assetSkills.title}
            </TableOfContents.AnchorLink>
            <TableOfContents.AnchorLink
              id={sectionMetadata.otherRequirements.id}
            >
              {sectionMetadata.otherRequirements.title}
            </TableOfContents.AnchorLink>
            <TableOfContents.AnchorLink id={sectionMetadata.status.id}>
              {sectionMetadata.status.title}
            </TableOfContents.AnchorLink>
            <Link
              href={adminPaths.poolView(poolAdvertisement.id)}
              color="secondary"
              mode="outline"
              type="button"
              data-h2-margin="base(x2, 0, 0, 0)"
            >
              {intl.formatMessage({
                defaultMessage: "Back to pool dashboard",
                id: "v6qX/r",
                description:
                  "Text on a link to navigate back to the pool dashboard page",
              })}
            </Link>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <PoolNameSection
              poolAdvertisement={poolAdvertisement}
              classifications={classifications}
              sectionMetadata={sectionMetadata.poolName}
              onSave={onSave}
            />
            <ClosingDateSection
              poolAdvertisement={poolAdvertisement}
              sectionMetadata={sectionMetadata.closingDate}
              onSave={onSave}
            />
            <YourImpactSection
              poolAdvertisement={poolAdvertisement}
              sectionMetadata={sectionMetadata.yourImpact}
              onSave={onSave}
            />
            <WorkTasksSection
              poolAdvertisement={poolAdvertisement}
              sectionMetadata={sectionMetadata.workTasks}
              onSave={onSave}
            />
            <EssentialSkillsSection
              poolAdvertisement={poolAdvertisement}
              skills={skills}
              sectionMetadata={sectionMetadata.essentialSkills}
              onSave={onSave}
            />
            <AssetSkillsSection
              poolAdvertisement={poolAdvertisement}
              skills={skills}
              sectionMetadata={sectionMetadata.assetSkills}
              onSave={onSave}
            />
            <OtherRequirementsSection
              poolAdvertisement={poolAdvertisement}
              sectionMetadata={sectionMetadata.otherRequirements}
              onSave={onSave}
            />
            <StatusSection
              poolAdvertisement={poolAdvertisement}
              sectionMetadata={sectionMetadata.status}
              onPublish={onPublish}
              onDelete={onDelete}
              onClose={onClose}
              onExtend={onExtend}
              onArchive={onArchive}
            />
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
    </div>
  );
};

type RouteParams = {
  poolId: Scalars["ID"];
};

export const EditPool = () => {
  const intl = useIntl();
  const { poolId } = useParams<RouteParams>();

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

  return (
    <Pending fetching={fetching} error={error}>
      <DashboardContentContainer>
        {data?.poolAdvertisement ? (
          <EditPoolContext.Provider value={ctx}>
            <EditPoolForm
              poolAdvertisement={data.poolAdvertisement}
              classifications={data.classifications.filter(notEmpty)}
              skills={data.skills.filter(notEmpty)}
              onSave={(saveData) => mutations.update(poolId, saveData)}
              onPublish={() => mutations.publish(poolId)}
              onDelete={() => mutations.delete(poolId)}
              onClose={() => mutations.close(poolId)}
              onExtend={(extendData) => mutations.update(poolId, extendData)}
              onArchive={() => console.warn("onArchive not yet implemented")}
            />
          </EditPoolContext.Provider>
        ) : (
          <NotFound
            headingMessage={intl.formatMessage(commonMessages.notFound)}
          >
            <p>{notFoundMessage}</p>
          </NotFound>
        )}
      </DashboardContentContainer>
    </Pending>
  );
};

export default EditPool;
