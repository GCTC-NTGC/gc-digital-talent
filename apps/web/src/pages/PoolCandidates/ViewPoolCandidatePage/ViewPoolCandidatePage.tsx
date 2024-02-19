import * as React from "react";
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import {
  NotFound,
  Pending,
  ToggleGroup,
  TableOfContents,
  Separator,
  TreeView,
  Heading,
  CardBasic,
  Sidebar,
  Accordion,
} from "@gc-digital-talent/ui";
import {
  commonMessages,
  getEducationRequirementOption,
  getLocalizedName,
  navigationMessages,
} from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import { useFeatureFlags } from "@gc-digital-talent/env";
import {
  ViewPoolCandidatesPageQuery,
  graphql,
  User,
  Maybe,
  SkillCategory,
  Scalars,
} from "@gc-digital-talent/graphql";

import {
  getShortPoolTitleHtml,
  getShortPoolTitleLabel,
  useAdminPoolPages,
} from "~/utils/poolUtils";
import useRequiredParams from "~/hooks/useRequiredParams";
import { categorizeSkill } from "~/utils/skillUtils";
import applicationMessages from "~/messages/applicationMessages";
import processMessages from "~/messages/processMessages";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import ExperienceTreeItems from "~/components/ExperienceTreeItems/ExperienceTreeItems";
import PoolStatusTable from "~/components/PoolStatusTable/PoolStatusTable";
import SkillTree from "~/components/SkillTree/SkillTree";
import AdminHero from "~/components/Hero/AdminHero";

import PersonalInformationDisplay from "../../../components/Profile/components/PersonalInformation/Display";
import DiversityEquityInclusionDisplay from "../../../components/Profile/components/DiversityEquityInclusion/Display";
import GovernmentInformationDisplay from "../../../components/Profile/components/GovernmentInformation/Display";
import LanguageProfileDisplay from "../../../components/Profile/components/LanguageProfile/Display";
import WorkPreferencesDisplay from "../../../components/Profile/components/WorkPreferences/Display";
import CareerTimelineSection from "./components/CareerTimelineSection/CareerTimelineSection";
import ApplicationStatusForm from "./components/ApplicationStatusForm";
import AssetSkillsFiltered from "./components/ApplicationStatusForm/AssetSkillsFiltered";
import ApplicationPrintButton from "./components/ApplicationPrintButton/ApplicationPrintButton";
import ApplicationInformation from "./components/ApplicationInformation/ApplicationInformation";

export interface ViewPoolCandidateProps {
  poolCandidate: NonNullable<ViewPoolCandidatesPageQuery["poolCandidate"]>;
  poolData: ViewPoolCandidatesPageQuery["pools"];
}

type SectionContent = {
  id: string;
  linkText?: string;
  title: string;
};

