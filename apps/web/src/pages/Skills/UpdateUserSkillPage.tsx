import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import LightBulbIcon from "@heroicons/react/24/outline/LightBulbIcon";
import BookmarkSquareIcon from "@heroicons/react/24/outline/BookmarkSquareIcon";
import PlusCircleIcon from "@heroicons/react/24/solid/PlusCircleIcon";

import {
  ThrowNotFound,
  TableOfContents,
  Pending,
  Well,
  Button,
  Dialog,
} from "@gc-digital-talent/ui";
import {
  Experience,
  Maybe,
  Scalars,
  Skill,
  SkillLevel,
  SkillCategory,
  UserSkill,
  WhenSkillUsed,
  useCreateUserSkillMutation,
  useDeleteUserSkillMutation,
  useUpdateUserSkillMutation,
  useUserSkillQuery,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  formMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { BasicForm } from "@gc-digital-talent/forms";
import { notEmpty } from "@gc-digital-talent/helpers";
import { toast } from "@gc-digital-talent/toast";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";
import UserSkillFormFields from "~/components/UserSkillFormFields/UserSkillFormFields";
import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";
import ExperienceSkillFormDialog from "~/components/ExperienceSkillFormDialog/ExperienceSkillFormDialog";
import useRoutes from "~/hooks/useRoutes";

type PageSection = {
  id: string;
  title: React.ReactNode;
};
type PageSections = Record<string, PageSection>;

type FormValues = {
  skillLevel: SkillLevel;
  whenSkillUsed: WhenSkillUsed;
};

interface NullExperienceMessageProps {
  hasExperiences: boolean;
}

const NullExperienceMessage = ({
  hasExperiences,
}: NullExperienceMessageProps) => {
  const intl = useIntl();
  return (
    <Well data-h2-text-align="base(center)">
      <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x.5)">
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
      </p>
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
    </Well>
  );
};

interface UpdateUserSkillFormProps {
  userId: Scalars["UUID"];
  skill: Skill;
  experiences: Experience[];
  userSkill?: Maybe<UserSkill>;
}

