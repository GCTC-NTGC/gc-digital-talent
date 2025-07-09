import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import ChatBubbleBottomCenterIcon from "@heroicons/react/24/outline/ChatBubbleBottomCenterIcon";
import { useMutation } from "urql";
import isEmpty from "lodash/isEmpty";

import { Button, ToggleSection } from "@gc-digital-talent/ui";
import {
  htmlToRichTextJSON,
  RichTextInput,
  RichTextRenderer,
  Submit,
} from "@gc-digital-talent/forms";
import {
  FragmentType,
  TalentNominationGroup,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { commonMessages } from "@gc-digital-talent/i18n";

import adminMessages from "~/messages/adminMessages";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";

const CommentsForm_Fragment = graphql(/* Graphql */ `
  fragment CommentsForm on TalentNominationGroup {
    id
    comments
    talentNominationEvent {
      name {
        localized
      }
    }
  }
`);

interface FormValues {
  comments?: TalentNominationGroup["comments"];
}

interface CommentsFormProps {
  nominationGroup: FragmentType<typeof CommentsForm_Fragment>;
}

const TalentNominationEvent_UpdateCommentsMutation = graphql(/* GraphQL */ `
  mutation TalentNominationEvent_UpdateComments(
    $id: UUID!
    $input: UpdateTalentNominationGroupInput!
  ) {
    updateTalentNominationGroup(id: $id, talentNominationGroup: $input) {
      id
      comments
    }
  }
`);

const CommentsForm = ({
  nominationGroup: nominationGroupQuery,
}: CommentsFormProps) => {
  const intl = useIntl();
  const [{ fetching }, executeMutation] = useMutation(
    TalentNominationEvent_UpdateCommentsMutation,
  );
  const nominationGroup = getFragment(
    CommentsForm_Fragment,
    nominationGroupQuery,
  );

  const { isEditing, setIsEditing } = useToggleSectionInfo({
    isNull: isEmpty(nominationGroup.comments),
    emptyRequired: false,
    fallbackIcon: ChatBubbleBottomCenterIcon,
  });

  const methods = useForm<FormValues>({
    defaultValues: {
      comments: nominationGroup.comments ?? "",
    },
  });
  const { handleSubmit } = methods;

  const handleError = () => {
    toast.error(
      intl.formatMessage(
        {
          defaultMessage:
            "Failed updating the comments about the nominations of this nominee for {eventName}.",
          id: "kWfAux",
          description:
            "Message displayed when an error occurs while an admin updates a nomination group",
        },
        {
          eventName:
            nominationGroup.talentNominationEvent.name.localized ??
            intl.formatMessage(commonMessages.notFound),
        },
      ),
    );
  };

  const handleFormSubmit: SubmitHandler<FormValues> = async (
    values: FormValues,
  ) => {
    await executeMutation({
      id: nominationGroup.id,
      input: {
        comments: values.comments ?? "",
      },
    })
      .then((result) => {
        if (result.data?.updateTalentNominationGroup) {
          toast.success(
            intl.formatMessage(
              {
                defaultMessage:
                  "Comments about the nominations of this nominee for {eventName} updated successfully.",
                id: "P8bsme",
                description:
                  "Message displayed when a nomination group has been updated by an admin",
              },
              {
                eventName:
                  nominationGroup.talentNominationEvent.name.localized ??
                  intl.formatMessage(commonMessages.notFound),
              },
            ),
          );
        } else {
          handleError();
        }
      })
      .catch(() => {
        handleError();
      });

    methods.resetField("comments", {
      keepDirty: false,
      defaultValue: values.comments,
    });

    setIsEditing(false);
  };

  return (
    <ToggleSection.Root
      id="comments-form"
      open={isEditing}
      onOpenChange={setIsEditing}
    >
      <ToggleSection.InitialContent>
        <RichTextRenderer
          node={htmlToRichTextJSON(nominationGroup.comments ?? "")}
        />
        <ToggleForm.Trigger>
          <Button mode="inline" type="button" color="secondary">
            {intl.formatMessage({
              defaultMessage: "Edit comments",
              id: "wrQN7E",
              description:
                "Button text to start editing talent nomination group comments",
            })}
          </Button>
        </ToggleForm.Trigger>
      </ToggleSection.InitialContent>
      <ToggleSection.OpenContent>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex flex-col gap-6"
          >
            <RichTextInput
              id="comments"
              name="comments"
              label={intl.formatMessage(adminMessages.comments)}
            />
            <div className="flex flex-wrap gap-3 text-center">
              <Submit
                text={intl.formatMessage({
                  defaultMessage: "Save comments",
                  id: "8R8ip4",
                  description: "Label for saving comments",
                })}
                color="secondary"
                mode="solid"
                isSubmitting={fetching}
              />
              <ToggleSection.Close>
                <Button mode="inline" type="button" color="warning">
                  {intl.formatMessage(commonMessages.cancel)}
                </Button>
              </ToggleSection.Close>
            </div>
          </form>
        </FormProvider>
      </ToggleSection.OpenContent>
    </ToggleSection.Root>
  );
};

export default CommentsForm;
