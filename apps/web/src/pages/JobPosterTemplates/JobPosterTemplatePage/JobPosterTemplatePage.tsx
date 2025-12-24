import { OperationContext, useQuery } from "urql";
import { useIntl } from "react-intl";

import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";
import {
  Container,
  Pending,
  Separator,
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
import JobPosterDownloadButton from "./components/JobPosterDownloadButton";

const JobPosterTemplateTopLevel_Fragment = graphql(/* GraphQL */ `
  fragment JobPosterTemplateTopLevel on JobPosterTemplate {
    id
    name {
      en
      fr
    }
    ...JobPosterTemplateBasicDetails
    ...JobPosterTemplateKeyTasks
    ...JobPosterTemplateEssentialTechnicalSkills
    ...JobPosterTemplateEssentialBehaviouralSkills
    ...JobPosterTemplateAssetTechnicalSkills
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
        label: intl.formatMessage(jobPosterTemplatesPageMessages.breadcrumb),
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
      <Container className="my-18">
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
                <TableOfContents.AnchorLink
                  id={sections.assetTechnicalSkills.id}
                >
                  {intl.formatMessage(sections.assetTechnicalSkills.shortTitle)}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            </TableOfContents.List>
            <Separator space="sm" />
            <JobPosterDownloadButton id={jobPosterTemplate.id} />
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <div className="flex flex-col gap-18">
              <TableOfContents.Section id={sections.basicDetails.id}>
                <BasicDetails jobPosterTemplateQuery={jobPosterTemplate} />
              </TableOfContents.Section>
              <TableOfContents.Section id={sections.keyTasks.id}>
                <KeyTasks jobPosterTemplateQuery={jobPosterTemplate} />
              </TableOfContents.Section>
              <TableOfContents.Section
                id={sections.essentialTechnicalSkills.id}
              >
                <EssentialTechnicalSkills
                  jobPosterTemplateQuery={jobPosterTemplate}
                />
              </TableOfContents.Section>
              <TableOfContents.Section
                id={sections.essentialBehaviouralSkills.id}
              >
                <EssentialBehaviouralSkills
                  jobPosterTemplateQuery={jobPosterTemplate}
                />
              </TableOfContents.Section>
              <TableOfContents.Section id={sections.assetTechnicalSkills.id}>
                <AssetTechnicalSkills
                  jobPosterTemplateQuery={jobPosterTemplate}
                />
              </TableOfContents.Section>
            </div>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </Container>
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

interface RouteParams extends Record<string, string> {
  templateId: Scalars["ID"]["output"];
}

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

export default JobPosterTemplatePage;
