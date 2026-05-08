import { useIntl } from "react-intl";
import { useMutation } from "urql";
import { useState } from "react";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Button, Dialog, Ul } from "@gc-digital-talent/ui";
import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";

export const ProfessionalizationRemoveDialog_Fragment = graphql(/* GraphQL */ `
  fragment ProfessionalizationRemoveDialog on Query {
    community(id: $id) {
      id
      name {
        localized
      }
    }
  }
`);

const RemoveProfessionalization_Mutation = graphql(/* GraphQL */ `
  mutation RemoveProfessionalization($id: UUID!) {
    deleteCommunityDevelopmentProgram(id: $id) {
      id
    }
  }
`);

interface RemoveDialogProps {
  communityDevelopmentProgramId: string;
  professionalizationName: string;
  query: FragmentType<typeof ProfessionalizationRemoveDialog_Fragment>;
}

const RemoveDialog = ({
  communityDevelopmentProgramId,
  professionalizationName,
  query,
}: RemoveDialogProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);

  const data = getFragment(ProfessionalizationRemoveDialog_Fragment, query);
  const [{ fetching }, executeMutation] = useMutation(
    RemoveProfessionalization_Mutation,
  );

  const onSubmit = () => {
    return executeMutation({
      id: communityDevelopmentProgramId,
    })
      .then((result) => {
        if (result.data?.deleteCommunityDevelopmentProgram?.id) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Professionalization removed",
              id: "QeP4Rb",
              description:
                "Message displayed to user after professionalization is removed successfully.",
            }),
          );
          setOpen(false);
          return result.data.deleteCommunityDevelopmentProgram.id;
        }
        return Promise.reject(new Error(result.error?.toString()));
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: removing professionalization failed",
            id: "+gAHHT",
            description:
              "Message displayed to user after professionalization fails to get removed.",
          }),
        );
      });
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button color="primary" mode="text" className="w-full">
          {intl.formatMessage(commonMessages.remove)}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage(
            {
              defaultMessage:
                "Confirm that you want to remove {professionalizationName} from the {communityName}",
              id: "O48hJ8",
              description: "Subtitle for remove a professionalization dialog",
            },
            {
              professionalizationName,
              communityName:
                data.community?.name?.localized ??
                intl.formatMessage(commonMessages.notProvided),
            },
          )}
        >
          {intl.formatMessage({
            defaultMessage: "Remove a professionalization",
            id: "IUM7Rb",
            description: "Heading for the remove a professionalization dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p className="mb-3">
            {intl.formatMessage({
              defaultMessage:
                "By removing this professionalization from the community, the following changes will be made for all users:",
              id: "M6CZwf",
              description:
                "Unordered list heading warning user before removing a professionalization",
            })}
          </p>
          <Ul className="mb-6 grid gap-2">
            <li>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "This professionalization will no longer be referred to members joining your community",
                  id: "N5NC2F",
                  description:
                    "First list item in warning message before removing a professionalization",
                })}
              </p>
            </li>
            <li>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "This professionalization will no longer be an option during talent management nominations",
                  id: "wwvaQ1",
                  description:
                    "Second list item in warning message before removing a professionalization",
                })}
              </p>
            </li>
            <li>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "This professionalization will no longer be an option during talent management nominations",
                  id: "IIUffU",
                  description:
                    "Third list item in warning message before removing a professionalization",
                })}
              </p>
            </li>
            <li>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Any user who has previously added this professionalization as a part of their community information will have it removed (their career experience will not be affected)",
                  id: "wppRjE",
                  description:
                    "Forth list item in warning message before removing a professionalization",
                })}
              </p>
            </li>
            <li>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Nominations that contained this professionalization as a development opportunity will continue to retain it for record purposes",
                  id: "e1fkL1",
                  description:
                    "Fifth list item in warning message before removing a professionalization",
                })}
              </p>
            </li>
          </Ul>
          <Dialog.Footer>
            <Button
              disabled={fetching}
              type="button"
              color="error"
              onClick={onSubmit}
            >
              {fetching
                ? intl.formatMessage(commonMessages.saving)
                : intl.formatMessage({
                    defaultMessage: "Remove professionalization",
                    id: "0AC/BM",
                    description:
                      "Button label for removing a professionalization",
                  })}
            </Button>
            <Dialog.Close>
              <Button type="button" color="warning" mode="inline">
                {intl.formatMessage(commonMessages.cancel)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default RemoveDialog;
