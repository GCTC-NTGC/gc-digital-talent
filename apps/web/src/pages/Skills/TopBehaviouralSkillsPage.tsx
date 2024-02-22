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

interface TopBehaviouralSkillsProps {
  skills: Skill[];
  userSkills: UserSkill[];
  initialSkills: FormValues;
}

const TopBehaviouralSkills = ({
  skills,
  userSkills,
  initialSkills,
}: TopBehaviouralSkillsProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const returnPath = paths.skillShowcase();
  const { userAuthInfo } = useAuthorization();
  const [, executeMutation] = useMutation(UpdateUserSkillRankings_Mutation);

  const pageId = "top-behavioural-skills";

  const pageTitle = intl.formatMessage({
    defaultMessage: "Your top 5 behavioural skills",
    description: "Page title for the top behavioural skills page",
    id: "6IitrN",
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
      url: paths.topBehaviouralSkills(),
    },
  ];

  const pageDescription = intl.formatMessage({
    defaultMessage:
      "Highlight up to 5 behavioural skills that showcase your strengths.",
    description: "Page description for the top behavioural skills page",
    id: "Zzh9Xs",
  });

  const pageBlurb = intl.formatMessage({
    defaultMessage:
      "Show managers the 5 strongest behavioural skills that make you an awesome member of the team. You can edit this showcase at any time and are free to order the skills however you like. Skills that you add to the showcase that aren't already in your library will be added for you automatically.",
    description: "Page blurb for the top behavioural skills page",
    id: "OY6KVG",
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
          topBehaviouralSkillsRanked: [
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
        topBehaviouralSkillsRanked: mergedSkillIds,
      },
    })
      .then((res) => {
        if (res.data) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Successfully updated top behavioural skills",
              id: "GfjNqa",
              description:
                "Success message displayed after updating top behavioural skills",
            }),
          );
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating top behavioural skills failed",
            id: "+dmNpa",
            description:
              "Message displayed to user after top behavioural skills fails to update",
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

const TopBehaviouralSkillsPage = () => {
  const [{ data, fetching, error }] = useQuery({
    query: UserSkills_Query,
    context,
  });
  const userSkills = data?.me?.userSkills?.filter(notEmpty);
  const behaviouralSkills = data?.skills
    .filter(notEmpty)
    .filter((skill) => skill.category === SkillCategory.Behavioural);

  const initialSkills: FormValues = {
    userSkills:
      userSkills
        ?.filter(
          (userSkill) =>
            userSkill.skill.category === SkillCategory.Behavioural &&
            userSkill.topSkillsRank,
        )
        .sort(
          (a, b) => ((a.topSkillsRank ?? 0) > (b.topSkillsRank ?? 0) ? 1 : -1), // sort initial user skills
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
      <TopBehaviouralSkills
        skills={behaviouralSkills ?? []}
        userSkills={userSkills ?? []}
        initialSkills={initialSkills ?? []}
      />
    </Pending>
  );
};

export default TopBehaviouralSkillsPage;
