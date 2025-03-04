import { useIntl } from "react-intl";
import PlusCircleIcon from "@heroicons/react/24/solid/PlusCircleIcon";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";
import TrashIcon from "@heroicons/react/20/solid/TrashIcon";
import { useFormContext } from "react-hook-form";

import { Button, Heading, Well } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import pageTitles from "~/messages/pageTitles";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";
import { WorkFormValues } from "~/types/experience";

import ExperienceWorkStreamsEditDialog from "./ExperienceWorkStreamsEditDialog";
import { WorkStreamsWithCommunity } from "./types";

const ExperienceWorkStreamsCommunity_Fragment = graphql(/* GraphQL */ `
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
  communitiesQuery?: FragmentType<
    typeof ExperienceWorkStreamsCommunity_Fragment
  >[];
}

const ExperienceWorkStreams = ({
  communitiesQuery,
}: ExperienceWorkStreamsProps) => {
  const intl = useIntl();

  const { setValue, watch } = useFormContext<WorkFormValues>();

  const watchWorkStreams = watch("workStreams") ?? [];

  const communities = getFragment(
    ExperienceWorkStreamsCommunity_Fragment,
    communitiesQuery,
  );

  const communitiesWithWorkStreams =
    communities
      ?.filter((item) => unpackMaybes(item?.workStreams).length > 0)
      .sort((a, b) =>
        (a.name?.localized ?? "").localeCompare(b.name?.localized ?? ""),
      ) ?? [];

  const workStreamsByCommunity = new Map<string, WorkStreamsWithCommunity>();
  communitiesWithWorkStreams.forEach((community) => {
    community.workStreams?.forEach((workStream) => {
      if (watchWorkStreams.includes(workStream.id)) {
        const newWorkStreams = [
          ...(workStreamsByCommunity.get(community.id)?.workStreams ?? []),
          workStream,
        ].sort((a, b) =>
          (a.name?.localized ?? "").localeCompare(b.name?.localized ?? ""),
        );
        workStreamsByCommunity.set(community.id, {
          community,
          workStreams: newWorkStreams,
        });
      }
    });
  });

  const handleUpdate = (workStreamIds: string[]) => {
    setValue("workStreams", workStreamIds, { shouldDirty: true });
  };

  const handleRemove = (communityId?: string) => {
    if (communityId) {
      const newWorkStreamsByCommunity = new Map(workStreamsByCommunity);
      newWorkStreamsByCommunity.delete(communityId);
      setValue(
        "workStreams",
        Array.from(newWorkStreamsByCommunity.values())
          .flat()
          .map((item) => item.workStreams)
          .flat()
          .flatMap((workStream) => workStream.id),
        { shouldDirty: true },
      );
    }
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
      {workStreamsByCommunity.size > 0 ? (
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
            {Array.from(workStreamsByCommunity.keys()).map((communityId) => {
              const currentWorkStreamsWithCommunity =
                workStreamsByCommunity.get(communityId);
              if (!currentWorkStreamsWithCommunity) {
                return null;
              }
              return (
                <div
                  key={currentWorkStreamsWithCommunity.community.id}
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
                      {
                        currentWorkStreamsWithCommunity.community.name
                          ?.localized
                      }
                    </span>
                    <div
                      data-h2-display="base(flex)"
                      data-h2-justify-content="p-tablet(space-between)"
                      data-h2-align-items="base(center)"
                      data-h2-gap="base(x.5)"
                    >
                      <ExperienceWorkStreamsEditDialog
                        communities={communitiesWithWorkStreams}
                        community={currentWorkStreamsWithCommunity.community}
                        workStreams={
                          currentWorkStreamsWithCommunity.workStreams
                        }
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
                      {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
                      <span data-h2-color="base(black.light)" aria-hidden>
                        &bull;
                      </span>
                      <Button
                        type="button"
                        icon={TrashIcon}
                        mode="icon_only"
                        color="black"
                        onClick={() =>
                          handleRemove(
                            currentWorkStreamsWithCommunity.community.id,
                          )
                        }
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
                              communityName:
                                currentWorkStreamsWithCommunity.community?.name
                                  ?.localized,
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
                    {currentWorkStreamsWithCommunity?.workStreams.map(
                      (workStream) => (
                        <div
                          key={`${currentWorkStreamsWithCommunity.community?.id}-${workStream.id}`}
                        >
                          <BoolCheckIcon value={true}>
                            {workStream?.name?.localized}
                          </BoolCheckIcon>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              );
            })}
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
                'You can add them using the "Add work streams" button.',
              id: "fdSRLv",
              description:
                "Subtitle when no work streams have been attached to experience",
            })}
          </p>
        </Well>
      )}
      {workStreamsByCommunity.size < communitiesWithWorkStreams.length && (
        <ExperienceWorkStreamsEditDialog
          communities={communitiesWithWorkStreams}
          selectedCommunities={workStreamsByCommunity}
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
