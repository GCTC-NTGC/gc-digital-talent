import { useIntl } from "react-intl";
import { OperationContext, useMutation, useQuery } from "urql";
import StarIcon from "@heroicons/react/24/outline/StarIcon";

import { Pending } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { Skill, SkillCategory, UserSkill } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import UpdateSkillShowcase, {
  FormValues,
} from "./components/UpdateSkillShowcase";
import {
  UpdateUserSkillRankings_Mutation,
  UserSkills_Query,
} from "./operations";

const MAX_SKILL_COUNT = 3;

interface ImproveBehaviouralSkillsProps {
  skills: Skill[];
  userSkills: UserSkill[];
  initialSkills: FormValues;
  stale: boolean;
}

const ImproveBehaviouralSkills = ({
  skills,
  userSkills,
  initialSkills,
  stale,
}: ImproveBehaviouralSkillsProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const returnPath = paths.skillShowcase();
  const { userAuthInfo } = useAuthorization();
  const [, executeUpdateUserSkillRankingsMutation] = useMutation(
    UpdateUserSkillRankings_Mutation,
  );

  const pageId = "improve-behavioural-skills";

  const pageTitle = intl.formatMessage({
    defaultMessage: "3 behavioural skills you'd like to improve",
    description: "Page title for the improve behavioural skills page",
    id: "6+TjHb",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
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
        url: paths.improveBehaviouralSkills(),
      },
    ],
  });

  const pageDescription = intl.formatMessage({
    defaultMessage:
      "Help managers understand your potential behavioural skill learning opportunities.",
    description: "Page description for the improve behavioural skills page",
    id: "EBE5Gv",
  });

  const pageBlurb = intl.formatMessage({
    defaultMessage:
      "Help managers understand where you'd like to improve behavioural skills. You can edit this showcase at any time and are free to order the skills however you like. Skills that you add to the showcase that aren't already in your library will be added for you automatically. ",
    description: "Page blurb for the improve behavioural skills page",
    id: "dSfDu1",
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
    executeUpdateUserSkillRankingsMutation({
      userId: userAuthInfo?.id,
      userSkillRanking: {
        improveBehaviouralSkillsRanked: [
          ...formValues.userSkills.map((userSkill) => userSkill.skill),
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
    return executeUpdateUserSkillRankingsMutation({
      userId: userAuthInfo?.id,
      userSkillRanking: {
        improveBehaviouralSkillsRanked: mergedSkillIds,
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
      userId={userAuthInfo?.id}
      crumbs={crumbs}
      pageInfo={pageInfo}
      allSkills={skills}
      allUserSkills={userSkills}
      initialData={initialSkills}
      handleSubmit={handleUpdateUserSkillRankings}
      onAddition={updateRankingsAfterAddingSkill}
      maxItems={MAX_SKILL_COUNT}
      userSkillRanking="improveBehaviouralSkillsRanked"
      disabled={stale}
    />
  );
};

const context: Partial<OperationContext> = {
  additionalTypenames: ["UserSkill"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
};

const ImproveBehaviouralSkillsPage = () => {
  const [{ data, fetching, error, stale }] = useQuery({
    query: UserSkills_Query,
    context,
  });

  const userSkills = data?.me?.userSkills?.filter(notEmpty);
  const behaviouralSkills = data?.skills
    .filter(notEmpty)
    .filter((skill) => skill.category.value === SkillCategory.Behavioural);

  const initialSkills: FormValues = {
    userSkills:
      userSkills
        ?.filter(
          (userSkill) =>
            userSkill.skill.category.value === SkillCategory.Behavioural &&
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
            category: userSkill.skill.category.value,
          };
        }) ?? [],
  };

  return (
    <Pending fetching={fetching} error={error}>
      <ImproveBehaviouralSkills
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
    <ImproveBehaviouralSkillsPage />
  </RequireAuth>
);

Component.displayName = "ImproveBehaviouralSkillsPage";

export default ImproveBehaviouralSkillsPage;
