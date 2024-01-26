import * as React from "react";
import { defineMessage, useIntl } from "react-intl";
import ChevronDoubleLeftIcon from "@heroicons/react/24/solid/ChevronDoubleLeftIcon";
import ExclamationCircleIcon from "@heroicons/react/24/outline/ExclamationCircleIcon";
import CheckCircleIcon from "@heroicons/react/24/outline/CheckCircleIcon";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import { useQuery } from "urql";

import {
  NotFound,
  Pending,
  Link,
  TableOfContents,
  Heading,
  Separator,
} from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  graphql,
  Pool,
  Scalars,
  Classification,
  Skill,
} from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import StatusItem from "~/components/StatusItem/StatusItem";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import {
  hasEmptyRequiredFields as poolNameError,
  isInNullState as educationRequirementIsNull,
} from "~/validators/process/classification";
import { hasEmptyRequiredFields as closingDateError } from "~/validators/process/closingDate";
import { hasEmptyRequiredFields as yourImpactError } from "~/validators/process/yourImpact";
import { hasEmptyRequiredFields as keyTasksError } from "~/validators/process/keyTasks";
import { hasEmptyRequiredFields as coreRequirementsError } from "~/validators/process/coreRequirements";
import { hasEmptyRequiredFields as essentialSkillsError } from "~/validators/process/essentialSkills";
import usePoolMutations from "~/hooks/usePoolMutations";
import { hasAllEmptyFields as specialNoteIsNull } from "~/validators/process/specialNote";

import PoolNameSection, {
  type PoolNameSubmitData,
} from "./components/PoolNameSection/PoolNameSection";
import ClosingDateSection, {
  type ClosingDateSubmitData,
} from "./components/ClosingDateSection/ClosingDateSection";
import YourImpactSection, {
  type YourImpactSubmitData,
} from "./components/YourImpactSection/YourImpactSection";
import WorkTasksSection, {
  type WorkTasksSubmitData,
} from "./components/WorkTasksSection/WorkTasksSection";
import CoreRequirementsSection, {
  type CoreRequirementsSubmitData,
} from "./components/CoreRequirementsSection/CoreRequirementsSection";
import EssentialSkillsSection, {
  type EssentialSkillsSubmitData,
} from "./components/EssentialSkillsSection";
import AssetSkillsSection, {
  type AssetSkillsSubmitData,
} from "./components/AssetSkillsSection";
import EducationRequirementsSection from "./components/EducationRequirementsSection";
import { type ScreeningQuestionsSubmitData } from "./components/ScreeningQuestions";
import SpecialNoteSection, {
  SpecialNoteSubmitData,
} from "./components/SpecialNoteSection/SpecialNoteSection";
import WhatToExpectSection, {
  type WhatToExpectSubmitData,
} from "./components/WhatToExpectSection/WhatToExpectSection";
import EditPoolContext from "./components/EditPoolContext";
import { EditPoolSectionMetadata } from "../../../types/pool";
import { SectionKey } from "./types";
import GeneralQuestions from "./components/GeneralQuestions";

export type PoolSubmitData =
  | AssetSkillsSubmitData
  | ClosingDateSubmitData
  | EssentialSkillsSubmitData
  | CoreRequirementsSubmitData
  | PoolNameSubmitData
  | WorkTasksSubmitData
  | YourImpactSubmitData
  | WhatToExpectSubmitData
  | SpecialNoteSubmitData
  | ScreeningQuestionsSubmitData;

export interface EditPoolFormProps {
  pool: Pool;
  classifications: Array<Classification>;
  skills: Array<Skill>;
  onSave: (submitData: PoolSubmitData) => Promise<void>;
}

