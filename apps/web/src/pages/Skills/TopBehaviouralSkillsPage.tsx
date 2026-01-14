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

const MAX_SKILL_COUNT = 5;

const TopBehaviouralSkillsPage_Query = graphql(/* GraphQL */ `
  query TopBehaviouralSkillsPageQuery {
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

interface TopBehaviouralSkillsProps {
  skills: Skill[];
  userSkills: UpdateSkillShowcaseUserSkillFragmentType[];
  initialSkills: FormValues;
  stale: boolean;
}

const TopBehaviouralSkills = ({
  skills,
  userSkills,
  initialSkills,
  stale,
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
        label: pageTitle,
        url: paths.topBehaviouralSkills(),
      },
    ],
  });

  const pageDescription = intl.formatMessage({
    defaultMessage:
      "Highlight up to 5 behavioural skills that showcase your strengths.",
    description: "Page description for the top behavioural skills page",
    id: "Zzh9Xs",
  });

  const pageBlurb = intl.formatMessage({
    defaultMessage:
      "Show managers the 5 strongest behavioural skills that make you an awesome member of the team. You can edit them at any time and are free to order the skills however you like. Skills that you add here that aren't already in your portfolio will be added for you automatically.",
    description: "Page blurb for the top behavioural skills page",
    id: "G6LNg7",
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
        topBehaviouralSkillsRanked: [
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
        topBehaviouralSkillsRanked: mergedSkillIds,
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
      userSkillRanking="topBehaviouralSkillsRanked"
      disabled={stale}
    />
  );
};

const context: Partial<OperationContext> = {
  additionalTypenames: ["UserSkill"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
};

const TopBehaviouralSkillsPage = () => {
  const [{ data, fetching, error, stale }] = useQuery({
    query: TopBehaviouralSkillsPage_Query,
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
  const behaviouralSkills = skills
    ? skills.filter(
        (skill) => skill.category.value === SkillCategory.Behavioural,
      )
    : [];

  const initialSkills: FormValues = {
    userSkills:
      userSkills
        ?.filter(
          (userSkill) =>
            userSkill.skill.category.value === SkillCategory.Behavioural &&
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
      <TopBehaviouralSkills
        skills={behaviouralSkills ?? []}
        userSkills={userSkills ?? []}
        initialSkills={initialSkills ?? []}
        stale={stale}
      />
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <TopBehaviouralSkillsPage />
  </RequireAuth>
);

Component.displayName = "TopBehaviouralSkillsPage";

export default Component;
