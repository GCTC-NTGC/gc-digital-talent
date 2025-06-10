import { OperationContext, useQuery } from "urql";
import { useIntl } from "react-intl";
import ArrowDownOnSquareIcon from "@heroicons/react/20/solid/ArrowDownOnSquareIcon";

import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";
import {
  Link,
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
      <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
        <div data-h2-margin-top="base(x2.5)">
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
                    {intl.formatMessage(
                      sections.assetTechnicalSkills.shortTitle,
                    )}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
              </TableOfContents.List>
              {/* The download links will be added in a later issue */}
              {/* eslint-disable-next-line no-constant-binary-expression */}
              {false && (
                <>
                  <Separator color="base:all(gray.lighter)" space="sm" />
                  <div
                    data-h2-display="base(flex)"
                    data-h2-flex-direction="base(column)"
                    data-h2-gap="base(x1)"
                  >
                    <Link
                      href="#"
                      icon={ArrowDownOnSquareIcon}
                      data-h2-font-weight="base(bold)"
                    >
                      {intl.formatMessage({
                        defaultMessage: "Download (EN)",
                        id: "+Ln2X/",
                        description: "Link to download a file in English",
                      })}
                    </Link>
                    <Link
                      href="#"
                      icon={ArrowDownOnSquareIcon}
                      data-h2-font-weight="base(bold)"
                    >
                      {intl.formatMessage({
                        defaultMessage: "Download (FR)",
                        id: "v1obWV",
                        description: "Link to download a file in French",
                      })}
                    </Link>
                  </div>
                </>
              )}
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
        </div>
      </div>
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

export const Component = () => <JobPosterTemplatePage />;

Component.displayName = "JobPosterTemplatePage";

export default JobPosterTemplatePage;
