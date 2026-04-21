import { useIntl } from "react-intl";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import { useState } from "react";

import {
  getFragment,
  graphql,
  type FragmentType,
  type User,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Accordion, Button, Heading, NotFound } from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import profileMessages from "~/messages/profileMessages";
import processMessages from "~/messages/processMessages";

import { ALL_SECTIONS, SECTION_KEY } from "./types";
import PersonalInformationSnapshot from "./Sections/PersonalInformation/PersonalInformationSnapshot";
import ScreeningQuestionResponsesSnapshot from "./Sections/QuestionResponses/ScreeningQuestionResponsesSnapshot";
import GeneralQuestionResponsesSnapshot from "./Sections/QuestionResponses/GeneralQuestionResponsesSnapshot";
import EducationRequirementSnapshot from "./Sections/EducationRequirment/EducationRequirementSnapshot";
import TechnicalAssetSkillsSnapshot from "./Sections/Skills/TechnicalAssetSkillsSnapshot";
import TechnicalEssentialSkillsSnapshot from "./Sections/Skills/TechnicalEssentialSkillsSnapshot";

const ApplicationSnapshot_Fragment = graphql(/** GraphQL */ `
  fragment ApplicationSnapshot on PoolCandidate {
    profileSnapshot
    submittedAt

    ...ScreeningQuestionResponsesSnapshot
    ...GeneralQuestionResponsesSnapshot
    ...EducationRequirement_PoolCandidate
    ...TechnicalEssentialSkillsSnapshot
    ...TechnicalAssetSkillsSnapshot
  }
`);

interface ParsedSnapshot extends User {
  version?: number;
}

interface ApplicationSnapshotProps {
  query?: FragmentType<typeof ApplicationSnapshot_Fragment>;
  defaultOpen?: boolean;
}

const ApplicationSnapshot = ({
  query,
  defaultOpen,
}: ApplicationSnapshotProps) => {
  const intl = useIntl();
  const [openSections, setOpenSections] = useState<string[]>(
    defaultOpen ? ALL_SECTIONS : [],
  );
  const hasOpenSections = openSections.length > 0;

  const toggleSections = () => {
    const newValue = hasOpenSections ? [] : ALL_SECTIONS;
    setOpenSections(newValue);
  };
  const application = getFragment(ApplicationSnapshot_Fragment, query);

  const snapshot = application?.profileSnapshot
    ? (JSON.parse(String(application.profileSnapshot)) as ParsedSnapshot)
    : undefined;

  const experiences = unpackMaybes(snapshot?.experiences);

  if (!snapshot) {
    return (
      <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
        <p>
          {intl.formatMessage({
            defaultMessage: "Profile snapshot not found.",
            id: "JH2+tK",
            description: "Message displayed for profile snapshot not found.",
          })}
        </p>
      </NotFound>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <Heading
          icon={UserCircleIcon}
          color="secondary"
          className="mb-0"
          level="h2"
          size="h3"
        >
          {intl.formatMessage({
            defaultMessage: "Application information",
            id: "R/z71a",
            description: "Heading for the information of an application",
          })}
        </Heading>
        <div className="flex items-end gap-3">
          <Button mode="inline" color="primary" onClick={toggleSections}>
            {hasOpenSections
              ? intl.formatMessage({
                  defaultMessage:
                    "Collapse all<hidden> application information</hidden> sections",
                  id: "3amaVI",
                  description:
                    "Button text to close all application information accordions",
                })
              : intl.formatMessage({
                  defaultMessage:
                    "Expand all<hidden> application information</hidden> sections",
                  id: "N/OaWg",
                  description:
                    "Button text to open all application information accordions",
                })}
          </Button>
        </div>
      </div>
      <p className="my-6">
        {intl.formatMessage(
          {
            defaultMessage:
              "This is the application information submitted on {submittedAt}.",
            id: "VsHx1O",
            description:
              "Description of the information for a submitted application",
          },
          {
            submittedAt: application?.submittedAt
              ? formatDate({
                  date: parseDateTimeUtc(String(application?.submittedAt)),
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
          <Accordion.Trigger as="h3">
            {intl.formatMessage(profileMessages.personalAndContactInformation)}
          </Accordion.Trigger>
          <Accordion.Content>
            <PersonalInformationSnapshot snapshot={snapshot} />
          </Accordion.Content>

          <Accordion.Item value={SECTION_KEY.SCREENING}>
            <Accordion.Trigger as="h3">
              {intl.formatMessage(processMessages.screeningQuestions)}
            </Accordion.Trigger>
            <Accordion.Content>
              <ScreeningQuestionResponsesSnapshot query={application} />
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value={SECTION_KEY.GENERAL}>
            <Accordion.Trigger as="h3">
              {intl.formatMessage(processMessages.generalQuestions)}
            </Accordion.Trigger>
            <Accordion.Content>
              <GeneralQuestionResponsesSnapshot query={application} />
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value={SECTION_KEY.EDUCATION}>
            <Accordion.Trigger as="h3">
              {intl.formatMessage(processMessages.minEducationRequirement)}
            </Accordion.Trigger>
            <Accordion.Content>
              <EducationRequirementSnapshot
                snapshot={snapshot}
                educationRequirementQuery={application}
              />
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value={SECTION_KEY.ESSENTIAL}>
            <Accordion.Trigger as="h3">
              {intl.formatMessage({
                defaultMessage: "Essential skills",
                id: "w7E0He",
                description: "Title for the required skills snapshot section",
              })}
            </Accordion.Trigger>
            <Accordion.Content>
              <TechnicalEssentialSkillsSnapshot
                query={application}
                experiences={experiences}
              />
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value={SECTION_KEY.ASSET}>
            <Accordion.Trigger as="h3">
              {intl.formatMessage({
                defaultMessage: "Asset skills",
                id: "K0Zkdw",
                description: "Title for optional skills",
              })}
            </Accordion.Trigger>
            <Accordion.Content>
              <TechnicalAssetSkillsSnapshot
                query={application}
                experiences={experiences}
              />
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Item>
      </Accordion.Root>
    </>
  );
};

export default ApplicationSnapshot;
