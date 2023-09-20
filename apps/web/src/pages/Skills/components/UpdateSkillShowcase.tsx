import React from "react";
import { useIntl } from "react-intl";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import isEqual from "lodash/isEqual";
import { useNavigate } from "react-router-dom";

import {
  TableOfContents,
  IconType,
  Well,
  Separator,
  Button,
} from "@gc-digital-talent/ui";
import { Skill, UserSkill } from "@gc-digital-talent/graphql";
import { Repeater, Submit } from "@gc-digital-talent/forms";
import {
  getBehaviouralSkillLevel,
  getLocalizedName,
  getTechnicalSkillLevel,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";
import SkillDialog from "~/components/SkillDialog/SkillDialog";
import { FormValues as SkillDialogFormValues } from "~/components/SkillDialog/types";
import {
  Scalars,
  SkillCategory,
  useCreateUserSkillMutation,
  useUpdateUserSkillMutation,
} from "~/api/generated";

export type FormValues = { userSkills: SkillDialogFormValues[] };

interface ModificationAlertProps {
  userSkills: FormValues["userSkills"];
}

const ModificationAlert = ({ userSkills }: ModificationAlertProps) => {
  const intl = useIntl();
  const {
    watch,
    formState: { isDirty },
  } = useFormContext();
  const currentSkills = watch("userSkills");
  const changedItems = userSkills?.filter((skill, index) => {
    const current = currentSkills[index];
    return !current || !isEqual(skill, current);
  });

  // Nothing has changed so do not show the alert
  if (
    !isDirty ||
    (!changedItems?.length && currentSkills.length === userSkills?.length)
  )
    return null;

  return (
    <Well data-h2-margin-bottom="base(x1)" data-h2-text-align="base(center)">
      {intl.formatMessage({
        defaultMessage: "You have unsaved changes. Please, remember to save!",
        id: "Un9x5Z",
        description:
          "Message displayed when items have been moved and not saved",
      })}
    </Well>
  );
};

interface UpdateSkillShowcaseProps {
  userId: Scalars["UUID"];
  skills: Skill[];
  userSkills: UserSkill[];
  initialSkills: FormValues;
  crumbs: { label: string; url: string }[];
  pageInfo: {
    id: string;
    title: string;
    description: string;
    icon: IconType;
    blurb: string;
    maxSkillCount: number;
    returnPath: string;
  };
  handleSubmit: SubmitHandler<FormValues>;
}

const UpdateSkillShowcase = ({
  userId,
  skills,
  userSkills,
  initialSkills,
  crumbs,
  pageInfo,
  handleSubmit,
}: UpdateSkillShowcaseProps) => {
  const intl = useIntl();
  const navigate = useNavigate();

  const [, executeCreateMutation] = useCreateUserSkillMutation();
  const [, executeUpdateMutation] = useUpdateUserSkillMutation();

  const methods = useForm<FormValues>({
    defaultValues: initialSkills,
  });
  const { control, watch } = methods;
  const { remove, move, append, fields } = useFieldArray({
    control,
    name: "userSkills",
  });
  const watchedSkills = watch("userSkills");

  const handleSuccess = (msg?: React.ReactNode) => {
    toast.success(
      msg ||
        intl.formatMessage({
          defaultMessage: "Successfully updated skill",
          id: "vMBiMV",
          description: "Message displayed when a user updates a skill",
        }),
    );
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

  const handleSave = async (values: SkillDialogFormValues) => {
    const skillId = values.skill;
    const userHasSkill =
      userSkills.filter((userSkill) => userSkill.skill.id === values.skill)
        .length > 0 ||
      watchedSkills.filter((userSkill) => userSkill.skill === values.skill)
        .length > 0;

    if (userHasSkill) {
      executeUpdateMutation({
        id: userSkills.find((userSkill) => userSkill.skill.id === values.skill)
          ?.id,
        userSkill: {
          skillLevel: values.skillLevel,
          whenSkillUsed: values.whenSkillUsed,
        },
      })
        .then((res) => {
          append(
            {
              skill: res.data?.updateUserSkill?.skill.id,
              skillLevel: res.data?.updateUserSkill?.skillLevel ?? undefined,
            },
            { shouldFocus: false },
          );
          handleSuccess();
        })
        .catch(() => handleError());
    } else {
      executeCreateMutation({
        userId,
        skillId,
        userSkill: {
          skillLevel: values.skillLevel,
          whenSkillUsed: values.whenSkillUsed,
        },
      })
        .then((res) => {
          append(
            {
              skill: res.data?.createUserSkill?.skill.id,
              skillLevel: res.data?.createUserSkill?.skillLevel ?? undefined,
            },
            { shouldFocus: false },
          );
          handleSuccess();
        })
        .catch(() => handleError());
    }
  };

  const canAdd = fields.length < pageInfo.maxSkillCount;
  const getSkill = (skillId: string | undefined) =>
    skills.find((skill) => skill.id === skillId);
  return (
    <>
      <SEO title={pageInfo.title} description={pageInfo.description} />
      <Hero
        title={pageInfo.title}
        subtitle={pageInfo.description}
        crumbs={crumbs}
      />
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        <TableOfContents.Wrapper data-h2-margin-top="base(x3)">
          <TableOfContents.Navigation>
            <TableOfContents.List>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={pageInfo.id}>
                  {pageInfo.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            </TableOfContents.List>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <TableOfContents.Section id={pageInfo.id}>
              <TableOfContents.Heading
                icon={pageInfo.icon}
                color="primary"
                data-h2-margin-top="base(0)"
              >
                {pageInfo.title}
              </TableOfContents.Heading>
              <p data-h2-margin="base(x1 0)">{pageInfo.blurb}</p>
              <div>
                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(handleSubmit)}>
                    <Repeater.Root
                      data-h2-margin-bottom="base(1rem)"
                      showAdd={canAdd}
                      customButton={
                        <SkillDialog
                          trigger={
                            canAdd
                              ? {
                                  label: intl.formatMessage(
                                    {
                                      defaultMessage:
                                        "Add a new item ({numOfSkills}/{maxSkills})",
                                      id: "XzGOuV",
                                      description:
                                        "Label for skill dialog trigger on skills showcase section.",
                                    },
                                    {
                                      numOfSkills: watchedSkills.length,
                                      maxSkills: pageInfo.maxSkillCount,
                                    },
                                  ),
                                }
                              : {
                                  label: intl.formatMessage(
                                    {
                                      defaultMessage:
                                        "Delete an item to add another ({numOfSkills}/{maxSkills})",
                                      id: "lFFnfX",
                                      description:
                                        "Label for disabled dialog trigger on skills showcase section.",
                                    },
                                    {
                                      numOfSkills: watchedSkills.length,
                                      maxSkills: pageInfo.maxSkillCount,
                                    },
                                  ),
                                  disabled: true,
                                }
                          }
                          context="showcase"
                          skills={skills}
                          onSave={handleSave}
                          showCategory={false}
                          noToast
                          {...(!canAdd
                            ? {
                                "data-h2-background": "base(background)",
                                "data-h2-border-style": "base(dashed)",
                                "data-h2-border-color": "base(gray.dark)",
                                "data-h2-color": "base(gray.dark)",
                                "data-h2-display": "base(flex)",
                                "data-h2-justify-content": "base(center)",
                                "data-h2-width": "base(100%)",
                              }
                            : {
                                "data-h2-background":
                                  "base(background) base:hover(secondary.10) base:focus-visible(focus)",
                                "data-h2-border-style":
                                  "base(dashed) base:focus-visible(solid)",
                                "data-h2-border-color":
                                  "base(secondary.darker) base:focus-visible(focus)",
                                "data-h2-color":
                                  "base(secondary.darker) base:focus-visible(black)",
                                "data-h2-display": "base(flex)",
                                "data-h2-justify-content": "base(center)",
                                "data-h2-width": "base(100%)",
                              })}
                        />
                      }
                    >
                      {fields.length ? (
                        fields.map((item, index) => (
                          <Repeater.Fieldset
                            key={item.id}
                            index={index}
                            total={fields.length}
                            onMove={move}
                            onRemove={remove}
                            legend={
                              <span
                                data-h2-display="base(flex)"
                                data-h2-justify-content="base(space-between)"
                              >
                                <span>
                                  {getLocalizedName(
                                    getSkill(item.skill)?.name ?? undefined,
                                    intl,
                                  )}
                                </span>
                                <span
                                  data-h2-font-weight="base(400)"
                                  data-h2-color="base(black.light)"
                                >
                                  {item.skillLevel
                                    ? intl.formatMessage(
                                        item.category ===
                                          SkillCategory.Behavioural
                                          ? getBehaviouralSkillLevel(
                                              item.skillLevel,
                                            )
                                          : getTechnicalSkillLevel(
                                              item.skillLevel,
                                            ),
                                      )
                                    : getLocalizedName(null, intl)}
                                </span>
                              </span>
                            }
                          >
                            <div>
                              <p>
                                {getLocalizedName(
                                  getSkill(item.skill)?.description ??
                                    undefined,
                                  intl,
                                )}
                              </p>
                            </div>
                          </Repeater.Fieldset>
                        ))
                      ) : (
                        <Well data-h2-text-align="base(center)">
                          <p
                            data-h2-font-weight="base(700)"
                            data-h2-margin-bottom="base(x.5)"
                          >
                            {intl.formatMessage({
                              defaultMessage:
                                "You haven't added any items yet.",
                              id: "cEalcz",
                              description:
                                "Message that appears when there are no skills on showcase",
                            })}
                          </p>
                          <p>
                            {intl.formatMessage({
                              defaultMessage: `You can add items using the "Add a new item" button provided.`,
                              id: "mR8ccV",
                              description:
                                "Instructions on how to add a skill to showcase when there are none",
                            })}
                          </p>
                        </Well>
                      )}
                    </Repeater.Root>

                    <ModificationAlert userSkills={initialSkills.userSkills} />

                    <Separator
                      orientation="horizontal"
                      decorative
                      data-h2-margin="base(x2, 0, x2, 0)"
                      data-h2-background-color="base(black.lightest)"
                    />
                    <div
                      data-h2-display="base(flex)"
                      data-h2-gap="base(x.5, x1)"
                      data-h2-flex-wrap="base(wrap)"
                      data-h2-flex-direction="base(column) l-tablet(row)"
                      data-h2-align-items="base(flex-start) l-tablet(center)"
                    >
                      <Submit
                        text={intl.formatMessage({
                          defaultMessage: "Save and return",
                          id: "TQt+3L",
                          description:
                            "Text on a button to save the skill order and return to skill showcase",
                        })}
                        color="primary"
                        mode="solid"
                      />
                      <Button
                        type="button"
                        mode="inline"
                        color="secondary"
                        onClick={() => {
                          navigate(pageInfo.returnPath);
                        }}
                      >
                        {intl.formatMessage({
                          defaultMessage: "Cancel",
                          id: "yFIC7K",
                          description: "Label for close availability dialog.",
                        })}
                      </Button>
                    </div>
                  </form>
                </FormProvider>
              </div>
            </TableOfContents.Section>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
    </>
  );
};

export default UpdateSkillShowcase;
