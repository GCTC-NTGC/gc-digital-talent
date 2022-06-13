import * as React from "react";
import { imageUrl, navigate } from "@common/helpers/router";
import { useIntl } from "react-intl";
import { Alert } from "@common/components";
import { BellIcon } from "@heroicons/react/outline";
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
} from "../../api/generated";
import {
  formValuesToSubmitData,
  GovernmentInfoForm,
} from "../GovernmentInfoForm/GovernmentInfoForm";
import talentSearchRoutes from "../../talentSearchRoutes";

type FormValues = Pick<
  UpdateUserAsUserInput,
  "firstName" | "lastName" | "email" | "preferredLang"
> & {
  govEmployeeYesNo: "yes" | "no";
  govEmployeeType: GovEmployeeType | null;
  lateralDeployBool: boolean;
  currentClassificationGroup: string;
  currentClassificationLevel: string;
};

export interface CreateAccountFormProps {
  classifications: Classification[];
  handleCreateAccount: (data: UpdateUserAsUserInput) => Promise<void>;
}

export const CreateAccountForm: React.FunctionComponent<
  CreateAccountFormProps
> = ({ classifications, handleCreateAccount }) => {
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
  const [govEmployee, govEmployeeStatus, groupSelection] = methods.watch([
    "govEmployeeYesNo",
    "govEmployeeType",
    "currentClassificationGroup",
  ]);

  return (
    <section>
      <div
        data-h2-padding="b(x1, x.5)"
        data-h2-color="b(dt-white)"
        data-h2-text-align="b(center)"
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
          data-h2-margin="b(x3, auto, x.5, auto)"
          data-h2-font-weight="b(700)"
        >
          {intl.formatMessage({
            defaultMessage: "Welcome to Digital Talent",
            description:
              "Title for the create account page for applicant profiles.",
          })}
        </h1>
      </div>
      <div
        data-h2-width="b(100%) s(75%) m(50%)"
        data-h2-padding="b(0, x2) s(0)"
        style={{ margin: "auto" }}
      >
        <Alert
          title={intl.formatMessage({
            defaultMessage: "You’ve successfully logged in",
            description:
              "Title for successful login alert in create account page.",
          })}
          message={intl.formatMessage({
            defaultMessage:
              "Welcome to the Digital Talent platform. Moving forward, you can log into your profile using the same GC Key username and password.",
            description:
              "Message for successful login alert in create account page.",
          })}
          icon={<BellIcon style={{ width: "1.4rem" }} />}
          type="success"
          data-h2-margin="b(x3, auto, auto, auto)"
        />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2>
              {intl.formatMessage({
                defaultMessage: "Getting started",
                description: "Main heading in create account page.",
              })}
            </h2>
            <p data-h2-padding="b(0, 0, x1, 0)">
              {intl.formatMessage({
                defaultMessage:
                  "Before we take you to your profile, we need to collect some required information to complete your account set up. ",
                description:
                  "Message after main heading in create account page.",
              })}
            </p>
            <div>
              <div data-h2-display="b(flex)" data-h2-margin="b(auto, auto, x1, auto)">
                <div style={{ flex: 1 }} data-h2-padding="b(0, x1, 0, 0)">
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    label={intl.formatMessage({
                      defaultMessage: "Given name(s)",
                      description:
                        "Label displayed for the first name field in create account form.",
                    })}
                    placeholder={intl.formatMessage({
                      defaultMessage: "e.g. Thomas",
                      description:
                        "Placeholder displayed for the first name field in create account form.",
                    })}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                </div>
                <div style={{ flex: 1 }} data-h2-padding="b(left, m)">
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    label={intl.formatMessage({
                      defaultMessage: "Surname(s)",
                      description:
                        "Label displayed for the last name field in create account form.",
                    })}
                    placeholder={intl.formatMessage({
                      defaultMessage: "e.g. Edison",
                      description:
                        "Placeholder displayed for the first name field in create account form.",
                    })}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                </div>
              </div>
              <div data-h2-margin="b(auto, auto, x1, auto)">
                <Input
                  id="email"
                  type="email"
                  name="email"
                  label={intl.formatMessage({
                    defaultMessage:
                      "Which email do you like to be contacted at?",
                    description:
                      "Label displayed for the email field in create account form.",
                  })}
                  placeholder={intl.formatMessage({
                    defaultMessage: "e.g. thomas.edison@example.com",
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
              <p data-h2-margin="b(x2, auto, auto, auto)">
                {intl.formatMessage({
                  defaultMessage:
                    "Below we’d like to know if you’re already an employee with the Government of Canada. We collect this information because it helps us understand, at an aggregate level, how digital skills are distributed amongst departments.",
                  description:
                    "First message before is a government of canada radio group in create account form.",
                })}
              </p>
              <p data-h2-margin="b(auto, auto, x1, auto)">
                {intl.formatMessage({
                  defaultMessage:
                    "We also use this information to provide you with more contextualized opportunities and suggestions based on your employment status.",
                  description:
                    "Second message before is a government of canada radio group in create account form.",
                })}
              </p>
              <GovernmentInfoForm
                classifications={classifications}
                govEmployee={govEmployee}
                govEmployeeStatus={govEmployeeStatus}
                groupSelection={groupSelection}
              />
              <div
                data-h2-margin="b(x2, auto)"
                data-h2-padding="b(x2, 0)"
                data-h2-border="b(top, 1px, solid, light.dt-gray)"
                data-h2-display="b(flex)"
                data-h2-justify-content="b(flex-end)"
              >
                <Submit
                  mode="solid"
                  color="primary"
                  text={intl.formatMessage({
                    defaultMessage: "Save and go to my profile",
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

export const CreateAccount: React.FunctionComponent = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = talentSearchRoutes(locale);

  const [lookUpResult] = useGetCreateAccountFormDataQuery();
  const { data: lookupData, fetching, error } = lookUpResult;
  const meInfo = lookupData?.me;
  const meId = meInfo?.id;
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
          description: "Message displayed to user if user is not found",
        }),
      );
      return;
    }
    await handleCreateAccount(meId, data)
      .then(() => {
        navigate(paths.profile());
        toast.success(
          intl.formatMessage({
            defaultMessage: "Account successfully created.",
            description:
              "Message displayed to user if account is created successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating account failed.",
            description:
              "Message displayed to user if account fails to get updated.",
          }),
        );
      });
  };

  return (
    <Pending fetching={fetching} error={error}>
      <CreateAccountForm
        classifications={classifications}
        handleCreateAccount={onSubmit}
      />
    </Pending>
  );
};
