import { useEffect } from "react";
import { Location, useLocation, useNavigate, useParams } from "react-router";
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
  Container,
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
import { useAuthorization } from "@gc-digital-talent/auth";
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
  ExperienceDetailsSubmissionData,
  ExperienceMutationResponse,
} from "~/types/experience";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import ErrorSummary from "~/components/ExperienceFormFields/ErrorSummary";
import ExperienceDetails from "~/components/ExperienceFormFields/ExperienceDetails";
import SelectExperience from "~/components/ExperienceFormFields/SelectExperience";
import ExperienceHeading from "~/components/ExperienceFormFields/ExperienceHeading";
import {
  deriveExperienceType,
  formValuesToSubmitData,
  organizationSuggestionsFromExperiences,
  queryResultToDefaultValues,
} from "~/utils/experienceUtils";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import adminMessages from "~/messages/adminMessages";
import ExperienceWorkStreams from "~/components/ExperienceWorkStreams/ExperienceWorkStreams";

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
interface FormValues extends ExperienceFormValues<AllExperienceFormValues> {
  experienceType?: ExperienceType;
  action: FormAction;
}

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
    category {
      value
      label {
        en
        fr
      }
    }
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

const ExperienceFormExperience_Fragment = graphql(/* GraphQL */ `
  fragment ExperienceFormExperience on Experience {
    id
    details
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
    ... on AwardExperience {
      title
      issuedBy
      awardedDate
      awardedTo {
        value
        label {
          en
          fr
        }
      }
      awardedScope {
        value
        label {
          en
          fr
        }
      }
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
      type {
        value
        label {
          localized
        }
      }
      status {
        value
        label {
          en
          fr
        }
      }
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
      employmentCategory {
        value
        label {
          en
          fr
        }
      }
      extSizeOfOrganization {
        value
        label {
          en
          fr
        }
      }
      extRoleSeniority {
        value
        label {
          en
          fr
        }
      }
      govEmploymentType {
        value
        label {
          en
          fr
        }
      }
      govPositionType {
        value
        label {
          en
          fr
        }
      }
      govContractorRoleSeniority {
        value
        label {
          en
          fr
        }
      }
      govContractorType {
        value
        label {
          en
          fr
        }
      }
      contractorFirmAgencyName
      cafEmploymentType {
        value
        label {
          en
          fr
        }
      }
      cafForce {
        value
        label {
          en
          fr
        }
      }
      cafRank {
        value
        label {
          en
          fr
        }
      }
      classification {
        id
        group
        level
      }
      department {
        id
        departmentNumber
        name {
          en
          fr
        }
      }
      workStreams {
        id
      }
      supervisoryPosition
      supervisedEmployees
      supervisedEmployeesNumber
      budgetManagement
      annualBudgetAllocation
      seniorManagementStatus
      cSuiteRoleTitle {
        value
        label {
          localized
        }
      }
      otherCSuiteRoleTitle
    }
  }
`);

interface ExperienceFormProps {
  edit?: boolean;
  experienceQuery?: FragmentType<typeof ExperienceFormExperience_Fragment>;
  experienceId?: string;
  experienceType?: ExperienceType;
  skillsQuery: FragmentType<typeof ExperienceFormSkill_Fragment>[];
  userId: string;
  organizationSuggestions: string[];
}

