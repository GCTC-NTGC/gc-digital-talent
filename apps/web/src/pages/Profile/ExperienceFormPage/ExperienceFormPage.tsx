import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { OperationContext } from "urql";

import { toast } from "@gc-digital-talent/toast";
import {
  Button,
  ThrowNotFound,
  Pending,
  Separator,
  Link,
  AlertDialog,
  TableOfContents,
} from "@gc-digital-talent/ui";
import { formMessages, navigationMessages } from "@gc-digital-talent/i18n";

import {
  Scalars,
  Skill,
  useGetMyExperiencesQuery,
  useGetSkillsQuery,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";

import ProfileFormWrapper from "~/components/ProfileFormWrapper/ProfileFormWrapper";

import {
  useDeleteExperienceMutation,
  useExperienceMutations,
} from "~/hooks/useExperienceMutations";
import type {
  ExperienceType,
  AllExperienceFormValues,
  ExperienceFormValues,
  AnyExperience,
} from "~/types/experience";
import ErrorSummary from "~/components/ExperienceFormFields/ErrorSummary";
import ExperienceDetails from "~/components/ExperienceFormFields/ExperienceDetails";
import AdditionalDetails from "~/components/ExperienceFormFields/AdditionalDetails";
import SelectExperience from "~/components/ExperienceFormFields/SelectExperience";
import ExperienceHeading from "~/components/ExperienceFormFields/ExperienceHeading";
import { useAuthorization } from "@gc-digital-talent/auth";
import {
  deriveExperienceType,
  formValuesToSubmitData,
  queryResultToDefaultValues,
} from "~/utils/experienceUtils";

import ExperienceSkills from "./components/ExperienceSkills";

type FormAction = "return" | "add-another";
type ExperienceExperienceFormValues =
  ExperienceFormValues<AllExperienceFormValues> & {
    experienceType: ExperienceType | "";
    action: FormAction | "";
  };

export interface ExperienceFormProps {
  edit?: boolean;
  experience?: AnyExperience;
  experienceId?: string;
  experienceType: ExperienceType;
  skills: Skill[];
  userId: string;
}

export const ExperienceForm = ({
  edit,
  experience,
  experienceId,
  experienceType,
  skills,
  userId,
}: ExperienceFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const { user } = useAuthorization();
  const returnPath = paths.careerTimelineAndRecruitment(userId);
  const defaultValues =
    experienceId && experience
      ? queryResultToDefaultValues(experienceType || "award", experience)
      : {};
  const methods = useForm<ExperienceExperienceFormValues>({
    shouldFocusError: false,
    mode: "onSubmit",
    defaultValues,
  });
  const {
    watch,
    register,
    setValue,
    setFocus,
    formState: { isSubmitSuccessful },
    reset,
  } = methods;
  const [type, action] = watch(["experienceType", "action"]);
  const { executeMutation, getMutationArgs } = useExperienceMutations(
    experienceId ? "update" : "create",
    type,
  );
  const executeDeletionMutation = useDeleteExperienceMutation(experienceType);

  const actionProps = register("action");

  const handleSubmit: SubmitHandler<ExperienceExperienceFormValues> = async (
    formValues,
  ) => {
    const submitData = formValuesToSubmitData(formValues, [], type);
    const args = getMutationArgs(
      experience ? experience.id : user?.id || "",
      submitData,
    );
    if (executeMutation) {
      executeMutation(args)
        .then((res) => {
          if (res.data) {
            if (experienceId) {
              toast.success(
                intl.formatMessage({
                  defaultMessage: "Successfully updated experience!",
                  id: "4438xW",
                  description:
                    "Success message displayed after updating an experience",
                }),
              );
            } else {
              toast.success(
                intl.formatMessage({
                  defaultMessage: "Successfully added experience!",
                  id: "DZ775N",
                  description:
                    "Success message displayed after adding experience to profile",
                }),
              );
            }
            if (formValues.action !== "add-another") {
              navigate(returnPath);
            }
          }
        })
        .catch(() => {
          toast.error(
            intl.formatMessage({
              defaultMessage: "Error: adding experience failed",
              id: "moKAQP",
              description:
                "Message displayed to user after experience fails to be created.",
            }),
          );
        });
    }
  };

  const handleDeleteExperience = () => {
    if (executeDeletionMutation && experience) {
      executeDeletionMutation({
        id: experience.id,
      })
        .then((result) => {
          navigate(returnPath);
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

  React.useEffect(() => {
    if (action === "add-another" && isSubmitSuccessful) {
      // Help users out by focusing the first input after scrolling
      setFocus("experienceType");
      reset();
    }
  }, [isSubmitSuccessful, reset, action, setFocus]);

  const crumbs: { label: string | React.ReactNode; url: string }[] = [
    {
      label: intl.formatMessage(
        navigationMessages.careerTimelineAndRecruitment,
      ),
      url: returnPath,
    },
    {
      label: experience
        ? intl.formatMessage({
            defaultMessage: "Edit Experience",
            id: "NrivlZ",
            description: "Display text for edit experience form in breadcrumbs",
          })
        : intl.formatMessage({
            defaultMessage: "Add Experience",
            id: "mJ1HE4",
            description: "Display text for add experience form in breadcrumbs",
          }),
      url: "#",
    },
  ];

  const pageTitle: string = experience
    ? intl.formatMessage({
        defaultMessage: "Edit a résumé experience",
        id: "UISX7F",
        description: "Display text for edit experience form in breadcrumbs",
      })
    : intl.formatMessage({
        defaultMessage: "Add an experience to your résumé",
        id: "s9hqAQ",
        description: "Display text for add experience form in breadcrumbs",
      });

  const pageSubtitle: string = experience
    ? intl.formatMessage({
        defaultMessage: "Update or delete an experience on your résumé",
        id: "MxbskW",
        description: "Display text for edit experience form in breadcrumbs",
      })
    : intl.formatMessage({
        defaultMessage:
          "Describe work, education, community, personal, or award experiences.",
        id: "YwO4XP",
        description: "Display text for add experience form in breadcrumbs",
      });

  return (
    <ProfileFormWrapper
      title={pageTitle}
      description={pageSubtitle}
      prefixBreadcrumbs
      crumbs={crumbs}
    >
      <TableOfContents.Wrapper data-h2-margin-top="base(x3)">
        <TableOfContents.Navigation>
          <TableOfContents.List>
            {!edit && (
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id="type-of-experience">
                  {intl.formatMessage({
                    defaultMessage: "Select a type of experience",
                    id: "jw6Umr",
                    description:
                      "Heading for the experience type section fo the experience form",
                  })}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            )}
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id="details">
                {intl.formatMessage({
                  defaultMessage: "Provide a few details",
                  id: "GB3LDj",
                  description:
                    "Heading for the experience type section fo the experience form",
                })}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id="highlight">
                {intl.formatMessage({
                  defaultMessage: "Highlight additional information",
                  id: "sKi4eh",
                  description:
                    "Heading for the experience type section fo the experience form",
                })}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id="skills">
                {intl.formatMessage({
                  defaultMessage: "List featured skills",
                  id: "rxDfeN",
                  description:
                    "Heading for the experience type section fo the experience form",
                })}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
          </TableOfContents.List>
        </TableOfContents.Navigation>
        <TableOfContents.Content>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <ErrorSummary experienceType={experienceType} />
              <ExperienceHeading edit={!!experienceId} />

              {!edit && (
                <TableOfContents.Section id="type-of-experience">
                  <SelectExperience experienceType={experienceType} />
                </TableOfContents.Section>
              )}

              <TableOfContents.Section id="details">
                <ExperienceDetails experienceType={experienceType} />
              </TableOfContents.Section>

              <TableOfContents.Section id="highlight">
                <AdditionalDetails experienceType={experienceType} />
              </TableOfContents.Section>

              <TableOfContents.Section id="skills">
                <ExperienceSkills
                  experienceType={experienceType}
                  skills={skills}
                />
              </TableOfContents.Section>
              <Separator
                orientation="horizontal"
                decorative
                data-h2-background="base(black.light)"
                data-h2-margin="base(x2, 0)"
              />
              {experience ? (
                <div
                  data-h2-display="base(flex)"
                  data-h2-gap="base(x.25, x.5)"
                  data-h2-flex-wrap="base(wrap)"
                  data-h2-flex-direction="base(column) l-tablet(row)"
                  data-h2-align-items="base(flex-start) l-tablet(center)"
                >
                  <Button type="submit">
                    {intl.formatMessage({
                      defaultMessage: "Save and return to my résumé",
                      id: "frDbhX",
                      description:
                        "Label on button to save and return on the current experience",
                    })}
                  </Button>
                  <Link color="quaternary" mode="inline" href={returnPath}>
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
                      <AlertDialog.Description>
                        {intl.formatMessage({
                          defaultMessage:
                            "Are you sure you would like to delete this experience from your profile? This action cannot be undone.",
                          id: "IhXvCe",
                          description:
                            "Question displayed when a user attempts to delete an experience from their profile",
                        })}
                      </AlertDialog.Description>
                      <AlertDialog.Footer>
                        <AlertDialog.Cancel>
                          <Button type="button" color="secondary">
                            {intl.formatMessage({
                              defaultMessage: "Cancel",
                              id: "KnE2Rk",
                              description: "Cancel confirmation",
                            })}
                          </Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action>
                          <Button
                            type="submit"
                            mode="solid"
                            color="primary"
                            onClick={handleDeleteExperience}
                          >
                            {intl.formatMessage({
                              defaultMessage: "Delete",
                              id: "sBksyQ",
                              description: "Delete confirmation",
                            })}
                          </Button>
                        </AlertDialog.Action>
                      </AlertDialog.Footer>
                    </AlertDialog.Content>
                  </AlertDialog.Root>
                </div>
              ) : (
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
                    value="return"
                    {...actionProps}
                    onClick={() => setValue("action", "return")}
                  >
                    {intl.formatMessage({
                      defaultMessage: "Save and return to my résumé",
                      id: "frDbhX",
                      description:
                        "Label on button to save and return on the current experience",
                    })}
                  </Button>
                  <Button
                    type="submit"
                    mode="inline"
                    {...actionProps}
                    onClick={() => setValue("action", "add-another")}
                  >
                    {intl.formatMessage({
                      defaultMessage: "Save and add another",
                      id: "+7v9Dq",
                      description:
                        "Text for save button and add another button on experience form.",
                    })}
                  </Button>
                  <Link mode="inline" href={returnPath}>
                    {intl.formatMessage({
                      defaultMessage: "Cancel and go back",
                      id: "fMcKtJ",
                      description: "Text to cancel changes to a form",
                    })}
                  </Link>
                </div>
              )}
            </form>
          </FormProvider>
        </TableOfContents.Content>
      </TableOfContents.Wrapper>
    </ProfileFormWrapper>
  );
};

const context: Partial<OperationContext> = {
  additionalTypenames: ["Skill", "SkillFamily"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first", // The list of skills will rarely change, so we override default request policy to avoid unnecessary cache updates.
};

type RouteParams = {
  userId: Scalars["ID"];
  experienceType: ExperienceType;
  experienceId: Scalars["ID"];
};
export interface ExperienceFormContainerProps {
  edit?: boolean;
}

const ExperienceFormContainer = ({ edit }: ExperienceFormContainerProps) => {
  const intl = useIntl();
  const { userId, experienceId } = useParams<RouteParams>();
  const { state } = useLocation();

  const [
    {
      data: experienceData,
      fetching: experienceFetching,
      error: experienceError,
    },
  ] = useGetMyExperiencesQuery();

  const [skillResults] = useGetSkillsQuery({
    context,
  });
  const {
    data: skillsData,
    fetching: fetchingSkills,
    error: skillError,
  } = skillResults;

  const experience =
    experienceData?.me?.experiences?.find((exp) => exp?.id === experienceId) ??
    undefined;

  const experienceType = experience
    ? deriveExperienceType(experience)
    : state?.experienceType;

  return (
    <Pending
      fetching={fetchingSkills || experienceFetching}
      error={skillError || experienceError}
    >
      {skillsData ? (
        <ExperienceForm
          edit={edit}
          experience={experience}
          experienceId={experienceId || ""}
          experienceType={experienceType}
          skills={skillsData.skills as Skill[]} // Only grab technical skills (hard skills).
          userId={userId || ""}
        />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage({
            defaultMessage: "No experience found.",
            id: "Yhd/hk",
            description:
              "Message displayed when no experience is found for experience form.",
          })}
        />
      )}
    </Pending>
  );
};

export default ExperienceFormContainer;
