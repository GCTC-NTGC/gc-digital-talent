import React from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { useMutation } from "urql";

import {
  TableOfContents,
  IconType,
  Separator,
  Button,
  ButtonLinkMode,
  CardRepeater,
} from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { UpdateUserSkillRankingsInput } from "@gc-digital-talent/graphql";

import { Skill, UserSkill, Scalars } from "~/api/generated";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";
import { FormValues as SkillBrowserDialogFormValues } from "~/components/SkillBrowser/types";
import SkillBrowserDialog from "~/components/SkillBrowser/SkillBrowserDialog";

import {
  CreateUserSkill_Mutation,
  UpdateUserSkill_Mutation,
} from "../operations";
import SkillShowcaseCard from "./SkillShowcaseCard";

export type FormValues = { userSkills: SkillBrowserDialogFormValues[] };

interface UpdateSkillShowcaseProps {
  userId: Scalars["UUID"];
  allSkills: Skill[];
  allUserSkills: UserSkill[];
  initialData: FormValues;
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
  handleSubmit: (formValues: FormValues) => Promise<void>;
  onAddition: (initialSkillRanking: string[], newSkillId: string) => void;
  userSkillRanking: keyof UpdateUserSkillRankingsInput;
  disabled: boolean;
}

// To help the URQL cache work
// Keep the reference stable.
const context = { additionalTypenames: ["UserSkill"] };

const UpdateSkillShowcase = ({
  userId,
  allSkills,
  allUserSkills,
  initialData,
  maxItems,
  crumbs,
  pageInfo,
  handleSubmit,
  onAddition,
  userSkillRanking,
  disabled,
}: UpdateSkillShowcaseProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const addId = React.useId();

  const [isBusy, setIsBusy] = React.useState<boolean>(false);

  const [, executeCreateMutation] = useMutation(CreateUserSkill_Mutation);
  const [, executeUpdateMutation] = useMutation(UpdateUserSkill_Mutation);

  const existingSkillsRanking = initialData.userSkills.map(
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

  const handleAdd = (values: SkillBrowserDialogFormValues): Promise<void> => {
    setIsBusy(true);
    const skillId = values.skill;
    const userHasSkill =
      allUserSkills.filter((userSkill) => userSkill.skill.id === values.skill)
        .length > 0 ||
      initialData.userSkills.filter(
        (userSkill) => userSkill.skill === values.skill,
      ).length > 0;

    const mutationPromise = userHasSkill
      ? executeUpdateMutation(
          {
            id: allUserSkills.find(
              (userSkill) => userSkill.skill.id === values.skill,
            )?.id,
            userSkill: {
              skillLevel: values.skillLevel,
              whenSkillUsed: values.whenSkillUsed,
            },
          },
          context,
        )
          .then((res) => {
            handleSuccess();
            if (res.data?.updateUserSkill?.skill.id) {
              // having claimed a user skill in the modal and the mutation successful, update the ranking
              onAddition(
                existingSkillsRankingFiltered,
                res.data.updateUserSkill.skill.id,
              );
            }
          })
          .catch(() => handleError())
          .finally(() => setIsBusy(false))
      : executeCreateMutation(
          {
            userId,
            skillId,
            userSkill: {
              skillLevel: values.skillLevel,
              whenSkillUsed: values.whenSkillUsed,
            },
          },
          context,
        )
          .then((res) => {
            if (res.data?.createUserSkill?.skill.id) {
              handleSuccess();
              onAddition(
                existingSkillsRankingFiltered,
                res.data.createUserSkill.skill.id,
              );
            } else {
              handleError();
            }
          })
          .catch(() => handleError())
          .finally(() => setIsBusy(false));

    return mutationPromise;
  };

  const canAdd = initialData.userSkills.length < pageInfo.maxSkillCount;

  const triggerProps = canAdd
    ? {
        id: addId,
        block: true,
        mode: "placeholder" as ButtonLinkMode,
        label: intl.formatMessage(
          {
            defaultMessage: "Add a new item ({numOfSkills}/{maxSkills})",
            id: "XzGOuV",
            description:
              "Label for skill dialog trigger on skills showcase section.",
          },
          {
            numOfSkills: initialData.userSkills.length,
            maxSkills: pageInfo.maxSkillCount,
          },
        ),
      }
    : {
        mode: "placeholder" as ButtonLinkMode,
        block: true,
        label: intl.formatMessage(
          {
            defaultMessage:
              "Delete an item to add another ({numOfSkills}/{maxSkills})",
            id: "lFFnfX",
            description:
              "Label for disabled dialog trigger on skills showcase section.",
          },
          {
            numOfSkills: initialData.userSkills.length,
            maxSkills: pageInfo.maxSkillCount,
          },
        ),
        disabled: true,
      };

  const handleUpdate = (formValues: FormValues): Promise<void> => {
    setIsBusy(true);
    const submitPromise = handleSubmit(formValues);

    submitPromise
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Successfully updated your skills!",
            id: "j7nWu/",
            description:
              "Message displayed to users when saving skills is successful.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating skill failed",
            id: "kfjmTt",
            description:
              "Message displayed to user after skill fails to be updated",
          }),
        );
      })
      .finally(() => setIsBusy(false));

    return submitPromise;
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
                <div data-h2-margin-bottom="base(1rem)">
                  <CardRepeater.Root<SkillBrowserDialogFormValues>
                    disabled={isBusy || disabled}
                    items={initialData.userSkills.map((userSkill) => ({
                      id: userSkill.skill ?? "unknown",
                      ...userSkill,
                    }))}
                    max={maxItems}
                    add={
                      <SkillBrowserDialog
                        inLibrary={allUserSkills
                          .map((userSkill) => userSkill.skill)
                          .filter(
                            (skill) =>
                              !existingSkillsRankingFiltered.includes(skill.id),
                          )}
                        trigger={triggerProps}
                        context="showcase"
                        skills={allSkills.filter(
                          (skill) =>
                            !existingSkillsRankingFiltered.includes(skill.id),
                        )}
                        onSave={handleAdd}
                        showCategory={false}
                        noToast
                      />
                    }
                    onItemsMoved={(items) =>
                      handleUpdate({ userSkills: items })
                    }
                  >
                    {initialData.userSkills.map((item, index) => (
                      <SkillShowcaseCard
                        key={item.skill}
                        item={item}
                        index={index}
                        skills={allSkills}
                        userSkillRanking={userSkillRanking}
                      />
                    ))}
                  </CardRepeater.Root>
                </div>
                <Separator />
                <div
                  data-h2-display="base(flex)"
                  data-h2-gap="base(x.5, x1)"
                  data-h2-flex-wrap="base(wrap)"
                  data-h2-flex-direction="base(column) l-tablet(row)"
                  data-h2-align-items="base(flex-start) l-tablet(center)"
                >
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
              </div>
            </TableOfContents.Section>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
    </>
  );
};

export default UpdateSkillShowcase;
