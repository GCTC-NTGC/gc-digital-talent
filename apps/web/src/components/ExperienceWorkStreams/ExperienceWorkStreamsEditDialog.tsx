import { ReactNode, useState } from "react";
import { useIntl } from "react-intl";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
} from "react-hook-form";

import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import { Button, Dialog, Well } from "@gc-digital-talent/ui";
import { CheckboxOption, Checklist, Select } from "@gc-digital-talent/forms";
import { sortAlphaBy } from "@gc-digital-talent/helpers";

import pageTitles from "~/messages/pageTitles";
import { WorkFormValues } from "~/types/experience";

import {
  CommunityWithoutKey,
  WorkStreamsWithCommunity,
  WorkStreamWithoutKey,
} from "./types";

interface FormValues {
  community?: string;
  workStreams: string[];
}
interface ExperienceWorkStreamsEditDialogProps {
  communities: CommunityWithoutKey[];
  community?: CommunityWithoutKey | null;
  workStreams?: WorkStreamWithoutKey[];
  selectedCommunities?: Map<string, WorkStreamsWithCommunity>;
  trigger: ReactNode;
  defaultOpen?: boolean;
  onUpdate: (ids: string[]) => void;
}

const ExperienceWorkStreamsEditDialog = ({
  communities,
  community,
  workStreams,
  selectedCommunities,
  trigger,
  defaultOpen = false,
  onUpdate,
}: ExperienceWorkStreamsEditDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  const { watch: watchParent } = useFormContext<WorkFormValues>();
  const watchWorkStreams = watchParent("workStreams");

  const experienceWorkStreamIds: string[] =
    watchWorkStreams?.filter((workStream) =>
      workStreams?.some((i) => i.id == workStream),
    ) ?? [];

  const methods = useForm<FormValues>({
    values: {
      workStreams: community ? experienceWorkStreamIds : [],
    },
  });
  const { handleSubmit, reset, watch } = methods;

  const communityValue = community?.id ?? watch("community");

  const workStreamItemsOfCommunity = communities
    ?.find((item) => communityValue === item.id)
    ?.workStreams?.sort(sortAlphaBy((workStream) => workStream.name?.localized))
    .map<CheckboxOption>(({ id, name }) => ({
      value: id,
      label: name?.localized,
    }));
  const handleOpenChange = (newOpen: boolean) => {
    reset();
    setIsOpen(newOpen);
  };

  const submitForm: SubmitHandler<FormValues> = (formValues: FormValues) => {
    const newWorkStreams = watchWorkStreams?.filter(
      (workStream) => !workStreams?.some((i) => i.id === workStream),
    );
    onUpdate([...(formValues?.workStreams ?? []), ...(newWorkStreams ?? [])]);
    handleOpenChange(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
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
            <form
              onSubmit={(e) => {
                e.stopPropagation();
                return handleSubmit(submitForm)(e);
              }}
            >
              <p className="mb-6">
                {intl.formatMessage({
                  defaultMessage:
                    "The first step in identifying work streams is selecting one of our partner functional communities. If you can't find a relevant community, you can skip this step until a more relevant community joins the platform.",
                  id: "uEzDbH",
                  description:
                    "Description for work streams for an experience dialog",
                })}
              </p>
              <div className="flex flex-col gap-y-6">
                {community && (
                  <>
                    <span className="block font-bold">
                      {intl.formatMessage({
                        defaultMessage: "Functional community",
                        id: "gV0mRk",
                        description: "Label for Functional community value",
                      })}
                    </span>
                    <span>{community?.name?.localized}</span>
                  </>
                )}
                {communities && !community && (
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
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                    options={communities
                      .filter((item) => !selectedCommunities?.has(item.id))
                      .map(({ id, name }) => ({
                        value: id,
                        label: name?.localized,
                      }))}
                  />
                )}
                {!communityValue ? (
                  <Well className="text-center">
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
                      {community &&
                        // eslint-disable-next-line formatjs/no-literal-string-in-jsx
                        ` ${intl.formatMessage({
                          defaultMessage:
                            "To remove this functional community entirely, use the trash can button on the previous screen and save your changes.",
                          id: "fM48Ck",
                          description:
                            "Instructions for deselecting work streams",
                        })}`}
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
                <Button type="submit" color="secondary">
                  {community
                    ? intl.formatMessage({
                        defaultMessage: "Update work streams",
                        id: "eePQun",
                        description:
                          "Link text to add work streams for an experience",
                      })
                    : intl.formatMessage({
                        defaultMessage: "Add work streams",
                        id: "gL8LDB",
                        description:
                          "Link text to update work streams for an experience",
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

export default ExperienceWorkStreamsEditDialog;