export const ViewPoolCandidate = ({
  poolCandidate,
  poolData,
}: ViewPoolCandidateProps): JSX.Element => {
  const intl = useIntl();
  const features = useFeatureFlags();

  const pools = poolData.filter(notEmpty);

  // prefer the rich view if available
  const [preferRichView, setPreferRichView] = React.useState(true);

  const parsedSnapshot: Maybe<User> = JSON.parse(poolCandidate.profileSnapshot);
  const snapshotUserPropertyExists = !!parsedSnapshot;
  const pages = useAdminPoolPages(intl, poolCandidate.pool);
  const showRichSnapshot = snapshotUserPropertyExists && preferRichView;

  const sections: Record<string, SectionContent> = {
    statusForm: {
      id: "status-form",
      title: intl.formatMessage({
        defaultMessage: "Application status",
        id: "/s66sg",
        description: "Title for admins to edit an applications status.",
      }),
    },
    poolInformation: {
      id: "pool-information",
      title: intl.formatMessage({
        defaultMessage: "Pool information",
        id: "ptOxLJ",
        description: "Title for pool information",
      }),
    },
    snapshot: {
      id: "snapshot",
      title: intl.formatMessage({
        defaultMessage: "Application",
        id: "5iNcHS",
        description:
          "Title displayed for the Pool Candidates table View Application link.",
      }),
    },
    minExperience: {
      id: "min-experience",
      title: intl.formatMessage({
        defaultMessage: "Minimum experience or equivalent education",
        id: "LvYEdh",
        description: "Title for Minimum experience or equivalent education",
      }),
    },
    essentialSkills: {
      id: "essential-skills",
      title: intl.formatMessage({
        defaultMessage: "Essential skills",
        id: "w7E0He",
        description: "Title for the required skills snapshot section",
      }),
    },
    assetSkills: {
      id: "asset-skills",
      title: intl.formatMessage({
        defaultMessage: "Asset skills",
        id: "K0Zkdw",
        description: "Title for optional skills",
      }),
    },
    questions: {
      id: "questions",
      title: intl.formatMessage(processMessages.screeningQuestions),
    },
    careerTimeline: {
      id: "career-timeline",
      title: intl.formatMessage({
        defaultMessage: "Career timeline",
        id: "2KM4iz",
        description: "Title for the career timeline snapshot section",
      }),
    },
    personal: {
      id: "personal",
      title: intl.formatMessage({
        defaultMessage: "Personal and contact information",
        id: "BWh6S1",
        description: "Title for the personal and contact information section",
      }),
    },
    work: {
      id: "work",
      title: intl.formatMessage(navigationMessages.workPreferences),
    },
    dei: {
      id: "dei",
      title: intl.formatMessage(navigationMessages.diversityEquityInclusion),
    },
    government: {
      id: "government",
      title: intl.formatMessage({
        defaultMessage: "Government employee information",
        id: "Jf3vT5",
        description: "Title for the government employee information section",
      }),
    },
    language: {
      id: "language",
      title: intl.formatMessage({
        defaultMessage: "Language profile",
        id: "KsS1Py",
        description: "Title for the language profile snapshot section",
      }),
    },
    signature: {
      id: "signature",
      title: intl.formatMessage({
        defaultMessage: "Signature",
        id: "1ZZgbi",
        description: "Title for the signature snapshot section",
      }),
    },
  };

  const subTitle = (
    <TableOfContents.Section id={sections.snapshot.id}>
      <div
        data-h2-display="l-tablet(flex)"
        data-h2-align-items="base(center)"
        data-h2-justify-content="base(space-between)"
        data-h2-margin="base(x1, 0)"
      >
        {snapshotUserPropertyExists && (
          <>
            <TableOfContents.Heading
              as="h3"
              data-h2-margin="base(0)"
              data-h2-font-weight="base(800)"
            >
              {sections.snapshot.title}
            </TableOfContents.Heading>
            <ToggleGroup.Root
              type="single"
              color="primary.dark"
              value={preferRichView ? "text" : "code"}
              onValueChange={(value) => {
                if (value) setPreferRichView(value === "text");
              }}
            >
              <ToggleGroup.Item value="text">
                {intl.formatMessage({
                  defaultMessage: "Text",
                  id: "Ude1JQ",
                  description: "Title for the application's profile snapshot.",
                })}
              </ToggleGroup.Item>
              <ToggleGroup.Item value="code">
                {intl.formatMessage({
                  defaultMessage: "Code",
                  id: "m0JFE/",
                  description: "Title for the application's profile snapshot.",
                })}
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </>
        )}
      </div>
    </TableOfContents.Section>
  );

  let mainContent: React.ReactNode;
  if (showRichSnapshot) {
    const snapshotCandidate = parsedSnapshot?.poolCandidates
      ?.filter(notEmpty)
      .find(({ id }) => id === poolCandidate.id);
    const categorizedEssentialSkills = categorizeSkill(
      poolCandidate.pool.essentialSkills,
    );
    const categorizedAssetSkills = categorizeSkill(
      poolCandidate.pool.nonessentialSkills,
    );
    const nonEmptyExperiences = parsedSnapshot.experiences?.filter(notEmpty);

    const classificationGroup = snapshotCandidate?.pool.classifications
      ? snapshotCandidate.pool.classifications[0]?.group
      : "";

    if (features.recordOfDecision) {
      mainContent = (
        <>
          <ApplicationInformation
            poolQuery={poolCandidate.pool}
            snapshot={parsedSnapshot}
            application={snapshotCandidate}
          />
          <div data-h2-margin="base(x2 0)">
            <Accordion.Root type="single" mode="card" collapsible>
              <Accordion.Item value="otherRecruitments">
                <Accordion.Trigger>
                  {intl.formatMessage({
                    defaultMessage: "Other recruitments",
                    id: "kZs3Nk",
                    description:
                      "Heading for table of a users other applications and recruitments",
                  })}
                </Accordion.Trigger>
                <Accordion.Content>
                  <PoolStatusTable user={poolCandidate.user} pools={pools} />
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </div>
          <CareerTimelineSection experiences={nonEmptyExperiences ?? []} />
        </>
      );
    } else {
      mainContent = (
        <>
          {subTitle}
          <TableOfContents.Section id={sections.minExperience.id}>
            <TableOfContents.Heading
              as="h4"
              size="h5"
              data-h2-margin="base(x2 0 x.5 0)"
            >
              {sections.minExperience.title}
            </TableOfContents.Heading>
            <p data-h2-margin="base(x1, 0)">
              {intl.formatMessage(
                {
                  defaultMessage:
                    "Requirement selection: <strong>{educationRequirementOption}</strong>.",
                  id: "J3Ud6R",
                  description:
                    "Application snapshot minimum experience section description",
                },
                {
                  educationRequirementOption: intl.formatMessage(
                    snapshotCandidate?.educationRequirementOption
                      ? getEducationRequirementOption(
                          snapshotCandidate.educationRequirementOption,
                          classificationGroup,
                        )
                      : commonMessages.notAvailable,
                  ),
                },
              )}
            </p>
            {snapshotCandidate?.educationRequirementExperiences?.length ? (
              <>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Demonstrated with the following experiences:",
                    id: "tpTntk",
                    description:
                      "Lead in text for experiences that demonstrate minimum education experience",
                  })}
                </p>
                <TreeView.Root>
                  <ExperienceTreeItems
                    experiences={snapshotCandidate?.educationRequirementExperiences.filter(
                      notEmpty,
                    )}
                  />
                </TreeView.Root>
              </>
            ) : null}
          </TableOfContents.Section>
          <TableOfContents.Section id={sections.essentialSkills.id}>
            <TableOfContents.Heading
              as="h4"
              size="h5"
              data-h2-margin="base(x2 0 x.5 0)"
            >
              {sections.essentialSkills.title}
            </TableOfContents.Heading>
            {categorizedEssentialSkills[SkillCategory.Technical]?.length ? (
              <>
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Represented by the following experiences:",
                    id: "mDowK/",
                    description:
                      "Lead in text for experiences that represent the users skills",
                  })}
                </p>
                {categorizedEssentialSkills[SkillCategory.Technical]?.map(
                  (requiredTechnicalSkill) => (
                    <SkillTree
                      key={requiredTechnicalSkill.id}
                      skill={requiredTechnicalSkill}
                      experiences={
                        parsedSnapshot.experiences?.filter(notEmpty) || []
                      }
                      showDisclaimer
                      hideConnectButton
                      hideEdit
                      disclaimerMessage={
                        <p>
                          {intl.formatMessage({
                            defaultMessage:
                              "There are no experiences attached to this skill.",
                            id: "XrfkBm",
                            description:
                              "Message displayed when no experiences have been attached to a skill",
                          })}
                        </p>
                      }
                    />
                  ),
                )}
              </>
            ) : null}
          </TableOfContents.Section>
          <TableOfContents.Section id={sections.assetSkills.id}>
            <TableOfContents.Heading
              as="h4"
              size="h5"
              data-h2-margin="base(x2 0 x.5 0)"
            >
              {sections.assetSkills.title}
            </TableOfContents.Heading>
            {categorizedAssetSkills[SkillCategory.Technical]?.length ? (
              <AssetSkillsFiltered
                poolAssetSkills={
                  categorizedAssetSkills[SkillCategory.Technical]
                }
                experiences={parsedSnapshot.experiences?.filter(notEmpty) || []}
              />
            ) : null}
          </TableOfContents.Section>
          <TableOfContents.Section id={sections.questions.id}>
            <TableOfContents.Heading
              as="h4"
              size="h5"
              data-h2-margin="base(x2 0 x.5 0)"
            >
              {sections.questions.title}
            </TableOfContents.Heading>
            {snapshotCandidate?.generalQuestionResponses
              ?.filter(notEmpty)
              .map((response) => (
                <React.Fragment key={response.id}>
                  <Heading
                    level="h5"
                    size="h6"
                    data-h2-margin-bottom="base(x.5)"
                  >
                    {getLocalizedName(
                      response?.generalQuestion?.question,
                      intl,
                    )}
                  </Heading>
                  <div
                    data-h2-background-color="base(foreground)"
                    data-h2-color="base(black)"
                    data-h2-padding="base(x1)"
                    data-h2-border-left="base(x.5 solid primary)"
                    data-h2-radius="base(0 rounded rounded 0)"
                    data-h2-shadow="base(medium)"
                  >
                    <p>{response.answer}</p>
                  </div>
                </React.Fragment>
              ))}
          </TableOfContents.Section>
          <TableOfContents.Section id={sections.careerTimeline.id}>
            <TableOfContents.Heading
              as="h4"
              size="h5"
              data-h2-margin="base(x2 0 x.5 0)"
            >
              {sections.careerTimeline.title}
            </TableOfContents.Heading>
            <p data-h2-margin="base(x1, 0)">
              {intl.formatMessage({
                defaultMessage:
                  "The following is the applicant's career timeline:",
                id: "ghcC8V",
                description:
                  "Lead-in text for the snapshot career timeline section",
              })}
            </p>
            <CareerTimelineSection experiences={nonEmptyExperiences ?? []} />
          </TableOfContents.Section>
          <TableOfContents.Section id={sections.personal.id}>
            <TableOfContents.Heading
              as="h4"
              size="h5"
              data-h2-margin="base(x2 0 x.5 0)"
            >
              {sections.personal.title}
            </TableOfContents.Heading>
            <CardBasic>
              <PersonalInformationDisplay user={parsedSnapshot as User} />
            </CardBasic>
          </TableOfContents.Section>
          <TableOfContents.Section id={sections.work.id}>
            <TableOfContents.Heading
              as="h4"
              size="h5"
              data-h2-margin="base(x2 0 x.5 0)"
            >
              {sections.work.title}
            </TableOfContents.Heading>
            <CardBasic>
              <WorkPreferencesDisplay user={parsedSnapshot as User} />
            </CardBasic>
          </TableOfContents.Section>
          <TableOfContents.Section id={sections.dei.id}>
            <TableOfContents.Heading
              as="h4"
              size="h5"
              data-h2-margin="base(x2 0 x.5 0)"
            >
              {sections.dei.title}
            </TableOfContents.Heading>
            <CardBasic>
              <DiversityEquityInclusionDisplay user={parsedSnapshot as User} />
            </CardBasic>
          </TableOfContents.Section>
          <TableOfContents.Section id={sections.government.id}>
            <TableOfContents.Heading
              as="h4"
              size="h5"
              data-h2-margin="base(x2 0 x.5 0)"
            >
              {sections.government.title}
            </TableOfContents.Heading>
            <CardBasic>
              <GovernmentInformationDisplay user={parsedSnapshot as User} />
            </CardBasic>
          </TableOfContents.Section>
          <TableOfContents.Section id={sections.language.id}>
            <TableOfContents.Heading
              as="h4"
              size="h5"
              data-h2-margin="base(x2 0 x.5 0)"
            >
              {sections.language.title}
            </TableOfContents.Heading>
            <CardBasic>
              <LanguageProfileDisplay user={parsedSnapshot as User} />
            </CardBasic>
          </TableOfContents.Section>
          <TableOfContents.Section id={sections.signature.id}>
            <TableOfContents.Heading
              as="h4"
              size="h5"
              data-h2-margin="base(x2 0 x.5 0)"
            >
              {sections.signature.title}
            </TableOfContents.Heading>
            <p data-h2-margin="base(0, 0, x1, 0)">
              {intl.formatMessage(applicationMessages.confirmationLead)}
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
            <Heading
              level="h6"
              data-h2-font-size="base(copy)"
              data-h2-font-weight="base(400)"
            >
              {intl.formatMessage({
                defaultMessage: "Signed",
                id: "fEcEv3",
                description:
                  "Heading for the application snapshot users signature",
              })}
            </Heading>
            <CardBasic data-h2-shadow="base(none)">
              <p data-h2-font-weight="base(700)">
                {snapshotCandidate?.signature ||
                  intl.formatMessage(commonMessages.notProvided)}
              </p>
            </CardBasic>
          </TableOfContents.Section>
        </>
      );
    }
  } else if (snapshotUserPropertyExists && !preferRichView) {
    mainContent = (
      <>
        {subTitle}
        <pre
          data-h2-background-color="base(background.dark.3)"
          data-h2-border="base(1px solid background.darker)"
          data-h2-overflow="base(scroll auto)"
          data-h2-padding="base(x1)"
          data-h2-radius="base(s)"
        >
          {JSON.stringify(parsedSnapshot, null, 2)}
        </pre>
      </>
    );
  } else {
    mainContent = (
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
      <AdminHero
        title={intl.formatMessage({
          defaultMessage: "Candidate information",
          id: "69/cNW",
          description:
            "Heading displayed above the pool candidate application page.",
        })}
        subtitle={`${poolCandidate.user.firstName} ${
          poolCandidate.user.lastName
        } / ${getShortPoolTitleLabel(intl, poolCandidate.pool)}`}
        nav={{
          mode: "subNav",
          items: Array.from(pages.values()).map((page) => ({
            label: page.link.label ?? page.title,
            url: page.link.url,
          })),
        }}
      />
      <AdminContentWrapper>
        {!features.recordOfDecision ? (
          <>
            <p data-h2-margin="base(-x1, 0, x1, 0)">
              {intl.formatMessage(
                {
                  defaultMessage:
                    "This is the profile submitted on <strong>{submittedAt}</strong> for the pool: <strong>{poolName}</strong>",
                  id: "V2vBbu",
                  description:
                    "Snapshot details displayed above the pool candidate application page.",
                },
                {
                  submittedAt: poolCandidate.submittedAt,
                  poolName: getShortPoolTitleHtml(intl, poolCandidate.pool),
                },
              )}
            </p>
            <Separator
              data-h2-background-color="base(black.lightest)"
              data-h2-margin="base(x1, 0, x1, 0)"
            />
            {parsedSnapshot && (
              <div
                data-h2-container="base(center, large, 0)"
                data-h2-text-align="base(right)"
                data-h2-margin-right="base(0)"
              >
                <ApplicationPrintButton
                  user={parsedSnapshot}
                  pool={poolCandidate.pool}
                  color="primary"
                  mode="solid"
                />
              </div>
            )}

            <TableOfContents.Wrapper data-h2-margin-top="base(x3)">
              <TableOfContents.Navigation>
                <TableOfContents.List>
                  <TableOfContents.ListItem>
                    <TableOfContents.AnchorLink id={sections.statusForm.id}>
                      {sections.statusForm.title}
                    </TableOfContents.AnchorLink>
                  </TableOfContents.ListItem>
                  <TableOfContents.ListItem>
                    <TableOfContents.AnchorLink
                      id={sections.poolInformation.id}
                    >
                      {sections.poolInformation.title}
                    </TableOfContents.AnchorLink>
                  </TableOfContents.ListItem>
                  <TableOfContents.ListItem>
                    <TableOfContents.AnchorLink id={sections.snapshot.id}>
                      {sections.snapshot.title}
                    </TableOfContents.AnchorLink>
                  </TableOfContents.ListItem>
                  {showRichSnapshot && (
                    <>
                      <TableOfContents.ListItem>
                        <TableOfContents.AnchorLink
                          id={sections.minExperience.id}
                        >
                          {sections.minExperience.title}
                        </TableOfContents.AnchorLink>
                      </TableOfContents.ListItem>
                      <TableOfContents.ListItem>
                        <TableOfContents.AnchorLink
                          id={sections.essentialSkills.id}
                        >
                          {sections.essentialSkills.title}
                        </TableOfContents.AnchorLink>
                      </TableOfContents.ListItem>
                      <TableOfContents.ListItem>
                        <TableOfContents.AnchorLink
                          id={sections.assetSkills.id}
                        >
                          {sections.assetSkills.title}
                        </TableOfContents.AnchorLink>
                      </TableOfContents.ListItem>
                      <TableOfContents.ListItem>
                        <TableOfContents.AnchorLink id={sections.questions.id}>
                          {sections.questions.title}
                        </TableOfContents.AnchorLink>
                      </TableOfContents.ListItem>
                      <TableOfContents.ListItem>
                        <TableOfContents.AnchorLink
                          id={sections.careerTimeline.id}
                        >
                          {sections.careerTimeline.title}
                        </TableOfContents.AnchorLink>
                      </TableOfContents.ListItem>
                      <TableOfContents.ListItem>
                        <TableOfContents.AnchorLink id={sections.personal.id}>
                          {sections.personal.title}
                        </TableOfContents.AnchorLink>
                      </TableOfContents.ListItem>
                      <TableOfContents.ListItem>
                        <TableOfContents.AnchorLink id={sections.work.id}>
                          {sections.work.title}
                        </TableOfContents.AnchorLink>
                      </TableOfContents.ListItem>
                      <TableOfContents.ListItem>
                        <TableOfContents.AnchorLink id={sections.dei.id}>
                          {sections.dei.title}
                        </TableOfContents.AnchorLink>
                      </TableOfContents.ListItem>
                      <TableOfContents.ListItem>
                        <TableOfContents.AnchorLink id={sections.government.id}>
                          {sections.government.title}
                        </TableOfContents.AnchorLink>
                      </TableOfContents.ListItem>
                      <TableOfContents.ListItem>
                        <TableOfContents.AnchorLink id={sections.language.id}>
                          {sections.language.title}
                        </TableOfContents.AnchorLink>
                      </TableOfContents.ListItem>
                      <TableOfContents.ListItem>
                        <TableOfContents.AnchorLink id={sections.signature.id}>
                          {sections.signature.title}
                        </TableOfContents.AnchorLink>
                      </TableOfContents.ListItem>
                    </>
                  )}
                </TableOfContents.List>
              </TableOfContents.Navigation>
              <TableOfContents.Content>
                <TableOfContents.Section id={sections.statusForm.id}>
                  <TableOfContents.Heading
                    data-h2-margin="base(0, 0, x1, 0)"
                    data-h2-font-weight="base(800)"
                    as="h3"
                  >
                    {sections.statusForm.title}
                  </TableOfContents.Heading>
                  <ApplicationStatusForm candidateQuery={poolCandidate} />
                  <Separator
                    data-h2-background-color="base(black.lightest)"
                    data-h2-margin="base(x1, 0, 0, 0)"
                  />
                </TableOfContents.Section>
                <TableOfContents.Section id={sections.poolInformation.id}>
                  <TableOfContents.Heading
                    data-h2-margin="base(x1, 0, x1, 0)"
                    data-h2-font-weight="base(800)"
                    as="h3"
                  >
                    {sections.poolInformation.title}
                  </TableOfContents.Heading>
                  <PoolStatusTable user={poolCandidate.user} pools={pools} />
                  <Separator
                    data-h2-background-color="base(black.lightest)"
                    data-h2-margin="base(x1, 0, 0, 0)"
                  />
                </TableOfContents.Section>
                {mainContent}
              </TableOfContents.Content>
            </TableOfContents.Wrapper>
          </>
        ) : (
          <Sidebar.Wrapper>
            <Sidebar.Content>
              {/**
               * TODO: Remove `ApplicationStatusForm` with record of decision flag (#8415)
               *
               * This is here to keep tests passing
               */}
              <ApplicationStatusForm candidateQuery={poolCandidate} />
              {mainContent}
            </Sidebar.Content>
          </Sidebar.Wrapper>
        )}
      </AdminContentWrapper>
    </>
  );
};

