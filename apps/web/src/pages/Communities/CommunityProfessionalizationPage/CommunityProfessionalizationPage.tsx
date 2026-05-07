import { useIntl } from "react-intl";
import { useQuery } from "urql";
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
} from "@gc-digital-talent/ui";
import type {
  Classification,
  CommunityDevelopmentProgram,
  DevelopmentProgram,
  FragmentType,
  Scalars,
} from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";
import DevelopmentProgramCard from "~/components/DevelopmentProgramCard/DevelopmentProgramCard";
import adminMessages from "~/messages/adminMessages";

import type { ContextType } from "../CommunityMembersPage/components/types";
import AddDialog from "./components/AddDialog";
import { useSort, type SortValues } from "./utils/useSort";
import EditDialog from "./components/EditDialog";
import RemoveDialog from "./components/RemoveDialog";

interface RouteParams extends Record<string, string> {
  communityId: Scalars["ID"]["output"];
}

const CommunityProfessionalizationForm_Fragment = graphql(/* GraphQL */ `
  fragment CommunityProfessionalizationForm on Community {
    id
    name {
      localized
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
  communityDevelopmentPrograms: CommunityDevelopmentProgram[];
  classifications: Classification[];
  developmentPrograms: DevelopmentProgram[];
  query: FragmentType<typeof CommunityProfessionalizationForm_Fragment>;
}

export const CommunityProfessionalizationForm = ({
  communityDevelopmentPrograms,
  classifications,
  developmentPrograms,
  query,
}: CommunityProfessionalizationProps) => {
  const intl = useIntl();
  const { communityName, navigationCrumbs, navTabs } =
    useOutletContext<ContextType>();

  const community = getFragment(
    CommunityProfessionalizationForm_Fragment,
    query,
  );

  const [sortBy, setSortBy] = useState<SortValues>("recentlyAdded");

  const ids = new Set(
    communityDevelopmentPrograms.map((cdp) => cdp.developmentProgram.id),
  );
  const filteredDevelopmentPrograms = developmentPrograms.filter(
    (dp) => !ids.has(dp.id),
  );
  const sortedCommunityDevelopmentPrograms = useSort(
    communityDevelopmentPrograms,
    sortBy,
  );

  const pageTitle = intl.formatMessage(adminMessages.professionalization);

  const notFound = intl.formatMessage(commonMessages.notFound);

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
            <AddDialog
              communityId={community.id}
              communityName={communityName}
              developmentPrograms={filteredDevelopmentPrograms}
              classifications={classifications}
            />
            <div
              role="group"
              aria-labelledby="sortFilter"
              className="mt-6 flex items-center gap-3"
            >
              <span id="sortFilter" className="text-gray-500">
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
          <div className="-mr-6 -mb-5 -ml-6">
            <DevelopmentProgramCard.Root>
              {sortedCommunityDevelopmentPrograms.map((cdp) => {
                return (
                  <DevelopmentProgramCard.Item
                    key={cdp.developmentProgram.id}
                    title={cdp.developmentProgram.name.localized ?? notFound}
                    description={
                      cdp.developmentProgram.descriptionForProfile.localized ??
                      notFound
                    }
                    classificationRestrictions={unpackMaybes(
                      cdp.classifications,
                    )}
                    edit={
                      <EditDialog
                        key={cdp.id}
                        classifications={classifications}
                        communityDevelopmentProgramId={cdp.id}
                        defaultValues={{
                          needForRestrictions:
                            unpackMaybes(cdp.classifications)?.length > 0,
                          restrictedClassifications: unpackMaybes(
                            cdp.classifications?.map((c) => c.id),
                          ),
                        }}
                        professionalizationName={
                          cdp.developmentProgram.name.localized ?? notFound
                        }
                      />
                    }
                    remove={
                      <RemoveDialog
                        communityDevelopmentProgramId={cdp.id}
                        communityName={community.name?.localized ?? notFound}
                        professionalizationName={
                          cdp.developmentProgram.name.localized ?? notFound
                        }
                      />
                    }
                  />
                );
              })}
            </DevelopmentProgramCard.Root>
          </div>
        </Card>
      </Container>
    </>
  );
};

const CommunityProfessionalization_Query = graphql(/* GraphQL */ `
  query CommunityProfessionalization($id: UUID!) {
    community(id: $id) {
      ...CommunityProfessionalizationForm
      communityDevelopmentPrograms {
        id
        createdAt
        community {
          id
          key
        }
        classifications {
          id
          group
          level
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
    developmentPrograms {
      id
      name {
        localized
      }
      descriptionForProfile {
        localized
      }
    }
    classifications {
      id
      group
      level
    }
  }
`);

const CommunityProfessionalizationPage = () => {
  const intl = useIntl();
  const { communityId } = useRequiredParams<RouteParams>("communityId");
  const [{ data, fetching, error }] = useQuery({
    query: CommunityProfessionalization_Query,
    variables: { id: communityId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.community ? (
        <CommunityProfessionalizationForm
          query={data.community}
          communityDevelopmentPrograms={unpackMaybes(
            data.community.communityDevelopmentPrograms,
          )}
          developmentPrograms={unpackMaybes(data.developmentPrograms)}
          classifications={unpackMaybes(data.classifications)}
        />
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

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.CommunityTalentCoordinator,
      ROLE_NAME.PlatformAdmin,
    ]}
  >
    <CommunityProfessionalizationPage />
  </RequireAuth>
);

Component.displayName = "CommunityProfessionalizationPage";

export default Component;
