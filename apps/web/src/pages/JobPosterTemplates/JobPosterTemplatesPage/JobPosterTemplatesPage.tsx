import RectangleStackIcon from "@heroicons/react/24/outline/RectangleStackIcon";
import { defineMessage, useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { useQuery } from "urql";

import {
  Button,
  Heading,
  Loading,
  Separator,
  Sidebar,
} from "@gc-digital-talent/ui";
import {
  graphql,
  PoolStream,
  SupervisoryStatus,
} from "@gc-digital-talent/graphql";
import {
  Checklist,
  Input,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";

interface FormValues {
  keyword?: string;
  classifications?: string[];
  supervisoryStatus?: SupervisoryStatus[];
  streams?: PoolStream[];
}

const defaultValues = {
  keyword: "",
  classifications: [],
  supervisoryStatus: [],
  streams: [],
} satisfies FormValues;

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

const JobPostersFormData_Query = graphql(/* GraphQL */ `
  query JobPostersFormData {
    classifications {
      id
      group
      level
    }
    supervisoryStatuses: localizedEnumStrings(enumName: "SupervisoryStatus") {
      value
      label {
        en
        fr
      }
    }
    poolStreams: localizedEnumStrings(enumName: "PoolStream") {
      value
      label {
        en
        fr
      }
    }
  }
`);

const JobPosterTemplatesPage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const [{ data: formData, fetching: formDataFetching }] = useQuery({
    query: JobPostersFormData_Query,
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitle),
        url: paths.jobPosterTemplates(),
      },
    ],
  });

  const methods = useForm<FormValues>({ defaultValues });

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
        <FormProvider {...methods}>
          <Sidebar.Wrapper>
            <Sidebar.Sidebar>
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x1)"
              >
                <Input
                  id="keyword"
                  name="keyword"
                  type="text"
                  label={intl.formatMessage({
                    defaultMessage: "Search by keyword",
                    id: "PYMFoh",
                    description: "Label for the keyword search input",
                  })}
                />
                {formDataFetching ? (
                  <Loading inline />
                ) : (
                  <>
                    <Checklist
                      idPrefix="classifications"
                      name="classifications"
                      legend={intl.formatMessage({
                        defaultMessage: "Filter by levels",
                        id: "SaPE+p",
                        description: "Label for the classification input",
                      })}
                      items={unpackMaybes(formData?.classifications)
                        .filter(
                          (classification) => classification.group === "IT",
                        )
                        .map((classification) => ({
                          value: classification.id,
                          label: `${classification.group}-0${classification.level}`,
                        }))}
                    />
                    <Checklist
                      idPrefix="supervisoryStatuses"
                      name="supervisoryStatuses"
                      items={localizedEnumToOptions(
                        unpackMaybes(formData?.supervisoryStatuses),
                        intl,
                      )}
                      legend={intl.formatMessage({
                        defaultMessage: "Filter by type of role",
                        id: "vjbsDe",
                        description: "Legend for supervisory status input",
                      })}
                    />
                    <Checklist
                      idPrefix="streams"
                      name="streams"
                      items={localizedEnumToOptions(
                        unpackMaybes(formData?.poolStreams),
                        intl,
                      )}
                      legend={intl.formatMessage({
                        defaultMessage: "Filter by work streams",
                        id: "eeU13V",
                        description: "Legend for pool streams input",
                      })}
                    />
                  </>
                )}
                <Separator decorative orientation="horizontal" space="sm" />
                <Button
                  type="reset"
                  mode="inline"
                  color="secondary"
                  block
                  onClick={() => methods.reset()}
                >
                  {intl.formatMessage({
                    defaultMessage: "Reset all filters",
                    id: "0/jj1v",
                    description: "Button text to reset a filter form",
                  })}
                </Button>
              </div>
            </Sidebar.Sidebar>
          </Sidebar.Wrapper>
        </FormProvider>
      </div>
    </>
  );
};

export const Component = () => <JobPosterTemplatesPage />;

Component.displayName = "JobPosterTemplatesPage";

export default JobPosterTemplatesPage;
