import { useNavigate } from "react-router";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { defineMessage, useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { toast } from "@gc-digital-talent/toast";
import { Option, Select, Submit } from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  errorMessages,
  formMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { Pending, Link, Card, Heading } from "@gc-digital-talent/ui";
import {
  graphql,
  CreatePoolInput,
  CreatePoolMutation,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";
import { hasRequiredRoles, ROLE_NAME, RoleName } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import messages from "~/messages/adminMessages";
import permissionConstants from "~/constants/permissionConstants";
import Hero from "~/components/Hero";

import FunctionalCommunitySection from "./FunctionalCommunitySection";

const CreatePoolClassification_Fragment = graphql(/* GraphQL */ `
  fragment CreatePoolClassification on Classification {
    id
    group
    level
    name {
      en
      fr
    }
  }
`);

const CreatePoolDepartment_Fragment = graphql(/* GraphQL */ `
  fragment CreatePoolDepartment on Department {
    id
    departmentName: name {
      localized
    }
    isCorePublicAdministration
    isCentralAgency
    isScience
    isRegulatory
  }
`);

export const CreatePoolCommunity_Fragment = graphql(/* GraphQL */ `
  fragment CreatePoolCommunity on Community {
    id
    name {
      localized
    }
    description {
      localized
    }
    workStreams {
      id
      name {
        localized
      }
    }
  }
`);

interface FormValues {
  classification: string;
  department: string;
  community: string;
}

interface CreatePoolFormProps {
  userId: string;
  classificationsQuery: FragmentType<
    typeof CreatePoolClassification_Fragment
  >[];
  departmentsQuery: FragmentType<typeof CreatePoolDepartment_Fragment>[];
  communitiesQuery: FragmentType<typeof CreatePoolCommunity_Fragment>[];
  handleCreatePool: (
    userId: string,
    communityId: string,
    data: CreatePoolInput,
  ) => Promise<CreatePoolMutation["createPool"]>;
  canToggleFunctionalCommunity: boolean;
}

export const CreatePoolForm = ({
  userId,
  classificationsQuery,
  departmentsQuery,
  communitiesQuery,
  handleCreatePool,
  canToggleFunctionalCommunity,
}: CreatePoolFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;
  const classifications = getFragment(
    CreatePoolClassification_Fragment,
    classificationsQuery,
  );
  const departments = getFragment(
    CreatePoolDepartment_Fragment,
    departmentsQuery,
  );
  const communities = getFragment(
    CreatePoolCommunity_Fragment,
    communitiesQuery,
  );

  // submission section, and navigate to edit the created pool
  const formValuesToSubmitData = (values: FormValues): CreatePoolInput => ({
    classification: {
      connect: values.classification,
    },
    department: {
      connect: values.department,
    },
  });
  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    await handleCreatePool(userId, data.community, formValuesToSubmitData(data))
      .then(async (result) => {
        if (result) {
          await navigate(paths.poolUpdate(result.id));
          toast.success(
            intl.formatMessage({
              defaultMessage: "Recruitment process created successfully!",
              id: "/UxJBZ",
              description:
                "Message displayed to user after pool is created successfully.",
            }),
          );
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating recruitment process failed",
            id: "ruHk5N",
            description:
              "Message displayed to pool after pool fails to get created.",
          }),
        );
      });
  };

  const classificationOptions: Option[] = classifications.map(
    ({ id, group, level, name }) => {
      return {
        value: id,
        label: `${group}-${level < 10 ? "0" : ""}${level} (${getLocalizedName(name, intl)})`,
      };
    },
  );

  const departmentOptions: Option[] = departments.map(
    ({ id, departmentName }) => ({
      value: id,
      label:
        departmentName?.localized ??
        intl.formatMessage(commonMessages.notAvailable),
    }),
  );

  return (
    <Card className="mb-18">
      <Heading
        level="h2"
        color="secondary"
        icon={IdentificationIcon}
        className="mt-0 xs:justify-start xs:text-left"
        center
      >
        {intl.formatMessage({
          defaultMessage: "Basic details",
          id: "G7uMOV",
          description: "The basic details of a job poster template",
        })}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Fill out the basic information regarding your new process advertisement.",
          id: "diWnGY",
          description: "Informative line for create a process page",
        })}
      </p>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-y-6">
            <div>
              <Card.Separator space="none" className="my-6" />
              <p>
                {intl.formatMessage({
                  defaultMessage: "Basic details",
                  id: "G7uMOV",
                  description: "The basic details of a job poster template",
                })}
              </p>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Fill out the basic information regarding your new process advertisement.",
                  id: "diWnGY",
                  description: "Informative line for create a process page",
                })}
              </p>
              <Select
                id="classification"
                label={intl.formatMessage(messages.groupAndLevel)}
                name="classification"
                nullSelection={intl.formatMessage({
                  defaultMessage: "Select a classification",
                  id: "tD99Wf",
                  description:
                    "Placeholder displayed on the pool form classification field.",
                })}
                options={classificationOptions}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
              <Card.Separator space="none" className="my-6" />
            </div>
            <div>
              <p>
                {intl.formatMessage({
                  defaultMessage: "Basic details",
                  id: "G7uMOV",
                  description: "The basic details of a job poster template",
                })}
              </p>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Fill out the basic information regarding your new process advertisement.",
                  id: "diWnGY",
                  description: "Informative line for create a process page",
                })}
              </p>
              <Select
                id="department"
                label={intl.formatMessage(messages.department)}
                name="department"
                nullSelection={intl.formatMessage({
                  defaultMessage: "Select a department",
                  id: "y827h2",
                  description:
                    "Null selection for department select input in the request form.",
                })}
                options={departmentOptions}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
              <Card.Separator space="none" className="my-6" />
            </div>
            <div>
              <p>
                {intl.formatMessage({
                  defaultMessage: "Basic details",
                  id: "G7uMOV",
                  description: "The basic details of a job poster template",
                })}
              </p>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Fill out the basic information regarding your new process advertisement.",
                  id: "diWnGY",
                  description: "Informative line for create a process page",
                })}
              </p>
              <FunctionalCommunitySection
                communities={communities}
                canToggleFunctionalCommunity={canToggleFunctionalCommunity}
              />
              <Card.Separator space="none" className="my-6" />
            </div>
            <div className="flex items-center gap-6">
              <Submit
                color="secondary"
                text={intl.formatMessage({
                  defaultMessage: "Create process",
                  id: "rRREuF",
                  description:
                    "Label/title for creating a recruitment process.",
                })}
              />
              <Link href={paths.poolTable()} mode="inline" color="warning">
                {intl.formatMessage(formMessages.cancelGoBack)}
              </Link>
            </div>
          </div>
        </form>
      </FormProvider>
    </Card>
  );
};

