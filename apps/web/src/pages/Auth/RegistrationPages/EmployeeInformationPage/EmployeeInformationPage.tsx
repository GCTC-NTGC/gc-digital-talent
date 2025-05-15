import { createSearchParams, useNavigate, useSearchParams } from "react-router";
import { defineMessage, useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import { useFormContext } from "react-hook-form";
import uniqBy from "lodash/uniqBy";
import { useEffect } from "react";
import HomeModernIcon from "@heroicons/react/24/outline/HomeModernIcon";

import { Button, Heading, Pending, Well } from "@gc-digital-talent/ui";
import {
  BasicForm,
  Combobox,
  enumToOptions,
  FieldLabels,
  Input,
  objectsToSortedOptions,
  RadioGroup,
  Select,
} from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { unpackMaybes, workEmailDomainRegex } from "@gc-digital-talent/helpers";
import {
  graphql,
  FragmentType,
  getFragment,
  GovEmployeeType,
  UpdateUserAsUserInput,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  errorMessages,
  getGovEmployeeType,
  getLocalizedName,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { getFromSessionStorage } from "@gc-digital-talent/storage";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import { splitAndJoin } from "~/utils/nameUtils";

import messages from "../utils/messages";

const specificTitle = defineMessage({
  defaultMessage: "Employee information",
  id: "uA8hbm",
  description: "Main heading in employee information page.",
});

interface FormValues {
  govEmployeeYesNo: "yes" | "no";
  govEmployeeType: GovEmployeeType | null;
  lateralDeployBool: boolean;
  department: string;
  workEmail: string;
  currentClassificationGroup: string;
  currentClassificationLevel: string;
  skipVerification?: boolean;
}

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

export interface EmployeeInformationFormFieldsProps {
  labels: FieldLabels;
  query?: FragmentType<typeof EmployeeInformation_QueryFragment>;
}

export const EmployeeInformationFormFields = ({
  labels,
  query,
}: EmployeeInformationFormFieldsProps) => {
  const intl = useIntl();
  const result = getFragment(EmployeeInformation_QueryFragment, query);
  const departments = unpackMaybes(result?.departments);
  const classifications = unpackMaybes(result?.classifications);
  const { watch, resetField, setValue, register } =
    useFormContext<FormValues>();
  const skipVerificationProps = register("skipVerification");
  // hooks to watch, needed for conditional rendering
  const [govEmployee, groupSelection] = watch([
    "govEmployeeYesNo",
    "currentClassificationGroup",
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
        value: iterator.level,
        label: iterator.level.toString(),
      };
    })
    .sort((a, b) => a.value - b.value);

  const isGovEmployee = govEmployee === "yes";

  /**
   * Reset fields when they disappear
   * to avoid confusing users about unsaved changes
   */
  useEffect(() => {
    const resetDirtyField = (name: keyof FormValues) => {
      resetField(name, {
        keepDirty: false,
      });
    };

    if (!isGovEmployee) {
      resetDirtyField("department");
      resetDirtyField("govEmployeeType");
      resetDirtyField("workEmail");
      resetDirtyField("currentClassificationGroup");
      resetDirtyField("currentClassificationLevel");
    }
  }, [isGovEmployee, resetField]);

  /**
   * Reset classification level when group changes
   * because level options change
   */
  useEffect(() => {
    resetField("currentClassificationLevel", {
      keepDirty: false,
    });
  }, [resetField, groupSelection]);

  return (
    <>
      <Heading
        level="h2"
        size="h3"
        Icon={HomeModernIcon}
        color="primary"
        data-h2-font-weight="base(400)"
        data-h2-margin="base(0, 0, x1, 0)"
      >
        {intl.formatMessage(specificTitle)}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "We'd now like to know if you're currently an employee with the Government of Canada. We collect this information because it helps us understand, at an aggregate level, how digital skills are distributed across departments.",
          id: "VZnDzi",
          description:
            "Message after main heading in employee information page - paragraph 1.",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "We also use this information to provide you with a more contextualized experience, including opportunity recommendations based on your employment status, classification, and more.",
          id: "2HGCCF",
          description:
            "Message after main heading in employee information page - paragraph 2.",
        })}
      </p>
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
                defaultMessage: "No, I am not a Government of Canada employee.",
                id: "yUSG9Z",
                description:
                  "Label displayed for is not a government employee option",
              }),
            },
            {
              value: "yes",
              label: intl.formatMessage({
                defaultMessage: "Yes, I am a Government of Canada employee.",
                id: "Td2+oC",
                description:
                  "Label displayed for is a government employee option",
              }),
            },
          ]}
        />
        {isGovEmployee && (
          <>
            <RadioGroup
              idPrefix="govEmployeeType"
              legend={labels.govEmployeeType}
              name="govEmployeeType"
              id="govEmployeeType"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              items={enumToOptions(GovEmployeeType, [
                GovEmployeeType.Student,
                GovEmployeeType.Casual,
                GovEmployeeType.Term,
                GovEmployeeType.Indeterminate,
              ]).map(({ value }) => ({
                value,
                label: intl.formatMessage(getGovEmployeeType(value)),
              }))}
            />
            <Combobox
              id="department"
              name="department"
              label={labels.department}
              options={objectsToSortedOptions(departments, intl)}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              doNotSort
            />
            <div>
              <div data-h2-margin="base(0, 0, x0.25, 0)">
                <Input
                  id="workEmail"
                  name="workEmail"
                  type="email"
                  label={labels.workEmail}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                    pattern: {
                      value: workEmailDomainRegex,
                      message: intl.formatMessage({
                        defaultMessage:
                          "This does not appear to be a Government of Canada email. If you are entering a Government of Canada email and still getting this error, please contact our support team.",
                        id: "BLOt/e",
                        description:
                          "Description for rule pattern on work email field",
                      }),
                    },
                  }}
                />
              </div>
              <Well>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Please note that your work email must be a valid Government of Canada email address and will also require verification.",
                    id: "KtXvdO",
                    description:
                      "Message on getting started page about the contact email address - part 1.",
                  })}
                </p>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "By providing and verifying your work email, you'll have access to employee-specific tools, features, and opportunities. Work emails may need to be re-verified periodically. Please get in touch if you have questions or need help.",
                    id: "jBjIJT",
                    description:
                      "Message on getting started page about the contact email address - part 2.",
                  })}
                </p>
              </Well>
            </div>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Please indicate your current substantive classification group and level. If you're in an acting position, this means you should select your original classification and level prior to the acting role.",
                id: "nWy6LP",
                description:
                  "Text blurb, asking about classification and level in the employee info page",
              })}
            </p>
            <div
              data-h2-display="base(grid)"
              data-h2-gap="base(x1)"
              data-h2-grid-template-columns="l-tablet(4fr 1fr)"
            >
              <Combobox
                id="currentClassificationGroup"
                label={labels.currentClassificationGroup}
                name="currentClassificationGroup"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                options={groupOptions}
              />
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
                doNotSort
              />
            </div>
          </>
        )}
      </div>
      {isGovEmployee ? (
        <div
          data-h2-display="base(flex)"
          data-h2-gap="base(x.25, x.5)"
          data-h2-flex-wrap="base(wrap)"
          data-h2-flex-direction="base(column) l-tablet(row)"
          data-h2-align-items="base(flex-start) l-tablet(center)"
        >
          <Button
            mode="solid"
            color="secondary"
            onClick={() => setValue("skipVerification", false)}
            {...skipVerificationProps}
          >
            {intl.formatMessage({
              defaultMessage: "Verify your work email",
              id: "T7irec",
              description: "Verify your work email text",
            })}
          </Button>
          <Button
            mode="inline"
            color="secondary"
            {...skipVerificationProps}
            onClick={() => {
              setValue("skipVerification", true);
            }}
          >
            {intl.formatMessage({
              defaultMessage: "Save and skip verification",
              id: "NpznI5",
              description:
                "Button label for submit and skip email verification button on getting started form.",
            })}
          </Button>
        </div>
      ) : (
        <Button
          mode="solid"
          color="secondary"
          {...skipVerificationProps}
          onClick={() => {
            setValue("skipVerification", true);
          }}
        >
          {intl.formatMessage({
            defaultMessage: "Save and continue",
            id: "MQB4IA",
            description:
              "Button text to save a form step and continue to the next one",
          })}
        </Button>
      )}
    </>
  );
};

