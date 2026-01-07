import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useMutation } from "urql";
import { ReactNode } from "react";

import {
  Button,
  Heading,
  Separator,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { Input, RadioGroup } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  ApplicationStep,
  graphql,
  IndigenousCommunity,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";
import { getSelfDeclarationLabels } from "~/components/SelfDeclaration/utils";
import SelfDeclarationDialog from "~/components/IAPDialog/SelfDeclarationDialog";
import VerificationDialog from "~/components/IAPDialog/VerificationDialog";
import DefinitionDialog from "~/components/IAPDialog/DefinitionDialog";
import { wrapAbbr } from "~/utils/nameUtils";
import {
  apiCommunitiesToFormValuesWithYesNo as apiCommunitiesToFormValues,
  formValuesToApiCommunities,
  type FormValuesWithYesNo as IndigenousFormValues,
} from "~/utils/indigenousDeclaration";
import HelpLink from "~/components/SelfDeclaration/HelpLink";
import CommunitySelection from "~/components/SelfDeclaration/CommunitySelection";
import poolCandidateMessages from "~/messages/poolCandidateMessages";

import { ApplicationPageProps } from "../ApplicationApi";
import { useApplicationContext } from "../ApplicationContext";
import useApplication from "../useApplication";

const Application_UpdateSelfDeclarationMutation = graphql(/* GraphQL */ `
  mutation Application_UpdateSelfDeclaration(
    $userId: ID!
    $userInput: UpdateUserAsUserInput!
    $applicationId: ID!
    $applicationInput: UpdateApplicationInput!
  ) {
    updateUserAsUser(id: $userId, user: $userInput) {
      id
      indigenousCommunities {
        value
      }
      indigenousDeclarationSignature
    }
    updateApplication(id: $applicationId, application: $applicationInput) {
      id
    }
  }
`);

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
    crumbs: [
      {
        url: path,
        label: intl.formatMessage(poolCandidateMessages.assessmentStepNumber, {
          stepNumber: stepOrdinal,
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

const whyLink = (chunks: ReactNode) => (
  <SelfDeclarationDialog>{chunks}</SelfDeclarationDialog>
);

const verificationLink = (chunks: ReactNode) => (
  <VerificationDialog>{chunks}</VerificationDialog>
);

const definitionLink = (chunks: ReactNode) => (
  <DefinitionDialog>{chunks}</DefinitionDialog>
);

type PageAction = "continue" | "cancel" | "explore";
interface FormValues extends IndigenousFormValues {
  signature: string;
  action: PageAction;
}

export interface SelfDeclarationFormProps {
  onSubmit: (data: FormValues) => void;
}

export interface ApplicationSelfDeclarationProps extends ApplicationPageProps {
  indigenousCommunities: IndigenousCommunity[] | undefined;
  signature: string | null;
  onSubmit: SubmitHandler<FormValues>;
}

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
      <Heading className="mt-0 mb-6 font-normal" size="h3">
        {pageInfo.title}
      </Heading>
      <p className="mb-6">
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

          <div className="max-w-192">
            {isIndigenous && hasCommunities ? (
              <>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "By submitting your signature (typing your full name), you are contributing to an honest and safe space for Indigenous Peoples to access these job opportunities.",
                    id: "9LR5wC",
                    description:
                      "Disclaimer before signing Indigenous self-declaration form",
                  })}
                </p>
                <div className="my-6">
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
                <div className="flex flex-col flex-wrap items-start gap-6 sm:flex-row sm:items-center">
                  <Button
                    type="submit"
                    color="primary"
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
                    color="primary"
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
                <p className="my-6">
                  {intl.formatMessage({
                    defaultMessage:
                      "This program is for First Nations, Inuit, and Métis peoples within the geographic boundaries of Canada.",
                    id: "v0EVPQ",
                    description:
                      "Disclaimer displayed when a user has indicated they are not Indigenous on the self-declaration form.",
                  })}
                </p>
                <p className="my-6">
                  {intl.formatMessage({
                    defaultMessage: "Not a member of an Indigenous group?",
                    id: "Xe90FW",
                    description:
                      "Lead in text for button to submit form and navigate to a different page when no Indigenous",
                  })}
                </p>
                <p className="my-6">
                  {/* Form must have a submit button to satisfy https://www.w3.org/TR/2016/NOTE-WCAG20-TECHS-20161007/H32 */}
                  <Button
                    type="submit"
                    mode="solid"
                    color="primary"
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
                        abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
                      },
                    )}
                  </Button>
                </p>
              </>
            )}
          </div>
          <Separator />
          <HelpLink />
          <p className="my-6 font-bold">
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

export const Component = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { application } = useApplication();

  const navigate = useNavigate();
  const { followingPageUrl } = useApplicationContext();
  const [, executeMutation] = useMutation(
    Application_UpdateSelfDeclarationMutation,
  );
  const cancelPath = paths.profileAndApplications({ fromIapDraft: true });
  const nextStep = followingPageUrl ?? cancelPath;

  const resolvedIndigenousCommunities =
    application.user?.indigenousCommunities?.filter(notEmpty);
  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    // not indigenous - explore other opportunities
    if (formValues.action === "explore") {
      await navigate(paths.jobs());
      return;
    }
    const newCommunities = formValuesToApiCommunities(formValues);
    // Have to update both the user and the pool candidate in same request.  If you try to update just the user first and the application afterwards it interferes with the navigation.  I guess it creates a race condition as one of the contexts automatically refreshes.
    executeMutation({
      userId: application?.user?.id || "",
      userInput: {
        indigenousCommunities: newCommunities,
        indigenousDeclarationSignature:
          newCommunities.length > 0 ? formValues.signature : null,
      },
      applicationId: application.id,
      applicationInput: {
        insertSubmittedStep: ApplicationStep.SelfDeclaration,
      },
    })
      .then(async (result) => {
        if (result.error) throw new Error("Update user and application failed");

        toast.success(
          intl.formatMessage({
            defaultMessage: "Successfully updated your self-declaration",
            id: "F/WYCH",
            description:
              "Message displayed to users when saving self-declaration is successful.",
          }),
        );
        await navigate(
          formValues.action === "continue" ? nextStep : cancelPath,
        );
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

  return application && application?.user ? (
    <ApplicationSelfDeclaration
      application={application}
      indigenousCommunities={resolvedIndigenousCommunities?.map(
        (community) => community.value,
      )}
      signature={application.user.indigenousDeclarationSignature ?? null}
      onSubmit={handleSubmit}
    />
  ) : (
    <ThrowNotFound />
  );
};

Component.displayName = "ApplicationSelfDeclarationPage";

export default Component;
