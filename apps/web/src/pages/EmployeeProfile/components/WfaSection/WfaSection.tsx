import { useIntl } from "react-intl";
import { useMutation } from "urql";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import { FormProvider, useForm } from "react-hook-form";
import { ReactNode } from "react";

import {
  EmployeeWfa,
  FragmentType,
  getFragment,
  graphql,
  LocalizedWfaInterest,
  Maybe,
  Scalars,
  WfaInterest,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import {
  Button,
  Heading,
  Link,
  ToggleSection,
  Ul,
  Well,
} from "@gc-digital-talent/ui";
import { DateInput, RadioGroup, Submit } from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  errorMessages,
  formMessages,
  getWfaInterestFirstPerson,
  narrowEnumType,
} from "@gc-digital-talent/i18n";

import { hasAllEmptyFields } from "~/validators/employeeProfile/wfa";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import useRoutes from "~/hooks/useRoutes";
import messages from "~/messages/workforceAdjustmentMessages";
import UserWorkforceAdjustment from "~/components/WorkforceAdjustment/UserWorkforceAdjustment";
import SubstantiveExperiences from "~/components/WorkforceAdjustment/SubstantiveExperiences";
import Warning from "~/components/WorkforceAdjustment/Warning";

const wfaLink = (chunks: ReactNode, href: string) => (
  <Link href={href}>{chunks}</Link>
);

const EmployeeWfaOptions_Fragment = graphql(/** GraphQL */ `
  fragment EmployeeWfaOptions on Query {
    wfaInterests: localizedEnumOptions(enumName: "WfaInterest") {
      ... on LocalizedWfaInterest {
        value
        label {
          localized
        }
      }
    }
  }
`);

export const EmployeeProfileWfa_Fragment = graphql(/** GraphQL */ `
  fragment EmployeeProfileWfa on User {
    id
    ...UserWorkforceAdjustment
    employeeWFA {
      wfaInterest {
        value
        label {
          localized
        }
      }
      wfaDate
    }
    currentSubstantiveExperiences {
      id
      department {
        isCorePublicAdministration
      }
      ...SubstantiveExperiences
      ...ExperienceCard
    }
    employeeProfile {
      communityInterests {
        community {
          id
          name {
            localized
          }
        }
      }
    }
  }
`);

const UpdateEmployeeWfa_Mutation = graphql(/** GraphQL */ `
  mutation UpdateEmployeeWfa(
    $id: UUID!
    $employeeWfa: UpdateEmployeeWFAInput!
  ) {
    updateEmployeeWFA(id: $id, employeeWFA: $employeeWfa) {
      id
    }
  }
`);

interface FormValues {
  wfaInterest?: Maybe<WfaInterest>;
  wfaDate?: Maybe<Scalars["Date"]["input"]>;
  experienceCount?: number;
}

const dataToFormValues = (
  initialData?: Maybe<Pick<EmployeeWfa, "wfaInterest" | "wfaDate">>,
): FormValues => ({
  wfaInterest: initialData?.wfaInterest?.value,
  wfaDate: initialData?.wfaDate,
});

interface WfaSectionProps {
  employeeWfaQuery: FragmentType<typeof EmployeeProfileWfa_Fragment>;
  optionsQuery: FragmentType<typeof EmployeeWfaOptions_Fragment>;
}

