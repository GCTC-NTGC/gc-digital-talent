import { useIntl } from "react-intl";
import { useMutation } from "urql";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import { FormProvider, useForm } from "react-hook-form";

import {
  EmployeeWfa,
  FragmentType,
  getFragment,
  graphql,
  Maybe,
  Scalars,
  WfaInterest,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { Button, Heading, ToggleSection } from "@gc-digital-talent/ui";
import { RadioGroup, Submit } from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  errorMessages,
  formMessages,
  narrowEnumType,
} from "@gc-digital-talent/i18n";

import { hasAllEmptyFields } from "~/validators/employeeProfile/wfa";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";

import messages from "../../messages";
import Display from "./Display";

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

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(user?.employeeWFA),
  });

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
  ).map(({ value, label }) => ({
    value,
    label: label.localized ?? intl.formatMessage(commonMessages.notAvailable),
  }));

  return (
    <ToggleSection.Root
      id="wfa-form"
      open={isEditing}
      onOpenChange={setIsEditing}
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
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? <ToggleForm.NullDisplay /> : <Display user={user} />}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSave)}>
              <Heading level="h4" size="h5" className="mt-0">
                {intl.formatMessage({
                  defaultMessage: "Workforce adjustment information",
                  id: "9+lpKK",
                  description:
                    "Title for the information specifically related to workfoce adjustment",
                })}
              </Heading>
              <RadioGroup
                idPrefix="wfaInterest"
                name="wfaInterest"
                legend={intl.formatMessage(messages.wfaSituation)}
                rules={{ required: intl.formatMessage(errorMessages.required) }}
                items={wfaInterests}
              />
              <div className="flex flex-wrap items-center gap-6">
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
