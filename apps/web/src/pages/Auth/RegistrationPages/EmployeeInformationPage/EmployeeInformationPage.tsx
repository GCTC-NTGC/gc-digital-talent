import { useNavigate, useSearchParams } from "react-router";
import { defineMessage, useIntl } from "react-intl";
import BriefcaseIcon from "@heroicons/react/24/outline/BriefcaseIcon";
import { FormProvider, useForm } from "react-hook-form";

import { Link, Card, Heading } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Submit } from "@gc-digital-talent/forms";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import WorkFields from "~/components/ExperienceFormFields/WorkFields/WorkFields";
import { getExperienceFormLabels } from "~/utils/experienceUtils";
import { WorkFormValues } from "~/types/experience";

import messages from "../messages";

const addWorkExperienceSectionTitle = defineMessage({
  defaultMessage: "Add your most recent work experience",
  id: "v1dIUn",
  description: "Section title for the Add work experience section.",
});

export interface EmployeeInformationFormProps {
  navigationTarget: string;
  onSubmit: (formValues: WorkFormValues) => Promise<void>;
}

export const EmployeeInformationForm = ({
  navigationTarget,
  onSubmit,
}: EmployeeInformationFormProps) => {
  const intl = useIntl();
  const methods = useForm<WorkFormValues>();
  const labels = getExperienceFormLabels(intl, "work");
  return (
    <>
      <Heading
        level="h2"
        size="h3"
        icon={BriefcaseIcon}
        color="secondary"
        className="mt-0 mb-6 font-normal"
      >
        {intl.formatMessage(addWorkExperienceSectionTitle)}
      </Heading>
      <p className="mb-6">
        {intl.formatMessage({
          defaultMessage:
            "Start building your profile by telling us about your most recent job. Not ready to add experience yet? You can skip this step at the end of the form.",
          id: "g3vPKp",
          description: "Description for Add your work experience section",
        })}
      </p>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="mb-9">
            <WorkFields labels={labels} organizationSuggestions={[]} />
          </div>
          <Card.Separator className="mb-6" />
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-end">
            <Link mode="inline" href={navigationTarget}>
              {intl.formatMessage({
                defaultMessage: "Skip this step",
                id: "aZESX1",
                description: "label to skip this step",
              })}
            </Link>
            <Submit
              mode="solid"
              color="primary"
              text={intl.formatMessage(commonMessages.saveAndContinue)}
              submittedText={intl.formatMessage(commonMessages.saveAndContinue)}
            />
          </div>
        </form>
      </FormProvider>
    </>
  );
};

const EmployeeInformationPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(messages.breadcrumb),
        url: paths.employeeInformation(),
      },
    ],
  });

  const navigationTarget = from ?? paths.applicantDashboard();

  const handleSubmit = async (formValues: WorkFormValues) => {
    console.debug("handleSubmit", formValues);
  };

  return (
    <>
      <SEO
        title={intl.formatMessage(addWorkExperienceSectionTitle)}
        description={intl.formatMessage(messages.subtitle)}
      />
      <Hero
        title={intl.formatMessage(messages.title)}
        subtitle={intl.formatMessage(messages.subtitle)}
        crumbs={crumbs}
        overlap
        centered
      >
        <section className="mb-18">
          <Card space="lg">
            {/* <Pending fetching={fetching} error={error}> */}
            <EmployeeInformationForm
              navigationTarget={navigationTarget}
              onSubmit={handleSubmit}
            />

            {/* </Pending> */}
          </Card>
        </section>
      </Hero>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <EmployeeInformationPage />
  </RequireAuth>
);

export default EmployeeInformationPage;
