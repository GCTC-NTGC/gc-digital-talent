import { useIntl } from "react-intl";
import PlusCircleIcon from "@heroicons/react/24/solid/PlusCircleIcon";
import { ReactNode, JSX } from "react";

import { Button } from "@gc-digital-talent/ui";
import {
  IndigenousCommunity,
  LocalizedIndigenousCommunity,
} from "@gc-digital-talent/graphql";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import CommunityIcon from "~/components/Profile/components/DiversityEquityInclusion/CommunityIcon";

import { IndigenousDialog } from "./dialogs";
import { IndigenousDialogProps, IndigenousUpdateProps } from "./types";

type EquityGroup = "indigenous";

interface EquityOptionProps {
  indigenousCommunities: LocalizedIndigenousCommunity[];
  signature: string | undefined;
  option: EquityGroup;
  // Note: Just defining the func signature
  onSave: (data: IndigenousUpdateProps) => Promise<void>;
  title: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

type IndigenousDialogFunc = (props: IndigenousDialogProps) => JSX.Element;

const dialogMap: Record<EquityGroup, IndigenousDialogFunc> = {
  indigenous: IndigenousDialog,
};

const EquityOption = ({
  indigenousCommunities,
  signature,
  option,
  onSave,
  title,
  description,
  disabled,
}: EquityOptionProps) => {
  const intl = useIntl();
  const Dialog = dialogMap[option];

  const removeText = intl.formatMessage(
    {
      defaultMessage: "Edit this information<hidden> for {title}</hidden>",
      id: "+fIw4g",
      description:
        "Text label for button to edit employment equity category in profile.",
    },
    {
      title,
    },
  );

  const addText = intl.formatMessage(
    {
      defaultMessage: "Add <hidden>{title} </hidden>to my profile",
      id: "Re8emH",
      description:
        "Text label for button to add employment equity category to profile.",
    },
    {
      title,
    },
  );

  const isAdded = indigenousCommunities.length > 0;

  const nonLegacyIndigenousCommunities = indigenousCommunities.filter(
    (c) => c.value && c.value !== IndigenousCommunity.LegacyIsIndigenous,
  );

  return (
    <div
      data-h2-background="base(foreground)"
      data-h2-color="base(black)"
      data-h2-padding="base(x1)"
      data-h2-radius="base(rounded)"
      data-h2-shadow="base(m)"
    >
      <p data-h2-font-weight="base(700)">{title}</p>
      <ul data-h2-padding-left="base(x.25)" data-h2-padding-bottom="base(x1)">
        {isAdded
          ? nonLegacyIndigenousCommunities.map((community) => {
              return (
                <li
                  key={community.value}
                  data-h2-display="base(flex)"
                  data-h2-align-items="base(center)"
                  data-h2-gap="base(0, x.25)"
                >
                  <CommunityIcon community={community.value} />
                  <span>{getLocalizedName(community.label, intl)}</span>
                </li>
              );
            })
          : null}
      </ul>
      {description && <p data-h2-padding-bottom="base(x1)">{description}</p>}
      <Dialog
        indigenousCommunities={indigenousCommunities}
        signature={signature}
        onSave={onSave}
        disabled={disabled}
      >
        <Button type="button" mode="inline" color="secondary">
          {isAdded ? (
            removeText
          ) : (
            <>
              <PlusCircleIcon
                data-h2-width="base(x1)"
                data-h2-display="base(inline-block)"
                data-h2-vertical-align="base(bottom)"
                data-h2-margin="base(0, x.25, 0, 0) p-tablet(0, x0.5, 0, 0)"
              />
              {addText}
            </>
          )}
        </Button>
      </Dialog>
    </div>
  );
};

export default EquityOption;
