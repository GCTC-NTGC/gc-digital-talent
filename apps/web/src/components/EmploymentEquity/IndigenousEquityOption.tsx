import { useIntl } from "react-intl";
import PlusCircleIcon from "@heroicons/react/24/solid/PlusCircleIcon";
import { ReactNode, JSX } from "react";

import { Button, Card, Ul } from "@gc-digital-talent/ui";
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
    <Card>
      <p className="font-bold">{title}</p>
      <Ul className="mb-6" unStyled>
        {isAdded
          ? nonLegacyIndigenousCommunities.map((community) => {
              return (
                <li
                  key={community.value}
                  className="flex items-center gap-x-1.5"
                >
                  <CommunityIcon community={community.value} />
                  <span>{getLocalizedName(community.label, intl)}</span>
                </li>
              );
            })
          : null}
      </Ul>
      {description && <p className="mb-6">{description}</p>}
      <Dialog
        indigenousCommunities={indigenousCommunities}
        signature={signature}
        onSave={onSave}
        disabled={disabled}
      >
        <Button
          type="button"
          mode="inline"
          color="secondary"
          icon={isAdded ? undefined : PlusCircleIcon}
        >
          {isAdded ? removeText : addText}
        </Button>
      </Dialog>
    </Card>
  );
};

export default EquityOption;
