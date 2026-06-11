import { useIntl } from "react-intl";
import { useQuery, type OperationContext } from "urql";
import { useOutletContext } from "react-router";
import CheckBadgeIcon from "@heroicons/react/24/outline/CheckBadgeIcon";
import { useState } from "react";

import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import {
  Pending,
  NotFound,
  Heading,
  Card,
  Container,
  Button,
  Notice,
} from "@gc-digital-talent/ui";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { sortAlphaBy, unpackMaybes } from "@gc-digital-talent/helpers";
import { MAX_DATE } from "@gc-digital-talent/date-helpers";

import SEO from "~/components/SEO/SEO";
import useRequiredParams from "~/hooks/useRequiredParams";
import Hero from "~/components/Hero";
import DevelopmentProgramCard from "~/components/DevelopmentProgramCard/DevelopmentProgramCard";
import adminMessages from "~/messages/adminMessages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import type { ContextType } from "../CommunityMembersPage/components/types";
import AddDialog from "./components/AddDialog";
import EditDialog from "./components/EditDialog";
import RemoveDialog from "./components/RemoveDialog";

type SortValues = "recentlyAdded" | "name";

interface RouteParams extends Record<string, string> {
  communityId: string;
}

const ProfessionalizationForm_Fragment = graphql(/* GraphQL */ `
  fragment ProfessionalizationForm on Community {
    ...ProfessionalizationAddDialog
    ...ProfessionalizationRemoveDialog
    communityDevelopmentPrograms {
      id
      createdAt
      community {
        id
        key
      }
      classifications {
        id
        groupAndLevel
      }
      developmentProgram {
        id
        name {
          en
          fr
          localized
        }
        descriptionForProfile {
          localized
        }
      }
    }
  }
`);

const selectedFilterStyle: Record<string, string> = {
  mode: "inline",
  color: "black",
  className: "[&_*]:no-underline pointer-events-none",
};

const unselectedFilterStyle: Record<string, string> = {
  mode: "inline",
  color: "black",
  className: "font-normal text-gray-500",
};

interface CommunityProfessionalizationProps {
  community: FragmentType<typeof ProfessionalizationForm_Fragment>;
}

