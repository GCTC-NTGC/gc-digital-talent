import { useIntl } from "react-intl";
import PlusCircleIcon from "@heroicons/react/24/solid/PlusCircleIcon";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";
import TrashIcon from "@heroicons/react/20/solid/TrashIcon";
import { useFormContext } from "react-hook-form";

import {
  Button,
  Heading,
  HTMLEntity,
  IconButton,
  Well,
} from "@gc-digital-talent/ui";
import { sortAlphaBy, unpackMaybes } from "@gc-digital-talent/helpers";
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
      .sort(sortAlphaBy((community) => community.name?.localized)) ?? [];

  const workStreamsByCommunity = new Map<string, WorkStreamsWithCommunity>();
  communitiesWithWorkStreams.forEach((community) => {
    community.workStreams?.forEach((workStream) => {
      if (watchWorkStreams.includes(workStream.id)) {
        const newWorkStreams = [
          ...(workStreamsByCommunity.get(community.id)?.workStreams ?? []),
          workStream,
        ].sort(sortAlphaBy((ws) => ws.name?.localized));
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
      <Heading level="h3" size="h4" className="mt-18 mb-6 font-bold">
        {intl.formatMessage(pageTitles.workStreams)}
      </Heading>
      <p className="mb-6">
        {intl.formatMessage({
          defaultMessage:
            "This section is optional, but linking your experience to one or more work streams can highlight your cumulative experience and help our recruitment teams match you with new opportunities. This is especially valuable if you have Government of Canada experience or are interested in executive roles.",
          id: "sGQ4eO",
          description:
            "Description for work streams paragraph 1 on Experience form",
        })}
      </p>
      <p className="mb-6">
        {intl.formatMessage({
          defaultMessage:
            "You can select work streams by linking your experience to a functional community that uses our platform. Functional communities connect colleagues in government with jobs, training, and talent management opportunities within the functional community's area of expertise. Experience from outside the government can also be linked.",
          id: "81Zt0T",
          description:
            "Description for work streams paragraph 2 on Experience form",
        })}
      </p>
      <p className="mb-6">
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
          <p className="mb-6 text-gray-700 dark:text-gray-100">
            {intl.formatMessage(
              {
                defaultMessage:
                  "{workStreamCount, plural, =0 {0 linked work streams} one {# linked work stream} other {# linked work streams}}",
                id: "8ii/QN",
                description: "Count of work streams for work experience",
              },
              {
                workStreamCount: watchWorkStreams ? watchWorkStreams.length : 0,
              },
            )}
          </p>
          <div className="mb-6">
            {Array.from(workStreamsByCommunity.keys()).map((communityId) => {
              const currentWorkStreamsWithCommunity =
                workStreamsByCommunity.get(communityId);
              if (!currentWorkStreamsWithCommunity) {
                return null;
              }
              return (
                <div
                  key={currentWorkStreamsWithCommunity.community.id}
                  className="border-t border-gray-100 p-6 last:border-b odd:bg-gray-100 even:bg-white dark:border-gray-500 odd:dark:bg-gray-700 dark:even:bg-gray-600"
                >
                  <div className="mb-3 flex flex-col justify-between gap-3 xs:mb-0 xs:flex-row xs:gap-6">
                    <span className="font-bold">
                      {
                        currentWorkStreamsWithCommunity.community.name
                          ?.localized
                      }
                    </span>
                    <div className="flex items-center gap-3 xs:justify-between">
                      <ExperienceWorkStreamsEditDialog
                        communities={communitiesWithWorkStreams}
                        community={currentWorkStreamsWithCommunity.community}
                        workStreams={
                          currentWorkStreamsWithCommunity.workStreams
                        }
                        onUpdate={handleUpdate}
                        trigger={
                          <IconButton
                            type="button"
                            icon={PencilSquareIcon}
                            color="black"
                            label={intl.formatMessage(commonMessages.edit)}
                          />
                        }
                      />
                      <HTMLEntity
                        name="&bull;"
                        className="text-gray-100 dark:text-gray-500"
                        aria-hidden
                      />
                      <IconButton
                        type="button"
                        icon={TrashIcon}
                        color="black"
                        onClick={() =>
                          handleRemove(
                            currentWorkStreamsWithCommunity.community.id,
                          )
                        }
                        label={intl.formatMessage(
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
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
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
        <Well className="mb-6 text-center">
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
              color="primary"
              block
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
