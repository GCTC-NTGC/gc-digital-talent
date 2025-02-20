import { useState } from "react";
import { useIntl } from "react-intl";
import { useMutation } from "urql";
import TrashIcon from "@heroicons/react/20/solid/TrashIcon";

import { graphql, WorkExperienceInput } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { AlertDialog, Button } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";

import { CommunityWithoutKey, WorkStreamWithoutKey } from "./types";

const UpdateExperienceWorkStreams_Mutation = graphql(/* GraphQL */ `
  mutation UpdateExperienceWorkStreams_Mutation(
    $id: ID!
    $workExperience: WorkExperienceInput!
  ) {
    updateWorkExperience(id: $id, workExperience: $workExperience) {
      workStreams {
        id
      }
    }
  }
`);

interface ExperienceWorkStreamsRemoveDialogProps {
  experienceId: string;
  communityGroup?: {
    community?: CommunityWithoutKey | null;
    workStreams: WorkStreamWithoutKey[];
  };
  experienceWorkStreams: WorkStreamWithoutKey[];
}

const ExperienceWorkStreamsRemoveDialog = ({
  experienceId,
  communityGroup,
  experienceWorkStreams,
}: ExperienceWorkStreamsRemoveDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [{ fetching }, executeMutation] = useMutation(
    UpdateExperienceWorkStreams_Mutation,
  );

  // filter out work streams from selected community
  const experienceWorkStreamIdsWithoutSelectedCommunity: string[] =
    experienceWorkStreams
      .map((workStream) => workStream.id)
      .filter(
        (item) =>
          !communityGroup?.workStreams
            .map((workStream) => workStream.id)
            .includes(item),
      ) ?? [];

  const requestMutation = async (id: string, values: WorkExperienceInput) => {
    const result = await executeMutation({ id, workExperience: values });
    if (result.data?.updateWorkExperience) {
      return result.data.updateWorkExperience;
    }
    return Promise.reject(new Error(result.error?.toString()));
  };

  const handleRemove = async () => {
    await requestMutation(experienceId, {
      workStreamIds: experienceWorkStreamIdsWithoutSelectedCommunity,
    })
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Work streams removed successfully",
            id: "SJdZ4t",
            description: "Toast for successful experience work streams save",
          }),
        );
        setIsOpen(false);
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Failed removing work streams",
            id: "0j3GN0",
            description: "Toast for failed experience work streams save",
          }),
        );
      });
  };

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialog.Trigger>
        <Button type="button" icon={TrashIcon} mode="icon_only">
          <span data-h2-visually-hidden="base(invisible)">
            {intl.formatMessage(
              {
                defaultMessage: "Remove<hidden> {communityName}</hidden>",
                id: "+ygHm1",
                description:
                  "Title for alert dialog to remove community from experience",
              },
              { communityName: communityGroup?.community?.name?.localized },
            )}
          </span>
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
            { communityName: communityGroup?.community?.name?.localized },
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
            <Button
              disabled={fetching}
              type="submit"
              mode="solid"
              color="error"
              onClick={handleRemove}
            >
              {fetching
                ? intl.formatMessage(commonMessages.saving)
                : intl.formatMessage(commonMessages.remove)}
            </Button>
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default ExperienceWorkStreamsRemoveDialog;
