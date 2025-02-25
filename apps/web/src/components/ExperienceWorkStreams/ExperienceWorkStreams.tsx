import { useIntl } from "react-intl";
import PlusCircleIcon from "@heroicons/react/24/solid/PlusCircleIcon";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";
import TrashIcon from "@heroicons/react/20/solid/TrashIcon";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button, Heading, Well } from "@gc-digital-talent/ui";
import { groupBy, uniqueItems, unpackMaybes } from "@gc-digital-talent/helpers";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import pageTitles from "~/messages/pageTitles";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";
import { WorkFormValues } from "~/types/experience";

import ExperienceWorkStreamsEditDialog from "./ExperienceWorkStreamsEditDialog";

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

export interface ExperienceWorkStreamsProps {
  communitiesQuery?: FragmentType<
    typeof ExperienceWorkStreamsCommunity_Fragment
  >[];
}

const ExperienceWorkStreams = ({
  communitiesQuery,
}: ExperienceWorkStreamsProps) => {
  const intl = useIntl();

  const { control, watch } = useFormContext<WorkFormValues>();
  const { replace } = useFieldArray({
    control,
    name: "workStreams",
  });

  const watchWorkStreams = watch("workStreams") ?? [];

  const communities = getFragment(
    ExperienceWorkStreamsCommunity_Fragment,
    communitiesQuery,
  );

  const groupsExperience = Object.values(
    groupBy(watchWorkStreams, (item) => {
      return item?.communityId ?? "";
    }),
  ).map((communityGroupOfWorkStreams) => {
    return {
      community: communities?.find(
        (item) => item.id === communityGroupOfWorkStreams[0].communityId,
      ),
      workStreams: communityGroupOfWorkStreams.map((workStream) => workStream),
    };
  });

  const selectedCommunities = uniqueItems(
    watchWorkStreams.flatMap((workStream) => workStream.communityId),
  );

  const communitiesWithWorkStreams =
    communities?.filter((item) => unpackMaybes(item?.workStreams).length > 0) ??
    [];

  const handleUpdate = (workStreamIds: string[]) => {
    const newWorkStreams: WorkFormValues["workStreams"] = workStreamIds.reduce(
      (formFields: WorkFormValues["workStreams"], currentWorkStreamId) => {
        const communitiesReduced = communitiesWithWorkStreams?.find((item) =>
          item.workStreams?.some(
            (workStream) => workStream.id === currentWorkStreamId,
          ),
        );
        const workStream = communitiesReduced?.workStreams?.find(
          (item) => item.id === currentWorkStreamId,
        );
        if (!communitiesReduced || !workStream?.name) {
          return formFields;
        }
        return [
          ...(formFields ?? []),
          {
            id: workStream.id,
            communityId: communitiesReduced.id,
            name: workStream.name,
          },
        ];
      },
      [],
    );
    replace(unpackMaybes(newWorkStreams));
  };

  const handleRemove = (communityId?: string) => {
    const newWorkStreams = watchWorkStreams.filter(
      (item) => item.communityId !== communityId,
    );
    replace(unpackMaybes(newWorkStreams));
  };

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
      {groupsExperience.length > 0 ? (
        <>
          <p data-h2-margin-bottom="base(x1)" data-h2-color="base(black.light)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "{workStreamCount, plural, =0 {0 linked work streams} =1 {1 linked work stream} other {# linked work streams}}",
                id: "HWjcqg",
                description: "Count of work streams for work experience",
              },
              {
                workStreamCount: watchWorkStreams ? watchWorkStreams.length : 0,
              },
            )}
          </p>
          <div data-h2-margin-bottom="base(x1)">
            {groupsExperience.map((group) => (
              <div
                key={group?.community?.id}
                data-h2-background-color="base:selectors[:nth-child(even)](background.light) base:selectors[:nth-child(odd)](foreground)"
                data-h2-padding="base(x1)"
                data-h2-border-top="base(1px solid gray.lighter)"
                data-h2-border-right="base(none)"
                data-h2-border-bottom="base:selectors[:last-child](1px solid gray.lighter)"
                data-h2-border-left="base(none)"
              >
                <div
                  data-h2-display="base(flex)"
                  data-h2-justify-content="base(space-between)"
                  data-h2-flex-direction="base(column) p-tablet(row)"
                  data-h2-gap="base(x.5) p-tablet(x1)"
                  data-h2-margin-bottom="base(x.5) p-tablet(0)"
                >
                  <span data-h2-font-weight="base(700)">
                    {group.community?.name?.localized}
                  </span>
                  <div
                    data-h2-display="base(flex)"
                    data-h2-justify-content="p-tablet(space-between)"
                    data-h2-align-items="base(center)"
                    data-h2-gap="base(x.5)"
                  >
                    <ExperienceWorkStreamsEditDialog
                      communities={communitiesWithWorkStreams}
                      communityGroup={group}
                      onUpdate={handleUpdate}
                      trigger={
                        <Button
                          type="button"
                          icon={PencilSquareIcon}
                          mode="icon_only"
                          color="black"
                        >
                          <span data-h2-visually-hidden="base(invisible)">
                            {intl.formatMessage(commonMessages.edit)}
                          </span>
                        </Button>
                      }
                    />
                    <span data-h2-color="base(black.light)" aria-hidden>
                      &bull;
                    </span>
                    <Button
                      type="button"
                      icon={TrashIcon}
                      mode="icon_only"
                      color="black"
                      onClick={() => handleRemove(group?.community?.id)}
                    >
                      <span data-h2-visually-hidden="base(invisible)">
                        {intl.formatMessage(
                          {
                            defaultMessage:
                              "Remove<hidden> {communityName}</hidden>",
                            id: "uTf8vH",
                            description:
                              "Title for to remove community from experience",
                          },
                          {
                            communityName: group?.community?.name?.localized,
                          },
                        )}
                      </span>
                    </Button>
                  </div>
                </div>
                <div
                  data-h2-display="base(flex)"
                  data-h2-flex-direction="base(column)"
                  data-h2-gap="base(x.25)"
                >
                  {group.workStreams.map((workStream) => (
                    <div key={`${group?.community?.id}-${workStream.id}`}>
                      <BoolCheckIcon value={true}>
                        {workStream?.name?.localized}
                      </BoolCheckIcon>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <Well
          data-h2-text-align="base(center)"
          data-h2-margin-bottom="base(x1)"
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
        <ExperienceWorkStreamsEditDialog
          communities={communitiesWithWorkStreams}
          selectedCommunities={unpackMaybes(selectedCommunities)}
          onUpdate={handleUpdate}
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
