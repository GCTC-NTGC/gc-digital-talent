import React from "react";
import { useIntl } from "react-intl";
import SparklesIcon from "@heroicons/react/20/solid/SparklesIcon";

import {
  Accordion,
  StandardAccordionHeader,
  Heading,
  Link,
} from "@gc-digital-talent/ui";
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

import { getLocalizedName } from "@gc-digital-talent/i18n";
import SkillTree from "./components/SkillTree";
import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";
import SkillDescriptionAccordion from "./components/SkillDescriptionAccordion";

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
  const categorizedOptionalSkills = categorizeSkill(
    application.poolAdvertisement?.nonessentialSkills,
  );

  const optionalDisclaimer = intl.formatMessage({
    defaultMessage:
      "All the following skills are optionally beneficial to the role, and demonstrating them might benefit you when being considered.",
    id: "LazN9T",
    description: "Instructions on  optional skills for a pool advertisement",
  });

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
                showDisclaimer
              />
            ),
          )}
        </>
      ) : null}
      {categorizedOptionalSkills[SkillCategory.Technical]?.length ? (
        <>
          <Heading level="h3" size="h5">
            {intl.formatMessage({
              defaultMessage: "Options technical skills",
              id: "csLwyM",
              description: "Heading for optional technical skills section",
            })}
          </Heading>
          <p>{optionalDisclaimer}</p>
          {categorizedOptionalSkills[SkillCategory.Technical].map(
            (optionalTechnicalSkill) => (
              <SkillTree
                key={optionalTechnicalSkill.id}
                skill={optionalTechnicalSkill}
                experiences={experiences}
              />
            ),
          )}
        </>
      ) : null}
      {categorizedEssentialSkills[SkillCategory.Behavioural]?.length ? (
        <>
          <Heading level="h3" size="h5">
            {intl.formatMessage({
              defaultMessage: "Required behavioural skills",
              id: "zv4Vyd",
              description: "Heading for required behavioural skills section",
            })}
          </Heading>
          <p data-h2-margin-bottom="base(x1)">
            {intl.formatMessage({
              defaultMessage:
                "The following skills are required for this role, but aren't required as a part of this application. <strong>They will be reviewed during the assessment process should your application be accepted</strong>.",
              id: "fA79sM",
              description: "Information regarding required behavioural skills",
            })}
          </p>
          <SkillDescriptionAccordion
            skills={categorizedEssentialSkills[SkillCategory.Behavioural]}
          />
        </>
      ) : null}
      {categorizedOptionalSkills[SkillCategory.Behavioural]?.length ? (
        <>
          <Heading level="h3" size="h5">
            {intl.formatMessage({
              defaultMessage: "Optional behavioural skills",
              id: "BqeIyx",
              description: "Heading for optional behavioural skills section",
            })}
          </Heading>
          <p data-h2-margin-bottom="base(x1)">{optionalDisclaimer}</p>
          <SkillDescriptionAccordion
            skills={categorizedOptionalSkills[SkillCategory.Behavioural]}
          />
        </>
      ) : null}
    </>
  );
};

const ApplicationSkillsPage = () => (
  <ApplicationApi PageComponent={ApplicationSkills} />
);

export default ApplicationSkillsPage;
