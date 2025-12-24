import { useNavigate, useSearchParams } from "react-router";
import { defineMessage, useIntl } from "react-intl";
import LightBulbIcon from "@heroicons/react/24/outline/LightBulbIcon";
import BookmarkSquareIcon from "@heroicons/react/24/outline/BookmarkSquareIcon";
import PlusCircleIcon from "@heroicons/react/24/solid/PlusCircleIcon";
import { useMutation, useQuery } from "urql";
import { ReactNode } from "react";

import {
  ThrowNotFound,
  TableOfContents,
  Pending,
  Notice,
  Button,
  Dialog,
  Ul,
  Container,
} from "@gc-digital-talent/ui";
import {
  commonMessages,
  formMessages,
  getLocalizedName,
  navigationMessages,
} from "@gc-digital-talent/i18n";
import { BasicForm } from "@gc-digital-talent/forms";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { toast } from "@gc-digital-talent/toast";
import {
  FragmentType,
  Scalars,
  SkillCategory,
  SkillLevel,
  WhenSkillUsed,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import UserSkillFormFields from "~/components/UserSkillFormFields/UserSkillFormFields";
import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";
import ExperienceSkillFormDialog from "~/components/ExperienceSkillFormDialog/ExperienceSkillFormDialog";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import {
  CreateUserSkill_Mutation,
  DeleteUserSkill_Mutation,
  UpdateUserSkill_Mutation,
} from "./operations";

interface PageSection {
  id: string;
  title: ReactNode;
}
type PageSections = Record<string, PageSection>;

interface FormValues {
  skillLevel: SkillLevel;
  whenSkillUsed: WhenSkillUsed;
}

interface NullExperienceMessageProps {
  hasExperiences: boolean;
}

const NullExperienceMessage = ({
  hasExperiences,
}: NullExperienceMessageProps) => {
  const intl = useIntl();
  return (
    <Notice.Root className="text-center">
      <Notice.Title>
        {hasExperiences
          ? intl.formatMessage({
              defaultMessage:
                "You haven't featured this skill on any of your experiences yet.",
              id: "rF/VIw",
              description:
                "Message displayed when user has experiences but hasn't featured any",
            })
          : intl.formatMessage({
              defaultMessage:
                "You haven't created any career experiences on your career timeline.",
              id: "a0VxCM",
              description:
                "Message displayed when user has no experiences to feature on a skill.",
            })}
      </Notice.Title>
      <Notice.Content>
        <p>
          {hasExperiences
            ? intl.formatMessage({
                defaultMessage:
                  'You can use the "Link an experience" button provided to feature this skill.',
                id: "TK0b6n",
                description:
                  "Instructions displayed when user has experiences but hasn't featured any.",
              })
            : intl.formatMessage({
                defaultMessage:
                  "After you've added a few, you'll be able to feature this skill on one or more of your experiences.",
                id: "QZeoHp",
                description:
                  "Instructions displayed when user has no experiences to feature on a skill.",
              })}
        </p>
      </Notice.Content>
    </Notice.Root>
  );
};

const subTitle = defineMessage({
  defaultMessage:
    "Update your skill level and manage career experiences linked to this skill.",
  id: "xJfPRe",
  description: "Subtitle for the self skill evaluation page",
});

export const UpdateUserSkillSkill_Fragment = graphql(/* GraphQL */ `
  fragment UpdateUserSkillSkill on Skill {
    id
    key
    category {
      value
      label {
        en
        fr
      }
    }
    name {
      en
      fr
    }
    description {
      en
      fr
    }
  }
`);

export const UpdateUserSkillExperience_Fragment = graphql(/* GraphQL */ `
  fragment UpdateUserSkillExperience on Experience {
    id
    ...ExperienceSkillFormDialogExperience
  }
`);

export const UpdateUserSkill_Fragment = graphql(/* GraphQL */ `
  fragment UpdateUserSkill on UserSkill {
    id
    whenSkillUsed
    skillLevel
    topSkillsRank
    improveSkillsRank
    user {
      id
    }
    skill {
      id
      key
      category {
        value
        label {
          en
          fr
        }
      }
      name {
        en
        fr
      }
    }
    experiences {
      id
      ...ExperienceCard
    }
  }
`);

interface UpdateUserSkillFormProps {
  userId: Scalars["UUID"]["output"];
  skillQuery: FragmentType<typeof UpdateUserSkillSkill_Fragment>;
  experiencesQuery: FragmentType<typeof UpdateUserSkillExperience_Fragment>[];
  userSkillQuery?: FragmentType<typeof UpdateUserSkill_Fragment> | null;
}

export const UpdateUserSkillForm = ({
  userId,
  experiencesQuery,
  skillQuery,
  userSkillQuery,
}: UpdateUserSkillFormProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const skill = getFragment(UpdateUserSkillSkill_Fragment, skillQuery);
  const experiences = getFragment(
    UpdateUserSkillExperience_Fragment,
    experiencesQuery,
  );
  const userSkill = getFragment(UpdateUserSkill_Fragment, userSkillQuery);
  const skillName = getLocalizedName(skill.name, intl);
  const skillDescription = getLocalizedName(skill.description, intl);
  const hasUserSkill = notEmpty(userSkill);
  const linkedExperiences = unpackMaybes(userSkill?.experiences);
  const from = searchParams.get("from");
  const fromShowcase = from && from === "showcase";
  const returnPath = fromShowcase
    ? paths.skillShowcase()
    : paths.skillPortfolio();

  const availableExperiences = experiences.filter(
    (exp) =>
      !linkedExperiences?.find(
        (existingExperience) => existingExperience.id === exp.id,
      ),
  );

  const [{ fetching: creating }, executeCreateMutation] = useMutation(
    CreateUserSkill_Mutation,
  );
  const [{ fetching: updating }, executeUpdateMutation] = useMutation(
    UpdateUserSkill_Mutation,
  );
  const [{ fetching: deleting }, executeDeleteMutation] = useMutation(
    DeleteUserSkill_Mutation,
  );
  const mutating = creating || updating || deleting;

  const handleSuccess = async (msg?: ReactNode) => {
    toast.success(
      msg ??
        intl.formatMessage({
          defaultMessage: "Successfully updated skill!",
          id: "Vfa3Ek",
          description: "Message displayed when a user updates a skill",
        }),
    );
    await navigate(returnPath);
  };

  const handleError = (msg?: ReactNode) => {
    toast.error(
      msg ??
        intl.formatMessage({
          defaultMessage: "Error: updating skill failed",
          id: "kfjmTt",
          description:
            "Message displayed to user after skill fails to be updated",
        }),
    );
  };

  const handleSubmit = (values: FormValues) => {
    if (hasUserSkill) {
      executeUpdateMutation({
        id: userSkill.id,
        userSkill: values,
      })
        .then(() => handleSuccess())
        .catch(() => handleError());
    } else {
      executeCreateMutation({
        userId,
        skillId: skill.id,
        userSkill: values,
      })
        .then(() => handleSuccess())
        .catch(() => handleError());
    }
  };

  const handleDelete = () => {
    executeDeleteMutation({
      id: userSkill?.id ?? "",
    })
      .then(() =>
        handleSuccess(
          intl.formatMessage({
            defaultMessage: "Successfully removed from profile.",
            id: "O98p6J",
            description:
              "Message displayed to user when removing a skill from their profile",
          }),
        ),
      )
      .catch(() =>
        handleError(
          intl.formatMessage({
            defaultMessage: "Error: removing skill failed",
            id: "0NbdGD",
            description:
              "Message displayed to user after skill fails to be deleted.",
          }),
        ),
      );
  };

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.applicantDashboard),
        url: paths.applicantDashboard(),
      },

      {
        label: intl.formatMessage(navigationMessages.skillPortfolio),
        url: paths.skillPortfolio(),
      },
      ...(fromShowcase
        ? [
            {
              label: intl.formatMessage(navigationMessages.skillShowcase),
              url: paths.skillShowcase(),
            },
          ]
        : []),
      {
        label: skillName,
        url: paths.editUserSkill(skill.id),
      },
    ],
  });

  const sections: PageSections = {
    skillLevel: {
      id: "skill-level",
      title: intl.formatMessage({
        defaultMessage: "Skill level self-evaluation",
        id: "bu0Hi1",
        description: "Title for the skill level self-evaluation form",
      }),
    },
    featuredExperiences: {
      id: "featured-experiences",
      title: intl.formatMessage({
        defaultMessage: "Experiences featuring this skill",
        id: "QuLbBU",
        description: "Title for the experience section of the user skill page",
      }),
    },
  };

  const pageTitle = intl.formatMessage(
    {
      defaultMessage: 'Manage "{skillName}"',
      description: "Page title for the skill self evaluation page",
      id: "opkSia",
    },
    { skillName },
  );

  const formattedSubTitle = intl.formatMessage(subTitle);

  return (
    <>
      <SEO title={pageTitle} description={formattedSubTitle} />
      <Hero title={pageTitle} crumbs={crumbs} subtitle={formattedSubTitle} />
      <Container className="my-18">
        <TableOfContents.Wrapper>
          <TableOfContents.Navigation>
            <TableOfContents.List>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={sections.skillLevel.id}>
                  {sections.skillLevel.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink
                  id={sections.featuredExperiences.id}
                >
                  {sections.featuredExperiences.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            </TableOfContents.List>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <TableOfContents.Section id={sections.skillLevel.id}>
              <TableOfContents.Heading
                icon={LightBulbIcon}
                color="primary"
                className="mt-0"
              >
                {sections.skillLevel.title}
              </TableOfContents.Heading>
              <p className="my-6">
                {intl.formatMessage({
                  defaultMessage:
                    "As your skill level grows, you can use this form to update your self-evaluated skill level. You’ll find both the Government’s definition of the skill, as well as explanations for each skill level to help you make your choice.",
                  id: "J/oofb",
                  description: "Help text for updating a skill level",
                })}
              </p>
              {skillDescription && (
                <Notice.Root className="my-6">
                  <Notice.Title>
                    {intl.formatMessage(
                      {
                        defaultMessage: "Remember, {skillName} is defined as",
                        id: "5dhDA+",
                        description: "Lead-in text to a skill description",
                      },
                      { skillName },
                    )}
                    {intl.formatMessage(commonMessages.dividingColon)}
                  </Notice.Title>
                  <Notice.Content>
                    <p>{skillDescription}</p>
                  </Notice.Content>
                </Notice.Root>
              )}
              <BasicForm
                onSubmit={handleSubmit}
                options={{
                  defaultValues: hasUserSkill
                    ? {
                        skillLevel: userSkill.skillLevel ?? undefined,
                        whenSkillUsed: userSkill.whenSkillUsed ?? undefined,
                      }
                    : undefined,
                }}
              >
                <div className="mt-6 mb-12 flex flex-col gap-y-6">
                  <UserSkillFormFields
                    category={skill.category.value ?? SkillCategory.Technical}
                  />
                  <div className="flex flex-wrap gap-6">
                    <Button type="submit" color="primary" disabled={mutating}>
                      {intl.formatMessage(formMessages.saveChanges)}
                    </Button>
                    {hasUserSkill && (
                      <Dialog.Root>
                        <Dialog.Trigger>
                          <Button
                            mode="inline"
                            color="error"
                            disabled={mutating}
                          >
                            {intl.formatMessage({
                              defaultMessage: "Delete this skill",
                              id: "fK+EvE",
                              description:
                                "Button text to remove a skill from a users profile",
                            })}
                          </Button>
                        </Dialog.Trigger>
                        <Dialog.Content hasSubtitle>
                          <Dialog.Header
                            subtitle={intl.formatMessage({
                              defaultMessage:
                                "Before deleting the skill, please read the following carefully.",
                              id: "pYXeXV",
                              description:
                                "Subtitle for confirmation to delete a skill",
                            })}
                          >
                            {intl.formatMessage(
                              {
                                defaultMessage:
                                  'Delete "{skillName}" from your profile',
                                id: "M1Q9CE",
                                description:
                                  "Title for the confirmation alert to delete a skill",
                              },
                              { skillName },
                            )}
                          </Dialog.Header>
                          <Dialog.Body>
                            <p>
                              {intl.formatMessage({
                                defaultMessage:
                                  "Please note that by deleting a skill from your profile:",
                                id: "Awtr05",
                                description:
                                  "Lead-in text to points of concern when deleting a skill and what will happen",
                              })}
                            </p>
                            <Ul className="mt-1.5 mb-6">
                              <li>
                                {intl.formatMessage({
                                  defaultMessage:
                                    "If applicable, this skill <strong>will be removed from all of your skill showcases</strong>",
                                  id: "epqtpM",
                                  description:
                                    "Notice that deleting a skill removes it from a users skill showcase",
                                })}
                              </li>
                              <li>
                                {intl.formatMessage({
                                  defaultMessage:
                                    "This skill <strong>will be removed from all linked experiences</strong>",
                                  id: "Sm9Ml5",
                                  description:
                                    "Notice that deleting a skill removes it from any linked experiences",
                                })}
                              </li>
                            </Ul>
                            <p>
                              {intl.formatMessage({
                                defaultMessage:
                                  "If you decide to re-add this skill to your profile at a later time:",
                                id: "YW3A7H",
                                description:
                                  "Lead-in text to points of concern when deleting a skill on how to re-add it",
                              })}
                            </p>
                            <Ul className="mt-1.5 mb-6">
                              <li>
                                {intl.formatMessage({
                                  defaultMessage:
                                    "The skill <strong>will not be re-added to your skill showcases</strong>",
                                  id: "xYJi2Y",
                                  description:
                                    "Notice that re-adding a skill will not add it back to a users skill showcase",
                                })}
                              </li>
                              <li>
                                {intl.formatMessage({
                                  defaultMessage:
                                    "The skill <strong>will be linked to the experiences it was previously linked to</strong>",
                                  id: "DPfJ30",
                                  description:
                                    "Notice that re-adding a skill will re-add it to any linked experiences",
                                })}
                              </li>
                            </Ul>
                            <Dialog.Footer>
                              <Button
                                color="error"
                                onClick={handleDelete}
                                disabled={updating || creating}
                              >
                                {intl.formatMessage({
                                  defaultMessage:
                                    "I understand, delete this skill",
                                  id: "jb7PvU",
                                  description:
                                    "Button text to confirm deleting a skill",
                                })}
                              </Button>
                              <Dialog.Close>
                                <Button
                                  mode="inline"
                                  color="primary"
                                  disabled={updating || creating}
                                >
                                  {intl.formatMessage({
                                    defaultMessage:
                                      "Keep this skill on my profile",
                                    id: "WvKRKa",
                                    description:
                                      "Button text to cancel deleting a skill",
                                  })}
                                </Button>
                              </Dialog.Close>
                            </Dialog.Footer>
                          </Dialog.Body>
                        </Dialog.Content>
                      </Dialog.Root>
                    )}
                  </div>
                </div>
              </BasicForm>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.featuredExperiences.id}>
              <TableOfContents.Heading
                icon={BookmarkSquareIcon}
                color="error"
                className="mt-18 mb-6"
              >
                {sections.featuredExperiences.title}
              </TableOfContents.Heading>
              <p className="my-6">
                {intl.formatMessage({
                  defaultMessage:
                    "Any experience you've added to your career timeline that features this skill can be managed in this section. You can also link this skill to other experiences using the button provided.",
                  id: "cPOQCk",
                  description:
                    "Lead-in text describing how to link experiences to a skill",
                })}
              </p>
              {availableExperiences.length ? (
                <div className="my-3 flex justify-end">
                  <ExperienceSkillFormDialog
                    skill={skill}
                    availableExperiencesQuery={availableExperiences}
                    trigger={
                      <Button color="primary" icon={PlusCircleIcon}>
                        {intl.formatMessage({
                          defaultMessage: "Link an experience",
                          id: "Y2ULHN",
                          description:
                            "Button text to open the form allowing a user to link an experience to a skill",
                        })}
                      </Button>
                    }
                  />
                </div>
              ) : null}
              {linkedExperiences?.length ? (
                <div className="flex flex-col gap-y-3">
                  {linkedExperiences.map((experience) => (
                    <ExperienceCard
                      key={experience.id}
                      experienceQuery={experience}
                      headingLevel="h3"
                      editMode="dialog"
                      showSkills={skill}
                      linkTo={skill}
                    />
                  ))}
                </div>
              ) : (
                <NullExperienceMessage
                  hasExperiences={availableExperiences.length > 0}
                />
              )}
            </TableOfContents.Section>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </Container>
    </>
  );
};

