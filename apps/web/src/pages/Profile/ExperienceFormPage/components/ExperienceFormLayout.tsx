import { useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { defineMessage, useIntl } from "react-intl";
import type { SubmitHandler } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import type { CombinedError } from "urql";

import { toast } from "@gc-digital-talent/toast";
import {
  Button,
  Card,
  CardSeparator,
  Heading,
  Link,
  AlertDialog,
} from "@gc-digital-talent/ui";
import type { IconType } from "@gc-digital-talent/ui";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { Submit } from "@gc-digital-talent/forms";

import useRoutes from "~/hooks/useRoutes";
import {
  useDeleteExperienceMutation,
  useExperienceMutations,
} from "~/hooks/useExperienceMutations";
import type {
  ExperienceType,
  AllExperienceFormValues,
  ExperienceFormValues,
  ExperienceDetailsDefaultValues,
  ExperienceDetailsSubmissionData,
} from "~/types/experience";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import ErrorSummary from "~/components/ExperienceFormFields/ErrorSummary";
import {
  experienceSkillsToFormSkills,
  formValuesToSubmitData,
} from "~/utils/experienceUtils";

import { ExperienceFormSkill_Fragment } from "../ExperienceFormPage";
import useExperienceFormCrumbs from "../useExperienceFormCrumbs";
import ExperienceSkills from "./ExperienceSkills";

export const ExperienceFormLayout_Fragment = graphql(/* GraphQL */ `
  fragment ExperienceFormLayout on Experience {
    id
    skills {
      id
      key
      name {
        en
        fr
      }
      category {
        value
        label {
          en
          fr
        }
      }
      experienceSkillRecord {
        details
      }
    }
  }
`);

const saveAndReturnMessage = defineMessage({
  defaultMessage: "Save and return to my career timeline",
  id: "jZi53k",
  description: "Label on button to save and return on the current experience",
});

// Used when the form was opened from an application
const saveAndGoBackMessage = defineMessage({
  defaultMessage: "Save and go back",
  id: "CuHYqt",
  description: "Text for save button on profile form.",
});

export const editSubTitle = defineMessage({
  defaultMessage: "Update or delete an experience on your career timeline",
  id: "A+4huJ",
  description: "Display text for edit experience form in breadcrumbs",
});

type FormAction = "return" | "add-another";
interface FormValues extends ExperienceFormValues<AllExperienceFormValues> {
  experienceType?: ExperienceType;
  action: FormAction;
}

interface ExperienceFormDataProps {
  edit?: boolean;
  experienceId?: string;
  skillsQuery: FragmentType<typeof ExperienceFormSkill_Fragment>[];
  userId: string;
}

export interface ExperienceTypeFormProps extends ExperienceFormDataProps {
  organizationSuggestions: string[];
}

interface ExperienceFormLayoutProps extends ExperienceFormDataProps {
  experienceQuery?: FragmentType<typeof ExperienceFormLayout_Fragment>;
  detailsDefaultValues?: ExperienceDetailsDefaultValues;
  hasRelatedAwards?: boolean;
  experienceType: ExperienceType;
  title: string;
  subtitle: string;
  heading: ReactNode;
  intro: ReactNode;
  icon: IconType;
  children: ReactNode;
  afterSkills?: ReactNode;
}

const ExperienceFormLayout = ({
  edit,
  experienceQuery,
  detailsDefaultValues,
  hasRelatedAwards,
  experienceId,
  experienceType,
  skillsQuery,
  userId,
  title,
  subtitle,
  heading,
  intro,
  icon,
  children,
  afterSkills,
}: ExperienceFormLayoutProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId") ?? undefined;
  const returnPath = applicationId
    ? paths.applicationCareerTimeline(applicationId)
    : paths.careerTimeline();
  const experience = getFragment(
    ExperienceFormLayout_Fragment,
    experienceQuery,
  );
  const skills = getFragment(ExperienceFormSkill_Fragment, skillsQuery);

  const methods = useForm<FormValues>({
    shouldFocusError: false,
    mode: "onSubmit",
    defaultValues: {
      ...detailsDefaultValues,
      skills: experienceSkillsToFormSkills(experience?.skills),
      experienceType,
    },
  });

  const {
    watch,
    register,
    setValue,
    formState: { isSubmitSuccessful },
    reset,
  } = methods;

  const action = watch("action");
  const actionProps = register("action");

  const handleSuccess = async () => {
    toast.success(
      edit
        ? intl.formatMessage({
            defaultMessage: "Successfully updated experience!",
            id: "4438xW",
            description:
              "Success message displayed after updating an experience",
          })
        : intl.formatMessage({
            defaultMessage: "Successfully added experience!",
            id: "DZ775N",
            description:
              "Success message displayed after adding experience to profile",
          }),
    );

    if (action !== "add-another") {
      await navigate(returnPath);
    }
  };

  const handleError = () => {
    toast.error(
      edit
        ? intl.formatMessage({
            defaultMessage: "Error: updating experience failed",
            id: "WyKJsK",
            description:
              "Message displayed to user after experience fails to be updated.",
          })
        : intl.formatMessage({
            defaultMessage: "Error: adding experience failed",
            id: "moKAQP",
            description:
              "Message displayed to user after experience fails to be created.",
          }),
    );
  };

  const handleMutationResponse = async (res: { error?: CombinedError }) => {
    if (res.error) {
      handleError();
    } else {
      await handleSuccess();
    }
  };

  const {
    executeMutation,
    executing: mutationExecuting,
    getMutationArgs,
  } = useExperienceMutations(experience ? "update" : "create", experienceType);

  const handleUpdateExperience = (values: ExperienceDetailsSubmissionData) => {
    const args = getMutationArgs(experienceId ?? userId ?? "", values);
    if (executeMutation) {
      return executeMutation(args)
        .then(async (mutationResponse) => {
          await handleMutationResponse(mutationResponse);
        })
        .catch(handleError);
    }

    return undefined;
  };

  const executeDeletionMutation = useDeleteExperienceMutation(experienceType);

  const handleDeleteExperience = () => {
    if (executeDeletionMutation) {
      executeDeletionMutation({
        id: experienceId ?? "",
      })
        .then(async (result) => {
          await navigate(returnPath);
          toast.success(
            intl.formatMessage({
              defaultMessage: "Experience Deleted",
              id: "/qN7tM",
              description:
                "Message displayed to user after experience deleted.",
            }),
          );
          return result.data;
        })
        .catch(() => {
          toast.error(
            intl.formatMessage({
              defaultMessage: "Error: deleting experience failed",
              id: "YVhQ4t",
              description:
                "Message displayed to user after experience fails to be deleted.",
            }),
          );
        });
    }
  };

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    const data = formValuesToSubmitData(formValues, experienceType);
    return handleUpdateExperience(data);
  };

  useEffect(() => {
    if (action === "add-another" && isSubmitSuccessful) {
      reset({ experienceType });
    }
  }, [isSubmitSuccessful, reset, action, experienceType]);

  const crumbs = useExperienceFormCrumbs({
    applicationId,
    edit,
    title,
    currentUrl: experience
      ? paths.editExperience(experience.id, { applicationId })
      : "#",
  });

  return (
    <>
      <SEO title={title} description={subtitle} />
      <Hero title={title} subtitle={subtitle} crumbs={crumbs} centered overlap>
        <div className="mb-18">
          <Card>
            <Heading
              rank="h2"
              size="h3"
              color="secondary"
              icon={icon}
              className="mt-0 mb-6 font-normal"
            >
              {heading}
            </Heading>
            <p className="mb-6">{intro}</p>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(handleSubmit)}>
                <ErrorSummary experienceType={experienceType} />
                {children}
                <CardSeparator />
                <ExperienceSkills
                  experienceType={experienceType}
                  experienceId={experienceId}
                  skills={[...skills]}
                />
                {afterSkills}
                <CardSeparator />
                {edit ? (
                  <div className="flex flex-col flex-wrap items-start gap-6 sm:flex-row sm:items-center">
                    <Submit
                      text={intl.formatMessage(
                        applicationId
                          ? formMessages.saveChanges
                          : saveAndReturnMessage,
                      )}
                      isSubmitting={mutationExecuting}
                    />
                    <Link color="warning" mode="inline" href={returnPath}>
                      {intl.formatMessage(formMessages.cancelGoBack)}
                    </Link>
                    <AlertDialog.Root>
                      <AlertDialog.Trigger>
                        <Button type="button" mode="inline" color="error">
                          {intl.formatMessage({
                            defaultMessage: "Delete this experience",
                            id: "5DfpAy",
                            description:
                              "Label on button to delete the current experience",
                          })}
                        </Button>
                      </AlertDialog.Trigger>
                      <AlertDialog.Content>
                        <AlertDialog.Title>
                          {intl.formatMessage({
                            defaultMessage: "Are you sure?",
                            id: "AcsOrg",
                            description: "Delete confirmation",
                          })}
                        </AlertDialog.Title>
                        <div className="grid gap-6">
                          <AlertDialog.Description>
                            {intl.formatMessage({
                              defaultMessage:
                                "Are you sure you would like to delete this experience from your profile? This action cannot be undone.",
                              id: "IhXvCe",
                              description:
                                "Question displayed when a user attempts to delete an experience from their profile",
                            })}
                          </AlertDialog.Description>
                          {hasRelatedAwards ? (
                            <AlertDialog.Description>
                              {intl.formatMessage({
                                defaultMessage:
                                  "Please note that by deleting this experience, it will no longer appear on any related award experiences.",
                                id: "qgp94h",
                                description:
                                  "Note displayed when a user attempts to delete an experience from their profile with related experiences attached",
                              })}
                            </AlertDialog.Description>
                          ) : null}
                        </div>
                        <AlertDialog.Footer>
                          <AlertDialog.Cancel>
                            <Button type="button" color="primary">
                              {intl.formatMessage(commonMessages.cancel)}
                            </Button>
                          </AlertDialog.Cancel>
                          <AlertDialog.Action>
                            <Button
                              type="submit"
                              mode="solid"
                              color="secondary"
                              onClick={handleDeleteExperience}
                            >
                              {intl.formatMessage(commonMessages.delete)}
                            </Button>
                          </AlertDialog.Action>
                        </AlertDialog.Footer>
                      </AlertDialog.Content>
                    </AlertDialog.Root>
                  </div>
                ) : (
                  <div className="flex flex-col flex-wrap items-start gap-6 sm:flex-row sm:items-center">
                    <Button
                      type="submit"
                      mode="solid"
                      value="return"
                      {...actionProps}
                      onClick={() => setValue("action", "return")}
                      disabled={mutationExecuting}
                    >
                      {mutationExecuting
                        ? intl.formatMessage(formMessages.submitting)
                        : intl.formatMessage(
                            applicationId
                              ? saveAndGoBackMessage
                              : saveAndReturnMessage,
                          )}
                    </Button>
                    <Button
                      type="submit"
                      mode="inline"
                      {...actionProps}
                      onClick={() => setValue("action", "add-another")}
                      disabled={mutationExecuting}
                    >
                      {mutationExecuting
                        ? intl.formatMessage(formMessages.submitting)
                        : intl.formatMessage({
                            defaultMessage: "Save and add another",
                            id: "+7v9Dq",
                            description:
                              "Text for save button and add another button on experience form.",
                          })}
                    </Button>
                    <Link mode="inline" href={returnPath}>
                      {intl.formatMessage(formMessages.cancelGoBack)}
                    </Link>
                  </div>
                )}
              </form>
            </FormProvider>
          </Card>
        </div>
      </Hero>
    </>
  );
};

export default ExperienceFormLayout;
