import { useState, Fragment } from "react";
import { useIntl } from "react-intl";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";

import {
  FragmentType,
  LocalizedString,
  Maybe,
  PoolCandidate,
  PoolSkillType,
  Scalars,
  SkillCategory,
  User,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { Accordion, Button, Heading } from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import {
  commonMessages,
  getLocalizedName,
  navigationMessages,
} from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import DiversityEquityInclusionDisplay from "~/components/Profile/components/DiversityEquityInclusion/Display";
import GovernmentInformationDisplay from "~/components/Profile/components/GovernmentInformation/Display";
import LanguageProfileDisplay from "~/components/Profile/components/LanguageProfile/Display";
import PersonalInformationDisplay from "~/components/Profile/components/PersonalInformation/Display";
import WorkPreferencesDisplay from "~/components/Profile/components/WorkPreferences/Display";
import { categorizeSkill, groupPoolSkillByType } from "~/utils/skillUtils";
import applicationMessages from "~/messages/applicationMessages";
import processMessages from "~/messages/processMessages";

import EducationRequirementsDisplay from "./EducationRequirementsDisplay";
import SkillDisplay from "./SkillDisplay";
import { SECTION_KEY } from "./types";
import DownloadButton from "../MoreActions/DownloadButton";

const ApplicationInformation_PoolFragment = graphql(/* GraphQL */ `
  fragment ApplicationInformation_PoolFragment on Pool {
    poolSkills {
      id
      skill {
        id
        key
        category {
          value
          label {
            en
            fr
          }
        }
        name {
          en
          fr
        }
        description {
          en
          fr
        }
      }
    }
  }
`);

// stopgap as screening questions become general questions while a new screening questions backend is set up
// preserve snapshot functionality
type ScreeningQuestion = {
  id: Scalars["ID"]["output"];
  question?: Maybe<LocalizedString>;
  sortOrder?: Maybe<Scalars["Int"]["output"]>;
};

type ScreeningQuestionResponse = {
  answer?: Maybe<Scalars["String"]["output"]>;
  screeningQuestion?: Maybe<ScreeningQuestion>;
  id: Scalars["ID"]["output"];
};

interface ApplicationInformationProps {
  poolQuery: FragmentType<typeof ApplicationInformation_PoolFragment>;
  application?: // comes from snapshot
  | (PoolCandidate & {
        screeningQuestionResponses?: Maybe<
          Array<Maybe<ScreeningQuestionResponse>>
        >;
      })
    | null;
  snapshot: User;
  defaultOpen?: boolean;
}

const ApplicationInformation = ({
  poolQuery,
  snapshot,
  application,
  defaultOpen = false,
}: ApplicationInformationProps) => {
  const intl = useIntl();
  const pool = getFragment(ApplicationInformation_PoolFragment, poolQuery);
  const [openSections, setOpenSections] = useState<string[]>(
    defaultOpen ? Object.values(SECTION_KEY) : [],
  );
  const hasOpenSections = openSections.length > 0;

  const toggleSections = () => {
    const newValue = hasOpenSections ? [] : Object.values(SECTION_KEY);
    setOpenSections(newValue);
  };

  const generalQuestionResponses = unpackMaybes(
    application?.generalQuestionResponses ?? [],
  );

  const screeningQuestionResponses = unpackMaybes(
    application?.screeningQuestionResponses ?? [],
  );

  const skills = groupPoolSkillByType(pool?.poolSkills);
  const categorizedEssentialSkills = categorizeSkill(
    skills.get(PoolSkillType.Essential),
  );
  const technicalEssentialSkills = unpackMaybes(
    categorizedEssentialSkills[SkillCategory.Technical],
  );
  const categorizedAssetSkills = categorizeSkill(
    skills.get(PoolSkillType.Nonessential),
  );
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
            <DownloadButton id={application.id} userId={application.user.id} />
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
          <Accordion.Trigger as="h3">
            {intl.formatMessage({
              defaultMessage: "Personal and contact information",
              id: "BWh6S1",
              description:
                "Title for the personal and contact information section",
            })}
          </Accordion.Trigger>
          <Accordion.Content>
            <PersonalInformationDisplay user={snapshot} />
          </Accordion.Content>
        </Accordion.Item>
        {screeningQuestionResponses.length > 0 ? (
          <Accordion.Item value={SECTION_KEY.SCREENING}>
            <Accordion.Trigger as="h3">
              {intl.formatMessage(processMessages.screeningQuestions)}
            </Accordion.Trigger>
            <Accordion.Content>
              {screeningQuestionResponses.map((response, index) => (
                <Fragment key={response.id}>
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
                </Fragment>
              ))}
            </Accordion.Content>
          </Accordion.Item>
        ) : null}
        {generalQuestionResponses.length > 0 ? (
          <Accordion.Item value={SECTION_KEY.GENERAL}>
            <Accordion.Trigger as="h3">
              {intl.formatMessage(processMessages.generalQuestions)}
            </Accordion.Trigger>
            <Accordion.Content>
              {generalQuestionResponses.map((response, index) => (
                <Fragment key={response.id}>
                  <Heading
                    level="h4"
                    size="h6"
                    data-h2-font-size="base(body)"
                    {...(index === 0 && {
                      "data-h2-margin-top": "base(0)",
                    })}
                  >
                    {getLocalizedName(response.generalQuestion?.question, intl)}
                  </Heading>
                  <p>{response.answer}</p>
                </Fragment>
              ))}
            </Accordion.Content>
          </Accordion.Item>
        ) : null}
        <Accordion.Item value={SECTION_KEY.EDUCATION}>
          <Accordion.Trigger as="h3">
            {intl.formatMessage({
              defaultMessage: "Minimum experience or equivalent education",
              id: "LvYEdh",
              description:
                "Title for Minimum experience or equivalent education",
            })}
          </Accordion.Trigger>
          <Accordion.Content>
            <EducationRequirementsDisplay application={application} />
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
          <Accordion.Trigger as="h3">
            {intl.formatMessage({
              defaultMessage: "Asset skills",
              id: "K0Zkdw",
              description: "Title for optional skills",
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
          <Accordion.Trigger as="h3">
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
          <Accordion.Trigger as="h3">
            {intl.formatMessage(navigationMessages.workPreferences)}
          </Accordion.Trigger>
          <Accordion.Content>
            <WorkPreferencesDisplay user={snapshot} />
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value={SECTION_KEY.GOV_INFO}>
          <Accordion.Trigger as="h3">
            {intl.formatMessage({
              defaultMessage: "Government employee information",
              id: "Jf3vT5",
              description:
                "Title for the government employee information section",
            })}
          </Accordion.Trigger>
          <Accordion.Content>
            <GovernmentInformationDisplay user={snapshot} />
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value={SECTION_KEY.DEI}>
          <Accordion.Trigger as="h3">
            {intl.formatMessage(navigationMessages.diversityEquityInclusion)}
          </Accordion.Trigger>
          <Accordion.Content>
            <DiversityEquityInclusionDisplay user={snapshot} />
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value={SECTION_KEY.SIGNATURE}>
          <Accordion.Trigger as="h3">
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
