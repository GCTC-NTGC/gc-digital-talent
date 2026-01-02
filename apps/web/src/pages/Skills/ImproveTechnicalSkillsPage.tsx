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

const ImproveTechnicalSkillsPage_Query = graphql(/* GraphQL */ `
  query ImproveTechnicalSkillsPageQuery {
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

interface ImproveTechnicalSkillsProps {
  skills: Skill[];
  userSkills: UpdateSkillShowcaseUserSkillFragmentType[];
  initialSkills: FormValues;
  stale: boolean;
}

const ImproveTechnicalSkills = ({
  skills,
  userSkills,
  initialSkills,
  stale,
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
        url: paths.improveTechnicalSkills(),
      },
    ],
  });

  const pageDescription = intl.formatMessage({
    defaultMessage:
      "Help managers understand your potential technical skill learning opportunities.",
    description: "Page description for the improve technical skills page",
    id: "2f1kN5",
  });

  const pageBlurb = intl.formatMessage({
    defaultMessage:
      "Help managers understand which technical skills you'd be interested in training for. You can edit them at any time and are free to order the skills however you like. Skills that you add here that aren't already in your portfolio will be added for you automatically.",
    description: "Page blurb for the improve technical skills page",
    id: "BurFgV",
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
        improveTechnicalSkillsRanked: [
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
        improveTechnicalSkillsRanked: mergedSkillIds,
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
      userSkillRanking="improveTechnicalSkillsRanked"
      disabled={stale}
    />
  );
};

const context: Partial<OperationContext> = {
  additionalTypenames: ["UserSkill"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
};

const ImproveTechnicalSkillsPage = () => {
  const [{ data, fetching, error, stale }] = useQuery({
    query: ImproveTechnicalSkillsPage_Query,
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
      <ImproveTechnicalSkills
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
    <ImproveTechnicalSkillsPage />
  </RequireAuth>
);

Component.displayName = "ImproveTechnicalSkills";

export default Component;
