import React from "react";
import { useIntl } from "react-intl";
import SparklesIcon from "@heroicons/react/20/solid/SparklesIcon";

import { Heading, Link } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  Applicant,
  ApplicationStep,
  PoolAdvertisement,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import { GetApplicationPageInfo } from "~/types/poolCandidate";
import { skillRequirementsIsIncomplete } from "~/validators/profile";
import { categorizeSkill } from "~/utils/skillUtils";
import { SkillCategory } from "~/api/generated";

import SkillTree from "./components/SkillTree";
import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";

export const getPageInfo: GetApplicationPageInfo = ({
  application,
  paths,
  intl,
}) => {
  const path = paths.applicationSkills(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "Skill requirements",
      id: "AtGnJW",
      description: "Page title for the application skills page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage:
        "Tell us about how you meet the skill requirements for this opportunity.",
      id: "+vHVZ2",
      description: "Subtitle for the application skills page",
    }),
    icon: SparklesIcon,
    crumbs: [
      {
        url: path,
        label: intl.formatMessage({
          defaultMessage: "Step 5",
          id: "/tscgU",
          description: "Breadcrumb link text for the application skills page",
        }),
      },
    ],
    link: {
      url: path,
    },
    prerequisites: [
      ApplicationStep.Welcome,
      ApplicationStep.ReviewYourProfile,
      ApplicationStep.ReviewYourResume,
      ApplicationStep.EducationRequirements,
    ],
    introUrl: paths.applicationSkillsIntro(application.id),
    stepSubmitted: ApplicationStep.SkillRequirements,
    hasError: (applicant: Applicant, poolAdvertisement: PoolAdvertisement) => {
      return skillRequirementsIsIncomplete(applicant, poolAdvertisement);
    },
  };
};

const ApplicationSkills = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const pageInfo = getPageInfo({ intl, paths, application });
  const instructionsPath = paths.applicationSkillsIntro(application.id);
  const experiences = application.user?.experiences?.filter(notEmpty) || [];
  const categorizedEssentialSkills = categorizeSkill(
    application.poolAdvertisement?.essentialSkills,
  );

  return (
    <>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) p-tablet(row)"
        data-h2-justify-content="base(space-between)"
        data-h2-align-items="base(flex-start) p-tablet(center)"
      >
        <Heading data-h2-margin-top="base(0)">{pageInfo.title}</Heading>
        <Link
          href={instructionsPath}
          type="button"
          mode="inline"
          color="secondary"
        >
          {intl.formatMessage({
            defaultMessage: "Review instructions",
            id: "VRxiNC",
            description: "A link back to the instructions for this section",
          })}
        </Link>
      </div>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Now let's link your experiences to the skills that are critical for this role. This is the most important step in the application process. Similarly to the minimum experience and education step, if you need to add or change a resume experience, you can do so by returning to the resume step in the application.",
          id: "slEfHC",
          description:
            "Lead in paragraph for adding experiences to a users skills",
        })}
      </p>
      {categorizedEssentialSkills[SkillCategory.Technical]?.length ? (
        <>
          <Heading level="h3" size="h5">
            {intl.formatMessage({
              defaultMessage: "Required technical skills",
              id: "OCrKtT",
              description: "Heading for required technical skills section",
            })}
          </Heading>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Please ensure that you provide at least 1 résumé experience for each required skill, along with a concise description of why that experience highlights your abilities in that skill.",
              id: "oeZv71",
              description: "Instructions on requiring information for skills",
            })}
          </p>
          {categorizedEssentialSkills[SkillCategory.Technical].map(
            (requiredTechnicalSkill) => (
              <SkillTree
                key={requiredTechnicalSkill.id}
                skill={requiredTechnicalSkill}
                experiences={experiences}
              />
            ),
          )}
        </>
      ) : null}
    </>
  );
};

const ApplicationSkillsPage = () => (
  <ApplicationApi PageComponent={ApplicationSkills} />
);

export default ApplicationSkillsPage;
