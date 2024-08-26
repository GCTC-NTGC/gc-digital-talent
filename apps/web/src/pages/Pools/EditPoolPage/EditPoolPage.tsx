import { useIntl } from "react-intl";
import ExclamationCircleIcon from "@heroicons/react/24/outline/ExclamationCircleIcon";
import CheckCircleIcon from "@heroicons/react/24/outline/CheckCircleIcon";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import { OperationContext, useQuery } from "urql";
import { useMemo, JSX } from "react";

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
  Scalars,
  Skill,
  FragmentType,
  getFragment,
  UpdatePublishedPoolInput,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

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
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import PoolNameSection, {
  PoolClassification_Fragment,
  PoolDepartment_Fragment,
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

export const EditPool_Fragment = graphql(/* GraphQL */ `
  fragment EditPool on Pool {
    ...EditPoolAboutUs
    ...EditPoolClosingDate
    ...EditPoolCoreRequirements
    ...EditPoolEducationRequirements
    ...EditPoolGeneralQuestions
    ...EditPoolKeyTasks
    ...EditPoolName
    ...EditPoolSkills
    ...EditPoolSpecialNote
    ...EditPoolWhatToExpectAdmission
    ...EditPoolWhatToExpect
    ...EditPoolYourImpact

    id
    stream {
      value
      label {
        en
        fr
      }
    }
    processNumber
    publishingGroup {
      value
      label {
        en
        fr
      }
    }
    opportunityLength {
      value
      label {
        en
        fr
      }
    }
    closingDate
    language {
      value
      label {
        en
        fr
      }
    }
    securityClearance {
      value
      label {
        en
        fr
      }
    }
    publishedAt
    status {
      value
      label {
        en
        fr
      }
    }
    location {
      en
      fr
    }
    name {
      en
      fr
    }
    classification {
      id
      group
      level
    }
    poolSkills {
      id
      type {
        value
        label {
          en
          fr
        }
      }
      requiredLevel
      skill {
        id
        category {
          value
          label {
            en
            fr
          }
        }
        key
        name {
          en
          fr
        }
      }
    }
    aboutUs {
      en
      fr
    }
    yourImpact {
      en
      fr
    }
    keyTasks {
      en
      fr
    }
    specialNote {
      en
      fr
    }
    whatToExpectAdmission {
      en
      fr
    }
    department {
      id
      departmentNumber
      name {
        en
        fr
      }
    }
    isRemote
  }
`);

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
  poolQuery: FragmentType<typeof EditPool_Fragment>;
  classifications: FragmentType<typeof PoolClassification_Fragment>[];
  departments: FragmentType<typeof PoolDepartment_Fragment>[];
  skills: Skill[];
  onSave: (submitData: PoolSubmitData) => Promise<void>;
  onUpdatePublished: (submitData: UpdatePublishedPoolInput) => Promise<void>;
  poolSkillMutations: PoolSkillMutationsType;
}

