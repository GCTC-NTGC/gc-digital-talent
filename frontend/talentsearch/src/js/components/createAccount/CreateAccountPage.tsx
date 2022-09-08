import * as React from "react";
import { imageUrl, navigate } from "@common/helpers/router";
import { useIntl } from "react-intl";
import { Alert } from "@common/components";
import { BellIcon } from "@heroicons/react/24/outline";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Input, RadioGroup, Submit } from "@common/components/form";
import { errorMessages } from "@common/messages";
import { enumToOptions } from "@common/helpers/formUtils";
import { getLanguage } from "@common/constants";
import { getLocale } from "@common/helpers/localize";
import { notEmpty } from "@common/helpers/util";
import Pending from "@common/components/Pending";
import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";
import {
  Language,
  GovEmployeeType,
  Classification,
  UpdateUserAsUserInput,
  useCreateAccountMutation,
  useGetCreateAccountFormDataQuery,
  Department,
} from "../../api/generated";
import {
  formValuesToSubmitData,
  GovernmentInfoForm,
} from "../GovernmentInfoForm/GovernmentInfoForm";
import applicantProfileRoutes from "../../applicantProfileRoutes";

type FormValues = Pick<
  UpdateUserAsUserInput,
  "firstName" | "lastName" | "email" | "preferredLang"
> & {
  govEmployeeYesNo: "yes" | "no";
  govEmployeeType: GovEmployeeType | null;
  lateralDeployBool: boolean;
  department: string;
  currentClassificationGroup: string;
  currentClassificationLevel: string;
  priorityEntitlementYesNo?: "yes" | "no";
  priorityEntitlementNumber?: string;
};

export interface CreateAccountFormProps {
  departments: Department[];
  classifications: Classification[];
  handleCreateAccount: (data: UpdateUserAsUserInput) => Promise<void>;
}

export const CreateAccountForm: React.FunctionComponent<
  CreateAccountFormProps
