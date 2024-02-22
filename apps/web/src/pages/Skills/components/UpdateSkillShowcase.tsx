import React from "react";
import { useIntl } from "react-intl";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "urql";

import {
  TableOfContents,
  IconType,
  Separator,
  Button,
  ButtonLinkMode,
} from "@gc-digital-talent/ui";
import { Repeater, Submit } from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getBehaviouralSkillLevel,
  getLocalizedName,
  getTechnicalSkillLevel,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import {
  Skill,
  UserSkill,
  Scalars,
  SkillCategory,
} from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";
import SkillBrowserDialog from "~/components/SkillBrowser/SkillBrowserDialog";
import { FormValues as SkillBrowserDialogFormValues } from "~/components/SkillBrowser/types";

import {
  CreateUserSkill_Mutation,
  UpdateUserSkill_Mutation,
} from "../operations";

export type FormValues = { userSkills: SkillBrowserDialogFormValues[] };

interface UpdateSkillShowcaseProps {
  userId: Scalars["UUID"];
  skills: Skill[];
  userSkills: UserSkill[];
  initialSkills: FormValues;
  maxItems: number;
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
  onAddition: (initialSkillRanking: string[], newSkillId: string) => void;
}

const UpdateSkillShowcase = ({
  userId,
  skills,
  userSkills,
  initialSkills,
  maxItems,
  crumbs,
  pageInfo,
  handleSubmit,
  onAddition,
}: UpdateSkillShowcaseProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const addId = React.useId();

  const [, executeCreateMutation] = useMutation(CreateUserSkill_Mutation);
  const [, executeUpdateMutation] = useMutation(UpdateUserSkill_Mutation);

  const methods = useForm<FormValues>({
    defaultValues: initialSkills,
  });
  const { control, watch, formState } = methods;
  const { remove, move, fields, append } = useFieldArray({
    control,
    name: "userSkills",
  });
  const watchedSkills = watch("userSkills");

  const existingSkillsRanking = initialSkills.userSkills.map(
    (userSkill) => userSkill.skill,
  );
  const existingSkillsRankingFiltered = unpackMaybes(existingSkillsRanking);

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
          id: "kfjmTt",
          description:
            "Message displayed to user after skill fails to be updated",
        }),
    );
  };

  const handleSave = async (values: SkillBrowserDialogFormValues) => {
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
          handleSuccess();
          if (res.data?.updateUserSkill?.skill.id) {
            append({
              skill: res.data.updateUserSkill.skill.id,
              skillLevel: res.data.updateUserSkill.skillLevel ?? undefined,
            });
            // having claimed a user skill in the modal and the mutation successful, update the ranking
            onAddition(
              existingSkillsRankingFiltered,
              res.data.updateUserSkill.skill.id,
            );
          }
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
          handleSuccess();
          if (res.data?.createUserSkill?.skill.id) {
            append({
              skill: res.data.createUserSkill.skill.id,
              skillLevel: res.data.createUserSkill.skillLevel ?? undefined,
            });
            onAddition(
              existingSkillsRankingFiltered,
              res.data.createUserSkill.skill.id,
            );
          }
        })
        .catch(() => handleError());
    }
  };

  const canAdd = fields.length < pageInfo.maxSkillCount;
  const getSkill = (skillId: string | undefined) =>
    skills.find((skill) => skill.id === skillId);

  const triggerProps = canAdd
    ? {
        id: addId,
        mode: "placeholder" as ButtonLinkMode,
        label: intl.formatMessage(
          {
            defaultMessage: "Add a new item ({numOfSkills}/{maxSkills})",
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
        mode: "placeholder" as ButtonLinkMode,
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
      };

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
                      name="userSkills"
                      total={fields.length}
                      maxItems={maxItems}
                      showAdd={canAdd}
                      showApproachingLimit
                      showUnsavedChanges
                      customButton={{
                        id: addId,
                        button: (
                          <SkillBrowserDialog
                            inLibrary={userSkills
                              .map((userSkill) => userSkill.skill)
                              .filter(
                                (skill) =>
                                  !existingSkillsRankingFiltered.includes(
                                    skill.id,
                                  ),
                              )}
                            trigger={triggerProps}
                            context="showcase"
                            skills={skills.filter(
                              (skill) =>
                                !existingSkillsRankingFiltered.includes(
                                  skill.id,
                                ),
                            )}
                            onSave={handleSave}
                            showCategory={false}
                            noToast
                          />
                        ),
                      }}
                    >
                      {fields.map((item, index) => (
                        <Repeater.Fieldset
                          key={item.id}
                          name="userSkills"
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
                                getSkill(item.skill)?.description ?? undefined,
                                intl,
                              )}
                            </p>
                          </div>
                        </Repeater.Fieldset>
                      ))}
                    </Repeater.Root>

                    <Separator
                      orientation="horizontal"
                      decorative
                      data-h2-margin="base(x2, 0, x2, 0)"
                      data-h2-background-color="base(gray)"
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
                        disabled={formState.isSubmitting}
                      />
                      <Button
                        type="button"
                        mode="inline"
                        color="secondary"
                        onClick={() => {
                          navigate(pageInfo.returnPath);
                        }}
                      >
                        {intl.formatMessage(commonMessages.cancel)}
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
