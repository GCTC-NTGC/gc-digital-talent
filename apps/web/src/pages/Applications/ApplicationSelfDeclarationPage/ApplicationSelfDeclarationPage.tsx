import React from "react";
import { useIntl } from "react-intl";
import HeartIcon from "@heroicons/react/20/solid/HeartIcon";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

import {
  Button,
  Heading,
  Pending,
  Separator,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { Input, RadioGroup } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import {
  ApplicationStep,
  IndigenousCommunity,
  useGetApplicationQuery,
  useGetMeQuery,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { notEmpty } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";
import applicationMessages from "~/messages/applicationMessages";
import { getSelfDeclarationLabels } from "~/pages/Applications/ApplicationSelfDeclarationPage/SelfDeclaration/utils";
import SelfDeclarationDialog from "~/pages/Home/IAPHomePage/components/Dialog/SelfDeclarationDialog";
import VerificationDialog from "~/pages/Home/IAPHomePage/components/Dialog/VerificationDialog";
import DefinitionDialog from "~/pages/Home/IAPHomePage/components/Dialog/DefinitionDialog";
import { wrapAbbr } from "~/utils/nameUtils";
import {
  apiCommunitiesToFormValuesWithYesNo as apiCommunitiesToFormValues,
  formValuesToApiCommunities,
  type FormValuesWithYesNo as IndigenousFormValues,
} from "~/utils/indigenousDeclaration";
import { useUpdateUserAndApplicationMutation } from "~/api/generated";

import { ApplicationPageProps } from "../ApplicationApi";
import { useApplicationContext } from "../ApplicationContext";
import HelpLink from "./SelfDeclaration/HelpLink";
import CommunitySelection from "./SelfDeclaration/CommunitySelection";

export const getPageInfo: GetPageNavInfo = ({
  application,
  paths,
  intl,
  stepOrdinal,
}) => {
  const path = paths.applicationSelfDeclaration(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "Indigenous Peoples Self-Declaration Form",
      id: "CU5XqI",
      description: "Page title for the self-declaration page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage: "Help us understand your community.",
      id: "gQl1LT",
      description: "Subtitle for the self-declaration page",
    }),
    icon: HeartIcon,
    crumbs: [
      {
        url: path,
        label: intl.formatMessage(applicationMessages.numberedStep, {
          stepOrdinal,
        }),
      },
    ],
    link: {
      url: path,
      label: intl.formatMessage({
        defaultMessage: "Self-declaration",
        id: "fLohdl",
        description: "Link text for the self-declaration page",
      }),
    },
  };
};

const whyLink = (chunks: React.ReactNode) => (
  <SelfDeclarationDialog>{chunks}</SelfDeclarationDialog>
);

const verificationLink = (chunks: React.ReactNode) => (
  <VerificationDialog>{chunks}</VerificationDialog>
);

const definitionLink = (chunks: React.ReactNode) => (
  <DefinitionDialog>{chunks}</DefinitionDialog>
);

type PageAction = "continue" | "cancel" | "explore";
type FormValues = IndigenousFormValues & {
  signature: string;
  action: PageAction;
};

export interface SelfDeclarationFormProps {
  onSubmit: (data: FormValues) => void;
}

export type ApplicationSelfDeclarationProps = ApplicationPageProps & {
  indigenousCommunities: IndigenousCommunity[] | undefined;
  signature: string | null;
  onSubmit: SubmitHandler<FormValues>;
};

