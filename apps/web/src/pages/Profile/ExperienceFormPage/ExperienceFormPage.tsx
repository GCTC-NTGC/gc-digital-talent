import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { defineMessage, useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { OperationContext, useQuery } from "urql";

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
import {
  commonMessages,
  formMessages,
  navigationMessages,
} from "@gc-digital-talent/i18n";
import {
  FragmentType,
  Scalars,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import {
  useDeleteExperienceMutation,
  useExperienceMutations,
} from "~/hooks/useExperienceMutations";
import type {
  ExperienceType,
  AllExperienceFormValues,
  ExperienceFormValues,
  ExperienceDetailsSubmissionData,
  ExperienceMutationResponse,
} from "~/types/experience";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";
import ErrorSummary from "~/components/ExperienceFormFields/ErrorSummary";
import ExperienceDetails from "~/components/ExperienceFormFields/ExperienceDetails";
import AdditionalDetails from "~/components/ExperienceFormFields/AdditionalDetails";
import SelectExperience from "~/components/ExperienceFormFields/SelectExperience";
import ExperienceHeading from "~/components/ExperienceFormFields/ExperienceHeading";
import {
  deriveExperienceType,
  formValuesToSubmitData,
  queryResultToDefaultValues,
} from "~/utils/experienceUtils";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import ExperienceSkills from "./components/ExperienceSkills";

const editPageTitle = defineMessage({
  defaultMessage: "Edit a career timeline experience",
  id: "1T+YAC",
  description: "Display text for edit experience form in breadcrumbs",
});
const addPageTitle = defineMessage({
  defaultMessage: "Add an experience to your career timeline",
  id: "gU/nxf",
  description: "Title for application career timeline add experience",
});

const editSubTitle = defineMessage({
  defaultMessage: "Update or delete an experience on your career timeline",
  id: "A+4huJ",
  description: "Display text for edit experience form in breadcrumbs",
});
const addSubTitle = defineMessage({
  defaultMessage:
    "Describe work, education, community, personal, or award experiences.",
  id: "YwO4XP",
  description: "Display text for add experience form in breadcrumbs",
});

type FormAction = "return" | "add-another";
type FormValues = ExperienceFormValues<AllExperienceFormValues> & {
  experienceType: ExperienceType | "";
  action: FormAction;
};

export const ExperienceFormSkill_Fragment = graphql(/* GraphQL */ `
  fragment ExperienceFormSkill on Skill {
    id
    key
    name {
      en
      fr
    }
    keywords {
      en
      fr
    }
    description {
      en
      fr
    }
    category
    families {
      id
      key
      name {
        en
        fr
      }
      description {
        en
        fr
      }
    }
  }
`);

export const ExperienceFormExperience_Fragment = graphql(/* GraphQL */ `
  fragment ExperienceFormExperience on Experience {
    id
    details
    user {
      id
    }
    skills {
      id
      key
      name {
        en
        fr
      }
      category
      experienceSkillRecord {
        details
      }
    }
    ... on AwardExperience {
      title
      issuedBy
      awardedDate
      awardedTo
      awardedScope
    }
    ... on CommunityExperience {
      title
      organization
      project
      startDate
      endDate
    }
    ... on EducationExperience {
      institution
      areaOfStudy
      thesisTitle
      startDate
      endDate
      type
      status
    }
    ... on PersonalExperience {
      title
      description
      startDate
      endDate
    }
    ... on WorkExperience {
      role
      organization
      division
      startDate
      endDate
    }
  }
`);

export interface ExperienceFormProps {
  edit?: boolean;
  experienceQuery?: FragmentType<typeof ExperienceFormExperience_Fragment>;
  experienceId?: string;
  experienceType: ExperienceType;
  skillsQuery: FragmentType<typeof ExperienceFormSkill_Fragment>[];
  userId: string;
}

export const ExperienceForm = ({
  edit,
  experienceQuery,
  experienceId,
  experienceType,
  skillsQuery,
  userId,
}: ExperienceFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const returnPath = paths.careerTimelineAndRecruitment();
  const experience = getFragment(
    ExperienceFormExperience_Fragment,
    experienceQuery,
  );
  const skills = getFragment(ExperienceFormSkill_Fragment, skillsQuery);

  const defaultValues =
    experienceId && experience
      ? queryResultToDefaultValues(experienceType, experience)
      : { experienceType };

  const methods = useForm<FormValues>({
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
  const actionProps = register("action");

  const handleSuccess = () => {
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
      navigate(returnPath);
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

  const handleMutationResponse = (res: ExperienceMutationResponse) => {
    if (res.error) {
      handleError();
    } else {
      handleSuccess();
    }
  };

  const { executeMutation, getMutationArgs } = useExperienceMutations(
    experience ? "update" : "create",
    type,
  );

  const handleUpdateExperience = (values: ExperienceDetailsSubmissionData) => {
    const args = getMutationArgs(experienceId || userId || "", values);
    if (executeMutation) {
      const res = executeMutation(args) as Promise<ExperienceMutationResponse>;
      return res
        .then((mutationResponse) => {
          handleMutationResponse(mutationResponse);
        })
        .catch(handleError);
    }

    return undefined;
  };

  const experienceIdExact = experienceId || "";
  const executeDeletionMutation = useDeleteExperienceMutation(
    type || undefined,
  );

  const handleDeleteExperience = () => {
    if (executeDeletionMutation) {
      executeDeletionMutation({
        id: experienceIdExact,
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
        .catch(handleError);
    }
  };

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    const data = formValuesToSubmitData(formValues, [], type);
    return handleUpdateExperience(data);
  };

  React.useEffect(() => {
    if (action === "add-another" && isSubmitSuccessful) {
      // Help users out by focusing the first input after scrolling
      setFocus("experienceType");
      reset();
      setValue("experienceType", "");
    }
  }, [isSubmitSuccessful, reset, action, setFocus, setValue]);

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.profileAndApplications),
        url: paths.profileAndApplications(),
      },
      {
        label: intl.formatMessage(
          navigationMessages.careerTimelineAndRecruitment,
        ),
        url: returnPath,
      },
      {
        label: experience
          ? intl.formatMessage({
              defaultMessage: "Edit experience",
              id: "zsUuN9",
              description: "Title for edit experience page",
            })
          : intl.formatMessage({
              defaultMessage: "Add Experience",
              id: "mJ1HE4",
              description:
                "Display text for add experience form in breadcrumbs",
            }),
        url: experience ? paths.editExperience(experience.id) : "#",
      },
    ],
  });

  const pageTitle: string = experience
    ? intl.formatMessage(editPageTitle)
    : intl.formatMessage(addPageTitle);

  const pageSubtitle: string = experience
    ? intl.formatMessage(editSubTitle)
    : intl.formatMessage(addSubTitle);

  return (
    <>
      <SEO title={pageTitle} description={pageSubtitle} />
      <Hero title={pageTitle} subtitle={pageSubtitle} crumbs={crumbs} />
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
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
                <TableOfContents.AnchorLink id="experience-details">
                  {intl.formatMessage({
                    defaultMessage: "Provide a few details",
                    id: "GB3LDj",
                    description:
                      "Heading for the experience type section fo the experience form",
                  })}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id="additional-details">
                  {intl.formatMessage({
                    defaultMessage: "Highlight additional details",
                    id: "6v+j79",
                    description: "Title for additional details section",
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
                    <SelectExperience />
                  </TableOfContents.Section>
                )}

                <TableOfContents.Section id="experience-details">
                  <ExperienceDetails experienceType={experienceType} />
                </TableOfContents.Section>

                <TableOfContents.Section id="additional-details">
                  <AdditionalDetails experienceType={experienceType} />
                </TableOfContents.Section>

                <TableOfContents.Section id="skills">
                  <ExperienceSkills
                    experienceType={experienceType}
                    skills={[...skills]}
                  />
                </TableOfContents.Section>
                <Separator space="lg" />
                {edit ? (
                  <div
                    data-h2-display="base(flex)"
                    data-h2-gap="base(x1)"
                    data-h2-flex-wrap="base(wrap)"
                    data-h2-flex-direction="base(column) l-tablet(row)"
                    data-h2-align-items="base(flex-start) l-tablet(center)"
                  >
                    <Button type="submit">
                      {intl.formatMessage({
                        defaultMessage: "Save and return to my career timeline",
                        id: "jZi53k",
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
                              {intl.formatMessage(commonMessages.cancel)}
                            </Button>
                          </AlertDialog.Cancel>
                          <AlertDialog.Action>
                            <Button
                              type="submit"
                              mode="solid"
                              color="primary"
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
                  <div
                    data-h2-display="base(flex)"
                    data-h2-gap="base(x1)"
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
                        defaultMessage: "Save and return to my career timeline",
                        id: "jZi53k",
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
                      {intl.formatMessage(formMessages.cancelGoBack)}
                    </Link>
                  </div>
                )}
              </form>
            </FormProvider>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
    </>
  );
};

const context: Partial<OperationContext> = {
  additionalTypenames: [
    "Skill",
    "SkillFamily",
    "AwardExperience",
    "CommunityExperience",
    "EducationExperience",
    "PersonalExperience",
    "WorkExperience",
  ], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first", // The list of skills and experiences will rarely change, so we override default request policy to avoid unnecessary cache updates.
};

const ExperienceFormData_Query = graphql(/* GraphQL */ `
  query ExperienceFormData {
    skills {
      ...ExperienceFormSkill
    }
    me {
      id
      experiences {
        id
        user {
          id
        }
        ...ExperienceFormExperience
      }
    }
  }
`);

type RouteParams = {
  userId: Scalars["ID"]["output"];
  experienceType: ExperienceType;
  experienceId: Scalars["ID"]["output"];
};
export interface ExperienceFormContainerProps {
  edit?: boolean;
}

const ExperienceFormContainer = ({ edit }: ExperienceFormContainerProps) => {
  const intl = useIntl();
  const { userAuthInfo } = useAuthorization();
  const { experienceId } = useParams<RouteParams>();
  const { state } = useLocation();

  const [{ data, fetching, error }] = useQuery({
    query: ExperienceFormData_Query,
    context,
  });

  const skills = unpackMaybes(data?.skills);
  const experience =
    data?.me?.experiences?.find((exp) => exp?.id === experienceId) ?? undefined;

  const experienceType = experience
    ? deriveExperienceType(experience)
    : state?.experienceType || "";

  return (
    <Pending fetching={fetching} error={error}>
      {skills ? (
        <ExperienceForm
          edit={edit}
          experienceQuery={experience}
          experienceId={experienceId || ""}
          experienceType={experienceType}
          skillsQuery={skills}
          userId={userAuthInfo?.id || ""}
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

export const Create = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <ExperienceFormContainer />
  </RequireAuth>
);

Create.displayName = "CreateExperienceFormPage";

export const Edit = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <ExperienceFormContainer edit />
  </RequireAuth>
);

Edit.displayName = "EditExperienceFormPage";

export default ExperienceFormContainer;
