import React from "react";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { RadioGroup, FieldLabels } from "@gc-digital-talent/forms";
import { Alert, Chip, Chips, Tabs } from "@gc-digital-talent/ui";
import { errorMessages, commonMessages } from "@gc-digital-talent/i18n";
import { useIsSmallScreen } from "@gc-digital-talent/helpers";

import HelpLink from "./HelpLink";
import CommunityCheckbox from "./CommunityCheckbox";
import CommunityTabs from "./CommunityTabs";
import {
  partOfCommunity,
  getCommunityLabels,
  hasCommunityAndOther,
} from "./utils";
import CommunityError from "./CommunityError";

interface CommunityListProps {
  labels: FieldLabels;
}

export const CommunityList = ({ labels }: CommunityListProps) => {
  const intl = useIntl();
  const isSmallScreen = useIsSmallScreen();
  const [isAlertOpen, setIsAlertOpen] = React.useState<boolean>(false);
  const [hasDismissedAlert, setHasDismissedAlert] =
    React.useState<boolean>(false);
  const [currentTab, setCurrentTab] = React.useState<string | null>(null);
  const { watch, setValue } = useFormContext();

  const communityLabels = getCommunityLabels(intl);

  const [communitiesValue] = watch(["communities"]);
  const isFirstNations = partOfCommunity("firstNations", communitiesValue);

  const isOtherAndHasCommunity = hasCommunityAndOther(communitiesValue);

  React.useEffect(() => {
    // Is not represented and has at least on other community selected
    setIsAlertOpen(!!(isOtherAndHasCommunity && !hasDismissedAlert));
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

  const CommunityOptionsWrapper = isSmallScreen ? Tabs.Root : "div";
  const CommunityOption = isSmallScreen ? CommunityTabs.Content : "div";

  return (
    <>
      <fieldset
        data-h2-border="base(none)"
        data-h2-margin="base(x1, 0, 0, 0)"
        data-h2-padding="base(0)"
      >
        <legend
          data-h2-align-items="base(center)"
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-text-align="base(center)"
          data-h2-justify-content="base(center)"
          data-h2-margin="base(x1, 0)"
          data-h2-width="base(100%)"
        >
          <span
            data-h2-align-items="base(center)"
            data-h2-display="base(flex)"
            data-h2-font-weight="base(700)"
            data-h2-font-size="base(h6)"
            data-h2-gap="base(x.5 0)"
            data-h2-margin="base(x.25, 0)"
          >
            <span>
              {intl.formatMessage({
                defaultMessage: "Select your Community(ies):",
                id: "zSH7Hx",
                description:
                  "Legend for the checkbox group for selecting Indigenous communities",
              })}
            </span>
            <span
              data-h2-font-size="base(caption)"
              data-h2-color="base(error.dark)"
              data-h2-display="base(inline-block)"
              data-h2-font-weight="base(400)"
              data-h2-margin="base(0, 0, 0, x.125)"
            >
              ({intl.formatMessage(commonMessages.required)})
            </span>
          </span>
          <span data-h2-font-style="base(italic)">
            {intl.formatMessage({
              defaultMessage: "(Select all that apply to you)",
              id: "reUbO2",
              description:
                "Disclaimer for the checkbox group for selecting Indigenous communities",
            })}
          </span>
        </legend>
        <CommunityOptionsWrapper
          {...(!isSmallScreen
            ? {
                "data-h2-display": "base(grid)",
                "data-h2-grid-template-columns":
                  "base(1fr 1fr) p-tablet(1fr 1fr 1fr 1fr)",
                "data-h2-gap": "base(x1)",
              }
            : {
                onValueChange: setCurrentTab,
              })}
        >
          {isSmallScreen && (
            <Tabs.List
              data-h2-display="base(grid)"
              data-h2-gap="base(x.25, 0)"
              data-h2-grid-template-columns="base(repeat(4, 1fr))"
            >
              <CommunityTabs.Trigger
                value="firstNations"
                community="first-nations"
                label={intl.formatMessage({
                  defaultMessage: "First Nations",
                  id: "NxmuI4",
                  description: "Trigger text for First Nations tab",
                })}
              />
              <CommunityTabs.Trigger
                value="inuk"
                community="inuit"
                label={intl.formatMessage({
                  defaultMessage: "Inuk",
                  id: "WDtanj",
                  description: "Trigger text for Inuk tab",
                })}
              />
              <CommunityTabs.Trigger
                value="metis"
                community="metis"
                label={intl.formatMessage({
                  defaultMessage: "Métis",
                  id: "BIgaKT",
                  description: "Trigger text for Métis tab",
                })}
              />
              <CommunityTabs.Trigger
                value="other"
                community="other"
                label={intl.formatMessage({
                  defaultMessage: "Other",
                  id: "WwEznG",
                  description:
                    "Trigger text for not represented community declaration tab",
                })}
              />
            </Tabs.List>
          )}
          <CommunityOption
            value="firstNations"
            {...(isSmallScreen && {
              on: currentTab === "firstNations",
            })}
          >
            <CommunityCheckbox
              id="communityFirstNations"
              name="communities"
              value="firstNations"
              community="first-nations"
              label={intl.formatMessage({
                defaultMessage: `"I am First Nations"`,
                id: "4e74J2",
                description:
                  "Label text for First Nations community declaration",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
          </CommunityOption>
          <CommunityOption
            value="inuk"
            {...(isSmallScreen && {
              on: currentTab === "inuk",
            })}
          >
            <CommunityCheckbox
              id="communityInuk"
              name="communities"
              value="inuk"
              community="inuit"
              label={intl.formatMessage({
                defaultMessage: `"I am Inuk"`,
                id: "vDb+O+",
                description: "Label text for Inuk community declaration",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
          </CommunityOption>
          <CommunityOption
            value="metis"
            {...(isSmallScreen && {
              on: currentTab === "metis",
            })}
          >
            <CommunityCheckbox
              id="communityMetis"
              name="communities"
              value="metis"
              community="metis"
              label={intl.formatMessage({
                defaultMessage: `"I am Métis"`,
                id: "/81xCT",
                description: "Label text for Métis community declaration",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
          </CommunityOption>
          <CommunityOption
            value="other"
            {...(isSmallScreen && {
              on: currentTab === "other",
            })}
          >
            <CommunityCheckbox
              id="communityOther"
              name="communities"
              value="other"
              community="other"
              label={intl.formatMessage({
                defaultMessage: `"I am Indigenous and I don't see my community here"`,
                id: "FRcbbi",
                description:
                  "Label text for not represented community declaration",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
          </CommunityOption>
        </CommunityOptionsWrapper>
        <CommunityError />
      </fieldset>
      {isFirstNations && (
        <RadioGroup
          idPrefix="isStatusFirstNations"
          id="isStatusFirstNations"
          name="isStatusFirstNations"
          legend={labels.isStatusFirstNations}
          trackUnsaved={false}
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
                "The program is for First Nations, Inuit, and Métis peoples within the geographic boundaries of Canada. At a later step of the application process, you may be asked to provide proof that you are Indigenous. You can read more about how this will be verified below.",
              id: "Ap86I/",
              description:
                "Text explaining the program and the possibility of needing to provide proof.",
            })}
          </p>
          <Alert.Footer>
            <HelpLink />
          </Alert.Footer>
        </Alert.Root>
      )}
      <div
        data-h2-background-color="base(white)"
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
    </>
  );
};

interface CommunitySelectionProps {
  labels: FieldLabels;
}

const CommunitySelection = ({ labels }: CommunitySelectionProps) => {
  const { watch } = useFormContext();

  const [isIndigenousValue] = watch(["isIndigenous"]);
  const isIndigenous = isIndigenousValue === "yes";

  return isIndigenous ? <CommunityList labels={labels} /> : null;
};

export default CommunitySelection;
