import { useNavigate, useSearchParams } from "react-router";
import { defineMessage, useIntl } from "react-intl";
import BriefcaseIcon from "@heroicons/react/24/outline/BriefcaseIcon";
import { FormProvider, useForm } from "react-hook-form";

import { Link, Card, Heading } from "@gc-digital-talent/ui";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Submit } from "@gc-digital-talent/forms";
import {
  EmploymentCategory,
  GovPositionType,
} from "@gc-digital-talent/graphql";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import WorkFields from "~/components/ExperienceFormFields/WorkFields/WorkFields";
import { getExperienceFormLabels } from "~/utils/experienceUtils";
import {
  ExperienceDetailsSubmissionData,
  WorkFormValues,
} from "~/types/experience";
import { useExperienceMutations } from "~/hooks/useExperienceMutations";

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

// A simpler copy from apps/web/src/utils/experienceUtils.tsx .
// I can't use that since I'm not using the full combo-form.
const formValuesToSubmitData = (
  formValues: WorkFormValues,
): ExperienceDetailsSubmissionData => {
  const {
    role,
    organization,
    team,
    startDate,
    endDate,
    currentRole,
    employmentCategory,
    extSizeOfOrganization,
    extRoleSeniority,
    department: departmentId,
    govEmploymentType,
    govPositionType,
    govContractorRoleSeniority,
    govContractorType,
    contractorFirmAgencyName,
    classificationLevel: classificationId,
    cafEmploymentType,
    cafForce,
    cafRank,
    workStreams,
    supervisoryPosition,
    supervisedEmployees,
    supervisedEmployeesNumber,
    budgetManagement,
    annualBudgetAllocation,
    seniorManagementStatus,
    cSuiteRoleTitle,
    otherCSuiteRoleTitle,
  } = formValues;

  // for government employee experiences only, expected end date is present in end date field
  // SUBSTANTIVE the exception, accessible solely through INDETERMINATE
  const allowExpectedEndDate =
    employmentCategory === EmploymentCategory.GovernmentOfCanada &&
    govPositionType !== GovPositionType.Substantive;

  const mappedData = {
    role,
    organization: organization ?? undefined, // this is different from the shared version but not sure why
    division: team,
    startDate,
    endDate: allowExpectedEndDate || (!currentRole && endDate) ? endDate : null,
    employmentCategory,
    extSizeOfOrganization,
    extRoleSeniority,
    departmentId: departmentId ?? null,
    govEmploymentType,
    govPositionType,
    govContractorRoleSeniority,
    govContractorType,
    contractorFirmAgencyName,
    classificationId: classificationId ?? null,
    cafEmploymentType,
    cafForce,
    cafRank,
    workStreams: {
      sync: workStreams,
    },
    supervisoryPosition,
    supervisedEmployees,
    supervisedEmployeesNumber: Number(supervisedEmployeesNumber),
    budgetManagement,
    annualBudgetAllocation: Number(annualBudgetAllocation),
    seniorManagementStatus,
    cSuiteRoleTitle,
    otherCSuiteRoleTitle,
  };

  return mappedData;
};

const EmployeeInformationPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { userAuthInfo } = useAuthorization();
  const paths = useRoutes();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const { executeMutation, getMutationArgs } = useExperienceMutations(
    "create",
    "work",
  );

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
    if (!executeMutation) {
      throw new Error("No mutation provided");
    }
    const submitData = formValuesToSubmitData(formValues);
    const args = getMutationArgs(userAuthInfo?.id ?? "", submitData);
    await executeMutation(args);
    await navigate(navigationTarget);
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
