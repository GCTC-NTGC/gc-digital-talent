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
      intl.formatMessage({
        defaultMessage:
          "Error: could not update talent nomination group comments",
        id: "1L+U6w",
        description:
          "Message displayed when an error occurs while an admin updates a nomination group",
      }),
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
            intl.formatMessage({
              defaultMessage:
                "Talent nomination group comments updated successfully",
              id: "cHHVLz",
              description:
                "Message displayed when a nomination group has been updated by an admin",
            }),
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
      data-h2-gap="base(x1, 0, 0, 0)"
    >
      <ToggleSection.InitialContent>
        <RichTextRenderer
          node={htmlToRichTextJSON(nominationGroup.comments ?? "")}
        />
        <ToggleForm.Trigger data-h2-margin-top="base(x.5)">
          <Button mode="inline" type="button" color="primary">
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
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-gap="base(x1)"
          >
            <RichTextInput
              id="comments"
              name="comments"
              label={intl.formatMessage(adminMessages.comments)}
            />
            <div
              data-h2-display="base(flex)"
              data-h2-flex-wrap="base(wrap)"
              data-h2-text-align="base(center)"
              data-h2-gap="base(x.5)"
            >
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
