import * as React from "react";
import { useNavigate } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { Squares2X2Icon } from "@heroicons/react/24/outline";

import { toast } from "@gc-digital-talent/toast";
import { Select, Submit, unpackMaybes } from "@gc-digital-talent/forms";
import { errorMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { Pending, Link } from "@gc-digital-talent/ui";

import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import PageHeader from "~/components/PageHeader/PageHeader";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import {
  CreatePoolAdvertisementInput,
  useCreatePoolAdvertisementMutation,
  CreatePoolAdvertisementMutation,
  useGetMePoolCreationQuery,
  Classification,
  Maybe,
  Team,
} from "~/api/generated";
import { RoleAssignment } from "@gc-digital-talent/graphql";

type Option<V> = { value: V; label: string };

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
    data: CreatePoolAdvertisementInput,
  ) => Promise<CreatePoolAdvertisementMutation["createPoolAdvertisement"]>;
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
  const formValuesToSubmitData = (
    values: FormValues,
  ): CreatePoolAdvertisementInput => ({
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
  const classificationOptions: Option<string>[] = classificationsArray
    .map(({ id, group, level, name }) => ({
      value: id,
      label: `${group}-0${level} (${getLocalizedName(name, intl)})`,
    }))
    .sort((a, b) => (a.label >= b.label ? 1 : -1));

  const teamOptions: Option<string>[] = teamsArray
    .map(({ id, displayName }) => ({
      value: id,
      label: getLocalizedName(displayName, intl),
    }))
    .sort((a, b) => (a.label >= b.label ? 1 : -1));

  return (
    <section data-h2-container="base(left, small, 0)">
      <PageHeader icon={Squares2X2Icon}>
        {intl.formatMessage({
          defaultMessage: "Create New Pool",
          id: "+umNAP",
          description: "Header for page to create pool advertisements",
        })}
      </PageHeader>
      <div data-h2-margin="base(x2, 0, 0, 0)">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 data-h2-margin="base(x.25, 0)" data-h2-font-size="base(h3)">
              {intl.formatMessage({
                defaultMessage: "Start blank job poster",
                id: "gv1Hwu",
                description: "Form header to create new pool",
              })}
            </h2>
            <p>
              {intl.formatMessage({
                defaultMessage: "Create a new job poster from scratch",
                id: "QodYZE",
                description: "Form blurb describing create pool form",
              })}
            </p>
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
                defaultMessage: "Select a classification...",
                id: "7aG86f",
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
                defaultMessage: "Select a team...",
                id: "hr/i9h",
                description: "Placeholder displayed for team selection input.",
              })}
              options={teamOptions}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Submit
              color="cta"
              text={intl.formatMessage({
                defaultMessage: "Create new pool",
                id: "TLl20s",
                description:
                  "Label displayed on submit button for new pool form.",
              })}
            />
          </form>
        </FormProvider>
      </div>

      <div data-h2-margin="base(x2, 0, 0, 0)">
        <Link
          type="button"
          href={paths.poolTable()}
          mode="outline"
          color="primary"
        >
          {intl.formatMessage({
            defaultMessage: "Cancel and go back",
            id: "dJxNRU",
            description: "Label displayed on cancel button for new pool form.",
          })}
        </Link>
      </div>
    </section>
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

const CreatePoolPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const [lookupResult] = useGetMePoolCreationQuery();
  const { data: lookupData, fetching, error } = lookupResult;

  // current user
  const userIdQueryUntyped = lookupData?.me?.id;
  const userIdQuery = userIdQueryUntyped || "";

  const classificationsData = unpackMaybes(lookupData?.classifications);
  const teamsArray = roleAssignmentsToTeams(lookupData?.me?.roleAssignments);

  const [, executeMutation] = useCreatePoolAdvertisementMutation();
  const handleCreatePool = (
    userId: string,
    teamId: string,
    data: CreatePoolAdvertisementInput,
  ) =>
    executeMutation({ userId, teamId, poolAdvertisement: data }).then(
      (result) => {
        if (result.data?.createPoolAdvertisement) {
          return result.data?.createPoolAdvertisement;
        }
        return Promise.reject(result.error);
      },
    );

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
      label: intl.formatMessage({
        defaultMessage: "Pools",
        id: "3fAkvM",
        description: "Breadcrumb title for the pools page link.",
      }),
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

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Create pool",
          id: "zwYuly",
          description: "Page title for the pool creation page",
        })}
      />
      <Pending fetching={fetching} error={error}>
        <CreatePoolForm
          userId={userIdQuery}
          classificationsArray={classificationsData}
          handleCreatePool={handleCreatePool}
          teamsArray={teamsArray}
        />
      </Pending>
    </AdminContentWrapper>
  );
};

export default CreatePoolPage;
