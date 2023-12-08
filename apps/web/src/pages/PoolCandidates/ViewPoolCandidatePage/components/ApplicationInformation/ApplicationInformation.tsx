import React from "react";
import { useIntl } from "react-intl";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";

import {
  Pool,
  PoolCandidate,
  SkillCategory,
  User,
} from "@gc-digital-talent/graphql";
import { Accordion, Button, Heading } from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import DiversityEquityInclusionDisplay from "~/components/Profile/components/DiversityEquityInclusion/Display";
import GovernmentInformationDisplay from "~/components/Profile/components/GovernmentInformation/Display";
import LanguageProfileDisplay from "~/components/Profile/components/LanguageProfile/Display";
import PersonalInformationDisplay from "~/components/Profile/components/PersonalInformation/Display";
import WorkPreferencesDisplay from "~/components/Profile/components/WorkPreferences/Display";
import { categorizeSkill } from "~/utils/skillUtils";
import applicationMessages from "~/messages/applicationMessages";

import ApplicationPrintButton from "../ApplicationPrintButton/ApplicationPrintButton";
import { SECTION_KEY } from "./types";
import EducationRequirementsDisplay from "./EducationRequirementsDisplay";
import SkillDisplay from "./SkillDisplay";

interface ApplicationInformationProps {
  pool: Pool;
  application?: PoolCandidate | null;
  snapshot: User;
}

