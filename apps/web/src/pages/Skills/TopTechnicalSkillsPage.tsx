import React from "react";
import { useIntl } from "react-intl";
import { OperationContext, useMutation, useQuery } from "urql";
import StarIcon from "@heroicons/react/24/outline/StarIcon";
import { useNavigate } from "react-router-dom";

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

const MAX_SKILL_COUNT = 10;

interface TopTechnicalSkillsProps {
  skills: Skill[];
  userSkills: UserSkill[];
  initialSkills: FormValues;
}

const TopTechnicalSkills = ({
  skills,
  userSkills,
  initialSkills,
}: TopTechnicalSkillsProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const returnPath = paths.skillShowcase();
  const { userAuthInfo } = useAuthorization();
  const [, executeMutation] = useMutation(UpdateUserSkillRankings_Mutation);

  const pageId = "top-technical-skills";

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
      label: intl.formatMessage({
        defaultMessage: "Top 10 technical skills",
        id: "Aymigb",
        description: "Title for the top 10 technical skills page",
      }),
      url: paths.topTechnicalSkills(),
    },
  ];

  const pageTitle = intl.formatMessage({
    defaultMessage: "Your top 10 technical skills",
    description: "Page title for the top technical skills page",
    id: "u5z9bK",
  });

  const pageDescription = intl.formatMessage({
    defaultMessage:
      "Highlight up to 10 technical skills that showcase your strengths.",
    description: "Page description for the top technical skills page",
    id: "1XRfYd",
  });

  const pageBlurb = intl.formatMessage({
    defaultMessage:
      "Show managers the 10 technical skills that best represent your expertise and skill set. You can edit this showcase at any time and are free to order the skills however you like. Skills that you add to the showcase that aren't already in your library will be added for you automatically.",
    description: "Page description for the top technical skills page",
    id: "e0QYLO",
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

  const handleUpdateUserSkillRankings = (formValues: FormValues) => {
    executeMutation({
      userId: userAuthInfo?.id,
      userSkillRanking: {
        topTechnicalSkillsRanked: [
          ...formValues.userSkills.map((userSkill) => userSkill.skill),
        ],
      },
    })
      .then((res) => {
        if (res.data) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Successfully updated top technical skills",
              id: "iqmE+5",
              description:
                "Success message displayed after updating top technical skills",
            }),
          );
          navigate(returnPath);
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating top technical skills failed",
            id: "D1+SmE",
            description:
              "Message displayed to user after top technical skills fails to update",
          }),
        );
      });
  };

  const updateRankingsAfterAddingSkill = (
    initialSkillRanking: string[],
    newSkillId: string,
  ) => {
    const mergedSkillIds = [...initialSkillRanking, newSkillId];
    executeMutation({
      userId: userAuthInfo?.id,
      userSkillRanking: {
        topTechnicalSkillsRanked: mergedSkillIds,
      },
    })
      .then((res) => {
        if (res.data) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Successfully updated top technical skills",
              id: "iqmE+5",
              description:
                "Success message displayed after updating top technical skills",
            }),
          );
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating top technical skills failed",
            id: "D1+SmE",
            description:
              "Message displayed to user after top technical skills fails to update",
          }),
        );
      });
  };

  return (
    <UpdateSkillShowcase
      userId={userAuthInfo?.id}
      crumbs={crumbs}
      pageInfo={pageInfo}
      skills={skills}
      userSkills={userSkills}
      initialSkills={initialSkills}
      handleSubmit={handleUpdateUserSkillRankings}
      onAddition={updateRankingsAfterAddingSkill}
      maxItems={MAX_SKILL_COUNT}
    />
  );
};

const context: Partial<OperationContext> = {
  additionalTypenames: ["UserSkill"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
};

const TopTechnicalSkillsPage = () => {
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
      <TopTechnicalSkills
        skills={technicalSkills ?? []}
        userSkills={userSkills ?? []}
        initialSkills={initialSkills ?? []}
      />
    </Pending>
  );
};

export default TopTechnicalSkillsPage;