export const EditPoolForm = ({
  pool,
  classifications,
  skills,
  onSave,
}: EditPoolFormProps): JSX.Element => {
  const intl = useIntl();
  const paths = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Create a new recruitment",
    id: "lNKpJl",
    description: "Title for advertisement information of a process",
  });

  const pageSubtitle = intl.formatMessage({
    defaultMessage:
      "Define the information and requirements for this recruitment process.",
    id: "Kyf9At",
    description: "Description of a process' advertisement",
  });

  const basicInfoHasError = poolNameError(pool) || closingDateError(pool);
  const skillRequirementsHasError = essentialSkillsError(pool);
  const aboutRoleHasError = yourImpactError(pool) || keyTasksError(pool);
  const sectionMetadata: Record<SectionKey, EditPoolSectionMetadata> = {
    basicInfo: {
      id: "basic-info",
      hasError: basicInfoHasError,
      title: intl.formatMessage({
        defaultMessage: "Basic information",
        id: "RDFAWE",
        description: "Title for basic information",
      }),
      subtitle: intl.formatMessage({
        defaultMessage:
          "This section asks about standard recruitment information such as classification, job title, and closing date.",
        id: "wO1c70",
        description: "Sub title for basic information",
      }),
      icon: basicInfoHasError ? ExclamationCircleIcon : CheckCircleIcon,
      color: basicInfoHasError ? "error" : "success",
    },
    poolName: {
      id: "pool-name",
      hasError: poolNameError(pool),
      title: intl.formatMessage({
        defaultMessage: "Advertisement details",
        id: "KEm64j",
        description: "Sub title for advertisement details",
      }),
      inList: false,
    },
    closingDate: {
      id: "closing-date",
      hasError: closingDateError(pool),
      title: intl.formatMessage({
        defaultMessage: "Closing date",
        id: "I8jlr2",
        description: "Sub title for pool closing date",
      }),
      inList: false,
    },
    coreRequirements: {
      id: "core-requirements",
      hasError: coreRequirementsError(pool),
      title: intl.formatMessage({
        defaultMessage: "Core requirements",
        id: "uWfG0e",
        description: "Sub title for the pool core requirements",
      }),
    },
    specialNote: {
      id: "special-note",
      hasError: false, // Optional section
      title: intl.formatMessage({
        defaultMessage: "Special note",
        id: "+6tF6S",
        description: "Sub title for the special note section",
      }),
      status: specialNoteIsNull(pool) ? "optional" : "success",
    },
    educationRequirements: {
      id: "education-requirements",
      hasError: educationRequirementIsNull(pool),
      title: intl.formatMessage({
        defaultMessage: "Minimum education",
        id: "Quwegl",
        description: "Title for application education",
      }),
    },
    skillRequirements: {
      id: "skill-requirements",
      hasError: skillRequirementsHasError,
      title: intl.formatMessage({
        defaultMessage: "Skill requirements",
        id: "tON7JL",
        description: "Title for skill requirements",
      }),
      subtitle: intl.formatMessage({
        defaultMessage:
          "Skill requirements are categorized as either being <strong>essential</strong> (the candidate absolutely requires this skill) or <strong>asset</strong> (the skill would be helpful but isn't required). Skill criteria will be presented to the applicant based on a combination of the skill's essential/asset status and whether or not the skill will be assessed as a part of their application.",
        id: "Qibs21",
        description: "Sub title for  skill requirements",
      }),
      icon: skillRequirementsHasError ? ExclamationCircleIcon : CheckCircleIcon,
      color: skillRequirementsHasError ? "error" : "success",
    },
    essentialSkills: {
      id: "essential-skills",
      hasError: essentialSkillsError(pool),
      title: intl.formatMessage({
        defaultMessage: "Essential skill criteria",
        id: "xIniPc",
        description: "Sub title for the pool essential skills",
      }),
      inList: false,
    },
    assetSkills: {
      id: "asset-skills",
      hasError: false, // Optional section
      title: intl.formatMessage({
        defaultMessage: "Asset skill criteria",
        id: "TE2Nwv",
        description: "Sub title for the pool essential skills",
      }),
      inList: false,
    },
    aboutRole: {
      id: "about-role",
      hasError: aboutRoleHasError, // optional section
      title: intl.formatMessage({
        defaultMessage: "About this role",
        id: "wCf/XC",
        description: "Title for basic information",
      }),
      subtitle: intl.formatMessage({
        defaultMessage:
          "This section focuses on information that provides the applicant with context for the type of work they'll be doing, who they'll be working with, as well as the way the role impacts Canadians.",
        id: "229QXZ",
        description: "Sub title for basic information",
      }),
      icon: aboutRoleHasError ? ExclamationCircleIcon : CheckCircleIcon,
      color: aboutRoleHasError ? "error" : "success",
    },
    yourImpact: {
      id: "your-impact",
      hasError: yourImpactError(pool),
      title: intl.formatMessage({
        defaultMessage: "Your impact",
        id: "ry3jFR",
        description: "Sub title for the pool introduction",
      }),
      inList: false,
    },
    workTasks: {
      id: "work-tasks",
      hasError: keyTasksError(pool),
      title: intl.formatMessage({
        defaultMessage: "Work tasks",
        id: "GXw2um",
        description: "Sub title for the pool work tasks",
      }),
      inList: false,
    },
    commonQuestions: {
      id: "common-questions",
      hasError: false, // Add understanding classification (#8831) validation here
      title: intl.formatMessage({
        defaultMessage: "Common Questions",
        id: "d81CEm",
        description: "Title for common questions",
      }),
      subtitle: intl.formatMessage({
        defaultMessage:
          "The following information is optional, but is intended to help applicants gain a better understanding of the hiring process. Your answers to these questions will appear alongside other important pieces of information such as equity, accommodation, and contact details.",
        id: "T3aDLD",
        description: "Sub title for common questions",
      }),
      icon: QuestionMarkCircleIcon,
      color: "secondary",
      status: "optional",
    },
    whatToExpect: {
      id: "what-to-expect",
      hasError: false,
      title: intl.formatMessage({
        defaultMessage: "What to expect post-application",
        id: "U0MY+6",
        description: "Title for the what to expect section",
      }),
      inList: false,
    },
    generalQuestions: {
      id: "general-questions",
      hasError: false, // Optional section
      title: intl.formatMessage({
        defaultMessage: "General questions",
        id: "/a9+0W",
        description: "Sub title for the general questions section",
      }),
      status: "optional",
    },
  };

  const backMessage = defineMessage({
    defaultMessage: "Back to process information",
    id: "wCvkgI",
    description:
      "Text on a link to navigate back to the process information page",
  });

  return (
    <>
      <SEO title={pageTitle} description={pageSubtitle} />
      <AdminContentWrapper>
        <div data-h2-container="base(left, large, 0)">
          <TableOfContents.Wrapper>
            <TableOfContents.Navigation>
              <TableOfContents.List
                data-h2-padding-left="base(x.5)"
                data-h2-list-style-type="base(none)"
              >
                {[...Object.values(sectionMetadata)]
                  .filter((meta) => meta.inList !== false)
                  .map((meta) => (
                    <TableOfContents.ListItem key={meta.id}>
                      <StatusItem
                        asListItem={false}
                        title={meta.shortTitle ?? meta.title}
                        status={
                          meta.hasError ? "error" : meta.status || "success"
                        }
                        scrollTo={meta.id}
                      />
                    </TableOfContents.ListItem>
                  ))}
              </TableOfContents.List>
              <Link
                mode="solid"
                href={paths.poolView(pool.id)}
                color="secondary"
              >
                {intl.formatMessage(backMessage)}
              </Link>
            </TableOfContents.Navigation>
            <TableOfContents.Content>
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x3 0)"
              >
                <TableOfContents.Section id={sectionMetadata.basicInfo.id}>
                  <div
                    data-h2-display="base(flex)"
                    data-h2-flex-direction="base(column)"
                    data-h2-gap="base(x3 0)"
                  >
                    <div>
                      <Heading
                        level="h2"
                        size="h3"
                        Icon={sectionMetadata.basicInfo.icon}
                        color={sectionMetadata.basicInfo.color}
                        data-h2-margin="base(0)"
                      >
                        {sectionMetadata.basicInfo.title}
                      </Heading>
                      <p data-h2-margin="base(x1 0)">
                        {sectionMetadata.basicInfo.subtitle}
                      </p>
                    </div>
                    <PoolNameSection
                      pool={pool}
                      classifications={classifications}
                      sectionMetadata={sectionMetadata.poolName}
                      onSave={onSave}
                    />
                    <ClosingDateSection
                      pool={pool}
                      sectionMetadata={sectionMetadata.closingDate}
                      onSave={onSave}
                    />
                  </div>
                </TableOfContents.Section>
                <TableOfContents.Section
                  id={sectionMetadata.coreRequirements.id}
                >
                  <CoreRequirementsSection
                    pool={pool}
                    sectionMetadata={sectionMetadata.coreRequirements}
                    onSave={onSave}
                  />
                </TableOfContents.Section>
                <TableOfContents.Section id={sectionMetadata.specialNote.id}>
                  <SpecialNoteSection
                    pool={pool}
                    sectionMetadata={sectionMetadata.specialNote}
                    onSave={onSave}
                  />
                </TableOfContents.Section>
                <TableOfContents.Section
                  id={sectionMetadata.educationRequirements.id}
                >
                  <EducationRequirementsSection
                    pool={pool}
                    sectionMetadata={sectionMetadata.educationRequirements}
                    changeTargetId={sectionMetadata.basicInfo.id}
                  />
                </TableOfContents.Section>
                <TableOfContents.Section
                  id={sectionMetadata.skillRequirements.id}
                >
                  <div
                    data-h2-display="base(flex)"
                    data-h2-flex-direction="base(column)"
                    data-h2-gap="base(x3 0)"
                  >
                    <div>
                      <Heading
                        level="h2"
                        size="h3"
                        Icon={sectionMetadata.skillRequirements.icon}
                        color={sectionMetadata.skillRequirements.color}
                        data-h2-margin="base(0)"
                      >
                        {sectionMetadata.skillRequirements.title}
                      </Heading>
                      <p data-h2-margin="base(x1 0)">
                        {sectionMetadata.skillRequirements.subtitle}
                      </p>
                    </div>
                    <EssentialSkillsSection
                      pool={pool}
                      skills={skills}
                      sectionMetadata={sectionMetadata.essentialSkills}
                      onSave={onSave}
                    />
                    <AssetSkillsSection
                      pool={pool}
                      skills={skills}
                      sectionMetadata={sectionMetadata.assetSkills}
                      onSave={onSave}
                    />
                  </div>
                </TableOfContents.Section>
                <div
                  data-h2-display="base(flex)"
                  data-h2-flex-direction="base(column)"
                  data-h2-gap="base(x3 0)"
                >
                  <TableOfContents.Section id={sectionMetadata.aboutRole.id}>
                    <div
                      data-h2-display="base(flex)"
                      data-h2-flex-direction="base(column)"
                      data-h2-gap="base(x3 0)"
                    >
                      <div>
                        <Heading
                          level="h2"
                          size="h3"
                          Icon={sectionMetadata.aboutRole.icon}
                          color={sectionMetadata.aboutRole.color}
                          data-h2-margin="base(0)"
                        >
                          {sectionMetadata.aboutRole.title}
                        </Heading>
                        <p data-h2-margin="base(x1 0)">
                          {sectionMetadata.aboutRole.subtitle}
                        </p>
                      </div>
                      <YourImpactSection
                        pool={pool}
                        sectionMetadata={sectionMetadata.yourImpact}
                        onSave={onSave}
                      />
                      <WorkTasksSection
                        pool={pool}
                        sectionMetadata={sectionMetadata.workTasks}
                        onSave={onSave}
                      />
                    </div>
                  </TableOfContents.Section>
                </div>
                <div
                  data-h2-display="base(flex)"
                  data-h2-flex-direction="base(column)"
                  data-h2-gap="base(x3 0)"
                >
                  <TableOfContents.Section
                    id={sectionMetadata.commonQuestions.id}
                  >
                    <div
                      data-h2-display="base(flex)"
                      data-h2-flex-direction="base(column)"
                      data-h2-gap="base(x3 0)"
                    >
                      <div>
                        <Heading
                          level="h2"
                          size="h3"
                          Icon={sectionMetadata.commonQuestions.icon}
                          color={sectionMetadata.commonQuestions.color}
                          data-h2-margin="base(0)"
                        >
                          {sectionMetadata.commonQuestions.title}
                        </Heading>
                        <p data-h2-margin="base(x1 0)">
                          {sectionMetadata.commonQuestions.subtitle}
                        </p>
                      </div>
                      <WhatToExpectSection
                        pool={pool}
                        sectionMetadata={sectionMetadata.whatToExpect}
                        onSave={onSave}
                      />
                    </div>
                  </TableOfContents.Section>
                </div>
                <TableOfContents.Section
                  id={sectionMetadata.generalQuestions.id}
                >
                  <GeneralQuestions
                    pool={pool}
                    sectionMetadata={sectionMetadata.generalQuestions}
                    onSave={onSave}
                  />
                </TableOfContents.Section>
              </div>
            </TableOfContents.Content>
          </TableOfContents.Wrapper>
          <Separator
            orientation="horizontal"
            decorative
            data-h2-background-color="base(gray.lighter)"
            data-h2-margin="base(x1 0)"
          />
          <Link
            mode="solid"
            href={paths.poolView(pool.id)}
            icon={ChevronDoubleLeftIcon}
          >
            {intl.formatMessage(backMessage)}
          </Link>
        </div>
      </AdminContentWrapper>
    </>
  );
};

