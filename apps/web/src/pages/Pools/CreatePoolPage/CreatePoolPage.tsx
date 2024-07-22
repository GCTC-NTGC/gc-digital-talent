import { useNavigate } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { defineMessage, useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";

import { toast } from "@gc-digital-talent/toast";
import { Option, Select, Submit } from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  errorMessages,
  formMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { Pending, Link } from "@gc-digital-talent/ui";
import {
  graphql,
  CreatePoolInput,
  CreatePoolMutation,
  Maybe,
  Team,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import AdminHero from "~/components/Hero/AdminHero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";

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

type FormValues = {
  classification: string;
  team: string;
  department: string;
};

interface CreatePoolFormProps {
  userId: string;
  classificationsQuery: FragmentType<
    typeof CreatePoolClassification_Fragment
  >[];
  departmentsQuery: FragmentType<typeof CreatePoolDepartment_Fragment>[];
  handleCreatePool: (
    userId: string,
    teamId: string,
    data: CreatePoolInput,
  ) => Promise<CreatePoolMutation["createPool"]>;
  teamsArray: Pick<Team, "id" | "displayName">[];
}

export const CreatePoolForm = ({
  userId,
  classificationsQuery,
  departmentsQuery,
  handleCreatePool,
  teamsArray,
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
    await handleCreatePool(userId, data.team, formValuesToSubmitData(data))
      .then((result) => {
        if (result) {
          navigate(paths.poolUpdate(result.id));
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
    ({ id, group, level, name }) => ({
      value: id,
      label: `${group}-0${level} (${getLocalizedName(name, intl)})`,
    }),
  );

  const teamOptions: Option[] = teamsArray.map(({ id, displayName }) => ({
    value: id,
    label: getLocalizedName(displayName, intl),
  }));

  const departmentOptions: Option[] = departments.map(({ id, name }) => ({
    value: id,
    label: getLocalizedName(name, intl),
  }));

  return (
    <div data-h2-wrapper="base(left, small, 0)">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-gap="base(x1 0)"
          >
            <Select
              id="classification"
              label={intl.formatMessage({
                defaultMessage: "Starting group and level",
                id: "gN5gy5",
                description:
                  "Label displayed on the pool form classification field.",
              })}
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
              id="team"
              label={intl.formatMessage({
                defaultMessage: "Parent team",
                id: "mOS8rj",
                description:
                  "Label displayed for selecting what team a new pool belongs to.",
              })}
              name="team"
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a team",
                id: "COJ3St",
                description: "Placeholder displayed for team selection input.",
              })}
              options={teamOptions}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Select
              id="department"
              label={intl.formatMessage({
                defaultMessage: "Parent department",
                id: "D/Ymty",
                description:
                  "Label displayed on the pool form department field.",
              })}
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
            <div
              data-h2-display="base(flex)"
              data-h2-gap="base(x1)"
              data-h2-align-items="base(center)"
            >
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

type ConstrainedTeamOnRoleAssignment = {
  team?: Maybe<Pick<Team, "id" | "displayName">>;
};

const roleAssignmentsToTeams = (
  roleAssignmentArray: Maybe<ConstrainedTeamOnRoleAssignment[]>,
): Pick<Team, "id" | "displayName">[] => {
  const flattenedTeams = roleAssignmentArray?.flatMap(
    (roleAssign) => roleAssign.team,
  );
  const filteredFlattenedTeams = unpackMaybes(flattenedTeams);

  // clear out any duplicate teams that could arise from multiple team-based roles per team
  // https://stackoverflow.com/a/56757215
  const teamsArray = filteredFlattenedTeams.filter(
    (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i,
  );
  return teamsArray;
};

const CreatePoolPage_Query = graphql(/* GraphQL */ `
  query CreatePoolPage {
    me {
      id
      authInfo {
        id
        roleAssignments {
          id
          team {
            id
            displayName {
              en
              fr
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
  mutation CreatePool($userId: ID!, $teamId: ID!, $pool: CreatePoolInput!) {
    createPool(userId: $userId, teamId: $teamId, pool: $pool) {
      id
      name {
        en
        fr
      }
    }
  }
`);

const pageTitle = defineMessage({
  defaultMessage: "Create process",
  id: "rRREuF",
  description: "Label/title for creating a recruitment process.",
});

const subTitle = defineMessage({
  defaultMessage: "Create a new job poster from scratch",
  id: "QodYZE",
  description: "Form blurb describing create pool form",
});

const CreatePoolPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const [{ data, fetching, error }] = useQuery({ query: CreatePoolPage_Query });

  const roleAssignments =
    unpackMaybes(data?.me?.authInfo?.roleAssignments) ?? [];
  const teamsArray = roleAssignmentsToTeams(roleAssignments);

  const [, executeMutation] = useMutation(CreatePoolPage_Mutation);
  const handleCreatePool = (
    userId: string,
    teamId: string,
    pool: CreatePoolInput,
  ) =>
    executeMutation({ userId, teamId, pool }).then((result) => {
      if (result.data?.createPool) {
        return result.data?.createPool;
      }
      return Promise.reject(result.error);
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
    isAdmin: true,
  });

  return (
    <>
      <SEO title={formattedPageTitle} description={formattedSubTitle} />
      <AdminHero
        title={formattedPageTitle}
        subtitle={formattedSubTitle}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <Pending fetching={fetching} error={error}>
          <CreatePoolForm
            userId={data?.me?.id ?? ""}
            classificationsQuery={unpackMaybes(data?.classifications)}
            departmentsQuery={unpackMaybes(data?.departments)}
            handleCreatePool={handleCreatePool}
            teamsArray={teamsArray}
          />
        </Pending>
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PoolOperator]}>
    <CreatePoolPage />
  </RequireAuth>
);

Component.displayName = "AdminCreatePoolPage";

export default CreatePoolPage;