export const ExperienceForm = ({
  edit,
  experienceQuery,
  experienceId,
  experienceType,
  skillsQuery,
  userId,
  organizationSuggestions,
}: ExperienceFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const returnPath = paths.careerTimeline();
  const experience = getFragment(
    ExperienceFormExperience_Fragment,
    experienceQuery,
  );
  const skills = getFragment(ExperienceFormSkill_Fragment, skillsQuery);

  const defaultValues =
    experienceId && experience && experienceType
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

  const handleMutationResponse = async (res: ExperienceMutationResponse) => {
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
  } = useExperienceMutations(experience ? "update" : "create", type);

  const handleUpdateExperience = (values: ExperienceDetailsSubmissionData) => {
    const args = getMutationArgs(experienceId ?? userId ?? "", values);
    if (executeMutation) {
      const res = executeMutation(args) as Promise<ExperienceMutationResponse>;
      return res
        .then(async (mutationResponse) => {
          await handleMutationResponse(mutationResponse);
        })
        .catch(handleError);
    }

    return undefined;
  };

  const experienceIdExact = experienceId ?? "";
  const executeDeletionMutation = useDeleteExperienceMutation(
    type ?? undefined,
  );

  const handleDeleteExperience = () => {
    if (executeDeletionMutation) {
      executeDeletionMutation({
        id: experienceIdExact,
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
        .catch(handleError);
    }
  };

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    const data = formValuesToSubmitData(formValues, [], type);
    return handleUpdateExperience(data);
  };

  useEffect(() => {
    if (action === "add-another" && isSubmitSuccessful) {
      // Help users out by focusing the first input after scrolling
      setFocus("experienceType");
      reset();
      setValue("experienceType", undefined);
    }
  }, [isSubmitSuccessful, reset, action, setFocus, setValue]);

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.applicantDashboard),
        url: paths.applicantDashboard(),
      },
      {
        label: intl.formatMessage(navigationMessages.careerTimeline),
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
              defaultMessage: "Add experience",
              id: "g1WB3B",
              description: "Title for add experience page",
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
      <Container className="my-18">
        <TableOfContents.Wrapper>
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
                <TableOfContents.AnchorLink id="skills">
                  {intl.formatMessage({
                    defaultMessage: "List featured skills",
                    id: "rxDfeN",
                    description:
                      "Heading for the experience type section fo the experience form",
                  })}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              {type === "work" && (
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id="workStreams">
                    {intl.formatMessage(adminMessages.workStreams)}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
              )}
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
                  <ExperienceDetails
                    organizationSuggestions={organizationSuggestions}
                    experienceType={experienceType}
                  />
                </TableOfContents.Section>

                <TableOfContents.Section id="skills">
                  <ExperienceSkills
                    experienceType={experienceType}
                    skills={[...skills]}
                  />
                </TableOfContents.Section>

                {type === "work" && (
                  <TableOfContents.Section id="workStreams">
                    <ExperienceWorkStreams />
                  </TableOfContents.Section>
                )}

                <Separator space="lg" />
                {edit ? (
                  <div className="flex flex-col flex-wrap items-start gap-6 sm:flex-row sm:items-center">
                    <Submit
                      text={intl.formatMessage({
                        defaultMessage: "Save and return to my career timeline",
                        id: "jZi53k",
                        description:
                          "Label on button to save and return on the current experience",
                      })}
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
                        : intl.formatMessage({
                            defaultMessage:
                              "Save and return to my career timeline",
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
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </Container>
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
        ...ExperienceFormExperience
      }
    }
  }
`);

interface RouteParams extends Record<string, string> {
  userId: Scalars["ID"]["output"];
  experienceType: ExperienceType;
  experienceId: Scalars["ID"]["output"];
}

interface LocationState {
  experienceType?: ExperienceType;
}

interface ExperienceFormContainerProps {
  edit?: boolean;
}

const ExperienceFormContainer = ({ edit }: ExperienceFormContainerProps) => {
  const intl = useIntl();
  const { userAuthInfo } = useAuthorization();
  const { experienceId } = useParams<RouteParams>();
  const { state } = useLocation() as Location<LocationState>;

  const [{ data, fetching, error }] = useQuery({
    query: ExperienceFormData_Query,
    context,
  });

  const skills = unpackMaybes(data?.skills);
  const experience =
    data?.me?.experiences?.find((exp) => exp?.id === experienceId) ?? undefined;

  const myExperiences = unpackMaybes(data?.me?.experiences);
  const organizationsForAutocomplete =
    organizationSuggestionsFromExperiences(myExperiences);

  const experienceType = experience
    ? deriveExperienceType(experience)
    : state?.experienceType;

  return (
    <Pending fetching={fetching} error={error}>
      {skills ? (
        <ExperienceForm
          edit={edit}
          experienceQuery={experience}
          experienceId={experienceId}
          experienceType={experienceType}
          skillsQuery={skills}
          userId={userAuthInfo?.id ?? ""}
          organizationSuggestions={organizationsForAutocomplete}
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
