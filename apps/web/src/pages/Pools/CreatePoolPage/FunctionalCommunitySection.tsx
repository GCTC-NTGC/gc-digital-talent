import { IntlShape, useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import uniqBy from "lodash/uniqBy";

import { Option, Select, Checkbox } from "@gc-digital-talent/forms";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import { CreatePoolCommunityFragment as CreatePoolCommunityFragmentType } from "@gc-digital-talent/graphql";
import { Notice, Ul } from "@gc-digital-talent/ui";

import messages from "~/messages/adminMessages";

interface CommunityNoticeProps {
  selectedCommunity: CreatePoolCommunityFragmentType;
  intl: IntlShape;
}

const CommunityNotice = ({ selectedCommunity, intl }: CommunityNoticeProps) => {
  return (
    <Notice.Root color="primary">
      <Notice.Content>
        <p className="mb-1.5 font-bold">
          {selectedCommunity.name?.localized ??
            intl.formatMessage(commonMessages.notAvailable)}
        </p>
        <p>
          {selectedCommunity.description?.localized ??
            intl.formatMessage(commonMessages.notAvailable)}
        </p>
        <p className="mt-4 mb-1 font-bold">
          {intl.formatMessage({
            defaultMessage: "Community workstreams",
            id: "Rd3PKk",
            description:
              "List of workstreams associated with a function community",
          })}
        </p>
        <Ul>
          {selectedCommunity.workStreams?.map((workStream) => (
            <li key={workStream.id}>{workStream?.name?.localized}</li>
          ))}
        </Ul>
      </Notice.Content>
    </Notice.Root>
  );
};

interface FormValues {
  addFunctionalCommunity: boolean;
  community?: string;
}

interface FunctionalCommunitySectionProps {
  communities: CreatePoolCommunityFragmentType[];
  canToggleFunctionalCommunity: boolean;
}

const FunctionalCommunitySection = ({
  communities,
  canToggleFunctionalCommunity,
}: FunctionalCommunitySectionProps) => {
  const intl = useIntl();
  const { watch, resetField } = useFormContext<FormValues>();

  const [watchAddFunctionalCommunity, watchCommunity] = watch([
    "addFunctionalCommunity",
    "community",
  ]);

  useEffect(() => {
    const resetDirtyField = (name: keyof FormValues) => {
      resetField(name, { keepDirty: false, defaultValue: undefined });
    };

    if (!watchAddFunctionalCommunity) {
      resetDirtyField("community");
    }
  }, [resetField, watchAddFunctionalCommunity]);

  const communityOptions: Option[] = communities.map(({ id, name }) => ({
    value: id,
    label: name?.localized ?? intl.formatMessage(commonMessages.notAvailable),
  }));
  const communityOptionsUnique: Option[] = uniqBy(communityOptions, "value");

  const selectedCommunity = watchCommunity
    ? communities.find((c) => c.id === watchCommunity)
    : undefined;

  return (
    <>
      {canToggleFunctionalCommunity ? (
        <>
          <Checkbox
            id="addFunctionalCommunity"
            name="addFunctionalCommunity"
            boundingBox
            boundingBoxLabel={intl.formatMessage({
              defaultMessage: "Community partnership",
              id: "K7SjlM",
              description: "Community partnership label",
            })}
            label={intl.formatMessage({
              defaultMessage: "Add a community partnership",
              id: "MZprzd",
              description: "Input to select to add a community partnership",
            })}
          />
          {watchAddFunctionalCommunity ? (
            <>
              <p className="my-5">
                {intl.formatMessage({
                  defaultMessage:
                    "Not all classifications have a related functional community.",
                  id: "VWRYBz",
                  description: "Heads-up before community select",
                })}
              </p>
              <p className="mb-5">
                {intl.formatMessage({
                  defaultMessage:
                    "Select which functional community you will like to collaborate on this process:",
                  id: "A24C7X",
                  description:
                    "Text describing community select in processes creation",
                })}
              </p>
              <Select
                id="community"
                label={intl.formatMessage(messages.community)}
                name="community"
                nullSelection={intl.formatMessage(
                  commonMessages.selectACommunity,
                )}
                options={communityOptionsUnique}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            </>
          ) : null}
          {selectedCommunity ? (
            <div className="mt-6">
              <CommunityNotice
                selectedCommunity={selectedCommunity}
                intl={intl}
              />
            </div>
          ) : null}
        </>
      ) : (
        <>
          <Select
            id="community"
            label={intl.formatMessage(messages.community)}
            name="community"
            nullSelection={intl.formatMessage(commonMessages.selectACommunity)}
            options={communityOptionsUnique}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          {selectedCommunity ? (
            <div className="mt-6">
              <CommunityNotice
                selectedCommunity={selectedCommunity}
                intl={intl}
              />
            </div>
          ) : null}
        </>
      )}
    </>
  );
};

export default FunctionalCommunitySection;