export const EditPoolForm = ({
  poolQuery,
  classifications,
  departments,
  skills,
  onSave,
  onUpdatePublished,
  poolSkillMutations,
}: EditPoolFormProps): JSX.Element => {
  const intl = useIntl();
  const pool = getFragment(EditPool_Fragment, poolQuery);

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

  const basicInfoHasError =
    poolNameError({
      classification: pool.classification,
      department: pool.department,
      stream: pool.stream,
      name: pool.name,
      processNumber: pool.processNumber,
      publishingGroup: pool.publishingGroup,
      opportunityLength: pool.opportunityLength,
    }) ||
    closingDateError({ closingDate: pool.closingDate, status: pool.status });
  const skillRequirementsHasError =
    essentialSkillsError({ poolSkills: pool.poolSkills }) ||
    nonessentialSkillsError({ poolSkills: pool.poolSkills });
  const aboutRoleHasError =
    yourImpactError({ yourImpact: pool.yourImpact }) ||
    keyTasksError({ keyTasks: pool.keyTasks }) ||
    aboutUsError({ aboutUs: pool.aboutUs });
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
      hasError: poolNameError({
        classification: pool.classification,
        department: pool.department,
        stream: pool.stream,
        name: pool.name,
        processNumber: pool.processNumber,
        publishingGroup: pool.publishingGroup,
        opportunityLength: pool.opportunityLength,
      }),
      title: intl.formatMessage({
        defaultMessage: "Advertisement details",
        id: "KEm64j",
        description: "Sub title for advertisement details",
      }),
      inList: false,
    },
    closingDate: {
      id: "closing-date",
      hasError: closingDateError({
        closingDate: pool.closingDate,
        status: pool.status,
      }),
      title: intl.formatMessage({
        defaultMessage: "Closing date",
        id: "I8jlr2",
        description: "Sub title for pool closing date",
      }),
      inList: false,
    },
    coreRequirements: {
      id: "core-requirements",
      hasError: coreRequirementsError({
        language: pool.language,
        securityClearance: pool.securityClearance,
        location: pool.location,
        isRemote: pool.isRemote,
      }),
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
      status: specialNoteIsNull({ specialNote: pool.specialNote })
        ? "optional"
        : "success",
    },
    educationRequirements: {
      id: "education-requirements",
      hasError: educationRequirementIsNull({
        stream: pool.stream,
        name: pool.name,
        processNumber: pool.processNumber,
        publishingGroup: pool.publishingGroup,
      }),
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
      hasError: essentialSkillsError({ poolSkills: pool.poolSkills }),
      title: intl.formatMessage({
        defaultMessage: "Essential skill criteria",
        id: "xIniPc",
        description: "Sub title for the pool essential skills",
      }),
      inList: false,
    },
    assetSkills: {
      id: "asset-skills",
      hasError: nonessentialSkillsError({ poolSkills: pool.poolSkills }),
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
      hasError: yourImpactError({ yourImpact: pool.yourImpact }),
      title: intl.formatMessage({
        defaultMessage: "Your impact",
        id: "ry3jFR",
        description: "Sub title for the pool introduction",
      }),
      inList: false,
    },
    workTasks: {
      id: "work-tasks",
      hasError: keyTasksError({ keyTasks: pool.keyTasks }),
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
      hasError: whatToExpectAdmissionError({
        whatToExpectAdmission: pool.whatToExpectAdmission,
      }), // Add understanding classification (#8831) validation here
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
        <div data-h2-wrapper="base(left, large, 0)">
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
                      <p data-h2-margin-top="base(x1)">
                        {sectionMetadata.basicInfo.subtitle}
                      </p>
                    </div>
                    <PoolNameSection
                      poolQuery={pool}
                      classificationsQuery={classifications}
                      departmentsQuery={departments}
                      sectionMetadata={sectionMetadata.poolName}
                      onSave={onSave}
                    />
                    <ClosingDateSection
                      poolQuery={pool}
                      sectionMetadata={sectionMetadata.closingDate}
                      onSave={onSave}
                    />
                  </div>
                </TableOfContents.Section>
                <TableOfContents.Section
                  id={sectionMetadata.coreRequirements.id}
                >
                  <CoreRequirementsSection
                    poolQuery={pool}
                    sectionMetadata={sectionMetadata.coreRequirements}
                    onSave={onSave}
                  />
                </TableOfContents.Section>
                <TableOfContents.Section id={sectionMetadata.specialNote.id}>
                  <SpecialNoteSection
                    poolQuery={pool}
                    sectionMetadata={sectionMetadata.specialNote}
                    onSave={onSave}
                    onUpdatePublished={onUpdatePublished}
                  />
                </TableOfContents.Section>
                <TableOfContents.Section
                  id={sectionMetadata.educationRequirements.id}
                >
                  <EducationRequirementsSection
                    poolQuery={pool}
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
                      <p data-h2-margin-top="base(x1)">
                        {sectionMetadata.skillRequirements.subtitle}
                      </p>
                    </div>
                    <EssentialSkillsSection
                      poolQuery={pool}
                      skills={skills}
                      sectionMetadata={sectionMetadata.essentialSkills}
                      poolSkillMutations={poolSkillMutations}
                    />
                    <AssetSkillsSection
                      poolQuery={pool}
                      skills={skills}
                      sectionMetadata={sectionMetadata.assetSkills}
                      poolSkillMutations={poolSkillMutations}
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
                        <p data-h2-margin-top="base(x1)">
                          {sectionMetadata.aboutRole.subtitle}
                        </p>
                      </div>
                      <YourImpactSection
                        poolQuery={pool}
                        sectionMetadata={sectionMetadata.yourImpact}
                        onSave={onSave}
                        onUpdatePublished={onUpdatePublished}
                      />
                      <WorkTasksSection
                        poolQuery={pool}
                        sectionMetadata={sectionMetadata.workTasks}
                        onSave={onSave}
                        onUpdatePublished={onUpdatePublished}
                      />
                      <AboutUsSection
                        poolQuery={pool}
                        sectionMetadata={sectionMetadata.aboutUs}
                        onSave={onSave}
                        onUpdatePublished={onUpdatePublished}
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
                        <p data-h2-margin-top="base(x1)">
                          {sectionMetadata.commonQuestions.subtitle}
                        </p>
                      </div>
                      <WhatToExpectSection
                        poolQuery={pool}
                        sectionMetadata={sectionMetadata.whatToExpect}
                        onSave={onSave}
                        onUpdatePublished={onUpdatePublished}
                      />
                      <WhatToExpectAdmissionSection
                        poolQuery={pool}
                        sectionMetadata={sectionMetadata.whatToExpectAdmission}
                        onSave={onSave}
                        onUpdatePublished={onUpdatePublished}
                      />
                    </div>
                  </TableOfContents.Section>
                </div>
                <TableOfContents.Section
                  id={sectionMetadata.generalQuestions.id}
                >
                  <GeneralQuestionsSection
                    poolQuery={pool}
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
      status {
        value
        label {
          en
          fr
        }
      }
      ...EditPool
    }

    # all classifications to populate form dropdown
    classifications {
      ...PoolClassification
    }

    # all departments to populate form dropdown
    departments {
      ...PoolDepartment
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
      category {
        value
        label {
          en
          fr
        }
      }
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

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
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

  const ctx = useMemo(() => {
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
            poolQuery={data.pool}
            classifications={unpackMaybes(data.classifications)}
            departments={unpackMaybes(data.departments)}
            skills={data.skills.filter(notEmpty)}
            onSave={(saveData) => mutations.update(poolId, saveData)}
            onUpdatePublished={(updateData) =>
              mutations.updatePublished(poolId, updateData)
            }
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

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PoolOperator,
      ROLE_NAME.CommunityManager,
      ROLE_NAME.PlatformAdmin,
    ]}
  >
    <EditPoolPage />
  </RequireAuth>
);

Component.displayName = "AdminEditPoolPage";

export default EditPoolPage;