export const ApplicationSelfDeclaration = ({
  application,
  indigenousCommunities: initialIndigenousCommunities,
  signature: initialSignature,
  onSubmit,
}: ApplicationSelfDeclarationProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { currentStepOrdinal } = useApplicationContext();
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    stepOrdinal: currentStepOrdinal,
  });
  const methods = useForm<FormValues>({
    defaultValues: {
      ...apiCommunitiesToFormValues(initialIndigenousCommunities),
      signature: initialSignature ?? undefined,
    },
  });
  const {
    watch,
    register,
    setValue,
    formState: { isSubmitting },
  } = methods;
  const actionProps = register("action");
  const [isIndigenousValue, communitiesValue] = watch([
    "isIndigenous",
    "communities",
  ]);

  const isIndigenous = isIndigenousValue === "yes";
  const hasCommunities = communitiesValue && communitiesValue.length > 0;

  const labels = getSelfDeclarationLabels(intl);

  return (
    <>
      <Heading data-h2-margin-top="base(0)" data-h2-margin-bottom="base(x1)">
        {pageInfo.title}
      </Heading>
      <p data-h2-margin-bottom="base(x1)">
        {intl.formatMessage({
          defaultMessage:
            "We recognize the importance of Indigenous voices in the federal government. The program was designed in partnership with Indigenous peoples. By completing and signing the Indigenous Peoples Self-Declaration Form, you are helping to protect the space, agreeing that you are a part of the three distinct Indigenous groups in Canada and are interested in joining the program!",
          id: "w1aZlG",
          description: "Application self-declaration intro paragraph 1",
        })}
      </p>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <RadioGroup
            idPrefix="isIndigenous"
            id="isIndigenous"
            name="isIndigenous"
            legend={labels.isIndigenous}
            trackUnsaved={false}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            items={[
              {
                value: "yes",
                label: intl.formatMessage({
                  defaultMessage:
                    '"I affirm that I am First Nations, Inuk (Inuit), or a Métis person"',
                  id: "7STO48",
                  description:
                    "Text for the option to self-declare as Indigenous",
                }),
              },
              {
                value: "no",
                label: intl.formatMessage({
                  defaultMessage:
                    '"I am not a member of an Indigenous group and I would like to see other opportunities available to me"',
                  id: "BwEf/S",
                  description:
                    "Text for the option to self-declare as not an Indigenous person",
                }),
              },
            ]}
          />
          <CommunitySelection labels={labels} />

          <div data-h2-max-width="base(48rem)">
            {isIndigenous && hasCommunities ? (
              <>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "By submitting your signature (typing your full name), you are contributing to an honest and safe space for Indigenous Peoples to access these opportunities.",
                    id: "Dz9xib",
                    description:
                      "Disclaimer displayed before signing the Indigenous self-declaration form",
                  })}
                </p>
                <div data-h2-margin="base(x1 0)">
                  <Input
                    type="text"
                    id="signature"
                    name="signature"
                    label={labels.signature}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                </div>
                <div
                  data-h2-display="base(flex)"
                  data-h2-gap="base(x.25, x.5)"
                  data-h2-flex-wrap="base(wrap)"
                  data-h2-flex-direction="base(column) l-tablet(row)"
                  data-h2-align-items="base(flex-start) l-tablet(center)"
                >
                  <Button
                    type="submit"
                    mode="solid"
                    value="continue"
                    disabled={isSubmitting}
                    {...actionProps}
                    onClick={() => {
                      setValue("action", "continue");
                    }}
                  >
                    {intl.formatMessage({
                      defaultMessage: "Sign and continue",
                      id: "7rSh+m",
                      description:
                        "Button text to submit the Indigenous self-declaration form.",
                    })}
                  </Button>
                  <Button
                    type="submit"
                    mode="inline"
                    color="secondary"
                    value="cancel"
                    disabled={isSubmitting}
                    {...actionProps}
                    onClick={() => {
                      setValue("action", "cancel");
                    }}
                  >
                    {intl.formatMessage({
                      defaultMessage: "Save and quit for now",
                      id: "U86N4g",
                      description:
                        "Action button to save and exit an application",
                    })}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p data-h2-margin="base(x1, 0)">
                  {intl.formatMessage({
                    defaultMessage:
                      "This program is for First Nations, Inuit, and Métis peoples within the geographic boundaries of Canada.",
                    id: "v0EVPQ",
                    description:
                      "Disclaimer displayed when a user has indicated they are not Indigenous on the self-declaration form.",
                  })}
                </p>
                <p data-h2-margin="base(x1, 0)">
                  {intl.formatMessage({
                    defaultMessage: "Not a member of an Indigenous group?",
                    id: "Xe90FW",
                    description:
                      "Lead in text for button to submit form and navigate to a different page when no Indigenous",
                  })}
                </p>
                <p data-h2-margin="base(x1, 0)">
                  {/* Form must have a submit button to satisfy https://www.w3.org/TR/2016/NOTE-WCAG20-TECHS-20161007/H32 */}
                  <Button
                    type="submit"
                    mode="solid"
                    value="explore"
                    disabled={isSubmitting}
                    {...actionProps}
                    onClick={() => {
                      setValue("action", "explore");
                    }}
                  >
                    {intl.formatMessage(
                      {
                        defaultMessage:
                          "Explore <abbreviation>IT</abbreviation> opportunities within the federal government",
                        id: "j3WBqJ",
                        description:
                          "Button text to submit the Indigenous self-declaration form when not Indigenous.",
                      },
                      {
                        abbreviation: (text: React.ReactNode) =>
                          wrapAbbr(text, intl),
                      },
                    )}
                  </Button>
                </p>
              </>
            )}
          </div>
          <Separator
            orientation="horizontal"
            decorative
            data-h2-background-color="base(secondary)"
            data-h2-margin="base(x2, 0)"
          />
          <HelpLink />
          <p data-h2-font-weight="base(700)" data-h2-margin="base(x1, 0)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "See <whyLink>why we are asking you to self declare</whyLink>, <verificationLink>how this will be verified</verificationLink> and the term <definitionLink>Indigenous as defined for this program</definitionLink>.",
                id: "AMboRG",
                description:
                  "Links to more information on the self-declaration process and definition of Indigenous",
              },
              {
                whyLink,
                verificationLink,
                definitionLink,
              },
            )}
          </p>
        </form>
      </FormProvider>
    </>
  );
};

