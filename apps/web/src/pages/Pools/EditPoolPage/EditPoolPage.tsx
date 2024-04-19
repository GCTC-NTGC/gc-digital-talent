import * as React from "react";
import { useIntl } from "react-intl";
import ExclamationCircleIcon from "@heroicons/react/24/outline/ExclamationCircleIcon";
import CheckCircleIcon from "@heroicons/react/24/outline/CheckCircleIcon";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import { OperationContext, useQuery } from "urql";

import {
  NotFound,
  Pending,
  TableOfContents,
  Heading,
} from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  graphql,
  Pool,
  Scalars,
  Skill,
  FragmentType,
} from "@gc-digital-talent/graphql";

import { EditPoolSectionMetadata } from "~/types/pool";
import SEO from "~/components/SEO/SEO";
import StatusItem from "~/components/StatusItem/StatusItem";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import {
  hasEmptyRequiredFields as poolNameError,
  isInNullState as educationRequirementIsNull,
} from "~/validators/process/classification";
import { hasInvalidRequiredFields as closingDateError } from "~/validators/process/closingDate";
import { hasEmptyRequiredFields as yourImpactError } from "~/validators/process/yourImpact";
import { hasEmptyRequiredFields as keyTasksError } from "~/validators/process/keyTasks";
import { hasEmptyRequiredFields as coreRequirementsError } from "~/validators/process/coreRequirements";
import { hasEmptyRequiredFields as essentialSkillsError } from "~/validators/process/essentialSkills";
import { hasEmptyRequiredFields as nonessentialSkillsError } from "~/validators/process/nonEssentialSkills";
import { hasOneEmptyField as aboutUsError } from "~/validators/process/aboutUs";
import { hasOneEmptyField as whatToExpectAdmissionError } from "~/validators/process/whatToExpectAdmission";
import usePoolMutations from "~/hooks/usePoolMutations";
import { hasAllEmptyFields as specialNoteIsNull } from "~/validators/process/specialNote";