export interface EmployeeInformationFormProps {
  cacheKey?: string;
  query?: FragmentType<typeof EmployeeInformation_QueryFragment>;
  onSubmit: (
    data: UpdateUserAsUserInput,
    skipVerification?: boolean,
  ) => Promise<void>;
}

export const EmployeeInformationForm = ({
  cacheKey,
  query,
  onSubmit,
}: EmployeeInformationFormProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const result = getFragment(EmployeeInformation_QueryFragment, query);
  const classifications = unpackMaybes(result?.classifications);

  const labels = {
    govEmployeeYesNo: intl.formatMessage({
      defaultMessage: "Employee status",
      id: "oPXTG/",
      description: "Employee Status in Employee Info Form",
    }),
    department: intl.formatMessage({
      defaultMessage: "Home department",
      id: "CylcP4",
      description: "Label for department select input in Employee Info Form",
    }),
    govEmployeeType: intl.formatMessage({
      defaultMessage: "Employment type",
      id: "xzSXz9",
      description: "Employment type label",
    }),
    workEmail: intl.formatMessage(commonMessages.workEmail),
    currentClassificationGroup: intl.formatMessage(commonMessages.group),
    currentClassificationLevel: intl.formatMessage({
      defaultMessage: "Level",
      id: "GJ9QeQ",
      description: "Label displayed on classification level input",
    }),
  };

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(messages.breadcrumb),
        url: paths.employeeInformation(),
      },
    ],
  });

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
        workEmail: null,
        currentClassification: {
          disconnect: true,
        },
      };
    }
    return {
      isGovEmployee: values.govEmployeeYesNo === "yes",
      govEmployeeType: values.govEmployeeType,
      department: values.department ? { connect: values.department } : null,
      workEmail: values.workEmail,
      currentClassification: classificationId
        ? {
            connect: classificationId,
          }
        : null,
    };
  };

  const handleSubmit = (values: FormValues) =>
    onSubmit(formValuesToSubmitData(values), values.skipVerification);

  return (
    <>
      <SEO
        title={intl.formatMessage(specificTitle)}
        description={intl.formatMessage(messages.subtitle)}
      />
      <Hero
        title={intl.formatMessage(messages.title)}
        subtitle={intl.formatMessage(messages.subtitle)}
        crumbs={crumbs}
        overlap
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
              options={{
                defaultValues: cacheKey
                  ? getFromSessionStorage(cacheKey, {})
                  : {},
              }}
            >
              <EmployeeInformationFormFields labels={labels} query={query} />
            </BasicForm>
          </div>
        </section>
      </Hero>
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

  const [, executeMutation] = useMutation(EmployeeInformation_Mutation);
  const handleUpdateEmployee = (id: string, input: UpdateUserAsUserInput) =>
    executeMutation({
      id,
      user: { id: meId, ...input },
    }).then((result) => {
      if (result.data?.updateUserAsUser) {
        return result.data.updateUserAsUser;
      }
      return Promise.reject(new Error(result.error?.toString()));
    });

  const onSubmit = async (
    input: UpdateUserAsUserInput,
    skipVerification = true,
  ) => {
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
      .then(async () => {
        toast.success(
          intl.formatMessage(commonMessages.accountUpdateSuccessful),
        );
        if (skipVerification) {
          const navigationTarget = from ?? paths.profileAndApplications();
          await navigate(navigationTarget);
        } else {
          await navigate({
            pathname: paths.workEmailVerification(),
            search: from ? createSearchParams({ from }).toString() : "",
          });
        }
      })
      .catch(() => {
        toast.error(intl.formatMessage(commonMessages.accountUpdateFailed));
      });
  };

  return (
    <Pending fetching={fetching} error={error}>
      <EmployeeInformationForm
        cacheKey={`employee-information-${meId}`}
        query={data}
        onSubmit={onSubmit}
      />
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <EmployeeInformation />
  </RequireAuth>
);

export default EmployeeInformation;