export const CommunityProfessionalizationForm = ({
  community: formQuery,
}: CommunityProfessionalizationProps) => {
  const intl = useIntl();
  const { communityName, navigationCrumbs, navTabs } =
    useOutletContext<ContextType>();

  const community = getFragment(ProfessionalizationForm_Fragment, formQuery);

  const [sortBy, setSortBy] = useState<SortValues>("recentlyAdded");

  let sortedCommunityDevelopmentPrograms = unpackMaybes(
    community?.communityDevelopmentPrograms,
  );

  if (sortBy === "name") {
    sortedCommunityDevelopmentPrograms =
      sortedCommunityDevelopmentPrograms.sort(
        sortAlphaBy((cdp) => cdp.developmentProgram.name.localized),
      );
  } else {
    sortedCommunityDevelopmentPrograms =
      sortedCommunityDevelopmentPrograms.sort((cdp1, cdp2) => {
        const a = cdp1?.createdAt ? new Date(cdp1.createdAt) : MAX_DATE;
        const b = cdp2?.createdAt ? new Date(cdp2.createdAt) : MAX_DATE;
        return b.getTime() - a.getTime();
      });
  }

  const pageTitle = intl.formatMessage(adminMessages.professionalization);

  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const [editOpen, setEditOpen] = useState<string | null>(null);
  const [removeOpen, setRemoveOpen] = useState<string | null>(null);

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={communityName} crumbs={navigationCrumbs} navTabs={navTabs} />
      <Container className="my-12">
        <Card>
          <div className="mb-3 flex flex-col gap-6 px-3 pt-3">
            <Heading
              size="h3"
              icon={CheckBadgeIcon}
              color="primary"
              className="mt-0"
            >
              {pageTitle}
            </Heading>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Link common development programs, certifications, accreditation or licenses to the community for talent management purposes. When added, a professionalization will then be available as a development opportunity during Talent Management nominations as well as be provided to candidates who join the community from their profile.",
                id: "eC+ZhW",
                description: "Description for professionalizations page",
              })}
            </p>
            <AddDialog community={community} />
            <div
              role="group"
              aria-labelledby="sortFilter"
              className="mt-6 flex items-center gap-3"
            >
              <span
                id="sortFilter"
                className="text-gray-500 dark:text-gray-200"
              >
                {intl.formatMessage(formMessages.sortBy)}
                {intl.formatMessage(commonMessages.dividingColon)}
              </span>
              <Button
                onClick={() => setSortBy("recentlyAdded")}
                {...(sortBy === "recentlyAdded"
                  ? selectedFilterStyle
                  : unselectedFilterStyle)}
              >
                {intl.formatMessage({
                  defaultMessage: "Recently added",
                  id: "Fmi0y9",
                  description: "Sorting option for professionalizations list",
                })}
              </Button>
              <Button
                onClick={() => setSortBy("name")}
                {...(sortBy === "name"
                  ? selectedFilterStyle
                  : unselectedFilterStyle)}
              >
                {intl.formatMessage(commonMessages.name)}
              </Button>
            </div>
          </div>
          {sortedCommunityDevelopmentPrograms.length > 0 ? (
            <div className="-mr-6 -mb-5 -ml-6">
              <DevelopmentProgramCard.Root>
                {sortedCommunityDevelopmentPrograms.map((cdp) => {
                  return (
                    <DevelopmentProgramCard.Item
                      id={cdp.id}
                      key={cdp.developmentProgram.id}
                      title={
                        cdp.developmentProgram.name.localized ?? notProvided
                      }
                      description={
                        cdp.developmentProgram.descriptionForProfile
                          .localized ?? notProvided
                      }
                      classificationRestrictions={unpackMaybes(
                        cdp.classifications,
                      )}
                      edit={
                        <EditDialog
                          key={cdp.id}
                          communityDevelopmentProgramId={cdp.id}
                          defaultValues={{
                            needForRestrictions:
                              unpackMaybes(cdp.classifications)?.length > 0,
                            restrictedClassifications: unpackMaybes(
                              cdp.classifications?.map((c) => c.id),
                            ),
                          }}
                          professionalizationName={
                            cdp.developmentProgram.name.localized ?? notProvided
                          }
                          open={editOpen === cdp.id}
                          setOpen={setEditOpen}
                        />
                      }
                      remove={
                        <RemoveDialog
                          community={community}
                          communityDevelopmentProgramId={cdp.id}
                          professionalizationName={
                            cdp.developmentProgram.name.localized ?? notProvided
                          }
                          open={removeOpen === cdp.id}
                          setOpen={setRemoveOpen}
                        />
                      }
                      setEditOpen={setEditOpen}
                      setRemoveOpen={setRemoveOpen}
                    />
                  );
                })}
              </DevelopmentProgramCard.Root>
            </div>
          ) : (
            <Notice.Root color="gray" className="text-center">
              <Notice.Content>
                {intl.formatMessage({
                  defaultMessage:
                    "Your community doesn't have any professionalizations at the moment.",
                  id: "vM3MHo",
                  description:
                    "Label for notice when there are no professionalizations",
                })}
              </Notice.Content>
            </Notice.Root>
          )}
        </Card>
      </Container>
    </>
  );
};

const CommunityProfessionalization_Query = graphql(/* GraphQL */ `
  query CommunityProfessionalization($id: UUID!) {
    community(id: $id) {
      ...ProfessionalizationForm
    }
  }
`);

const operationContext: Partial<OperationContext> = {
  additionalTypenames: ["CommunityDevelopmentProgram"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
};

const CommunityProfessionalizationPage = () => {
  const intl = useIntl();
  const { communityId } = useRequiredParams<RouteParams>("communityId");
  const [{ data, fetching, error }] = useQuery({
    query: CommunityProfessionalization_Query,
    variables: { id: communityId },
    context: operationContext,
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.community ? (
        <CommunityProfessionalizationForm community={data.community} />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage(
              {
                defaultMessage: "Community {communityId} not found.",
                id: "TfbBB7",
                description: "Message displayed for community not found.",
              },
              { communityId },
            )}
          </p>
        </NotFound>
      )}
    </Pending>
  );
};

const Component = () => {
  const { teamId } = useOutletContext<ContextType>();

  // wait for outlet to load
  if (teamId === undefined) {
    return null;
  }

  return (
    <RequireAuth
      rolesRequirements={[
        { name: ROLE_NAME.PlatformAdmin },
        { name: ROLE_NAME.CommunityAdmin, teamId },
      ]}
      strict
    >
      <CommunityProfessionalizationPage />
    </RequireAuth>
  );
};

Component.displayName = "CommunityProfessionalizationPage";

export default Component;
