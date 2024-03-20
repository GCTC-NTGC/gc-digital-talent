import * as React from "react";
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
  RoleAssignment,
  CreatePoolInput,
  CreatePoolMutation,
  Classification,
  Maybe,
  Team,
} from "@gc-digital-talent/graphql";

import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import { pageTitle as indexPoolPageTitle } from "~/pages/Pools/IndexPoolPage/IndexPoolPage";
import AdminHero from "~/components/Hero/AdminHero";

type FormValues = {
  classification: string[];
  team: string;
};

interface CreatePoolFormProps {
  userId: string;
  classificationsArray: Classification[];
  handleCreatePool: (
    userId: string,
    teamId: string,
    data: CreatePoolInput,
  ) => Promise<CreatePoolMutation["createPool"]>;
  teamsArray: Team[];
}

export const CreatePoolForm = ({
  userId,
  classificationsArray,
  handleCreatePool,
  teamsArray,
}: CreatePoolFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;

  // submission section, and navigate to edit the created pool
  const formValuesToSubmitData = (values: FormValues): CreatePoolInput => ({
    classifications: {
      sync: values.classification,
    },
  });
  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    await handleCreatePool(userId, data.team, formValuesToSubmitData(data))
      .then((result) => {
        if (result) {
          navigate(paths.poolUpdate(result.id));
          toast.success(
            intl.formatMessage({
              defaultMessage: "Pool created successfully!",
              id: "wZ91g+",
              description:
                "Message displayed to user after pool is created successfully.",
            }),
          );
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating pool failed",
            id: "W2qRX5",
            description:
              "Message displayed to pool after pool fails to get created.",
          }),
        );
      });
  };

  // recycled from EditPool
  const classificationOptions: Option[] = classificationsArray.map(
    ({ id, group, level, name }) => ({
      value: id,
      label: `${group}-0${level} (${getLocalizedName(name, intl)})`,
    }),
  );

  const teamOptions: Option[] = teamsArray.map(({ id, displayName }) => ({
    value: id,
    label: getLocalizedName(displayName, intl),
  }));

  return (
    <div data-h2-container="base(left, small, 0)">
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
            <div
              data-h2-display="base(flex)"
              data-h2-gap="base(x1)"
              data-h2-align-items="base(center)"
            >
              <Submit
                color="secondary"
                text={intl.formatMessage({
                  defaultMessage: "Create new pool",
                  id: "TLl20s",
                  description:
                    "Label displayed on submit button for new pool form.",
                })}
              />
              <Link href={paths.poolTable()} mode="inline" color="quaternary">
                {intl.formatMessage(formMessages.cancelGoBack)}
              </Link>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

const roleAssignmentsToTeams = (
  roleAssignmentArray: Maybe<RoleAssignment[]>,
): Team[] => {
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
            name
            displayName {
              en
              fr
            }
          }
        }
      }
    }
    classifications {
      name {
        en
        fr
      }
      level
      group
      id
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
  defaultMessage: "Create pool",
  id: "zwYuly",
  description: "Page title for the pool creation page",
});

const subTitle = defineMessage({
  defaultMessage: "Create a new job poster from scratch",
  id: "QodYZE",
  description: "Form blurb describing create pool form",
});

const CreatePoolPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const [lookupResult] = useQuery({ query: CreatePoolPage_Query });
  const { data: lookupData, fetching, error } = lookupResult;

  // current user
  const userIdQueryUntyped = lookupData?.me?.id;
  const userIdQuery = userIdQueryUntyped || "";

  const classificationsData = unpackMaybes(lookupData?.classifications);
  const roleAssignments =
    unpackMaybes(lookupData?.me?.authInfo?.roleAssignments) ?? [];
  const teamsArray = roleAssignmentsToTeams(roleAssignments);

  const [, executeMutation] = useMutation(CreatePoolPage_Mutation);
  const handleCreatePool = (
    userId: string,
    teamId: string,
    data: CreatePoolInput,
  ) =>
    executeMutation({ userId, teamId, pool: data }).then((result) => {
      if (result.data?.createPool) {
        return result.data?.createPool;
      }
      return Promise.reject(result.error);
    });

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: routes.adminDashboard(),
    },
    {
      label: intl.formatMessage(indexPoolPageTitle),
      url: routes.poolTable(),
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Create new pool",
        id: "OgeWgx",
        description: "Breadcrumb title for the create new pool page link.",
      }),
      url: routes.poolCreate(),
    },
  ];

  const formattedPageTitle = intl.formatMessage(pageTitle);
  const formattedSubTitle = intl.formatMessage(subTitle);

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
            userId={userIdQuery}
            classificationsArray={classificationsData}
            handleCreatePool={handleCreatePool}
            teamsArray={teamsArray}
          />
        </Pending>
      </AdminContentWrapper>
    </>
  );
};

export default CreatePoolPage;
