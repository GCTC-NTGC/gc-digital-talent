import { useIntl } from "react-intl";
import PlusCircleIcon from "@heroicons/react/24/solid/PlusCircleIcon";

import { AlertDialog, Button, Heading, Well } from "@gc-digital-talent/ui";
import { groupBy, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  Community,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import pageTitles from "~/messages/pageTitles";

import ExperienceWorkStreamsDialog from "./ExperienceWorkStreamsDialog";

export const ExperienceFormWorkStream_Fragment = graphql(/* GraphQL */ `
  fragment ExperienceFormWorkStream on WorkExperience {
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

interface ExperienceWorkStreamsProps {
  experienceWorkStreamsQuery: FragmentType<
    typeof ExperienceFormWorkStream_Fragment
  >;
  communities: Community[];
}

const ExperienceWorkStreams = ({
  experienceWorkStreamsQuery,
  communities,
}: ExperienceWorkStreamsProps) => {
  const intl = useIntl();
  const experience = getFragment(
    ExperienceFormWorkStream_Fragment,
    experienceWorkStreamsQuery,
  );

  const experienceWorkStreams = unpackMaybes(experience?.workStreams);

  const groupsExperience = Object.values(
    groupBy(experienceWorkStreams, (workStream) => {
      return workStream?.community?.id;
    }),
  ).map((communityGroupOfWorkStreams) => {
    return {
      community: communityGroupOfWorkStreams[0].community,
      workStreams: communityGroupOfWorkStreams.map((stream) => stream),
    };
  });

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
      {groupsExperience ? (
        groupsExperience.map((group) => (
          <div key={group?.community?.id} data-h2-margin-bottom="base(1px)">
            <Heading level="h4" size="h4">
              {group.community?.name?.localized}
            </Heading>
            <div data-h2-margin-bottom="base(x1)">
              {group.workStreams.map((workStream) => (
                <div key={`${group?.community?.id}-${workStream.id}`}>
                  <span>{workStream?.name?.localized}</span>
                  <div
                    data-h2-display="base(flex)"
                    data-h2-flex-direction="base(row)"
                    data-h2-justify-content="base(flex-start)"
                    data-h2-gap="base(x1 0)"
                  >
                    <ExperienceWorkStreamsDialog
                      communities={communities}
                      trigger={
                        <Button mode="inline" type="button">
                          {intl.formatMessage(commonMessages.edit)}
                        </Button>
                      }
                    />
                    <AlertDialog.Root>
                      <AlertDialog.Trigger>
                        <Button mode="inline" type="button">
                          {intl.formatMessage(
                            {
                              defaultMessage:
                                "Remove<hidden> {communityName}</hidden>",
                              id: "+ygHm1",
                              description:
                                "Title for alert dialog to remove community from experience",
                            },
                            {
                              communityName: group.community?.name?.localized,
                            },
                          )}
                        </Button>
                      </AlertDialog.Trigger>
                      <AlertDialog.Content>
                        <AlertDialog.Title>
                          {intl.formatMessage(
                            {
                              defaultMessage: "Remove {communityName}",
                              id: "B9dPx2",
                              description:
                                "Title for alert dialog to remove community from experience",
                            },
                            {
                              communityName: group.community?.name?.localized,
                            },
                          )}
                        </AlertDialog.Title>
                        <AlertDialog.Description>
                          {intl.formatMessage({
                            defaultMessage:
                              "Are you sure you'd like to remove this functional community and its related work streams from this experience? You can always add them back at a later time.",
                            id: "R+Lghw",
                            description:
                              "Message displayed when user attempts to remove community from experience",
                          })}
                        </AlertDialog.Description>
                        <AlertDialog.Footer>
                          <AlertDialog.Cancel>
                            <Button color="primary" type="button">
                              {intl.formatMessage(commonMessages.cancel)}
                            </Button>
                          </AlertDialog.Cancel>
                          <AlertDialog.Action>
                            <Button mode="solid" color="error" type="button">
                              {intl.formatMessage(commonMessages.remove)}
                            </Button>
                          </AlertDialog.Action>
                        </AlertDialog.Footer>
                      </AlertDialog.Content>
                    </AlertDialog.Root>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <Well data-h2-text-align="base(center)">
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
      <ExperienceWorkStreamsDialog
        communities={communities}
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
    </section>
  );
};

export default ExperienceWorkStreams;
