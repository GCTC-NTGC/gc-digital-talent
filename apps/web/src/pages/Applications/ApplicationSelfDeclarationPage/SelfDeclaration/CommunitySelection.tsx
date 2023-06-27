import React from "react";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { FieldLabels, Checklist } from "@gc-digital-talent/forms";
import { Alert } from "@gc-digital-talent/ui";

import HelpLink from "./HelpLink";
import { hasCommunityAndOther } from "./utils";
import CommunityIcon from "./CommunityIcon";

interface CommunityListProps {
  labels: FieldLabels;
}

export const CommunityList = ({ labels }: CommunityListProps) => {
  const intl = useIntl();
  const [isAlertOpen, setIsAlertOpen] = React.useState<boolean>(false);
  const [hasDismissedAlert, setHasDismissedAlert] =
    React.useState<boolean>(false);
  const { watch } = useFormContext();

  const [communitiesValue] = watch(["communities"]);

  const isOtherAndHasCommunity = hasCommunityAndOther(communitiesValue);

  React.useEffect(() => {
    // Is not represented and has at least on other community selected
    setIsAlertOpen(!!(isOtherAndHasCommunity && !hasDismissedAlert));
  }, [isOtherAndHasCommunity, setIsAlertOpen, hasDismissedAlert]);

  const handleAlertDismiss = () => {
    setIsAlertOpen(false);
    setHasDismissedAlert(true);
  };

  return (
    <>
      <div data-h2-flex-grid="base(center, x1, x0)">
        <div data-h2-flex-item="base(3of4)" data-h2-align-self="base(center)">
          <Checklist
            idPrefix="firstNations"
            id="firstNations"
            name="communities"
            legend={labels.firstNations}
            trackUnsaved={false}
            items={[
              {
                value: "status",
                label: intl.formatMessage({
                  defaultMessage: '"I am Status First Nations"',
                  id: "ssJxrj",
                  description:
                    "Text for the option to self-declare as a status first nations",
                }),
              },
              {
                value: "nonStatus",
                label: intl.formatMessage({
                  defaultMessage: '"I am Non-Status First Nations"',
                  id: "sSE4kt",
                  description:
                    "Text for the option to self-declare as a non-status first nations",
                }),
              },
            ]}
          />
        </div>
        <div data-h2-flex-item="base(1of4)" data-h2-align-self="base(center)">
          <CommunityIcon
            values={["status", "nonStatus"]}
            community="first-nations"
          />
        </div>
        <div data-h2-flex-item="base(3of4)" data-h2-align-self="base(center)">
          <Checklist
            idPrefix="inuk"
            id="inuk"
            name="communities"
            legend={labels.inuk}
            trackUnsaved={false}
            items={[
              {
                value: "inuk",
                label: intl.formatMessage({
                  defaultMessage: `"I am Inuk"`,
                  id: "vDb+O+",
                  description: "Label text for Inuk community declaration",
                }),
              },
            ]}
          />
        </div>
        <div data-h2-flex-item="base(1of4)" data-h2-align-self="base(center)">
          <CommunityIcon values={["inuk"]} community="inuit" />
        </div>
        <div data-h2-flex-item="base(3of4)" data-h2-align-self="base(center)">
          <Checklist
            idPrefix="metis"
            id="metis"
            name="communities"
            legend={labels.metis}
            trackUnsaved={false}
            items={[
              {
                value: "metis",
                label: intl.formatMessage({
                  defaultMessage: `"I am Métis"`,
                  id: "/81xCT",
                  description: "Label text for Métis community declaration",
                }),
              },
            ]}
          />
        </div>
        <div data-h2-flex-item="base(1of4)" data-h2-align-self="base(center)">
          <CommunityIcon values={["metis"]} community="metis" />
        </div>
        <div data-h2-flex-item="base(3of4)" data-h2-align-self="base(center)">
          <Checklist
            idPrefix="other"
            id="other"
            name="communities"
            legend={labels.other}
            trackUnsaved={false}
            items={[
              {
                value: "other",
                label: intl.formatMessage({
                  defaultMessage: `"I am Indigenous and I don't see my community here"`,
                  id: "FRcbbi",
                  description:
                    "Label text for not represented community declaration",
                }),
              },
            ]}
          />
        </div>
        <div data-h2-flex-item="base(1of4)" data-h2-align-self="base(center)">
          <CommunityIcon values={["other"]} community="other" />
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
