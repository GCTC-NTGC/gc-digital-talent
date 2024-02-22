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

import { Skill, UserSkill, Scalars } from "~/api/generated";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";
import SkillBrowserDialog from "~/components/SkillBrowser/SkillBrowserDialog";
import { FormValues as SkillBrowserDialogFormValues } from "~/components/SkillBrowser/types";

import SkillShowcaseCard from "./SkillShowcaseCard";
import {
  CreateUserSkill_Mutation,
  UpdateUserSkill_Mutation,
} from "../operations";

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
  handleSubmit: (formValues: FormValues) => void;
  onAddition: (initialSkillRanking: string[], newSkillId: string) => void;
}

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
}: UpdateSkillShowcaseProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const addId = React.useId();

  const [, executeCreateMutation] = useMutation(CreateUserSkill_Mutation);
  const [, executeUpdateMutation] = useMutation(UpdateUserSkill_Mutation);

  const thisShowcaseUserSkills = initialData.userSkills
    .filter((userSkillWithId) => !!userSkillWithId.skill)
    .map((userSkill) => ({
      id: userSkill.skill ?? "", // we just filtered out nullish, so this is just to make TS happy
      ...userSkill,
    }));

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

  const handleSave = async (values: SkillBrowserDialogFormValues) => {
    const skillId = values.skill;
    const userHasSkill =
      allUserSkills.filter((userSkill) => userSkill.skill.id === values.skill)
        .length > 0 ||
      thisShowcaseUserSkills.filter(
        (userSkill) => userSkill.skill === values.skill,
      ).length > 0;

    if (userHasSkill) {
      executeUpdateMutation({
        id: allUserSkills.find(
          (userSkill) => userSkill.skill.id === values.skill,
        )?.id,
        userSkill: {
          skillLevel: values.skillLevel,
          whenSkillUsed: values.whenSkillUsed,
        },
      })
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
            onAddition(
              existingSkillsRankingFiltered,
              res.data.createUserSkill.skill.id,
            );
          }
        })
        .catch(() => handleError());
    }
  };

  const canAdd = thisShowcaseUserSkills.length < pageInfo.maxSkillCount;

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
            numOfSkills: thisShowcaseUserSkills.length,
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
            numOfSkills: thisShowcaseUserSkills.length,
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
                <div data-h2-margin-bottom="base(1rem)">
                  <CardRepeater.Root<SkillBrowserDialogFormValues>
                    items={thisShowcaseUserSkills}
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
                        onSave={handleSave}
                        showCategory={false}
                        noToast
                      />
                    }
                    onUpdate={(items) => handleSubmit({ userSkills: items })}
                  >
                    {thisShowcaseUserSkills.map((item, index) => (
                      <SkillShowcaseCard
                        key={item.skill}
                        item={item}
                        index={index}
                        skills={allSkills}
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