> = ({ departments, classifications, handleCreateAccount }) => {
  const intl = useIntl();

  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;
  const onSubmit = (values: FormValues) =>
    handleCreateAccount({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      preferredLang: values.preferredLang,
      ...formValuesToSubmitData(values, classifications),
    });
  // hooks to watch, needed for conditional rendering
  const [
    govEmployee,
    govEmployeeStatus,
    groupSelection,
    hasPriorityEntitlement,
  ] = methods.watch([
    "govEmployeeYesNo",
    "govEmployeeType",
    "currentClassificationGroup",
    "priorityEntitlementYesNo",
  ]);

  return (
    <section>
      <div
        data-h2-padding="base(x1, x.5)"
        data-h2-color="base(dt-white)"
        data-h2-text-align="base(center)"
        style={{
          background: `url(${imageUrl(
            TALENTSEARCH_APP_DIR,
            "applicant-profile-banner.png",
          )})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h1
          data-h2-margin="base(x3, 0, x.5, 0)"
          data-h2-font-weight="base(700)"
        >
          {intl.formatMessage({
            defaultMessage: "Welcome to Digital Talent",
            id: "0m7BIV",
            description:
              "Title for the create account page for applicant profiles.",
          })}
        </h1>
      </div>
      <div
        data-h2-width="base(100%) p-tablet(75%) l-tablet(50%)"
        data-h2-padding="base(0, x2) p-tablet(0)"
        style={{ margin: "auto" }}
      >
        <Alert
          title={intl.formatMessage({
            defaultMessage: "You’ve successfully logged in",
            id: "4FEV7d",
            description:
              "Title for successful login alert in create account page.",
          })}
          message={intl.formatMessage({
            defaultMessage:
              "Welcome to the Digital Talent platform. Moving forward, you can log into your profile using the same GC Key username and password.",
            id: "0O/eV0",
            description:
              "Message for successful login alert in create account page.",
          })}
          icon={<BellIcon style={{ width: "1.4rem" }} />}
          type="success"
          data-h2-margin="base(x3, 0, 0, 0)"
        />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 data-h2-margin="base(x2, 0, x1, 0)">
              {intl.formatMessage({
                defaultMessage: "Getting started",
                id: "o/YTo0",
                description: "Main heading in create account page.",
              })}
            </h2>
            <p data-h2-padding="base(0, 0, x1, 0)">
              {intl.formatMessage({
                defaultMessage:
                  "Before we take you to your profile, we need to collect some required information to complete your account set up. ",
                id: "bYg+MM",
                description:
                  "Message after main heading in create account page.",
              })}
            </p>
            <div>
              <div
                data-h2-display="base(flex)"
                data-h2-margin="base(0, 0, x1, 0)"
              >
                <div style={{ flex: 1 }} data-h2-padding="base(0, x1, 0, 0)">
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    label={intl.formatMessage({
                      defaultMessage: "Given name(s)",
                      id: "WpRB7Z",
                      description:
                        "Label displayed for the first name field in create account form.",
                    })}
                    placeholder={intl.formatMessage({
                      defaultMessage: "e.g. Thomas",
                      id: "H1J8wl",
                      description:
                        "Placeholder displayed for the first name field in create account form.",
                    })}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                </div>
                <div style={{ flex: 1 }} data-h2-padding="base(0, 0, 0, x1)">
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    label={intl.formatMessage({
                      defaultMessage: "Surname(s)",
                      id: "h9q52R",
                      description:
                        "Label displayed for the last name field in create account form.",
                    })}
                    placeholder={intl.formatMessage({
                      defaultMessage: "e.g. Edison",
                      id: "X9IdZQ",
                      description:
                        "Placeholder displayed for the first name field in create account form.",
                    })}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                </div>
              </div>
              <div data-h2-margin="base(0, 0, x1, 0)">
                <Input
                  id="email"
                  type="email"
                  name="email"
                  label={intl.formatMessage({
                    defaultMessage:
                      "Which email do you like to be contacted at?",
                    id: "MTwQ3S",
                    description:
                      "Label displayed for the email field in create account form.",
                  })}
                  placeholder={intl.formatMessage({
                    defaultMessage: "e.g. thomas.edison@example.com",
                    id: "UIkTbl",
                    description:
                      "Placeholder displayed for the first name field in create account form.",
                  })}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              </div>
              <RadioGroup
                idPrefix="required-lang-preferences"
                legend={intl.formatMessage({
                  defaultMessage: "What is your preferred contact language?",
                  id: "0ScnOT",
                  description:
                    "Legend text for required language preference in create account form",
                })}
                name="preferredLang"
                rules={{ required: intl.formatMessage(errorMessages.required) }}
                items={enumToOptions(Language).map(({ value }) => ({
                  value,
                  label: intl.formatMessage(getLanguage(value)),
                }))}
                defaultSelected={Language.En}
              />
              <p data-h2-margin="base(x2, 0, x1, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "Below we’d like to know if you’re already an employee with the Government of Canada. We collect this information because it helps us understand, at an aggregate level, how digital skills are distributed amongst departments.",
                  id: "XijxiY",
                  description:
                    "First message before is a government of canada radio group in create account form.",
                })}
              </p>
              <p data-h2-margin="base(0, 0, x1, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "We also use this information to provide you with more contextualized opportunities and suggestions based on your employment status.",
                  id: "5U4C61",
                  description:
                    "Second message before is a government of canada radio group in create account form.",
                })}
              </p>
              <GovernmentInfoForm
                departments={departments}
                classifications={classifications}
                govEmployee={govEmployee}
                govEmployeeStatus={govEmployeeStatus}
                groupSelection={groupSelection}
                priorityEntitlement={hasPriorityEntitlement}
              />
              <div
                data-h2-margin="base(x2, 0)"
                data-h2-padding="base(x2, 0)"
                data-h2-border="base(top, 1px, solid, light.dt-gray)"
                data-h2-display="base(flex)"
                data-h2-justify-content="base(flex-end)"
              >
                <Submit
                  mode="solid"
                  color="primary"
                  text={intl.formatMessage({
                    defaultMessage: "Save and go to my profile",
                    id: "H3Za3e",
                    description:
                      "Button label for submit button on create account form.",
                  })}
                />
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

const CreateAccount: React.FunctionComponent = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = applicantProfileRoutes(locale);

  const [lookUpResult] = useGetCreateAccountFormDataQuery();
  const { data: lookupData, fetching, error } = lookUpResult;
  const meInfo = lookupData?.me;
  const meId = meInfo?.id;
  const departments: Department[] | [] =
    lookupData?.departments.filter(notEmpty) ?? [];
  const classifications: Classification[] | [] =
    lookupData?.classifications.filter(notEmpty) ?? [];

  const [, executeMutation] = useCreateAccountMutation();
  const handleCreateAccount = (id: string, data: UpdateUserAsUserInput) =>
    executeMutation({
      id,
      user: data,
    }).then((result) => {
      if (result.data?.updateUserAsUser) {
        return result.data.updateUserAsUser;
      }
      return Promise.reject(result.error);
    });

  const onSubmit = async (data: UpdateUserAsUserInput) => {
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
    await handleCreateAccount(meId, data)
      .then(() => {
        navigate(paths.home(meId));
        toast.success(
          intl.formatMessage({
            defaultMessage: "Account successfully created.",
            id: "DK870a",
            description:
              "Message displayed to user if account is created successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating account failed.",
            id: "BruLeg",
            description:
              "Message displayed to user if account fails to get updated.",
          }),
        );
      });
  };

  return (
    <Pending fetching={fetching} error={error}>
      <CreateAccountForm
        departments={departments}
        classifications={classifications}
        handleCreateAccount={onSubmit}
      />
    </Pending>
  );
};

export default CreateAccount;