const ApplicationInformation = ({
  pool,
  snapshot,
  application,
}: ApplicationInformationProps) => {
  const intl = useIntl();
  const [openSections, setOpenSections] = React.useState<string[]>([]);
  const hasOpenSections = openSections.length > 0;

  const toggleSections = () => {
    const newValue = hasOpenSections ? [] : Object.values(SECTION_KEY);
    setOpenSections(newValue);
  };

  const screeningQuestionResponses = unpackMaybes(
    application?.screeningQuestionResponses ?? [],
  );

  const categorizedEssentialSkills = categorizeSkill(pool.essentialSkills);
  const technicalEssentialSkills = unpackMaybes(
    categorizedEssentialSkills[SkillCategory.Technical],
  );
  const categorizedAssetSkills = categorizeSkill(pool.nonessentialSkills);
  const technicalAssetSkills = unpackMaybes(
    categorizedAssetSkills[SkillCategory.Technical],
  );

  const experiences = unpackMaybes(snapshot.experiences);

  return (
    <>
      <div
        data-h2-display="base(flex)"
        data-h2-align-items="l-tablet(flex-end)"
        data-h2-flex-direction="base(column) l-tablet(row)"
        data-h2-justify-content="base(space-between)"
        data-h2-gap="base(x.5 0) l-tablet(0 x.5)"
        data-h2-margin-bottom="base(x1)"
      >
        {/** Note: Change to `margin-bottom` when application screening is added  */}
        <Heading Icon={UserCircleIcon} color="primary" data-h2-margin="base(0)">
          {intl.formatMessage({
            defaultMessage: "Application information",
            id: "R/z71a",
            description: "Heading for the information of an application",
          })}
        </Heading>
        <div
          data-h2-display="base(flex)"
          data-h2-align-items="base(flex-end)"
          data-h2-gap="base(0 x.5)"
        >
          {application && (
            <ApplicationPrintButton
              mode="inline"
              color="secondary"
              pool={application.pool}
              user={snapshot}
            />
          )}
          <Button mode="inline" color="secondary" onClick={toggleSections}>
            {hasOpenSections
              ? intl.formatMessage({
                  defaultMessage:
                    "Collapse all <hidden>application information</hidden>sections",
                  id: "OoZdlh",
                  description:
                    "Button text to close all application information accordions",
                })
              : intl.formatMessage({
                  defaultMessage:
                    "Expand all <hidden>application information</hidden>sections",
                  id: "DC2A59",
                  description:
                    "Button text to open all application information accordions",
                })}
          </Button>
        </div>
      </div>
      <p data-h2-margin="base(x1 0)">
        {intl.formatMessage(
          {
            defaultMessage:
              "This is the application information submitted on {submittedAt}. You can find the applicant's full career history in the timeline section.",
            id: "FNvBxZ",
            description: "Lead-in text for application information",
          },
          {
            submittedAt: application?.submittedAt
              ? formatDate({
                  date: parseDateTimeUtc(application.submittedAt),
                  formatString: "PPPP",
                  intl,
                })
              : intl.formatMessage(commonMessages.notAvailable),
          },
        )}
      </p>
      <Accordion.Root
        mode="card"
        type="multiple"
        value={openSections}
        onValueChange={setOpenSections}
      >
        <Accordion.Item value={SECTION_KEY.CONTACT}>
          <Accordion.Trigger>
            {intl.formatMessage({
              defaultMessage: "Personal and contact information",
              id: "0lUoqK",
              description:
                "Title for the personal and contact information snapshot section",
            })}
          </Accordion.Trigger>
          <Accordion.Content>
            <PersonalInformationDisplay user={snapshot} />
          </Accordion.Content>
        </Accordion.Item>
        {screeningQuestionResponses.length > 0 ? (
          <Accordion.Item value={SECTION_KEY.SCREENING}>
            <Accordion.Trigger>
              {intl.formatMessage({
                defaultMessage: "Screening questions",
                id: "mqWvWR",
                description:
                  "Title for the screening questions snapshot section",
              })}
            </Accordion.Trigger>
            <Accordion.Content>
              {screeningQuestionResponses.map((response, index) => (
                <React.Fragment key={response.id}>
                  <Heading
                    level="h4"
                    size="h6"
                    data-h2-font-size="base(body)"
                    {...(index === 0 && {
                      "data-h2-margin-top": "base(0)",
                    })}
                  >
                    {getLocalizedName(
                      response.screeningQuestion?.question,
                      intl,
                    )}
                  </Heading>
                  <p>{response.answer}</p>
                </React.Fragment>
              ))}
            </Accordion.Content>
          </Accordion.Item>
        ) : null}
        <Accordion.Item value={SECTION_KEY.EDUCATION}>
          <Accordion.Trigger>
            {intl.formatMessage({
              defaultMessage: "Minimum experience or equivalent education",
              id: "Fbh/MK",
              description:
                "Title for the minimum experience or equivalent education snapshot section.",
            })}
          </Accordion.Trigger>
          <Accordion.Content>
            <EducationRequirementsDisplay application={application} />
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value={SECTION_KEY.ESSENTIAL}>
          <Accordion.Trigger>
            {intl.formatMessage({
              defaultMessage: "Essential skills",
              id: "w7E0He",
              description: "Title for the required skills snapshot section",
            })}
          </Accordion.Trigger>
          <Accordion.Content>
            {technicalEssentialSkills.length > 0 ? (
              <SkillDisplay
                skills={technicalEssentialSkills}
                experiences={experiences}
              />
            ) : (
              <p>{intl.formatMessage(commonMessages.notAvailable)}</p>
            )}
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value={SECTION_KEY.ASSET}>
          <Accordion.Trigger>
            {intl.formatMessage({
              defaultMessage: "Asset skills",
              id: "Xpo+u6",
              description: "Title for the optional skills snapshot section",
            })}
          </Accordion.Trigger>
          <Accordion.Content>
            {technicalAssetSkills.length > 0 ? (
              <SkillDisplay
                skills={technicalAssetSkills}
                experiences={experiences}
              />
            ) : (
              <p>{intl.formatMessage(commonMessages.notAvailable)}</p>
            )}
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value={SECTION_KEY.LANGUAGE}>
          <Accordion.Trigger>
            {intl.formatMessage({
              defaultMessage: "Language profile",
              id: "KsS1Py",
              description: "Title for the language profile snapshot section",
            })}
          </Accordion.Trigger>
          <Accordion.Content>
            <LanguageProfileDisplay user={snapshot} />
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value={SECTION_KEY.WORK_PREF}>
          <Accordion.Trigger>
            {intl.formatMessage({
              defaultMessage: "Work preferences",
              id: "s7F24X",
              description: "Title for the work preferences snapshot section",
            })}
          </Accordion.Trigger>
          <Accordion.Content>
            <WorkPreferencesDisplay user={snapshot} />
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value={SECTION_KEY.GOV_INFO}>
          <Accordion.Trigger>
            {intl.formatMessage({
              defaultMessage: "Government employee information",
              id: "nEVNHp",
              description:
                "Title for the government employee information snapshot section",
            })}
          </Accordion.Trigger>
          <Accordion.Content>
            <GovernmentInformationDisplay user={snapshot} />
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value={SECTION_KEY.DEI}>
          <Accordion.Trigger>
            {intl.formatMessage({
              defaultMessage: "Diversity, equity, and inclusion",
              id: "zLeH2i",
              description:
                "Title for the diversity, equity, and inclusion snapshot section",
            })}
          </Accordion.Trigger>
          <Accordion.Content>
            <DiversityEquityInclusionDisplay user={snapshot} />
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value={SECTION_KEY.SIGNATURE}>
          <Accordion.Trigger>
            {intl.formatMessage({
              defaultMessage: "Signature",
              id: "1ZZgbi",
              description: "Title for the signature snapshot section",
            })}
          </Accordion.Trigger>
          <Accordion.Content>
            <p data-h2-margin-bottom="base(x1)">
              {intl.formatMessage({
                defaultMessage: "The applicant has confirmed that:",
                id: "iYD0eJ",
                description:
                  "Lead-in for list of application confirmation list",
              })}
            </p>
            <ul>
              <li>
                {intl.formatMessage(applicationMessages.confirmationReview)}
              </li>
              <li>
                {intl.formatMessage(applicationMessages.confirmationCommunity)}
              </li>
              <li>
                {intl.formatMessage(applicationMessages.confirmationTrue)}
              </li>
            </ul>
            <Heading level="h4" size="h6" data-h2-font-size="base(body)">
              {intl.formatMessage({
                defaultMessage: "Signed",
                id: "fEcEv3",
                description:
                  "Heading for the application snapshot users signature",
              })}
            </Heading>
            <p>
              {application?.signature ||
                intl.formatMessage(commonMessages.notProvided)}
            </p>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </>
  );
};

export default ApplicationInformation;