export const UpdateUserSkillForm = ({
  userId,
  experiences,
  skill,
  userSkill,
}: UpdateUserSkillFormProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const [isFormDialogOpen, setFormDialogOpen] = React.useState<boolean>(false);
  const [currentExperience, setCurrentExperience] =
    React.useState<Experience | null>(null);
  const skillName = getLocalizedName(skill.name, intl);
  const skillDescription = getLocalizedName(skill.description, intl);
  const hasUserSkill = notEmpty(userSkill);
  const isTechnical = skill.category === SkillCategory.Technical;
  const linkedExperiences = userSkill?.experiences?.filter(notEmpty);

  const availableExperiences = experiences.filter(
    (exp) =>
      !linkedExperiences?.find(
        (existingExperience) => existingExperience.id === exp.id,
      ),
  );

  const [{ fetching: creating }, executeCreateMutation] =
    useCreateUserSkillMutation();
  const [{ fetching: updating }, executeUpdateMutation] =
    useUpdateUserSkillMutation();
  const [{ fetching: deleting }, executeDeleteMutation] =
    useDeleteUserSkillMutation();
  const mutating = creating || updating || deleting;

  const handleSuccess = (msg?: React.ReactNode) => {
    toast.success(
      msg ||
        intl.formatMessage({
          defaultMessage: "Successfully updated skill!",
          id: "Vfa3Ek",
          description: "Message displayed when a user updates a skill",
        }),
    );
    navigate(paths.skillLibrary());
  };

  const handleError = (msg?: React.ReactNode) => {
    toast.error(
      msg ||
        intl.formatMessage({
          defaultMessage: "Error: updating skill failed",
          id: "CUxHd8",
          description:
            "Message displayed to user after skill fails to be updated.",
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
      id: userSkill?.id,
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

  const handleFormOpenChange = (newIsFormOpen: boolean) => {
    setFormDialogOpen(newIsFormOpen);
    // reset current experience when we close the form
    if (!newIsFormOpen) {
      setCurrentExperience(null);
    }
  };

  const crumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: paths.home(),
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Profile and applications",
        id: "wDc+F3",
        description: "Breadcrumb for profile and applications page.",
      }),
      url: paths.profileAndApplications(),
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Skill library",
        id: "Oi6fll",
        description: "Breadcrumb for skill library page.",
      }),
      url: paths.skillLibrary(),
    },
    {
      label: skillName,
      url: paths.editUserSkill(skill.id),
    },
  ];

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

  return (
    <>
      <SEO title={pageTitle} />
      <Hero
        title={pageTitle}
        crumbs={crumbs}
        subtitle={intl.formatMessage({
          defaultMessage:
            "Update your skill level and manage career experiences linked to this skill.",
          id: "xJfPRe",
          description: "Subtitle for the self skill evaluation page",
        })}
      />
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        <TableOfContents.Wrapper data-h2-margin-top="base(x3)">
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
                data-h2-margin="base(0 0 x1 0)"
              >
                {sections.skillLevel.title}
              </TableOfContents.Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "As your skill level grows, you can use this form to update your self-evaluated skill level. You’ll find both the Government’s definition of the skill, as well as explanations for each skill level to help you make your choice.",
                  id: "J/oofb",
                  description: "Help text for updating a skill level",
                })}
              </p>
              {skillDescription && (
                <Well data-h2-margin="base(x1 0)">
                  <p
                    data-h2-font-weight="base(700)"
                    data-h2-margin-bottom="base(x.5)"
                  >
                    {intl.formatMessage(
                      {
                        defaultMessage: "Remember, {skillName} is defined as",
                        id: "5dhDA+",
                        description: "Lead-in text to a skill description",
                      },
                      { skillName },
                    )}
                    {intl.formatMessage(commonMessages.dividingColon)}
                  </p>
                  <p>{skillDescription}</p>
                </Well>
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
                <div
                  data-h2-display="base(flex)"
                  data-h2-flex-direction="base(column)"
                  data-h2-gap="base(x1 0)"
                  data-h2-margin="base(x1, 0, x2, 0)"
                >
                  <UserSkillFormFields isTechnical={isTechnical} />
                  <div
                    data-h2-display="base(flex)"
                    data-h2-flex-wrap="base(wrap)"
                    data-h2-gap="base(x1)"
                  >
                    <Button type="submit" color="secondary" disabled={mutating}>
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
                        <Dialog.Content>
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
                            <ul data-h2-margin="base(x.25 0 x1 0)">
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
                            </ul>
                            <p>
                              {intl.formatMessage({
                                defaultMessage:
                                  "If you decide to re-add this skill to your profile at a later time:",
                                id: "YW3A7H",
                                description:
                                  "Lead-in text to points of concern when deleting a skill on how to re-add it",
                              })}
                            </p>
                            <ul data-h2-margin="base(x.25 0 x1 0)">
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
                            </ul>
                            <Dialog.Footer data-h2-justify-content="base(flex-start)">
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
                                  color="secondary"
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
                color="tertiary"
                data-h2-margin="base(x3 0 x1 0)"
              >
                {sections.featuredExperiences.title}
              </TableOfContents.Heading>
              <p data-h2-margin="base(x1 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "Any experience you've added to your career timeline that features this skill can be managed in this section. You can also link this skill to other experiences using the button provided.",
                  id: "cPOQCk",
                  description:
                    "Lead-in text describing how to link experiences to a skill",
                })}
              </p>
              {availableExperiences.length ? (
                <div
                  data-h2-display="base(flex)"
                  data-h2-justify-content="base(flex-end)"
                  data-h2-margin="base(x.5 0)"
                >
                  <Button
                    color="secondary"
                    icon={PlusCircleIcon}
                    onClick={() => setFormDialogOpen(true)}
                  >
                    {intl.formatMessage({
                      defaultMessage: "Link an experience",
                      id: "Y2ULHN",
                      description:
                        "Button text to open the form allowing a user to link an experience to a skill",
                    })}
                  </Button>
                </div>
              ) : null}
              {linkedExperiences?.length ? (
                <div
                  data-h2-display="base(flex)"
                  data-h2-flex-direction="base(column)"
                  data-h2-gap="base(x.5 0)"
                >
                  {linkedExperiences.map((experience) => (
                    <ExperienceCard
                      key={experience.id}
                      experience={experience}
                      headingLevel="h3"
                      showEdit
                      showSkills={skill}
                      onEditClick={() => {
                        setCurrentExperience(experience);
                        setFormDialogOpen(true);
                      }}
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
      </div>
      <ExperienceSkillFormDialog
        open={isFormDialogOpen}
        onOpenChange={handleFormOpenChange}
        skill={skill}
        availableExperiences={
          currentExperience ? [currentExperience] : availableExperiences
        }
        experience={currentExperience || undefined}
      />
    </>
  );
};

type RouteParams = {
  skillId: Scalars["ID"];
};

const UpdateUserSkillPage = () => {
  const intl = useIntl();
  const { skillId } = useParams<RouteParams>();

  const [{ data, fetching, error }] = useUserSkillQuery({
    variables: {
      skillId: skillId ?? "",
    },
  });

  const userSkill = data?.me?.userSkills?.find((s) => s?.skill.id === skillId);
  const userExperiences = data?.me?.experiences?.filter(notEmpty);

  return (
    <Pending fetching={fetching} error={error}>
      {data?.skill ? (
        <UpdateUserSkillForm
          userId={data.me?.id}
          skill={data.skill}
          userSkill={userSkill}
          experiences={userExperiences ?? []}
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

export default UpdateUserSkillPage;
