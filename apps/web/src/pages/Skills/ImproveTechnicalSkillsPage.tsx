import React from "react";
import { useIntl } from "react-intl";
import { OperationContext, useMutation, useQuery } from "urql";
import StarIcon from "@heroicons/react/24/outline/StarIcon";

import { Pending } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers/src/utils/util";
import { useAuthorization } from "@gc-digital-talent/auth";
import { toast } from "@gc-digital-talent/toast";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { Skill, SkillCategory, UserSkill } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";

import UpdateSkillShowcase, {
  FormValues,
} from "./components/UpdateSkillShowcase";
import {
  UpdateUserSkillRankings_Mutation,
  UserSkills_Query,
} from "./operations";

const MAX_SKILL_COUNT = 5;

interface ImproveTechnicalSkillsProps {
  skills: Skill[];
  userSkills: UserSkill[];
  initialSkills: FormValues;
}

const ImproveTechnicalSkills = ({
  skills,
  userSkills,
  initialSkills,
}: ImproveTechnicalSkillsProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const returnPath = paths.skillShowcase();
  const { userAuthInfo } = useAuthorization();
  const [, executeMutation] = useMutation(UpdateUserSkillRankings_Mutation);

  const pageId = "improve-technical-skills";

  const pageTitle = intl.formatMessage({
    defaultMessage: "5 technical skills you'd like to train",
    description: "Page title for the improve technical skills page",
    id: "aIMh6f",
  });

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
      label: intl.formatMessage(navigationMessages.profileAndApplications),
      url: paths.profileAndApplications(),
    },
    {
      label: intl.formatMessage(navigationMessages.skillShowcase),
      url: paths.skillShowcase(),
    },
    {
      label: pageTitle,
      url: paths.improveTechnicalSkills(),
    },
  ];

  const pageDescription = intl.formatMessage({
    defaultMessage:
      "Help managers understand your potential technical skill learning opportunities.",
    description: "Page description for the improve technical skills page",
    id: "2f1kN5",
  });

  const pageBlurb = intl.formatMessage({
    defaultMessage:
      "Help managers understand which technical skills you'd be interested in training for. You can edit this showcase at any time and are free to order the skills however you like. Skills that you add to the showcase that aren't already in your library will be added for you automatically.",
    description: "Page blurb for the improve technical skills page",
    id: "Lb3ppn",
  });

  const pageInfo = {
    id: pageId,
    title: pageTitle,
    description: pageDescription,
    icon: StarIcon,
    blurb: pageBlurb,
    maxSkillCount: MAX_SKILL_COUNT,
    returnPath,
  };

  const handleUpdateUserSkillRankings = (
    formValues: FormValues,
  ): Promise<void> =>
    new Promise((resolve, reject) => {
      executeMutation({
        userId: userAuthInfo?.id,
        userSkillRanking: {
          improveTechnicalSkillsRanked: [
            ...formValues.userSkills.map((userSkill) => userSkill.skill),
          ],
        },
      }).then((res) => {
        if (res.data?.updateUserSkillRankings) {
          resolve();
        }
        reject();
      });
    });

  const updateRankingsAfterAddingSkill = (
    initialSkillRanking: string[],
    newSkillId: string,
  ) => {
    const mergedSkillIds = [...initialSkillRanking, newSkillId];
    executeMutation({
      userId: userAuthInfo?.id,
      userSkillRanking: {
        improveTechnicalSkillsRanked: mergedSkillIds,
      },
    })
      .then((res) => {
        if (res.data) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Successfully updated improve technical skills",
              id: "z5f+GT",
              description:
                "Success message displayed after updating improve technical skills",
            }),
          );
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating improve technical skills failed",
            id: "dpvwTf",
            description:
              "Message displayed to user after improve technical skills fails to update",
          }),
        );
      });
  };

  return (
    <UpdateSkillShowcase
      userId={userAuthInfo?.id}
      crumbs={crumbs}
      pageInfo={pageInfo}
      allSkills={skills}
      allUserSkills={userSkills}
      initialData={initialSkills}
      handleSubmit={handleUpdateUserSkillRankings}
      onAddition={updateRankingsAfterAddingSkill}
      maxItems={MAX_SKILL_COUNT}
    />
  );
};

const context: Partial<OperationContext> = {
  additionalTypenames: ["UserSkill"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
};

const ImproveTechnicalSkillsPage = () => {
  const [{ data, fetching, error }] = useQuery({
    query: UserSkills_Query,
    context,
  });

  const userSkills = data?.me?.userSkills?.filter(notEmpty);
  const technicalSkills = data?.skills
    .filter(notEmpty)
    .filter((skill) => skill.category === SkillCategory.Technical);

  const initialSkills: FormValues = {
    userSkills:
      userSkills
        ?.filter(
          (userSkill) =>
            userSkill.skill.category === SkillCategory.Technical &&
            userSkill.improveSkillsRank,
        )
        .sort(
          (a, b) =>
            (a.improveSkillsRank ?? 0) > (b.improveSkillsRank ?? 0) ? 1 : -1, // sort initial user skills
        )
        .map((userSkill) => {
          return {
            skill: userSkill.skill.id,
            skillLevel: userSkill.skillLevel ?? undefined,
            whenSkillUsed: userSkill.whenSkillUsed ?? undefined,
            category: userSkill.skill.category,
          };
        }) ?? [],
  };

  return (
    <Pending fetching={fetching} error={error}>
      <ImproveTechnicalSkills
        skills={technicalSkills ?? []}
        userSkills={userSkills ?? []}
        initialSkills={initialSkills ?? []}
      />
    </Pending>
  );
};

export default ImproveTechnicalSkillsPage;
