import RectangleStackIcon from "@heroicons/react/24/outline/RectangleStackIcon";
import { defineMessage, useIntl } from "react-intl";

import { Heading } from "@gc-digital-talent/ui";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";

const pageTitle = defineMessage({
  defaultMessage: "Job advertisement templates",
  id: "58+Hom",
  description: "Heading for the page showing list of job poster templates",
});

const pageDescription = defineMessage({
  defaultMessage:
    "Browse a library of pre-built job advertisements that include suggestions for key tasks, required, and optional skills.",
  id: "s7jEFt",
  description: "Description for the page showing list of job poster templates",
});

const JobPosterTemplatesPage = () => {
  const intl = useIntl();
  const paths = useRoutes();

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitle),
        url: paths.jobPosterTemplates(),
      },
    ],
  });

  return (
    <>
      <SEO
        title={intl.formatMessage(pageTitle)}
        description={intl.formatMessage(pageDescription)}
      />
      <Hero
        title={intl.formatMessage(pageTitle)}
        subtitle={intl.formatMessage(pageDescription)}
        crumbs={crumbs}
      />
      <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
        <Heading level="h2" size="h3" color="primary" Icon={RectangleStackIcon}>
          {intl.formatMessage({
            defaultMessage: "Find a template",
            id: "XIDaGg",
            description: "Heading for the form to filter job poster templates",
          })}
        </Heading>
        <p data-h2-margin="base(x1 0)">
          {intl.formatMessage({
            defaultMessage:
              "This library contains a series of templates for common jobs across the communities we support. These templates include suggested information and recommendations for elements such as job title, common tasks in the role, essential and asset skills, and more. Feel free to browse the full list, or, if you have an idea of the type of role you're hiring for, you can use the search bar or filters to find templates that align with the job’s specific details.",
            id: "8dUPjb",
            description:
              "Description of how to use the form to filter job poster templates",
          })}
        </p>
      </div>
    </>
  );
};

export const Component = () => <JobPosterTemplatesPage />;

Component.displayName = "JobPosterTemplatesPage";

export default JobPosterTemplatesPage;