const WfaSection = ({ employeeWfaQuery, optionsQuery }: WfaSectionProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [{ fetching }, executeMutation] = useMutation(
    UpdateEmployeeWfa_Mutation,
  );
  const user = getFragment(EmployeeProfileWfa_Fragment, employeeWfaQuery);
  const options = getFragment(EmployeeWfaOptions_Fragment, optionsQuery);
  const employeeWFA = user?.employeeWFA ?? {};
  const isNull = hasAllEmptyFields(employeeWFA);
  const { isEditing, setIsEditing, icon } = useToggleSectionInfo({
    isNull,
    emptyRequired: false,
    fallbackIcon: QuestionMarkCircleIcon,
    optional: true,
  });
  const initialFormValues = dataToFormValues(user?.employeeWFA);

  const methods = useForm<FormValues>({
    defaultValues: initialFormValues,
  });
  const { watch, handleSubmit, reset } = methods;

  const interest = watch("wfaInterest");

  const handleOpenChange = (open: boolean) => {
    reset(initialFormValues);
    setIsEditing(open);
  };

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Failed updating workforce adjustment information",
        id: "NOjAPn",
        description:
          "Messages displayed when a user fails to update wfa information",
      }),
    );
  };

  const handleSave = async (values: FormValues) => {
    return executeMutation({ id: user.id, employeeWfa: values })
      .then((res) => {
        if (res.data?.updateEmployeeWFA) {
          toast.success(
            intl.formatMessage({
              defaultMessage:
                "Workforce adjustment information updated successfully!",
              id: "0vk6td",
              description:
                "Message displayed when a user successfully updates wfa information:",
            }),
          );
          setIsEditing(false);
        } else {
          handleError();
        }
      })
      .catch(handleError);
  };

  const wfaInterests = narrowEnumType(
    unpackMaybes(options.wfaInterests),
    "WfaInterest",
  ).map(({ value }: LocalizedWfaInterest) => ({
    value,
    label: intl.formatMessage(getWfaInterestFirstPerson(value)),
  }));

  const communityInterests = unpackMaybes(
    user.employeeProfile?.communityInterests,
  );

  return (
    <ToggleSection.Root
      id="wfa-form"
      open={isEditing}
      onOpenChange={handleOpenChange}
    >
      <ToggleSection.Header
        icon={icon.icon}
        color={icon.color}
        level="h3"
        size="h4"
        className="font-bold"
        toggle={
          <ToggleForm.LabelledTrigger
            sectionTitle={intl.formatMessage(messages.wfa)}
          />
        }
      >
        {intl.formatMessage(messages.wfa)}
      </ToggleSection.Header>
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "This section allows you to manage your workforce adjustment details. <link>Learn about workforce adjustment</link> and if it applies to you.",
            id: "YRcRHy",
            description: "Description of workforce adjustment form",
          },
          {
            link: (chunks) => wfaLink(chunks, paths.wfaInfo()),
          },
        )}
      </p>
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? (
            <ToggleForm.NullDisplay />
          ) : (
            <UserWorkforceAdjustment query={user} />
          )}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <Heading level="h4" size="h5" className="mt-0 font-bold">
                {intl.formatMessage({
                  defaultMessage: "Workforce adjustment information",
                  id: "XBWnI6",
                  description:
                    "Title for the information specifically related to workforce adjustment",
                })}
              </Heading>
              <RadioGroup
                idPrefix="wfaInterest"
                name="wfaInterest"
                legend={intl.formatMessage(messages.wfaSituation)}
                rules={{ required: intl.formatMessage(errorMessages.required) }}
                items={wfaInterests}
              />
              {interest && interest !== WfaInterest.NotApplicable && (
                <>
                  <Heading level="h4" size="h5" className="font-bold">
                    {intl.formatMessage({
                      defaultMessage: "Key details",
                      id: "GPizcR",
                      description:
                        "Title for key details related to workforce adjustment",
                    })}
                  </Heading>
                  <p className="my-6">
                    {intl.formatMessage({
                      defaultMessage:
                        "To be able to support you in the best way possible, it’s crucial to verify that the information about your current position is up to date.",
                      id: "e4uyTF",
                      description:
                        "Description for the key details of workforce adjustment",
                    })}
                  </p>
                  <Heading level="h5" size="h6">
                    {intl.formatMessage(messages.currentSubstantivePosition)}
                  </Heading>
                  <SubstantiveExperiences
                    query={unpackMaybes(user.currentSubstantiveExperiences)}
                  />
                  {![
                    WfaInterest.VoluntaryDeparture,
                    WfaInterest.NotApplicable,
                  ].includes(interest) && (
                    <>
                      <DateInput
                        name="wfaDate"
                        id="wfaDate"
                        legend={intl.formatMessage(messages.expectedEndDate)}
                        context={intl.formatMessage({
                          defaultMessage:
                            "If possible, verify your expected end date.",
                          id: "qDzAG6",
                          description:
                            "Help text for the wfa expected end date",
                        })}
                      />
                      <Heading level="h5" size="h6">
                        {intl.formatMessage(messages.currentCommunity)}
                      </Heading>
                      {communityInterests.length > 0 ? (
                        <Ul space="sm">
                          {communityInterests.map((ci) => (
                            <li key={ci.community.id}>
                              {ci?.community?.name?.localized ??
                                intl.formatMessage(commonMessages.notAvailable)}
                            </li>
                          ))}
                        </Ul>
                      ) : (
                        <Warning>
                          <p>
                            {intl.formatMessage({
                              defaultMessage: "Missing functional community",
                              id: "3QXxlE",
                              description:
                                "Title for when a user is missing a functional community",
                            })}
                          </p>
                          <p className="mb-6">
                            {intl.formatMessage({
                              defaultMessage:
                                "Workforce adjustment support is managed by recruitment teams from our functional communities. Add the relevant functional communities to your profile so that they'll see your workforce adjustment information.",
                              id: "5J0qfS",
                              description:
                                "Help text for resolving missing community warning",
                            })}
                          </p>
                          <Link
                            color="warning"
                            mode="inline"
                            href={`${paths.createCommunityInterest()}?from=${paths.employeeProfile()}`}
                          >
                            {intl.formatMessage({
                              defaultMessage: "Add a functional community",
                              id: "XE8xbj",
                              description:
                                "Link text to add a functional community",
                            })}
                          </Link>
                        </Warning>
                      )}
                    </>
                  )}
                  <Well className="mt-12">
                    <Heading level="h5" size="h6" className="mt-0">
                      {intl.formatMessage({
                        defaultMessage: "Privacy and confidentiality",
                        id: "2Csd16",
                        description:
                          "Title for the privacy and confidentiality section of wfa form",
                      })}
                    </Heading>
                    <p className="my-6">
                      {intl.formatMessage({
                        defaultMessage:
                          "We know that workforce adjustment is a vulnerable time and we’re committed to treating your information with the utmost care and confidentiality.",
                        id: "VjMgWb",
                        description:
                          "Paragraph one for privacy and confidentiality section of wfa form",
                      })}
                    </p>
                    <p className="my-6">
                      {intl.formatMessage({
                        defaultMessage:
                          "The information you share here will only be visible to a small group of authorized administrators, including members of the GC Digital Talent client services team and the recruitment team of the functional communities you've added to your profile. This information will not be made public anywhere on the platform or shared with your manager without your explicit consent. If you’re an employee seeking a match because you’ve received a workforce adjustment letter, your status will be validated with your department’s HR team prior to proceeding to next steps.",
                        id: "fRZ1c1",
                        description:
                          "Paragraph two for privacy and confidentiality section of wfa form",
                      })}
                    </p>
                    <p>
                      {intl.formatMessage({
                        defaultMessage:
                          "If a match with a new opportunity or a potential alternation is found, our team will reach out to confirm that you’re willing to share your information with the person you’ve been matched with.",
                        id: "srGJ8c",
                        description:
                          "Paragraph three for privacy and confidentiality section of wfa form",
                      })}
                    </p>
                  </Well>
                </>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-6">
                <Submit
                  text={intl.formatMessage(formMessages.saveChanges)}
                  aria-label={intl.formatMessage({
                    defaultMessage: "Save workforce adjustment",
                    id: "/LhwX1",
                    description:
                      "Text on a button to save workforce adjustment info",
                  })}
                  color="secondary"
                  mode="solid"
                  isSubmitting={fetching}
                />
                <ToggleSection.Close>
                  <Button mode="inline" type="button" color="warning">
                    {intl.formatMessage(commonMessages.cancel)}
                  </Button>
                </ToggleSection.Close>
              </div>
            </form>
          </FormProvider>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default WfaSection;
