import { useIntl } from "react-intl";
import PlusCircleIcon from "@heroicons/react/24/solid/PlusCircleIcon";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";

import { Button, Heading, Well } from "@gc-digital-talent/ui";
import {
  groupBy,
  notEmpty,
  uniqueItems,
  unpackMaybes,
} from "@gc-digital-talent/helpers";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import pageTitles from "~/messages/pageTitles";

import ExperienceWorkStreamsDialog from "./ExperienceWorkStreamsDialog";
import ExperienceWorkStreamsRemoveDialog from "./ExperienceWorkStreamsRemoveDialog";

export const ExperienceFormWorkStream_Fragment = graphql(/* GraphQL */ `
  fragment ExperienceFormWorkStream on WorkExperience {
    id
    workStreams {
      id
      key
      name {
        localized
      }
      community {
        id
        name {
          localized
        }
      }
    }
  }
`);

export const ExperienceWorkStreamsCommunity_Fragment = graphql(/* GraphQL */ `
  fragment ExperienceWorkStreamsCommunity on Community {
    id
    name {
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

interface ExperienceWorkStreamsProps {
  experienceWorkStreamsQuery: FragmentType<
    typeof ExperienceFormWorkStream_Fragment
  >;
  communitiesQuery?: FragmentType<
    typeof ExperienceWorkStreamsCommunity_Fragment
  >[];
}

const ExperienceWorkStreams = ({
  experienceWorkStreamsQuery,
  communitiesQuery,
}: ExperienceWorkStreamsProps) => {
  const intl = useIntl();
  const experience = getFragment(
    ExperienceFormWorkStream_Fragment,
    experienceWorkStreamsQuery,
  );

  const communities = getFragment(
    ExperienceWorkStreamsCommunity_Fragment,
    communitiesQuery,
  );

  const experienceWorkStreams = unpackMaybes(experience?.workStreams).filter(
    (item) => notEmpty(item.community),
  );

  const groupsExperience = Object.values(
    groupBy(experienceWorkStreams, (item) => {
      return item?.community?.id ?? "";
    }),
  ).map((communityGroupOfWorkStreams) => {
    return {
      community: communityGroupOfWorkStreams[0].community,
      workStreams: communityGroupOfWorkStreams.map((stream) => stream),
    };
  });

  const selectedCommunities = uniqueItems(
    experienceWorkStreams.flatMap((workStream) => workStream.community?.id),
  );

  const communitiesWithWorkStreams =
    communities?.filter((item) => unpackMaybes(item?.workStreams).length > 0) ??
    [];

  return (
    <section>
      <Heading
        level="h3"
        size="h4"
        data-h2-font-weight="base(700)"
        data-h2-margin="base(x3, 0, x1, 0)"
      >
        {intl.formatMessage(pageTitles.workStreams)}
      </Heading>
      <p data-h2-margin-bottom="base(x1)">
        {intl.formatMessage({
          defaultMessage:
            "This section is optional, but linking your experience to one or more work streams can highlight your cumulative experience and help our recruitment teams match you with new opportunities. This is especially valuable if you have Government of Canada experience or are interested in executive roles.",
          id: "sGQ4eO",
          description:
            "Description for work streams paragraph 1 on Experience form",
        })}
      </p>
      <p data-h2-margin-bottom="base(x1)">
        {intl.formatMessage({
          defaultMessage:
            "You can select work streams by linking your experience to a functional community that uses our platform. Functional communities connect colleagues in government with jobs, training, and talent management opportunities within the functional community's area of expertise. Experience from outside the government can also be linked.",
          id: "81Zt0T",
          description:
            "Description for work streams paragraph 2 on Experience form",
        })}
      </p>
      <p data-h2-margin-bottom="base(x1)">
        {intl.formatMessage({
          defaultMessage:
            "Not all functional communities have joined this platform, so you may find yourself looking for a community that isn’t available yet. If you don’t find a good match between your work experience and a functional community on our platform, skip this section.",
          id: "GK8s3M",
          description:
            "Description for work streams paragraph 3 on Experience form",
        })}
      </p>
      {/*
      TODO: add copy string for "5 linked work streams" (consider plural)
      TODO: style group cards
      TODO: fix lint errors
      TODO: send strings for translation
      */}
      {groupsExperience.length > 0 ? (
        groupsExperience.map((group) => (
          <div key={group?.community?.id} data-h2-margin-bottom="base(1px)">
            <Heading level="h4" size="h4">
              {group.community?.name?.localized}
            </Heading>
            <ExperienceWorkStreamsDialog
              experienceId={experience.id}
              communities={communitiesWithWorkStreams}
              communityGroup={group}
              experienceWorkStreams={experienceWorkStreams}
              trigger={
                <Button type="button" icon={PencilSquareIcon} mode="icon_only">
                  <span data-h2-visually-hidden="base(invisible)">
                    {intl.formatMessage(commonMessages.edit)}
                  </span>
                </Button>
              }
            />
            <ExperienceWorkStreamsRemoveDialog
              experienceId={experience.id}
              experienceWorkStreams={experienceWorkStreams}
              communityGroup={group}
            />
            <div data-h2-margin-bottom="base(x1)">
              {group.workStreams.map((workStream) => (
                <div key={`${group?.community?.id}-${workStream.id}`}>
                  <span>{workStream?.name?.localized}</span>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <Well
          data-h2-text-align="base(center)"
          data-h2-margin-bottom="base(x.5)"
        >
          <p>
            {intl.formatMessage({
              defaultMessage:
                "You haven't added any work streams to this experience yet.",
              id: "07xB/W",
              description:
                "Title when no work streams have been attached to experience",
            })}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage:
                'You can add a new field of work using the "Add work streams" button.',
              id: "MeN3/x",
              description:
                "Subtitle when no work streams have been attached to experience",
            })}
          </p>
        </Well>
      )}
      {selectedCommunities.length < communitiesWithWorkStreams.length && (
        <ExperienceWorkStreamsDialog
          experienceId={experience.id}
          communities={communitiesWithWorkStreams}
          experienceWorkStreams={experienceWorkStreams}
          selectedCommunities={selectedCommunities}
          trigger={
            <Button
              icon={PlusCircleIcon}
              mode="placeholder"
              color="secondary"
              data-h2-display="base(block)"
              data-h2-width="base(100%)"
            >
              {intl.formatMessage({
                defaultMessage: "Add work streams",
                id: "dXRajZ",
                description: "Button label for Add work streams",
              })}
            </Button>
          }
        />
      )}
    </section>
  );
};

export default ExperienceWorkStreams;
