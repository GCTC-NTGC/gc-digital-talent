import { useIntl } from "react-intl";
import { OperationContext, useMutation, useQuery } from "urql";
import StarIcon from "@heroicons/react/24/outline/StarIcon";

import { Pending } from "@gc-digital-talent/ui";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { navigationMessages } from "@gc-digital-talent/i18n";
import {
  graphql,
  Skill,
  SkillCategory,
  UpdateSkillShowcase_UserSkillFragment as UpdateSkillShowcaseUserSkillFragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import UpdateSkillShowcase, {
  FormValues,
  UpdateSkillShowcase_SkillFragment,
  UpdateSkillShowcase_UserSkillFragment,
} from "./components/UpdateSkillShowcase";
import { UpdateUserSkillRankings_Mutation } from "./operations";

const MAX_SKILL_COUNT = 10;

const TopTechnicalSkillsPage_Query = graphql(/* GraphQL */ `
  query TopTechnicalSkillsPageQuery {
    me {
      id
      userSkills {
        ...UpdateSkillShowcase_UserSkill
      }
    }
    skills {
      ...UpdateSkillShowcase_Skill
    }
  }
`);

interface TopTechnicalSkillsProps {
  skills: Skill[];
  userSkills: UpdateSkillShowcaseUserSkillFragmentType[];
  initialSkills: FormValues;
  stale: boolean;
}

const TopTechnicalSkills = ({
  skills,
  userSkills,
  initialSkills,
  stale,
}: TopTechnicalSkillsProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const returnPath = paths.skillShowcase();
  const { userAuthInfo } = useAuthorization();
  const [, executeMutation] = useMutation(UpdateUserSkillRankings_Mutation);

  const pageId = "top-technical-skills";

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.applicantDashboard),
        url: paths.applicantDashboard(),
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
    ],
  });

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
      "Show managers the 10 technical skills that best represent your expertise and skill set. You can edit them at any time and are free to order the skills however you like. Skills that you add here that aren't already in your portfolio will be added for you automatically.",
    description: "Page description for the top technical skills page",
    id: "1fmUv1",
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
    executeMutation({
      userId: userAuthInfo?.id ?? "",
      userSkillRanking: {
        topTechnicalSkillsRanked: [
          ...unpackMaybes(
            formValues.userSkills.map((userSkill) => userSkill.skill),
          ),
        ],
      },
    }).then((res) => {
      if (res.data?.updateUserSkillRankings) {
        return;
      }
      throw new Error("No data returned");
    });

  const updateRankingsAfterAddingSkill = (
    initialSkillRanking: string[],
    newSkillId: string,
  ): Promise<void> => {
    const mergedSkillIds = [...initialSkillRanking, newSkillId];
    return executeMutation({
      userId: userAuthInfo?.id ?? "",
      userSkillRanking: {
        topTechnicalSkillsRanked: mergedSkillIds,
      },
    }).then((res) => {
      if (res.data?.updateUserSkillRankings) {
        return;
      }
      throw new Error("No data returned");
    });
  };

  return (
    <UpdateSkillShowcase
      userId={userAuthInfo?.id ?? ""}
      crumbs={crumbs}
      pageInfo={pageInfo}
      allSkills={skills}
      allUserSkills={userSkills}
      initialData={initialSkills}
      handleSubmit={handleUpdateUserSkillRankings}
      onAddition={updateRankingsAfterAddingSkill}
      maxItems={MAX_SKILL_COUNT}
      userSkillRanking="topTechnicalSkillsRanked"
      disabled={stale}
    />
  );
};

const context: Partial<OperationContext> = {
  additionalTypenames: ["UserSkill"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
};

const TopTechnicalSkillsPage = () => {
  const [{ data, fetching, error, stale }] = useQuery({
    query: TopTechnicalSkillsPage_Query,
    context,
  });

  const userSkillsQuery = data?.me?.userSkills?.filter(notEmpty);
  const userSkills = getFragment(
    UpdateSkillShowcase_UserSkillFragment,
    userSkillsQuery,
  );

  const skillsQuery = data?.skills.filter(notEmpty);
  const skills = getFragment(
    UpdateSkillShowcase_SkillFragment,
    skillsQuery,
  )?.filter(notEmpty);
  const technicalSkills = skills
    ? skills.filter((skill) => skill.category.value === SkillCategory.Technical)
    : [];

  const initialSkills: FormValues = {
    userSkills:
      userSkills
        ?.filter(
          (userSkill) =>
            userSkill.skill.category.value === SkillCategory.Technical &&
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
            category: userSkill.skill.category.value,
          };
        }) ?? [],
  };

  return (
    <Pending fetching={fetching} error={error}>
      <TopTechnicalSkills
        skills={technicalSkills ?? []}
        userSkills={userSkills ?? []}
        initialSkills={initialSkills ?? []}
        stale={stale}
      />
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <TopTechnicalSkillsPage />
  </RequireAuth>
);

Component.displayName = "TopTechnicalSkillsPage";

export default Component;