import PoolNameSection, {
  PoolClassification_Fragment,
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
import EssentialSkillsSection from "./components/EssentialSkillsSection";
import AssetSkillsSection from "./components/AssetSkillsSection";
import EducationRequirementsSection from "./components/EducationRequirementsSection";
import GeneralQuestionsSection, {
  type GeneralQuestionsSubmitData,
} from "./components/GeneralQuestionsSection/GeneralQuestionsSection";
import SpecialNoteSection, {
  SpecialNoteSubmitData,
} from "./components/SpecialNoteSection/SpecialNoteSection";
import WhatToExpectSection, {
  type WhatToExpectSubmitData,
} from "./components/WhatToExpectSection/WhatToExpectSection";
import EditPoolContext from "./components/EditPoolContext";
import { PoolSkillMutationsType, SectionKey } from "./types";
import AboutUsSection, {
  AboutUsSubmitData,
} from "./components/AboutUsSection/AboutUsSection";
import WhatToExpectAdmissionSection, {
  WhatToExpectAdmissionSubmitData,
} from "./components/WhatToExpectAdmissionSection/WhatToExpectAdmissionSection";

export type PoolSubmitData =
  | ClosingDateSubmitData
  | CoreRequirementsSubmitData
  | PoolNameSubmitData
  | WorkTasksSubmitData
  | YourImpactSubmitData
  | WhatToExpectSubmitData
  | WhatToExpectAdmissionSubmitData
  | SpecialNoteSubmitData
  | AboutUsSubmitData
  | GeneralQuestionsSubmitData;

export interface EditPoolFormProps {
  pool: Pool;
  classifications: FragmentType<typeof PoolClassification_Fragment>[];
  skills: Array<Skill>;
  onSave: (submitData: PoolSubmitData) => Promise<void>;
  poolSkillMutations: PoolSkillMutationsType;
}

export const EditPoolForm = ({
  pool,
  classifications,
  skills,
  onSave,
  poolSkillMutations,
}: EditPoolFormProps): JSX.Element => {
  const intl = useIntl();

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
  const skillRequirementsHasError =
    essentialSkillsError(pool) || nonessentialSkillsError(pool);
  const aboutRoleHasError =
    yourImpactError(pool) || keyTasksError(pool) || aboutUsError(pool);
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
      hasError: nonessentialSkillsError(pool),
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
    aboutUs: {
      id: "about-us",
      hasError: false, // Optional section
      title: intl.formatMessage({
        defaultMessage: "About us",
        id: "Wy6aeg",
        description: "Sub title for the pool about us section",
      }),
      inList: false,
    },
    commonQuestions: {
      id: "common-questions",
      hasError: whatToExpectAdmissionError(pool), // Add understanding classification (#8831) validation here
      title: intl.formatMessage({
        defaultMessage: "Common questions",
        id: "RahVQS",
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
    whatToExpectAdmission: {
      id: "what-to-expect-admission",
      hasError: false,
      title: intl.formatMessage({
        defaultMessage: "What to expect post-admission",
        id: "Uwtkv6",
        description: "Title for the what to expect post admission section",
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
            </TableOfContents.Navigation>
            <TableOfContents.Content>
              <div
                className="flex"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x3 0)"
              >
                <TableOfContents.Section id={sectionMetadata.basicInfo.id}>
                  <div
                    className="flex"
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
                      <p data-h2-margin-top="base(x1)">
                        {sectionMetadata.basicInfo.subtitle}
                      </p>
                    </div>
                    <PoolNameSection
                      pool={pool}
                      classificationsQuery={classifications}
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
                    className="flex"
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
                      <p data-h2-margin-top="base(x1)">
                        {sectionMetadata.skillRequirements.subtitle}
                      </p>
                    </div>
                    <EssentialSkillsSection
                      pool={pool}
                      skills={skills}
                      sectionMetadata={sectionMetadata.essentialSkills}
                      poolSkillMutations={poolSkillMutations}
                    />
                    <AssetSkillsSection
                      pool={pool}
                      skills={skills}
                      sectionMetadata={sectionMetadata.assetSkills}
                      poolSkillMutations={poolSkillMutations}
                    />
                  </div>
                </TableOfContents.Section>
                <div
                  className="flex"
                  data-h2-flex-direction="base(column)"
                  data-h2-gap="base(x3 0)"
                >
                  <TableOfContents.Section id={sectionMetadata.aboutRole.id}>
                    <div
                      className="flex"
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
                        <p data-h2-margin-top="base(x1)">
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
                      <AboutUsSection
                        pool={pool}
                        sectionMetadata={sectionMetadata.aboutUs}
                        onSave={onSave}
                      />
                    </div>
                  </TableOfContents.Section>
                </div>
                <div
                  className="flex"
                  data-h2-flex-direction="base(column)"
                  data-h2-gap="base(x3 0)"
                >
                  <TableOfContents.Section
                    id={sectionMetadata.commonQuestions.id}
                  >
                    <div
                      className="flex"
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
                        <p data-h2-margin-top="base(x1)">
                          {sectionMetadata.commonQuestions.subtitle}
                        </p>
                      </div>
                      <WhatToExpectSection
                        pool={pool}
                        sectionMetadata={sectionMetadata.whatToExpect}
                        onSave={onSave}
                      />
                      <WhatToExpectAdmissionSection
                        pool={pool}
                        sectionMetadata={sectionMetadata.whatToExpectAdmission}
                        onSave={onSave}
                      />
                    </div>
                  </TableOfContents.Section>
                </div>
                <TableOfContents.Section
                  id={sectionMetadata.generalQuestions.id}
                >
                  <GeneralQuestionsSection
                    pool={pool}
                    sectionMetadata={sectionMetadata.generalQuestions}
                    onSave={onSave}
                  />
                </TableOfContents.Section>
              </div>
            </TableOfContents.Content>
          </TableOfContents.Wrapper>
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
      classification {
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
      aboutUs {
        en
        fr
      }
      whatToExpectAdmission {
        en
        fr
      }
      poolSkills {
        id
        type
        requiredLevel
        skill {
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
      }
      isRemote
      location {
        en
        fr
      }
      stream
      processNumber
      publishingGroup
      opportunityLength
      generalQuestions {
        id
        sortOrder
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
      ...PoolClassification
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

const context: Partial<OperationContext> = {
  additionalTypenames: ["PoolSkill"],
  requestPolicy: "cache-first",
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
    context,
    variables: { poolId },
  });

  const { isFetching, mutations } = usePoolMutations();

  const ctx = React.useMemo(() => {
    return { isSubmitting: isFetching || fetching };
  }, [fetching, isFetching]);

  const poolSkillMutations = {
    create: mutations.createPoolSkill,
    update: mutations.updatePoolSkill,
    delete: mutations.deletePoolSkill,
  };

  return (
    <Pending fetching={fetching} error={error}>
      {data?.pool ? (
        <EditPoolContext.Provider value={ctx}>
          <EditPoolForm
            pool={data.pool}
            classifications={unpackMaybes(data.classifications)}
            skills={data.skills.filter(notEmpty)}
            onSave={(saveData) => mutations.update(poolId, saveData)}
            poolSkillMutations={poolSkillMutations}
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
