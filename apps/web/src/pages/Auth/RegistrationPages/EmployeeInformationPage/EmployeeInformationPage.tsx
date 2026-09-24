import { useNavigate, useSearchParams } from "react-router";
import { defineMessage, useIntl } from "react-intl";
import BriefcaseIcon from "@heroicons/react/24/outline/BriefcaseIcon";
import { FormProvider, useForm } from "react-hook-form";
import { useQuery } from "urql";

import {
  Link,
  Card,
  Heading,
  Pending,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Submit } from "@gc-digital-talent/forms";
import {
  EmploymentCategory,
  GovPositionType,
  graphql,
} from "@gc-digital-talent/graphql";
import { useFeatureFlags } from "@gc-digital-talent/env";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import WorkFields from "~/components/ExperienceFormFields/WorkFields/WorkFields";
import { getExperienceFormLabels } from "~/utils/experienceUtils";
import type {
  ExperienceDetailsSubmissionData,
  WorkFormValues,
} from "~/types/experience";
import { useExperienceMutations } from "~/hooks/useExperienceMutations";
import profileMessages from "~/messages/profileMessages";
import AlreadyHaveProfileDialog from "~/components/InAppMigration/AlreadyHaveProfileDialog";
import MigrationPossibleNotice from "~/components/InAppMigration/MigrationPossibleNotice";

import messages from "../messages";

export const ADD_WORK_EXPERIENCE_FORM_ID = "add-work-experience-form";

const addWorkExperienceSectionTitle = defineMessage({
  defaultMessage: "Add your most recent work experience",
  id: "v1dIUn",
  description: "Section title for the Add work experience section.",
});

// decide what the default value of employment category should be in the form
const defaultEmploymentCategory = (
  isEmployee: string | null,
): EmploymentCategory | undefined => {
  if (isEmployee == "true") return EmploymentCategory.GovernmentOfCanada;
  if (isEmployee == "false") return EmploymentCategory.ExternalOrganization;
  return undefined;
};

export interface EmployeeInformationFormProps {
  navigationTarget: string;
  onSubmit: (formValues: WorkFormValues) => Promise<void>;
  canMigrateMyAccount: boolean;
}

export const EmployeeInformationForm = ({
  navigationTarget,
  onSubmit,
  canMigrateMyAccount,
}: EmployeeInformationFormProps) => {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const methods = useForm<WorkFormValues>({
    defaultValues: {
      employmentCategory: defaultEmploymentCategory(
        searchParams.get("isEmployee"),
      ),
    },
  });
  const featureFlags = useFeatureFlags();
  const showButtonAlreadyHaveProfile =
    featureFlags.authInAppMigration && !canMigrateMyAccount;
  const labels = getExperienceFormLabels(intl, "work");
  return (
    <>
      <Heading
        id={ADD_WORK_EXPERIENCE_FORM_ID}
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
          <div className="mt-6 flex flex-col items-center gap-x-6 gap-y-1.5 sm:flex-row sm:justify-between">
            {showButtonAlreadyHaveProfile ? (
              <AlreadyHaveProfileDialog />
            ) : (
              <div>{/* this is intentionally empty to maintain layout */}</div>
            )}
            <div className="flex flex-col items-center gap-x-6 gap-y-1.5 sm:flex-row sm:justify-end">
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
                submittedText={intl.formatMessage(
                  commonMessages.saveAndContinue,
                )}
              />
            </div>
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
    roleStatus,
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

  const mappedData: ExperienceDetailsSubmissionData = {
    role,
    organization: organization ?? undefined, // this is different from the shared version but not sure why
    division: team,
    startDate,
    endDate:
      allowExpectedEndDate || (roleStatus === "past" && endDate)
        ? endDate
        : null,
    employmentCategory,
    extSizeOfOrganization,
    extRoleSeniority,
    department: { connect: departmentId },
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

const EmployeeInformationPage_Query = graphql(/** GraphQL */ `
  query EmployeeInformationPage {
    canMigrateMyAccount
  }
`);

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

  const [{ data, fetching, error }] = useQuery({
    query: EmployeeInformationPage_Query,
  });

  const featureFlags = useFeatureFlags();
  const showMigrationPossibleNotice =
    featureFlags.authInAppMigration && data?.canMigrateMyAccount;

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(messages.breadcrumb),
        url: paths.registrationExperience(),
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
        <section className="mb-18 flex flex-col gap-6">
          {showMigrationPossibleNotice ? (
            <MigrationPossibleNotice
              ignoreAction="scroll"
              scrollToIdOnIgnore={ADD_WORK_EXPERIENCE_FORM_ID}
            />
          ) : null}
          <Card space="lg">
            <Pending fetching={fetching} error={error}>
              {data ? (
                <EmployeeInformationForm
                  navigationTarget={navigationTarget}
                  onSubmit={handleSubmit}
                  canMigrateMyAccount={data.canMigrateMyAccount}
                />
              ) : (
                <ThrowNotFound
                  message={intl.formatMessage(profileMessages.userNotFound)}
                />
              )}
            </Pending>
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

export default Component;