const CreatePoolPage_Query = graphql(/* GraphQL */ `
  query CreatePoolPage {
    me {
      id
      authInfo {
        roleAssignments {
          id
          role {
            id
            name
          }
          teamable {
            id
            ... on Community {
              ...CreatePoolCommunity
            }
          }
          teamable {
            id
            ... on Department {
              ...CreatePoolDepartment
            }
          }
        }
      }
    }
    classifications {
      ...CreatePoolClassification
    }
    communities {
      ...CreatePoolCommunity
    }
    departments {
      ...CreatePoolDepartment
    }
  }
`);

const CreatePoolPage_Mutation = graphql(/* GraphQL */ `
  mutation CreatePool(
    $userId: ID!
    $communityId: ID!
    $pool: CreatePoolInput!
  ) {
    createPool(userId: $userId, communityId: $communityId, pool: $pool) {
      id
      name {
        en
        fr
      }
    }
  }
`);

const createProcessCommunityRoles: RoleName[] = [
  ROLE_NAME.CommunityAdmin,
  ROLE_NAME.CommunityRecruiter,
];

const createProcessDepartmentRoles: RoleName[] = [
  ROLE_NAME.DepartmentAdmin,
  ROLE_NAME.DepartmentHRAdvisor,
];

const pageTitle = defineMessage({
  defaultMessage: "Create process",
  id: "rRREuF",
  description: "Label/title for creating a recruitment process.",
});

const subTitle = defineMessage({
  defaultMessage: "Create a job poster from scratch",
  id: "8XGVrK",
  description: "Form blurb describing create pool form",
});

const CreatePoolPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const [{ data, fetching, error }] = useQuery({
    query: CreatePoolPage_Query,
  });

  const [, executeMutation] = useMutation(CreatePoolPage_Mutation);
  const handleCreatePool = (
    userId: string,
    communityId: string,
    pool: CreatePoolInput,
  ) =>
    executeMutation({ userId, communityId, pool }).then((result) => {
      if (result.data?.createPool) {
        return result.data?.createPool;
      }
      return Promise.reject(new Error(result.error?.toString()));
    });

  const formattedPageTitle = intl.formatMessage(pageTitle);
  const formattedSubTitle = intl.formatMessage(subTitle);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.processes),
        url: routes.poolTable(),
      },
      {
        label: formattedPageTitle,
        url: routes.poolCreate(),
      },
    ],
  });

  const roleAssignments = unpackMaybes(data?.me?.authInfo?.roleAssignments);

  // defining methods to figure out when a community role or department role is applicable
  type RoleAssignment = (typeof roleAssignments)[number];
  function isAuthorizedCommunity(
    assignment: RoleAssignment,
  ): assignment is RoleAssignment & {
    teamable: Extract<RoleAssignment["teamable"], { __typename: "Community" }>;
  } {
    return (
      !!assignment.role &&
      createProcessCommunityRoles.includes(assignment.role.name as RoleName) &&
      assignment.teamable?.__typename === "Community"
    );
  }
  function isAuthorizedDepartment(
    assignment: RoleAssignment,
  ): assignment is RoleAssignment & {
    teamable: Extract<RoleAssignment["teamable"], { __typename: "Department" }>;
  } {
    return (
      !!assignment.role &&
      createProcessDepartmentRoles.includes(assignment.role.name as RoleName) &&
      assignment.teamable?.__typename === "Department"
    );
  }

  // determine if user has one of, both, or none of the branches Community and Department
  const hasCommunityRole = hasRequiredRoles({
    toCheck: [{ name: "community_admin" }, { name: "community_recruiter" }],
    userRoles: roleAssignments,
  });
  const hasDepartmentRole = hasRequiredRoles({
    toCheck: [{ name: "department_admin" }, { name: "department_hr_advisor" }],
    userRoles: roleAssignments,
  });

  // determine what communities and departments to display
  // only community -> sees own communities plus all departments
  // only department -> sees own departments plus all communities
  // both -> sees all, edge scenario, validator responsible for this
  let communities: FragmentType<typeof CreatePoolCommunity_Fragment>[] = [];
  let departments: FragmentType<typeof CreatePoolDepartment_Fragment>[] = [];

  // whether the community selection is optional for a user, never optional for users with only community role
  const canToggleFunctionalCommunity = !(
    hasCommunityRole && !hasDepartmentRole
  );

  if (hasCommunityRole && hasDepartmentRole) {
    communities = unpackMaybes(data?.communities);
    departments = unpackMaybes(data?.departments);
  } else if (hasCommunityRole) {
    communities = roleAssignments
      .filter(isAuthorizedCommunity)
      .map((assignment) => assignment.teamable);
    departments = unpackMaybes(data?.departments);
  } else if (hasDepartmentRole) {
    communities = unpackMaybes(data?.communities);
    departments = roleAssignments
      .filter(isAuthorizedDepartment)
      .map((assignment) => assignment.teamable);
  } else {
    communities = [];
    departments = [];
  }

  return (
    <>
      <SEO title={formattedPageTitle} description={formattedSubTitle} />
      <Hero
        title={formattedPageTitle}
        subtitle={formattedSubTitle}
        crumbs={navigationCrumbs}
        overlap
        centered
      >
        <Pending fetching={fetching} error={error}>
          <CreatePoolForm
            userId={data?.me?.id ?? ""}
            classificationsQuery={unpackMaybes(data?.classifications)}
            departmentsQuery={departments}
            communitiesQuery={communities}
            handleCreatePool={handleCreatePool}
            canToggleFunctionalCommunity={canToggleFunctionalCommunity}
          />
        </Pending>
      </Hero>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={permissionConstants.createProcess}>
    <CreatePoolPage />
  </RequireAuth>
);

Component.displayName = "AdminCreatePoolPage2";

export default Component;