const ApplicationSelfDeclarationPage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { applicationId } = useParams();
  const [
    {
      data: applicationData,
      fetching: applicationFetching,
      error: applicationError,
      stale: applicationStale,
    },
  ] = useGetApplicationQuery({
    requestPolicy: "cache-first",
    variables: {
      id: applicationId || "",
    },
  });
  const [{ data: userData, fetching: userFetching, error: userError }] =
    useGetMeQuery();

  const navigate = useNavigate();
  const { followingPageUrl } = useApplicationContext();
  const [, executeMutation] = useUpdateUserAndApplicationMutation();
  const cancelPath = paths.profileAndApplications({ fromIapDraft: true });
  const nextStep = followingPageUrl ?? cancelPath;

  const application = applicationData?.poolCandidate;
  const resolvedIndigenousCommunities =
    userData?.me?.indigenousCommunities?.filter(notEmpty);
  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    // not indigenous - explore other opportunities
    if (formValues.action === "explore") {
      navigate(paths.browsePools());
      return;
    }
    const newCommunities = formValuesToApiCommunities(formValues);
    // Have to update both the user and the pool candidate in same request.  If you try to update just the user first and the application afterwards it interferes with the navigation.  I guess it creates a race condition as one of the contexts automatically refreshes.
    executeMutation({
      userId: userData?.me?.id || "",
      userInput: {
        indigenousCommunities: newCommunities,
        indigenousDeclarationSignature:
          newCommunities.length > 0 ? formValues.signature : null,
      },
      applicationId: applicationId || "",
      applicationInput: {
        insertSubmittedStep: ApplicationStep.SelfDeclaration,
      },
    })
      .then((result) => {
        if (result.error) throw new Error("Update user and application failed");

        toast.success(
          intl.formatMessage({
            defaultMessage: "Successfully updated your self-declaration",
            id: "F/WYCH",
            description:
              "Message displayed to users when saving self-declaration is successful.",
          }),
        );
        navigate(formValues.action === "continue" ? nextStep : cancelPath);
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating your self-declaration failed",
            id: "Ps929U",
            description:
              "Message displayed to user after self-declaration fails to be updated.",
          }),
        );
      });
  };

  return (
    <Pending
      fetching={applicationFetching || applicationStale || userFetching}
      error={applicationError || userError}
    >
      {application && userData?.me ? (
        <ApplicationSelfDeclaration
          application={application}
          indigenousCommunities={resolvedIndigenousCommunities}
          signature={userData.me.indigenousDeclarationSignature ?? null}
          onSubmit={handleSubmit}
        />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export default ApplicationSelfDeclarationPage;
