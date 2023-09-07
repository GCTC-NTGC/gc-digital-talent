import React from "react";
import { useIntl } from "react-intl";
import { useCurrentEditor } from "@tiptap/react";
import ListBulletIcon from "@heroicons/react/20/solid/ListBulletIcon";
import ArrowUturnLeftIcon from "@heroicons/react/20/solid/ArrowUturnLeftIcon";
import ArrowUturnRightIcon from "@heroicons/react/20/solid/ArrowUturnRightIcon";

import { Button, ButtonProps } from "@gc-digital-talent/ui";
import { richTextMessages } from "@gc-digital-talent/i18n";

type MenuButtonProps = {
  onClick: ButtonProps["onClick"];
  icon?: ButtonProps["icon"];
  utilityIcon?: ButtonProps["utilityIcon"];
  active?: boolean;
  children: React.ReactNode;
};

const MenuButton = ({ active, ...rest }: MenuButtonProps) => {
  const { editor } = useCurrentEditor();
  return (
    <Button
      mode="solid"
      color={active ? "white" : "black"}
      data-h2-padding="base(x.125 x.25)"
      data-h2-font-size="base(caption)"
      disabled={!editor?.isEditable}
      {...rest}
    />
  );
};

const MenuBar = () => {
  const intl = useIntl();
  const { editor } = useCurrentEditor();

  return (
    <div
      data-h2-background="base(background.darkest)"
      data-h2-padding="base(x.25)"
      data-h2-display="base(flex)"
      data-h2-gap="base(x.25)"
      data-h2-radius="base(rounded rounded 0 0)"
      data-h2-justify-content="base(space-between)"
      data-h2-margin-bottom="base(-x.25)" /** Offset wrapper gap */
    >
      <div data-h2-display="base(flex)" data-h2-gap="base(x.25)">
        <MenuButton
          active={editor?.isActive("bulletList") ?? false}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          icon={ListBulletIcon}
        >
          {intl.formatMessage(richTextMessages.bulletList)}
        </MenuButton>
      </div>
      <div data-h2-display="base(flex)" data-h2-gap="base(x.25)">
        <MenuButton
          onClick={() => editor?.commands.undo()}
          icon={ArrowUturnLeftIcon}
        >
          {intl.formatMessage(richTextMessages.undo)}
        </MenuButton>
        <MenuButton
          onClick={() => editor?.commands.redo()}
          utilityIcon={ArrowUturnRightIcon}
        >
          {intl.formatMessage(richTextMessages.redo)}
        </MenuButton>
      </div>
    </div>
  );
};

export default MenuBar;
