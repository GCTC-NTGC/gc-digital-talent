import React from "react";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { Checkbox, RadioGroup } from "@common/components/form";
import { ExternalLink } from "@common/components/Link";
import { FieldLabels } from "@common/components/form/BasicForm";
import { Alert } from "@common/components";
import Chip, { Chips } from "@common/components/Chip";
import useLocale from "@common/hooks/useLocale";
import errorMessages from "@common/messages/errorMessages";
import { Locales } from "@common/helpers/localize";

import CommunityIcon from "./CommunityIcon";
import HelpLink from "./HelpLink";
import {
  partOfCommunity,
  getCommunityLabels,
  hasCommunityAndOther,
} from "./utils";

interface CommunitySelectionProps {
  labels: FieldLabels;
}

const otherOpportunitiesLink = (chunks: React.ReactNode, locale: Locales) => (
  <ExternalLink href={`/${locale}/browse/pools`}>{chunks}</ExternalLink>
);

const CommunitySelection = ({ labels }: CommunitySelectionProps) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const [isAlertOpen, setIsAlertOpen] = React.useState<boolean>(false);
  const [hasDismissedAlert, setHasDismissedAlert] =
    React.useState<boolean>(false);
  const { watch, setValue } = useFormContext();

  const communityLabels = getCommunityLabels(intl);

  const [isIndigenousValue, communitiesValue] = watch([
    "isIndigenous",
    "communities",
  ]);
  const isIndigenous = isIndigenousValue === "yes";
  const isFirstNations = partOfCommunity("firstNations", communitiesValue);
  const isInuk = partOfCommunity("inuk", communitiesValue);
  const isMetis = partOfCommunity("metis", communitiesValue);
  const isOther = partOfCommunity("other", communitiesValue);
  const isOtherAndHasCommunity = hasCommunityAndOther(communitiesValue);

  React.useEffect(() => {
    // Is not represented and has at least on other community selected
    if (isOtherAndHasCommunity && !hasDismissedAlert) {
      setIsAlertOpen((prevIsOpen) => !prevIsOpen);
    }
  }, [isOtherAndHasCommunity, setIsAlertOpen, hasDismissedAlert]);

  const handleAlertDismiss = () => {
    setIsAlertOpen(false);
    setHasDismissedAlert(true);
  };

  const handleDismissCommunity = (community: string) => {
    const newCommunities = communitiesValue.filter(
      (value: string) => value !== community,
    );
    setValue("communities", newCommunities);
  };

  // Show disclaimer is user is not Indigenous
  if (!isIndigenous) {
    return (
      <p data-h2-text-align="base(center)" data-h2-margin="base(x1, 0, 0, 0)">
        {intl.formatMessage(
          {
            defaultMessage:
              "Not a member of an Indigenous group? <link>Explore other opportunities in IT within the federal government</link>.",
            id: "yiSRDd",
            description:
              "Text to lead non-indigenous people to browse other opportunities.",
          },
          {
            link: (chunks: React.ReactNode) =>
              otherOpportunitiesLink(chunks, locale),
          },
        )}
      </p>
    );
  }

  return (
    <>
      <fieldset data-h2-border="base(none)" data-h2-margin="base(x2, 0, 0, 0)">
        <legend
          data-h2-text-align="base(center)"
          data-h2-font-weight="base(700)"
          data-h2-font-size="base(h6)"
          data-h2-margin="base(x1, 0)"
        >
          {intl.formatMessage({
            defaultMessage: "Select your Community(ies):",
            id: "zSH7Hx",
            description:
              "Legend for the checkbox group for selecting Indigenous communities",
          })}
        </legend>
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="base(1fr 1fr) p-tablet(1fr 1fr 1fr 1fr)"
          data-h2-gap="base(x1)"
        >
          <div>
            <CommunityIcon community="first-nations" on={isFirstNations} />
            <Checkbox
              id="communityFirstNations"
              name="communities"
              value="firstNations"
              label={intl.formatMessage({
                defaultMessage: `"I am First Nations"`,
                id: "4e74J2",
                description:
                  "Label text for First Nations community declaration",
              })}
            />
          </div>
          <div>
            <CommunityIcon community="inuit" on={isInuk} />
            <Checkbox
              id="communityInuk"
              name="communities"
              value="inuk"
              label={intl.formatMessage({
                defaultMessage: `"I am Inuk"`,
                id: "vDb+O+",
                description: "Label text for Inuk community declaration",
              })}
            />
          </div>
          <div>
            <CommunityIcon community="metis" on={isMetis} />
            <Checkbox
              id="communityMetis"
              name="communities"
              value="metis"
              label={intl.formatMessage({
                defaultMessage: `"I am Métis"`,
                id: "/81xCT",
                description: "Label text for Métis community declaration",
              })}
            />
          </div>
          <div>
            <CommunityIcon community="other" on={isOther} />
            <Checkbox
              id="communityOther"
              name="communities"
              value="other"
              label={intl.formatMessage({
                defaultMessage: `"I am Indigenous and I don't see my community here"`,
                id: "FRcbbi",
                description:
                  "Label text for not represented community declaration",
              })}
            />
          </div>
        </div>
      </fieldset>
      {isFirstNations && (
        <RadioGroup
          idPrefix="isStatusFirstNations"
          id="isStatusFirstNations"
          name="isStatusFirstNations"
          legend={labels.isStatusFirstNations}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={[
            {
              value: "yes",
              label: intl.formatMessage({
                defaultMessage: '"I am Status First Nations"',
                id: "ssJxrj",
                description:
                  "Text for the option to self-declare as a status first nations",
              }),
            },
            {
              value: "no",
              label: intl.formatMessage({
                defaultMessage: '"I am Non-Status First Nations"',
                id: "sSE4kt",
                description:
                  "Text for the option to self-declare as a non-status first nations",
              }),
            },
          ]}
        />
      )}
      <div
        data-h2-background-color="base(white) base:dark(black.light)"
        data-h2-radius="base(s)"
        data-h2-shadow="base(s)"
        data-h2-padding="base(x1.75, x1.25)"
        data-h2-margin="base(x1, 0)"
      >
        <div
          data-h2-display="base(flex)"
          data-h2-align-items="base(center)"
          data-h2-flex-direction="base(column) p-tablet(row)"
          data-h2-justify-content="base(flex-start)"
        >
          <p data-h2-margin="base(0, 0, x.5, 0) p-tablet(0, x.5, 0, 0)">
            {intl.formatMessage({
              defaultMessage: "My Community(ies):",
              id: "1nOT0r",
              description:
                "Text label for list of the users selected Indigenous communities",
            })}
          </p>
          {communitiesValue && communitiesValue.length > 0 ? (
            <Chips>
              {communitiesValue.map((community: string) => {
                const label = communityLabels.get(community);
                return label ? (
                  <Chip
                    key={community}
                    mode="outline"
                    color={
                      isOtherAndHasCommunity &&
                      isAlertOpen &&
                      community === "other"
                        ? "warning"
                        : "primary"
                    }
                    onDismiss={() => handleDismissCommunity(community)}
                    label={label}
                  />
                ) : null;
              })}
            </Chips>
          ) : null}
        </div>
      </div>
      {isAlertOpen && (
        <Alert.Root type="warning" dismissible onDismiss={handleAlertDismiss}>
          <Alert.Title>
            {intl.formatMessage({
              defaultMessage:
                'Are you sure you meant to select "I am Indigenous and I don\'t see my community here?"',
              id: "at11n5",
              description:
                "Title for the alert warning users about selection not represented and a represented community",
            })}
          </Alert.Title>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "The Program is for First Nations, Inuit, and Métis peoples within the geographic boundaries of Canada. At a later step of the application process, you may be asked to provide proof that you are Indigenous. You can read more about how this will be verified below.",
              id: "Cn9LYM",
              description:
                "Text explaining the program and the possibility of needing to provide proof.",
            })}
          </p>
          <Alert.Footer>
            <HelpLink />
          </Alert.Footer>
        </Alert.Root>
      )}
    </>
  );
};

export default CommunitySelection;
