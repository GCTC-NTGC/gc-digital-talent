import { ReactNode, useState } from "react";
import { useIntl } from "react-intl";
import {
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { useMutation } from "urql";

import {
  Community,
  graphql,
  WorkExperience,
  WorkExperienceInput,
  WorkStream
} from "@gc-digital-talent/graphql";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import { Button, Dialog, Well } from "@gc-digital-talent/ui";
import { CheckboxOption, Checklist, Select } from "@gc-digital-talent/forms";
import { uniqueItems, unpackMaybes } from "@gc-digital-talent/helpers";
import { toast } from "@gc-digital-talent/toast";

import pageTitles from "~/messages/pageTitles";

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

interface FormValues {
  workStreams: WorkExperience["workStreams"];
}
interface ExperienceWorkStreamsDialogProps {
  experienceId: string;
  communities: Community[];
  communityGroup?: {
    community: Community;
    workStreams: WorkStream[];
  };
  experienceWorkStreams: WorkStream[];
  trigger: ReactNode;
  defaultOpen?: boolean;
}

const ExperienceWorkStreamsDialog = ({
  experienceId,
  communities,
  communityGroup,
  experienceWorkStreams,
  trigger,
  defaultOpen = false,
}: ExperienceWorkStreamsDialogProps) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState<boolean>(defaultOpen);

  const methods = useForm<FormValues>();
  const { handleSubmit, watch } = methods;
  const communityValue = communityGroup ? communityGroup.community.id : watch("community");

  const experienceWorkStreamIds: string[] = experienceWorkStreams?.map((workStream) => workStream.id);

  // TODO: figure out how to set prop of checked (other than value: true) to CheckboxOption for existing values.
  const workStreamItemsOfCommunity = communities
    ?.find((item) => communityValue === item.id)
    ?.workStreams?.map<CheckboxOption>(({ id, name }) => ({
      value: id,
      label: name?.localized,
    }));

  const [{ fetching }, executeMutation] = useMutation(
    UpdateExperienceWorkStreams_Mutation,
  );

  const requestMutation = async (id: string, values: WorkExperienceInput) => {
    const result = await executeMutation({ id, workExperience: values });
    if (result.data?.updateWorkExperience) {
      return result.data.updateWorkExperience;
    }
    return Promise.reject(new Error(result.error?.toString()));
  };

  const submitForm: SubmitHandler<FormValues> = async (
    formValues: FormValues,
  ) => {
    existingExperienceWorkStreamIds = experienceWorkStreamIds && [];
    await requestMutation(experienceId, {
      workStreamIds: uniqueItems(experienceWorkStreamIds.concat(formValues.workStreams ?? []))
    })
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Work streams updated successfully",
            id: "Rs+0eP",
            description: "Toast for successful experience work streams save",
          }),
        );
        setOpen(false);
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Failed updating work streams",
            id: "GsuiUg",
            description: "Toast for failed experience work streams save",
          }),
        );
      });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Select the work streams for this experience",
            id: "njfu1M",
            description: "Subtitle for work streams for an experience dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitForm)}>
              <p data-h2-margin-bottom="base(x1)">
                {intl.formatMessage({
                  defaultMessage:
                    "The first step in identifying work streams is selecting one of our partner functional communities. If you can't find a relevant community, you can skip this step until a more relevant community joins the platform.",
                  id: "uEzDbH",
                  description:
                    "Description for work streams for an experience dialog",
                })}
              </p>
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x1 0)"
              >
                {communityGroup?.community && (<><span data-h2-display="base(block)" data-h2-font-weight="base(700)">{intl.formatMessage({
                    defaultMessage:
                      "Functional community",
                    id: "yKpbHC",
                    description: "Label for Functional community value",
                  })}</span><span>{communityGroup?.community?.name?.localized}</span></>)}
                {communities && !communityGroup && (
                  <Select
                    id="community"
                    name="community"
                    enableNull
                    label={intl.formatMessage({
                      defaultMessage: "Functional communities",
                      id: "QuVtMh",
                      description: "Label for functional communities field",
                    })}
                    nullSelection={intl.formatMessage(
                      commonMessages.selectACommunity,
                    )}
                    options={communities
                      ?.filter(
                        (item) => unpackMaybes(item?.workStreams).length > 0,
                      )
                      .map(({ id, name }) => ({
                        value: id,
                        label: name?.localized,
                      }))}
                  />
                )}
                {!communityValue ? (
                  <Well data-h2-text-align="base(center)">
                    <p>
                      {intl.formatMessage({
                        defaultMessage:
                          "Select a functional community to continue.",
                        id: "yKpbHC",
                        description: "Message when no community selected",
                      })}
                    </p>
                  </Well>
                ) : (
                  <>
                    <p>
                      {intl.formatMessage({
                        defaultMessage:
                          "Select 1 or more work streams that you feel match the work done during this experience.",
                        id: "L8iV5q",
                        description: "Instructions for selecting work streams",
                      })}
                    </p>
                    {workStreamItemsOfCommunity && (
                      <Checklist
                        idPrefix="workStreams"
                        name="workStreams"
                        legend={intl.formatMessage(pageTitles.workStreams)}
                        rules={{
                          required: intl.formatMessage(errorMessages.required),
                        }}
                        items={workStreamItemsOfCommunity}
                      />
                    )}
                  </>
                )}
              </div>
              <Dialog.Footer>
                <Button disabled={fetching} type="submit" color="secondary">
                  {fetching
                    ? intl.formatMessage(commonMessages.saving)
                    : intl.formatMessage({
                        defaultMessage: "Save work streams",
                        id: "JUC/JA",
                        description:
                          "Link text to save work streams for an experience",
                      })}
                </Button>
                <Dialog.Close>
                  <Button mode="inline" color="quaternary">
                    {intl.formatMessage(commonMessages.cancel)}
                  </Button>
                </Dialog.Close>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ExperienceWorkStreamsDialog;