interface RouteParams extends Record<string, string> {
  skillId: Scalars["ID"]["output"];
}

const UpdateUserSkill_Query = graphql(/* GraphQL */ `
  query UserSkill($skillId: UUID!) {
    me {
      id
      userSkills(includeSkillIds: [$skillId]) {
        skill {
          id
        }
        ...UpdateUserSkill
      }
      experiences {
        ...UpdateUserSkillExperience
      }
    }
    skill(id: $skillId) {
      ...UpdateUserSkillSkill
    }
  }
`);

const UpdateUserSkillPage = () => {
  const intl = useIntl();
  const { skillId } = useRequiredParams<RouteParams>("skillId");

  const [{ data, fetching, error }] = useQuery({
    query: UpdateUserSkill_Query,
    variables: {
      skillId,
    },
  });

  const userSkill = data?.me?.userSkills?.find((s) => s?.skill.id === skillId);

  return (
    <Pending fetching={fetching} error={error}>
      {data?.skill ? (
        <UpdateUserSkillForm
          userId={data.me?.id ?? ""}
          skillQuery={data.skill}
          userSkillQuery={userSkill}
          experiencesQuery={unpackMaybes(data.me?.experiences)}
        />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage({
            defaultMessage: "No skill found.",
            id: "VD/o5X",
            description: "Messaged displayed when no skill exists.",
          })}
        />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <UpdateUserSkillPage />
  </RequireAuth>
);

Component.displayName = "UpdateUserSkillPage";

export default Component;
