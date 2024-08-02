import { useNavigate, useSearchParams } from "react-router-dom";
import { defineMessage, useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import { useFormContext } from "react-hook-form";
import uniqBy from "lodash/uniqBy";
import { useEffect } from "react";

import { Heading, Pending } from "@gc-digital-talent/ui";
import {
  BasicForm,
  enumToOptions,
  FieldLabels,
  objectsToSortedOptions,
  RadioGroup,
  Select,
  Submit,
} from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import {
  empty,
  emptyToNull,
  notEmpty,
  unpackMaybes,
} from "@gc-digital-talent/helpers";
import {
  graphql,
  FragmentType,
  getFragment,
  GovEmployeeType,
  UpdateUserAsUserInput,
} from "@gc-digital-talent/graphql";
import {
  errorMessages,
  getGovEmployeeType,
  getLocalizedName,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { getFromSessionStorage } from "@gc-digital-talent/storage";

import Hero from "~/components/Hero/Hero";
import SEO from "~/components/SEO/SEO";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import { splitAndJoin } from "~/utils/nameUtils";

import messages from "./utils/messages";

const specificTitle = defineMessage({
  defaultMessage: "Employee Information",
  id: "0IMGOS",
  description: "Main heading in employee information page.",
});

type FormValues = {
  govEmployeeYesNo: "yes" | "no";
  govEmployeeType: GovEmployeeType | null;
  lateralDeployBool: boolean;
  department: string;
  currentClassificationGroup: string;
  currentClassificationLevel: string;
  priorityEntitlementYesNo?: "yes" | "no";
  priorityEntitlementNumber?: string;
};

export const EmployeeInformation_QueryFragment = graphql(/** GraphQL */ `
  fragment EmployeeInformation_QueryFragment on Query {
    departments {
      id
      name {
        en
        fr
      }
    }
    classifications {
      id
      name {
        en
        fr
      }
      group
      level
    }
  }
`);

export interface EmployeeInformationFormProps {
  labels: FieldLabels;
  query?: FragmentType<typeof EmployeeInformation_QueryFragment>;
}

export const EmployeeInformationForm = ({
  labels,
  query,
}: EmployeeInformationFormProps) => {
  const intl = useIntl();
  const result = getFragment(EmployeeInformation_QueryFragment, query);
  const departments = unpackMaybes(result?.departments);
  const classifications = unpackMaybes(result?.classifications);
  const { watch, resetField } = useFormContext();
  // hooks to watch, needed for conditional rendering
  const [govEmployee, govEmployeeStatus, groupSelection] = watch([
    "govEmployeeYesNo",
    "govEmployeeType",
    "currentClassificationGroup",
    "priorityEntitlementYesNo",
  ]);

  const classGroupsWithDupes: {
    label: string;
    ariaLabel: string;
  }[] = classifications.map((classification) => {
    return {
      label:
        classification.group ||
        intl.formatMessage({
          defaultMessage: "Error: classification group not found.",
          id: "YA/7nb",
          description: "Error message if classification group is not defined.",
        }),
      ariaLabel: `${getLocalizedName(classification.name, intl)} ${splitAndJoin(
        classification.group,
      )}`,
    };
  });
  const noDupes = uniqBy(classGroupsWithDupes, "label");
  const groupOptions = noDupes.map(({ label, ariaLabel }) => {
    return {
      value: label,
      label,
      ariaLabel,
    };
  });

  // generate classification levels from the selected group
  const levelOptions = classifications
    .filter((x) => x.group === groupSelection)
    .map((iterator) => {
      return {
        value: iterator.level.toString(),
        label: iterator.level.toString(),
      };
    });

  const isGovEmployee = govEmployee === "yes";
  const isPlaced =
    isGovEmployee &&
    (govEmployeeStatus === GovEmployeeType.Term ||
      govEmployeeStatus === GovEmployeeType.Indeterminate ||
      govEmployeeStatus === GovEmployeeType.Casual);

  /**
   * Reset fields when they disappear
   * to avoid confusing users about unsaved changes
   */
  useEffect(() => {
    const resetDirtyField = (name: string) => {
      resetField(name, {
        keepDirty: false,
      });
    };

    if (!isGovEmployee) {
      resetDirtyField("department");
      resetDirtyField("govEmployeeType");
      if (!isPlaced) {
        resetDirtyField("currentClassificationGroup");
        if (empty(groupSelection)) {
          resetDirtyField("currentClassificationLevel");
        }
      }
    }
  }, [isGovEmployee, resetField, isPlaced, groupSelection]);

  return (
    <>
      <Heading
        level="h2"
        size="h3"
        data-h2-font-weight="base(400)"
        data-h2-margin="base(0, 0, x1, 0)"
      >
        {intl.formatMessage(specificTitle)}
      </Heading>
      <p data-h2-padding="base(0, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "Before we take you to your profile, we need to collect some required information to complete your account set up.",
          id: "x6saT3",
          description: "Message after main heading in create account page.",
        })}
      </p>
      <div>
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x1 0)"
          data-h2-margin="base(x1 0)"
        >
          <RadioGroup
            idPrefix="govEmployeeYesNo"
            legend={labels.govEmployeeYesNo}
            id="govEmployeeYesNo"
            name="govEmployeeYesNo"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            items={[
              {
                value: "no",
                label: intl.formatMessage({
                  defaultMessage:
                    "<strong>No</strong>, I am not a Government of Canada employee.",
                  id: "PS/LFb",
                  description:
                    "Label displayed for is not a government employee option",
                }),
              },
              {
                value: "yes",
                label: intl.formatMessage({
                  defaultMessage:
                    "<strong>Yes</strong>, I am a Government of Canada employee.",
                  id: "gto/zD",
                  description:
                    "Label displayed for is a government employee option",
                }),
              },
            ]}
          />
          {isGovEmployee && (
            <>
              <Select
                id="department"
                name="department"
                label={labels.department}
                nullSelection={intl.formatMessage({
                  defaultMessage: "Select a department",
                  id: "y827h2",
                  description:
                    "Null selection for department select input in the request form.",
                })}
                options={objectsToSortedOptions(departments, intl)}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
              <RadioGroup
                idPrefix="govEmployeeType"
                legend={labels.govEmployeeType}
                name="govEmployeeType"
                id="govEmployeeType"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                items={enumToOptions(GovEmployeeType).map(({ value }) => ({
                  value,
                  label: intl.formatMessage(getGovEmployeeType(value)),
                }))}
              />
            </>
          )}
          {isPlaced && (
            <>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Please indicate your current substantive group classification and level.",
                  id: "TS63OC",
                  description:
                    "Text blurb, asking about classification and level in the government info form",
                })}
              </p>
              <div
                data-h2-display="base(grid)"
                data-h2-gap="base(x1)"
                data-h2-grid-template-columns="l-tablet(repeat(2, 1fr))"
              >
                <Select
                  id="currentClassificationGroup"
                  label={labels.currentClassificationGroup}
                  name="currentClassificationGroup"
                  nullSelection={intl.formatMessage({
                    defaultMessage: "Select a group",
                    id: "9Upe1V",
                    description: "Null selection for form.",
                  })}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  options={groupOptions}
                />
                {notEmpty(groupSelection) && (
                  <Select
                    id="currentClassificationLevel"
                    label={labels.currentClassificationLevel}
                    name="currentClassificationLevel"
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                    nullSelection={intl.formatMessage(
                      uiMessages.nullSelectionOptionLevel,
                    )}
                    options={levelOptions}
                  />
                )}
              </div>
            </>
          )}
        </div>
        <Submit
          mode="solid"
          color="secondary"
          text={intl.formatMessage({
            defaultMessage: "Save and go to my profile",
            id: "H3Za3e",
            description:
              "Button label for submit button on create account form.",
          })}
        />
      </div>
    </>
  );
};

