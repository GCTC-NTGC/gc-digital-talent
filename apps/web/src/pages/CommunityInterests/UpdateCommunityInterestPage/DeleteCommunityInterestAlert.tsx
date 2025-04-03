import { useIntl } from "react-intl";
import { useMutation } from "urql";
import { useNavigate } from "react-router";

import { AlertDialog, Button } from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

import useRoutes from "~/hooks/useRoutes";

const DeleteCommunityInterestAlert_Fragment = graphql(/** GraphQL */ `
  fragment DeleteCommunintyInterestAlert on CommunityInterest {
    id
    community {
      name {
        localized
      }
    }
  }
`);

const DeleteCommunityInterest_Mutation = graphql(/** GraphQL */ `
  mutation DeleteCommunityInterest($id: UUID!) {
    deleteCommunityInterest(id: $id) {
      id
    }
  }
`);

interface DeleteCommunityInterestAlertProps {
  query: FragmentType<typeof DeleteCommunityInterestAlert_Fragment>;
}

const DeleteCommunintyInterestAlert = ({
  query,
}: DeleteCommunityInterestAlertProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const [{ fetching }, executeMutatation] = useMutation(
    DeleteCommunityInterest_Mutation,
  );
  const communityInterest = getFragment(
    DeleteCommunityInterestAlert_Fragment,
    query,
  );

  const handleDelete = () => {
    if (fetching) return; // Prevent duplicate deletion attempts
    executeMutatation({ id: communityInterest.id })
      .then(async (res) => {
        if (res.error) throw new Error(res.error.message);
        if (!res.data?.deleteCommunityInterest?.id)
          throw new Error("Could not delete community interest");

        await navigate(paths.applicantDashboard());
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage:
              "We could not delete this community. Please, try again.",
            id: "zWR47V",
            description:
              "Error message displayed when something went wrong deleting a community interest",
          }),
        );
      });
  };

  const label = intl.formatMessage({
    defaultMessage: "Delete community",
    id: "w8Fhml",
    description: "Button text to delete a community from a users profile",
  });

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button mode="inline" color="error">
          {label}
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>
          {intl.formatMessage(
            {
              defaultMessage:
                "Are you sure you want to remove the “{communityName}” from your profile?",
              id: "HkdbNP",
              description:
                "Title for the deletion confirmation dialog of a community interest",
            },
            {
              communityName:
                communityInterest.community.name?.localized ??
                intl.formatMessage(commonMessages.notAvailable),
            },
          )}
        </AlertDialog.Title>
        <AlertDialog.Description>
          {intl.formatMessage({
            defaultMessage:
              "By deleting this functional community from your profile, your information will no longer be shared with recruiters and HR staff in this community. You can re-add this community to your profile at any time to opt back in.",
            id: "AnE0w9",
            description:
              "Description of what deleting a community means for a user",
          })}
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Action>
            <Button color="error" type="button" onClick={handleDelete}>
              {label}
            </Button>
          </AlertDialog.Action>
          <AlertDialog.Cancel>
            <Button color="warning" mode="inline" type="button">
              {intl.formatMessage(commonMessages.cancel)}
            </Button>
          </AlertDialog.Cancel>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default DeleteCommunintyInterestAlert;
