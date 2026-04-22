import EllipsisVerticalIcon from "@heroicons/react/16/solid/EllipsisVerticalIcon";
import { useIntl } from "react-intl";
import type { SubmitHandler } from "react-hook-form";

import type { Maybe } from "@gc-digital-talent/graphql";
import { DropdownMenu, IconButton } from "@gc-digital-talent/ui";

import DevelopmentProgramDialog, {
  type FormValues,
} from "./DevelopmentProgramDialog";
import RemoveDevelopmentProgramDialog from "./RemoveDevelopmentProgramDialog";

interface DevelopmentProgramCardProps {
  title?: Maybe<string>;
  description?: Maybe<string>;
  developmentProgramOptions?: {
    label: Maybe<string> | undefined;
    value: string;
  }[];
  defaultValues?: FormValues;
  onEdit?: SubmitHandler<FormValues>;
  onRemove?: () => void;
  actions?: boolean;
}

const DevelopmentProgramCard = ({
  title,
  description,
  developmentProgramOptions,
  defaultValues,
  onEdit,
  onRemove,
  actions = true,
}: DevelopmentProgramCardProps) => {
  const intl = useIntl();

  return (
    <div className="border-b border-gray-200 p-6 last:border-b-0 odd:bg-gray-100/30 dark:odd:bg-gray-700/50 dark:even:bg-gray-700/30">
      <div className="grid w-full grid-cols-12">
        <div className="col-span-1">
          {actions && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger
                render={
                  <IconButton
                    icon={EllipsisVerticalIcon}
                    color="black"
                    label={intl.formatMessage(
                      {
                        defaultMessage:
                          "More actions for development program {title}",
                        id: "izCazf",
                        description:
                          "Aria label for the menu trigger for development program actions",
                      },
                      {
                        title,
                      },
                    )}
                  />
                }
              />
              <DropdownMenu.Popup
                className="grid gap-3 p-3"
                portalProps={{ keepMounted: true }}
              >
                {developmentProgramOptions && onEdit ? (
                  <DropdownMenu.Item>
                    <DevelopmentProgramDialog
                      developmentProgramOptions={developmentProgramOptions}
                      defaultValues={defaultValues}
                      onSubmit={onEdit}
                      edit
                    />
                  </DropdownMenu.Item>
                ) : null}
                {onRemove && (
                  <DropdownMenu.Item>
                    <RemoveDevelopmentProgramDialog
                      title={title}
                      onRemove={onRemove}
                    />
                  </DropdownMenu.Item>
                )}
              </DropdownMenu.Popup>
            </DropdownMenu.Root>
          )}
        </div>
        <div className="col-span-11">
          <p className="font-bold">{title}</p>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentProgramCard;
