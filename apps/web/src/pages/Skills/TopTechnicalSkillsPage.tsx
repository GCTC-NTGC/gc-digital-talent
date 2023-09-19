import React from "react";
import { useIntl } from "react-intl";
import { OperationContext } from "urql";
import StarIcon from "@heroicons/react/24/outline/StarIcon";
import { useNavigate } from "react-router-dom";

import { Pending } from "@gc-digital-talent/ui";
import {
  Skill,
  SkillCategory,
  useUserSkillsQuery,
} from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers/src/utils/util";
import { useAuthorization } from "@gc-digital-talent/auth";
import { toast } from "@gc-digital-talent/toast";

import useRoutes from "~/hooks/useRoutes";
import { UserSkill, useUpdateUserSkillRankingsMutation } from "~/api/generated";

import UpdateSkillShowcase, {
  FormValues,
} from "./components/UpdateSkillShowcase";

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
  const { user } = useAuthorization();
  const [, executeMutation] = useUpdateUserSkillRankingsMutation();

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
      label: intl.formatMessage({
        defaultMessage: "Profile and applications",
        id: "wDc+F3",
        description: "Breadcrumb for profile and applications page.",
      }),
      url: paths.profileAndApplications(),
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Skill Showcase",
        id: "tE/sSE",
      }),
      url: paths.skillShowcase(),
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Top 10 technical skills",
        id: "v1Ya0+",
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
    description: "Page description for the skill library page",
    id: "Y3tqb0",
  });

  const pageBlurb = intl.formatMessage({
    defaultMessage:
      "Show managers the 10 technical skills that best represent your expertise and skill set. You can edit this showcase at any time and are free to order the skills however you like. Skills that you add to the showcase that aren’t already in your library will be added for you automatically.",
    description: "Page description for the skill library page",
    id: "jKVBT0",
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
      userId: user?.id,
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
              id: "k1TpzD",
              description:
                "Success message displayed after adding experience to profile",
            }),
          );
          navigate(returnPath);
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating top technical skills failed",
            id: "RsJ+xJ",
            description:
              "Message displayed to user after experience fails to be created.",
          }),
        );
      });
  };

  return (
    <UpdateSkillShowcase
      userId={user?.id}
      crumbs={crumbs}
      pageInfo={pageInfo}
      skills={skills}
      userSkills={userSkills}
      initialSkills={initialSkills}
      handleSubmit={handleUpdateUserSkillRankings}
    />
  );
};

const context: Partial<OperationContext> = {
  additionalTypenames: ["UserSkill"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
};

const TopTechnicalSkillsPage = () => {
  const [{ data, fetching, error }] = useUserSkillsQuery({ context });

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
