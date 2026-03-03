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
    <Notice.Root>
      <Notice.Content>
        <p>
          {selectedCommunity.name?.localized ??
            intl.formatMessage(commonMessages.notAvailable)}
        </p>
        <p>
          {selectedCommunity.description?.localized ??
            intl.formatMessage(commonMessages.notAvailable)}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage: "Community workstreams",
            id: "bIDukA",
            description: "aaa",
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
              defaultMessage: "Bbbbbbb",
              id: "6tNaqr",
              description:
                "Label displayed on Personal Experience form for disclaimer checkbox",
            })}
            label={intl.formatMessage({
              defaultMessage: "Aaaaaaa",
              id: "bAtCtV",
              description:
                "Label displayed on Personal Experience form for disclaimer checkbox",
            })}
          />
          {watchAddFunctionalCommunity ? (
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
          ) : null}
          {selectedCommunity ? (
            <CommunityNotice
              selectedCommunity={selectedCommunity}
              intl={intl}
            />
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
            <CommunityNotice
              selectedCommunity={selectedCommunity}
              intl={intl}
            />
          ) : null}
        </>
      )}
    </>
  );
};

export default FunctionalCommunitySection;
