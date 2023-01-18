import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";

import imageUrl from "@common/helpers/imageUrl";
import { Alert } from "@common/components";
import { toast } from "@common/components/Toast";
import { BasicForm, Input, RadioGroup, Submit } from "@common/components/form";
import { errorMessages } from "@common/messages";
import { enumToOptions } from "@common/helpers/formUtils";
import { getLanguage } from "@common/constants";
import { emptyToNull, notEmpty } from "@common/helpers/util";
import SEO from "@common/components/SEO/SEO";
import Pending from "@common/components/Pending";

import { AuthorizationContext } from "@common/components/Auth/AuthorizationContainer";
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
  getGovernmentInfoLabels,
  GovernmentInfoForm,
} from "../GovernmentInfoForm/GovernmentInfoForm";
import useRoutes from "../../hooks/useRoutes";

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
  cacheKey?: string;
  departments: Department[];
  classifications: Classification[];
  handleCreateAccount: (data: UpdateUserAsUserInput) => Promise<void>;
}

export const CreateAccountForm: React.FunctionComponent<
  CreateAccountFormProps
> = ({ cacheKey, departments, classifications, handleCreateAccount }) => {
  const intl = useIntl();
  const govInfoLabels = getGovernmentInfoLabels(intl);

  const labels = {
    ...govInfoLabels,
    firstName: intl.formatMessage({
      defaultMessage: "First Name",
      id: "IEkhMc",
      description:
        "Label displayed for the first name field in create account form.",
    }),
    lastName: intl.formatMessage({
      defaultMessage: "Last Name",
      id: "UxF291",
      description:
        "Label displayed for the last name field in create account form.",
    }),
    email: intl.formatMessage({
      defaultMessage: "Which email do you like to be contacted at?",
      id: "MTwQ3S",
      description:
        "Label displayed for the email field in create account form.",
    }),
    preferredLang: intl.formatMessage({
      defaultMessage: "What is your preferred contact language?",
      id: "0ScnOT",
      description:
        "Legend text for required language preference in create account form",
    }),
  };

  const handleSubmit = (values: FormValues) =>
    handleCreateAccount({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      preferredLang: values.preferredLang,
      ...formValuesToSubmitData(values, classifications),
    });

  return (
    <>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Create account",
          id: "lPWUoO",
          description: "Page title for the account creation page",
        })}
      />
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
          <Alert.Root
            type="success"
            live={false}
            data-h2-margin="base(x3, 0, 0, 0)"
          >
            <Alert.Title>
              {intl.formatMessage({
                defaultMessage: "You’ve successfully logged in",
                id: "4FEV7d",
                description:
                  "Title for successful login alert in create account page.",
              })}
            </Alert.Title>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Welcome to the Digital Talent platform. Moving forward, you can log into your profile using the same GC Key username and password.",
                id: "0O/eV0",
                description:
                  "Message for successful login alert in create account page.",
              })}
            </p>
          </Alert.Root>
          <BasicForm
            onSubmit={handleSubmit}
            cacheKey={cacheKey}
            labels={labels}
          >
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
                  "Before we take you to your profile, we need to collect some required information to complete your account set up.",
                id: "x6saT3",
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
                    label={labels.firstName}
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
                    label={labels.lastName}
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
                  label={labels.email}
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
                legend={labels.preferredLang}
                id="preferredLang"
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
                labels={labels}
                departments={departments}
                classifications={classifications}
              />
              <div
                data-h2-margin="base(x2, 0)"
                data-h2-padding="base(x2, 0)"
                data-h2-border-top="base(1px solid dt-gray.light)"
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
          </BasicForm>
        </div>
      </section>
    </>
  );
};

type LocationState = {
  from?: string;
};

const CreateAccount: React.FunctionComponent = () => {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();
  const paths = useRoutes();
  const { from } = location.state as LocationState;
  const authContext = React.useContext(AuthorizationContext);
  const meId = authContext.loggedInUser?.id;

  const [lookUpResult] = useGetCreateAccountFormDataQuery();
  const { data: lookupData, fetching, error } = lookUpResult;
  const departments: Department[] | [] =
    lookupData?.departments.filter(notEmpty) ?? [];
  const classifications: Classification[] | [] =
    lookupData?.classifications.filter(notEmpty) ?? [];

  const [, executeMutation] = useCreateAccountMutation();
  const handleCreateAccount = (id: string, data: UpdateUserAsUserInput) =>
    executeMutation({
      id,
      user: {
        ...data,
        id,
        email: emptyToNull(data.email),
      },
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
        toast.success(
          intl.formatMessage({
            defaultMessage: "Account successfully created.",
            id: "DK870a",
            description:
              "Message displayed to user if account is created successfully.",
          }),
        );
        // navigation will happen on useEffect after authorization context has updated
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

  // OK to navigate to profile once we have a user ID and an email
  const shouldNavigate = meId && authContext.loggedInEmail;
  const navigationTarget = from || paths.profile(meId || "");
  React.useEffect(() => {
    if (shouldNavigate) {
      navigate(navigationTarget);
    }
  }, [navigate, navigationTarget, shouldNavigate]);

  return (
    <Pending fetching={fetching || !authContext.isLoaded} error={error}>
      <CreateAccountForm
        cacheKey={`create-account-${meId}`}
        departments={departments}
        classifications={classifications}
        handleCreateAccount={onSubmit}
      />
    </Pending>
  );
};

export default CreateAccount;
