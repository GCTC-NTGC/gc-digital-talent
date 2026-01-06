import { useNavigate } from "react-router";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { defineMessage, useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import uniqBy from "lodash/uniqBy";

import { toast } from "@gc-digital-talent/toast";
import { Option, Select, Submit } from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  errorMessages,
  formMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { Pending, Link, Container } from "@gc-digital-talent/ui";
import {
  graphql,
  CreatePoolInput,
  CreatePoolMutation,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME, RoleName } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import messages from "~/messages/adminMessages";
import permissionConstants from "~/constants/permissionConstants";
import Hero from "~/components/Hero";

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
    name {
      en
      fr
    }
  }
`);

const CreatePoolCommunity_Fragment = graphql(/* GraphQL */ `
  fragment CreatePoolCommunity on Community {
    id
    name {
      en
      fr
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
}

export const CreatePoolForm = ({
  userId,
  classificationsQuery,
  departmentsQuery,
  communitiesQuery,
  handleCreatePool,
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

  // recycled from EditPool
  const classificationOptions: Option[] = classifications.map(
    ({ id, group, level, name }) => {
      return {
        value: id,
        label: `${group}-${level < 10 ? "0" : ""}${level} (${getLocalizedName(name, intl)})`,
      };
    },
  );

  const departmentOptions: Option[] = departments.map(({ id, name }) => ({
    value: id,
    label: getLocalizedName(name, intl),
  }));

  const communityOptions: Option[] = communities.map(({ id, name }) => ({
    value: id,
    label: getLocalizedName(name, intl),
  }));
  const communityOptionsUnique: Option[] = uniqBy(communityOptions, "value");

  return (
    <div className="my-18 sm:max-w-2xl">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-y-6">
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
            <Select
              id="community"
              label={intl.formatMessage(messages.community)}
              name="community"
              nullSelection={intl.formatMessage(
                commonMessages.selectACommunity,
              )}
              options={communityOptionsUnique}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
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
    </div>
  );
};

const CreatePoolPage_Query = graphql(/* GraphQL */ `
  query CreatePoolPage {
    me {
      id
      authInfo {
        roleAssignments {
          role {
            name
          }
          teamable {
            id
            ... on Community {
              ...CreatePoolCommunity
            }
          }
        }
      }
    }
    classifications {
      ...CreatePoolClassification
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

const createProcessRoles: RoleName[] = [
  ROLE_NAME.CommunityAdmin,
  ROLE_NAME.CommunityRecruiter,
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
  const [{ data, fetching, error }] = useQuery({ query: CreatePoolPage_Query });

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
  type RoleAssignment = (typeof roleAssignments)[number];

  function isAuthorizedCommunity(
    assignment: RoleAssignment,
  ): assignment is RoleAssignment & {
    teamable: Extract<RoleAssignment["teamable"], { __typename: "Community" }>;
  } {
    return (
      !!assignment.role &&
      createProcessRoles.includes(assignment.role.name as RoleName) &&
      assignment.teamable?.__typename === "Community"
    );
  }

  const communities = roleAssignments
    .filter(isAuthorizedCommunity)
    .map((assignment) => assignment.teamable);

  return (
    <>
      <SEO title={formattedPageTitle} description={formattedSubTitle} />
      <Hero
        title={formattedPageTitle}
        subtitle={formattedSubTitle}
        crumbs={navigationCrumbs}
      />
      <Container>
        <Pending fetching={fetching} error={error}>
          <CreatePoolForm
            userId={data?.me?.id ?? ""}
            classificationsQuery={unpackMaybes(data?.classifications)}
            departmentsQuery={unpackMaybes(data?.departments)}
            communitiesQuery={communities}
            handleCreatePool={handleCreatePool}
          />
        </Pending>
      </Container>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={permissionConstants.createProcess}>
    <CreatePoolPage />
  </RequireAuth>
);

Component.displayName = "AdminCreatePoolPage";

export default Component;