const EditPoolPage_Query = graphql(/* GraphQL */ `
  query EditPoolPage($poolId: UUID!) {
    # the existing data of the pool to edit
    pool(id: $poolId) {
      id
      name {
        en
        fr
      }
      closingDate
      status
      language
      securityClearance
      isComplete
      classifications {
        id
        group
        level
        name {
          en
          fr
        }
        genericJobTitles {
          id
          key
          name {
            en
            fr
          }
        }
      }
      yourImpact {
        en
        fr
      }
      keyTasks {
        en
        fr
      }
      whatToExpect {
        en
        fr
      }
      specialNote {
        en
        fr
      }
      essentialSkills {
        id
        key
        name {
          en
          fr
        }
        category
        families {
          id
          key
          description {
            en
            fr
          }
          name {
            en
            fr
          }
        }
      }
      nonessentialSkills {
        id
        key
        name {
          en
          fr
        }
        category
        families {
          id
          key
          description {
            en
            fr
          }
          name {
            en
            fr
          }
        }
      }
      isRemote
      location {
        en
        fr
      }
      stream
      processNumber
      publishingGroup
      screeningQuestions {
        id
        question {
          en
          fr
        }
      }
      team {
        id
        name
      }
    }

    # all classifications to populate form dropdown
    classifications {
      id
      group
      level
      name {
        en
        fr
      }
    }

    # all skills to populate skill pickers
    skills {
      id
      key
      name {
        en
        fr
      }
      description {
        en
        fr
      }
      keywords {
        en
        fr
      }
      category
      families {
        id
        key
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

type RouteParams = {
  poolId: Scalars["ID"]["output"];
};

export const EditPoolPage = () => {
  const intl = useIntl();
  const { poolId } = useRequiredParams<RouteParams>("poolId");

  const notFoundMessage = intl.formatMessage(
    {
      defaultMessage: "Pool {poolId} not found.",
      id: "Sb2fEr",
      description: "Message displayed for pool not found.",
    },
    { poolId },
  );

  if (!poolId) {
    throw new Response(notFoundMessage, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const [{ data, fetching, error }] = useQuery({
    query: EditPoolPage_Query,
    variables: { poolId },
  });

  const { isFetching, mutations } = usePoolMutations();

  const ctx = React.useMemo(() => {
    return { isSubmitting: isFetching };
  }, [isFetching]);

  return (
    <Pending fetching={fetching} error={error}>
      {data?.pool ? (
        <EditPoolContext.Provider value={ctx}>
          <EditPoolForm
            pool={data.pool}
            classifications={data.classifications.filter(notEmpty)}
            skills={data.skills.filter(notEmpty)}
            onSave={(saveData) => mutations.update(poolId, saveData)}
          />
        </EditPoolContext.Provider>
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>{notFoundMessage}</p>
        </NotFound>
      )}
    </Pending>
  );
};

export default EditPoolPage;