const ViewPoolCandidatesPage_Query = graphql(/* GraphQL */ `
  query ViewPoolCandidatesPage($poolCandidateId: UUID!) {
    poolCandidate(id: $poolCandidateId) {
      id
      profileSnapshot
      submittedAt
      user {
        id
        firstName
        lastName
        currentCity
        currentProvince
        telephone
        email
        citizenship
        preferredLang
        preferredLanguageForInterview
        preferredLanguageForExam
        poolCandidates {
          id
          status
          suspendedAt
          expiryDate
          pool {
            id
            name {
              en
              fr
            }
            publishingGroup
            stream
            classifications {
              id
              group
              level
            }
            team {
              id
              name
              displayName {
                en
                fr
              }
            }
          }
          user {
            id
          }
        }
      }
      pool {
        id
        name {
          en
          fr
        }
        publishingGroup
        stream
        classifications {
          id
          group
          level
        }
        essentialSkills {
          id
          key
          category
          name {
            en
            fr
          }
          description {
            en
            fr
          }
        }
        nonessentialSkills {
          id
          key
          category
          name {
            en
            fr
          }
          description {
            en
            fr
          }
        }
        ...ApplicationInformation_PoolFragment
        ...ApplicationPrintDocument_PoolFragment
      }
      ...ApplicationStatusForm_PoolCandidateFragment
    }
    pools {
      id
      name {
        en
        fr
      }
      status
      stream
      publishingGroup
      classifications {
        id
        group
        level
      }
    }
  }
`);

type RouteParams = {
  poolId: Scalars["ID"]["output"];
  poolCandidateId: Scalars["ID"]["output"];
};

export const ViewPoolCandidatePage = () => {
  const intl = useIntl();
  const { poolCandidateId } = useRequiredParams<RouteParams>("poolCandidateId");
  const [{ data, fetching, error }] = useQuery({
    query: ViewPoolCandidatesPage_Query,
    variables: { poolCandidateId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.poolCandidate && data?.pools ? (
        <ViewPoolCandidate
          poolCandidate={data.poolCandidate}
          poolData={data.pools}
        />
      ) : (
        <AdminContentWrapper>
          <NotFound
            headingMessage={intl.formatMessage(commonMessages.notFound)}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage: "Candidate {poolCandidateId} not found.",
                  id: "GrfidX",
                  description:
                    "Message displayed for pool candidate not found.",
                },
                { poolCandidateId },
              )}
            </p>
          </NotFound>
        </AdminContentWrapper>
      )}
    </Pending>
  );
};

export default ViewPoolCandidatePage;