const EmployeeInformation_Query = graphql(/** GraphQL */ `
  query EmployeeInformation_Query {
    ...EmployeeInformation_QueryFragment
    me {
      id
    }
    classifications {
      id
      name {
        en
        fr
      }
      group
      level
    }
  }
`);

const EmployeeInformation_Mutation = graphql(/** GraphQL */ `
  mutation EmployeeInformation_Mutation(
    $id: ID!
    $user: UpdateUserAsUserInput!
  ) {
    updateUserAsUser(id: $id, user: $user) {
      id
    }
  }
`);

const EmployeeInformation = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");

  const [{ data, fetching, error }] = useQuery({
    query: EmployeeInformation_Query,
  });
  const meId = data?.me?.id;
  const classifications = unpackMaybes(data?.classifications);

  const cacheKey = `employee-information-${meId}`;

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(messages.breadcrumb),
        url: paths.employeeInformation(),
      },
    ],
  });

  const labels = {
    govEmployeeYesNo: intl.formatMessage({
      defaultMessage: "Do you currently work for the government of Canada?",
      id: "MtONBT",
      description: "Employee Status in Government Info Form",
    }),
    department: intl.formatMessage({
      defaultMessage: "Which department do you work for?",
      id: "NP/fsS",
      description: "Label for department select input in the request form",
    }),
    govEmployeeType: intl.formatMessage({
      defaultMessage: "As an employee, what is your employment status?",
      id: "3f9P13",
      description: "Employee Status in Government Info Form",
    }),
    currentClassificationGroup: intl.formatMessage({
      defaultMessage: "Current Classification Group",
      id: "/K1/1n",
      description: "Label displayed on classification group input",
    }),
    currentClassificationLevel: intl.formatMessage({
      defaultMessage: "Current Classification Level",
      id: "gnGAe8",
      description: "Label displayed on classification level input",
    }),
    priorityEntitlementYesNo: intl.formatMessage({
      defaultMessage: "Priority Entitlement",
      id: "FqXo5j",
      description: "Priority Entitlement Status in Government Info Form",
    }),
    priorityEntitlementNumber: intl.formatMessage({
      defaultMessage:
        "Priority number provided by the Public Service Commission of Canada",
      id: "5G+j56",
      description: "Label for priority number input",
    }),
  };

  const [, executeMutation] = useMutation(EmployeeInformation_Mutation);
  const handleUpdateEmployee = (id: string, input: UpdateUserAsUserInput) =>
    executeMutation({
      id,
      user: {
        ...input,
        id,
        email: emptyToNull(input.email),
      },
    }).then((result) => {
      if (result.data?.updateUserAsUser) {
        return result.data.updateUserAsUser;
      }
      return Promise.reject(result.error);
    });

  const onSubmit = async (input: UpdateUserAsUserInput) => {
    if (meId === undefined || meId === "") {
      toast.error(
        intl.formatMessage({
          defaultMessage: "Error: user not found",
          id: "4bjh8X",
          description: "Message displayed to user if user is not found",
        }),
      );
      return;
    }
    await handleUpdateEmployee(meId, input)
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Account successfully updated.",
            id: "g9J8/u",
            description:
              "Message displayed to user if account is updated successfully.",
          }),
        );
        const navigationTarget = from || paths.profileAndApplications();
        navigate(navigationTarget);
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating account failed.",
            id: "cO535E",
            description:
              "Message displayed to user if account fails to get updated.",
          }),
        );
      });
  };

  // take classification group + level from data, return the matching classification from API
  // need to fit to the expected type when this function is called in formToData
  const classificationFormToId = (
    group: string | undefined,
    level: string | undefined,
  ): string | undefined => {
    return classifications.find(
      (classification) =>
        classification.group === group &&
        classification.level === Number(level),
    )?.id;
  };

  const formValuesToSubmitData = (
    values: FormValues,
  ): UpdateUserAsUserInput => {
    const classificationId = classificationFormToId(
      values.currentClassificationGroup,
      values.currentClassificationLevel,
    );

    // various IF statements are to clean up cases where user toggles the conditionally rendered stuff before submitting
    // IE, picks term position and IT-01, then picks not a government employee before submitting, the conditionally rendered stuff still exists and can get submitted
    if (values.govEmployeeYesNo === "no") {
      return {
        isGovEmployee: false,
        govEmployeeType: null,
        department: { disconnect: true },
        currentClassification: {
          disconnect: true,
        },
        hasPriorityEntitlement: values.priorityEntitlementYesNo === "yes",
        priorityNumber:
          values.priorityEntitlementYesNo === "yes" &&
          values.priorityEntitlementNumber
            ? values.priorityEntitlementNumber
            : null,
      };
    }
    if (values.govEmployeeType === GovEmployeeType.Student) {
      return {
        isGovEmployee: values.govEmployeeYesNo === "yes",
        govEmployeeType: values.govEmployeeType,
        department: values.department ? { connect: values.department } : null,
        currentClassification: {
          disconnect: true,
        },
        hasPriorityEntitlement: values.priorityEntitlementYesNo === "yes",
        priorityNumber:
          values.priorityEntitlementYesNo === "yes" &&
          values.priorityEntitlementNumber
            ? values.priorityEntitlementNumber
            : null,
      };
    }
    if (values.govEmployeeType === GovEmployeeType.Casual) {
      return {
        isGovEmployee: values.govEmployeeYesNo === "yes",
        govEmployeeType: values.govEmployeeType,
        department: values.department ? { connect: values.department } : null,
        currentClassification: classificationId
          ? {
              connect: classificationId,
            }
          : null,
        hasPriorityEntitlement: values.priorityEntitlementYesNo === "yes",
        priorityNumber:
          values.priorityEntitlementYesNo === "yes" &&
          values.priorityEntitlementNumber
            ? values.priorityEntitlementNumber
            : null,
      };
    }
    return {
      isGovEmployee: values.govEmployeeYesNo === "yes",
      govEmployeeType: values.govEmployeeType,
      department: values.department ? { connect: values.department } : null,
      currentClassification: classificationId
        ? {
            connect: classificationId,
          }
        : null,
      hasPriorityEntitlement: values.priorityEntitlementYesNo === "yes",
      priorityNumber:
        values.priorityEntitlementYesNo === "yes" &&
        values.priorityEntitlementNumber
          ? values.priorityEntitlementNumber
          : null,
    };
  };

  const handleSubmit = (values: FormValues) =>
    onSubmit({
      ...formValuesToSubmitData(values),
    });

  return (
    <Pending fetching={fetching} error={error}>
      <SEO
        title={intl.formatMessage(specificTitle)}
        description={intl.formatMessage(messages.subtitle)}
      />
      <Hero
        title={intl.formatMessage(messages.title)}
        subtitle={intl.formatMessage(messages.subtitle)}
        crumbs={crumbs}
        simpleCrumbs
      >
        <section data-h2-padding="base(0, 0, x3, 0)">
          <div
            data-h2-background-color="base(foreground)"
            data-h2-radius="base(rounded)"
            data-h2-padding="base(x1) p-tablet(x2)"
            data-h2-shadow="base(large)"
          >
            <BasicForm
              onSubmit={handleSubmit}
              cacheKey={cacheKey}
              labels={labels}
              options={{ defaultValues: getFromSessionStorage(cacheKey, {}) }}
            >
              <EmployeeInformationForm labels={labels} query={data} />
            </BasicForm>
          </div>
        </section>
      </Hero>
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <EmployeeInformation />
  </RequireAuth>
);

export default EmployeeInformation;
