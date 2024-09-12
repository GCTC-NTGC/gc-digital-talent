import { OperationContext, useQuery } from "urql";
import { useIntl } from "react-intl";

import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";
import {
  Link,
  Pending,
  TableOfContents,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";

import useRequiredParams from "~/hooks/useRequiredParams";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";

import pageMessages from "./messages";
import jobPosterTemplatesPageMessages from "../JobPosterTemplatesPage/messages";
import sections from "./sections";
import BasicDetails from "./components/BasicDetails";
import KeyTasks from "./components/KeyTasks";
import EssentialTechnicalSkills from "./components/EssentialTechnicalSkills";
import EssentialBehaviouralSkills from "./components/EssentialBehaviouralSkills";
import AssetTechnicalSkills from "./components/AssetTechnicalSkills";

const JobPosterTemplateTopLevel_Fragment = graphql(/* GraphQL */ `
  fragment JobPosterTemplateTopLevel on JobPosterTemplate {
    id
    name {
      en
      fr
    }
    ...JobPosterTemplateBasicDetails
  }
`);
interface JobPosterTemplateProps {
  jobPosterTemplateQuery: FragmentType<
    typeof JobPosterTemplateTopLevel_Fragment
  >;
}

const JobPosterTemplate = ({
  jobPosterTemplateQuery,
}: JobPosterTemplateProps) => {
  const paths = useRoutes();
  const intl = useIntl();

  const jobPosterTemplate = getFragment(
    JobPosterTemplateTopLevel_Fragment,
    jobPosterTemplateQuery,
  );

  const templateName = getLocalizedName(jobPosterTemplate?.name, intl, true);

  const formattedCrumbLabel =
    templateName ?? intl.formatMessage(pageMessages.pageTitle);
  const formattedPageTitle = templateName
    ? `${intl.formatMessage(pageMessages.pageTitle)}${intl.formatMessage(commonMessages.dividingColon)}${templateName}`
    : templateName;
  const formattedPageSubtitle = intl.formatMessage(pageMessages.subTitle);

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(jobPosterTemplatesPageMessages.pageTitle),
        url: paths.jobPosterTemplates(),
      },
      {
        label: formattedCrumbLabel,
        url: paths.jobPosterTemplate(jobPosterTemplate?.id),
      },
    ],
  });

  return (
    <>
      <SEO title={formattedPageTitle} description={formattedPageSubtitle} />
      <Hero
        title={formattedPageTitle}
        subtitle={formattedPageSubtitle}
        crumbs={crumbs}
      />
      <TableOfContents.Wrapper>
        <TableOfContents.Navigation>
          <TableOfContents.List>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={sections.basicDetails.id}>
                {intl.formatMessage(sections.basicDetails.title)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={sections.keyTasks.id}>
                {intl.formatMessage(sections.keyTasks.shortTitle)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink
                id={sections.essentialTechnicalSkills.id}
              >
                {intl.formatMessage(
                  sections.essentialTechnicalSkills.shortTitle,
                )}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink
                id={sections.essentialBehaviouralSkills.id}
              >
                {intl.formatMessage(
                  sections.essentialBehaviouralSkills.shortTitle,
                )}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={sections.assetTechnicalSkills.id}>
                {intl.formatMessage(sections.assetTechnicalSkills.shortTitle)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
          </TableOfContents.List>
          <div>
            <Link>
              {intl.formatMessage({
                defaultMessage: "Download (EN)",
                id: "+Ln2X/",
                description: "Link to download a file in English",
              })}
            </Link>
            <Link>
              {intl.formatMessage({
                defaultMessage: "Download (FR)",
                id: "v1obWV",
                description: "Link to download a file in French",
              })}
            </Link>
          </div>
        </TableOfContents.Navigation>
        <TableOfContents.Content>
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-gap="base(x3)"
          >
            <TableOfContents.Section id={sections.basicDetails.id}>
              <BasicDetails jobPosterTemplateQuery={jobPosterTemplate} />
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.keyTasks.id}>
              <KeyTasks />
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.essentialTechnicalSkills.id}>
              <EssentialTechnicalSkills />
            </TableOfContents.Section>
            <TableOfContents.Section
              id={sections.essentialBehaviouralSkills.id}
            >
              <EssentialBehaviouralSkills />
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.assetTechnicalSkills.id}>
              <AssetTechnicalSkills />
            </TableOfContents.Section>
          </div>
        </TableOfContents.Content>
      </TableOfContents.Wrapper>
    </>
  );
};

const JobPosterTemplatePage_Query = graphql(/* GraphQL */ `
  query JobPosterTemplatePage($templateId: UUID!) {
    jobPosterTemplate(id: $templateId) {
      id
      ...JobPosterTemplateTopLevel
    }
  }
`);

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type RouteParams = {
  templateId: Scalars["ID"]["output"];
};

const context: Partial<OperationContext> = {
  requestPolicy: "cache-first",
};

const JobPosterTemplatePage = () => {
  const intl = useIntl();
  const { templateId } = useRequiredParams<RouteParams>("templateId");

  const [{ data, fetching, error }] = useQuery({
    query: JobPosterTemplatePage_Query,
    context,
    variables: { templateId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.jobPosterTemplate ? (
        <JobPosterTemplate jobPosterTemplateQuery={data.jobPosterTemplate} />
      ) : (
        <ThrowNotFound message={intl.formatMessage(commonMessages.notFound)} />
      )}
    </Pending>
  );
};

export const Component = () => <JobPosterTemplatePage />;

Component.displayName = "JobPosterTemplatePage";

export default JobPosterTemplatePage;
